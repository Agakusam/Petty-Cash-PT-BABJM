/**
 * ============================================
 * Main.gs — Entry Point & Router
 * Sistem Petty Cash PT BABJM
 * ============================================
 */

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || '';

    // Health check — no auth
    if (action === 'healthCheck') {
      return jsonOutput(successResponse({
        version: getConfig('APP_VERSION', '1.0.0'),
        status: 'OK'
      }));
    }

    // Inspect sheets — no auth for debugging
    if (action === 'inspect') {
      return jsonOutput(inspectSheets());
    }
   
    // PIN validation — no API key needed
    if (action === 'validatePin') {
      var pin = params.pin || '';
      var webPin = getWebPin();
      var valid = !webPin || pin === webPin;
      return jsonOutput(valid ? successResponse({ valid: true }) : errorResponse('PIN tidak valid', 401));
    }

    // API key check for all other actions
    if (!_checkApiKey(params.api_key || params.apiKey)) {
      return jsonOutput(errorResponse('Unauthorized', 401));
    }

    switch (action) {
      // Cash
      case 'listCash':
        return jsonOutput(listCashTransactions(params));
      case 'getSaldo':
        return jsonOutput(getCurrentSaldo());
      case 'rekapCash':
        return jsonOutput(rekapCash(params));
      case 'exportCash':
        return jsonOutput(exportCashData(params));

      // Bon
      case 'listBon':
        return jsonOutput(listBons(params));
      case 'monitorBon':
        return jsonOutput(monitorBons());
      case 'rekapBon':
        return jsonOutput(rekapBons());

      // Dashboard
      case 'getDashboard':
        return jsonOutput(getDashboardData());
      case 'rebuildDashboard':
        var rebuildRes = setupGSheetDashboard();
        return jsonOutput(successResponse(null, rebuildRes));
      // Config
      case 'getConfig':
        return jsonOutput(successResponse({
          signatures: getSignatureNames(),
          version: getConfig('APP_VERSION', '1.0.0')
        }));

      default:
        return jsonOutput(errorResponse('Unknown action: ' + action, 404));
    }
  } catch (err) {
    return jsonOutput(errorResponse(err.message || String(err), 500));
  }
}

function doPost(e) {
  var body = {};
  if (e && e.postData && e.postData.contents) {
    try { body = JSON.parse(e.postData.contents); } catch (err) { /* not JSON */ }
  }

  // Telegram webhook
  if (body.update_id !== undefined) {
    var updateId = String(body.update_id);
    var cacheKey = 'tg_up_' + updateId;
    var cache = CacheService.getScriptCache();
    var cached = cache.get(cacheKey);
    
    if (cached !== null) {
      Logger.log('Ignored duplicate Telegram update_id: ' + updateId);
      return HtmlService.createHtmlOutput("ok");
    }
    
    // Save update_id to cache for 5 minutes (300 seconds) to prevent duplicate processing
    cache.put(cacheKey, 'processing', 300);
    
    try {
      if (body.callback_query) {
        handleCallbackQuery(body.callback_query);
      } else if (body.message) {
        handleTelegramMessage(body.message);
      }
    } catch (err) {
      Logger.log('Telegram error: ' + err.message + '\n' + err.stack);
    }
    return HtmlService.createHtmlOutput("ok");
  }

  // API calls
  var action = body.action || '';
  if (!_checkApiKey(body.api_key || body.apiKey)) {
    return jsonOutput(errorResponse('Unauthorized', 401));
  }

  try {
    switch (action) {
      // Cash
      case 'addCash':
        var cashResult = addCashTransaction(body);
        if (cashResult.success) notifyNewTransaction(cashResult.data);
        return jsonOutput(cashResult);

      case 'addCashBulk':
        var list = body.transactions || [];
        var successList = [];
        var errors = [];
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var res = addCashTransaction(item);
          if (res.success) {
            successList.push(res.data);
          } else {
            errors.push('Baris ' + (i+1) + ': ' + res.error);
          }
        }
        if (errors.length > 0 && successList.length === 0) {
          return jsonOutput(errorResponse('Gagal menginput semua transaksi:\n' + errors.join('\n')));
        }
        if (successList.length > 0) {
          notifyNewTransactionBulk(successList);
        }
        return jsonOutput(successResponse({
          success_count: successList.length,
          error_count: errors.length,
          errors: errors
        }, 'Berhasil menyimpan ' + successList.length + ' transaksi' + (errors.length > 0 ? ', gagal ' + errors.length + ' baris.' : '.')));

      case 'editCashBulk':
        var editResult = editCashTransactionsBulk(body);
        return jsonOutput(editResult);

      case 'deleteCash':
        var deleteResult = deleteCashTransactions(body);
        return jsonOutput(deleteResult);

      case 'importCashBulk':
        return jsonOutput(importCashTransactionsBulk(body));

      // Bon
      case 'addBon':
        var bonResult = addBon(body);
        if (bonResult.success) notifyNewBon(bonResult.data);
        return jsonOutput(bonResult);

      case 'addBonBulk':
        var list = body.bons || [];
        var successList = [];
        var errors = [];
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var res = addBon(item);
          if (res.success) {
            successList.push(res.data);
          } else {
            errors.push('Baris ' + (i+1) + ': ' + res.error);
          }
        }
        if (errors.length > 0 && successList.length === 0) {
          return jsonOutput(errorResponse('Gagal menginput semua bon:\n' + errors.join('\n')));
        }
        if (successList.length > 0) {
          notifyNewBonBulk(successList);
        }
        return jsonOutput(successResponse({
          success_count: successList.length,
          error_count: errors.length,
          errors: errors
        }, 'Berhasil menyimpan ' + successList.length + ' bon' + (errors.length > 0 ? ', gagal ' + errors.length + ' baris.' : '.')));

      case 'settleBon':
        var settleResult = settleBon(body);
        if (settleResult.success) notifyBonSettled(settleResult.data);
        return jsonOutput(settleResult);

      case 'editBonBulk':
        var editBonResult = editBonsBulk(body);
        return jsonOutput(editBonResult);

      case 'deleteBon':
        var deleteBonResult = deleteBons(body);
        return jsonOutput(deleteBonResult);

      // Config
      case 'updateConfig':
        if (body.key) {
          setConfig(body.key, body.value || '');
          return jsonOutput(successResponse({ key: body.key, value: body.value }));
        }
        return jsonOutput(errorResponse('Key wajib diisi'));

      default:
        return jsonOutput(errorResponse('Unknown action: ' + action, 404));
    }
  } catch (err) {
    Logger.log('POST error: ' + err.message + '\n' + err.stack);
    return jsonOutput(errorResponse('Server error: ' + err.message, 500));
  }
}

// ─── AUTH ────────────────────────────────────

function _checkApiKey(key) {
  var apiKey = getApiKey();
  if (!apiKey) return true; // Dev mode: no key set
  return key === apiKey;
}

// ─── SETUP FUNCTIONS ────────────────────────

/**
 * Setup webhook Telegram
 * Jalankan sekali setelah deploy Web App
 */
function setupTelegramWebhook() {
  var token = getTelegramBotToken();
  var webAppUrl = ScriptApp.getService().getUrl();

  if (webAppUrl.indexOf('/dev') !== -1) {
    var storedUrl = getConfig('WEB_APP_URL', '');
    if (storedUrl) {
      webAppUrl = storedUrl;
    } else {
      Logger.log('⚠️ Warning: Running setup inside GAS Editor returns a /dev URL which Telegram cannot access. Storing Web App URL in Config first is recommended.');
    }
  }

  var response = UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + token + '/setWebhook?url=' + encodeURIComponent(webAppUrl),
    { muteHttpExceptions: true }
  );

  Logger.log('Webhook setup (URL: ' + webAppUrl + '): ' + response.getContentText());
  return response.getContentText();
}

/**
 * Hapus webhook
 */
function removeTelegramWebhook() {
  var token = getTelegramBotToken();
  var response = UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + token + '/deleteWebhook',
    { muteHttpExceptions: true }
  );
  Logger.log('Webhook removed: ' + response.getContentText());
}

/**
 * Register bot commands di BotFather
 */
function registerBotCommands() {
  var token = getTelegramBotToken();
  var commands = [
    { command: 'kas', description: 'Input transaksi kas' },
    { command: 'bon', description: 'Catat bon baru' },
    { command: 'saldo', description: 'Cek saldo kas' },
    { command: 'monitor', description: 'Pantau bon belum lunas' },
    { command: 'lunas', description: 'Selesaikan bon' },
    { command: 'rekap', description: 'Rekap transaksi' },
    { command: 'help', description: 'Bantuan perintah' }
  ];

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/setMyCommands', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ commands: commands }),
    muteHttpExceptions: true
  });

  Logger.log('✅ Bot commands registered');
}

/**
 * Setup lengkap — jalankan sekali
 */
function fullSetup() {
  initConfig();
  setupTelegramWebhook();
  registerBotCommands();
  Logger.log('✅ Full setup completed');
}

/**
 * Simple & Installed Trigger onEdit Google Sheets
 * Otomatis berjalan setiap kali ada pengeditan di Google Spreadsheet (Buku Kas atau Buku Bon)
 */
function onEdit(e) {
  if (!e) return;
  try {
    var range = e.range;
    var sheet = range.getSheet();
    var sheetName = sheet.getName().trim().toLowerCase();
    
    if (sheetName === 'buku bon' || sheetName === 'bon_log') {
      var startRow = range.getRow();
      var numRows = range.getNumRows();
      for (var r = 0; r < numRows; r++) {
        var row = startRow + r;
        if (row < 2) continue; // Skip header
        _syncBonRowToCash(row);
      }
    } else if (sheetName === 'buku kas' || sheetName === 'cash_log') {
      // Rekalkulasi Saldo Akhir otomatis jika ada perubahan di Buku Kas
      recalculateSaldoAkhir();
    }
  } catch (err) {
    Logger.log('onEdit error: ' + err.message);
  }
}

/**
 * Setup installed trigger untuk edit spreadsheet
 */
function setupEditTrigger() {
  var ss = getSpreadsheet();
  
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEdit' || triggers[i].getHandlerFunction() === 'onSpreadsheetEdit') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  
  Logger.log('✅ Edit Trigger berhasil didaftarkan untuk fungsi onEdit');
}

/**
 * Sinkronisasikan satu baris bon di Buku Bon ke Buku Kas
 */
function _syncBonRowToCash(row) {
  var sheet = getBonSheet();
  var values = sheet.getRange(row, 1, 1, 6).getValues()[0];
  var idBon = String(values[0] || '').trim();
  var tglRaw = values[1];
  var pic = String(values[2] || '').trim();
  var keterangan = String(values[3] || '').trim();
  // parseRupiah safety net: backward compat jika nominal masih string
  var nominal = (typeof values[4] === 'number') ? values[4] : parseRupiah(values[4]);
  var rawStatus = String(values[5] || '').trim();
  var status = rawStatus ? rawStatus.toUpperCase() : 'BELUM';
  
  // Jika PIC atau nominal belum diisi lengkap/valid, jangan sinkronkan dulu
  if (!pic || nominal <= 0) return;

  // 1. Auto-set Status ke 'BELUM' di Kolom F jika kosong
  if (!rawStatus) {
    sheet.getRange(row, 6).setValue('BELUM');
  }

  // 2. Auto-generate ID BON jika Kolom A kosong
  if (!idBon) {
    idBon = generateNoId('BON');
    sheet.getRange(row, 1).setValue(idBon);
  }

  // 3. Auto-fill Tanggal di Kolom B jika kosong
  if (!tglRaw) {
    tglRaw = new Date();
    sheet.getRange(row, 2).setValue(formatDateISO(tglRaw));
  }

  // 4. Format Nominal di Kolom E sebagai Rupiah
  sheet.getRange(row, 5).setNumberFormat('[$Rp-421] #,##0');
  
  // Cek apakah transaksi Kredit (bon baru) atau Debit (pertanggungan) sudah ada di Buku Kas
  var cashRows = readCashData();
  var existKredit = false;
  var existDebit = false;
  
  for (var i = 0; i < cashRows.length; i++) {
    var cashRow = cashRows[i];
    if (String(cashRow.no_id).trim().toUpperCase() === idBon.toUpperCase()) {
      // parseRupiah safety net: backward compat jika data masih string
      var kreditVal = (typeof cashRow.kredit === 'number') ? cashRow.kredit : parseRupiah(cashRow.kredit);
      var debitVal = (typeof cashRow.debit === 'number') ? cashRow.debit : parseRupiah(cashRow.debit);
      if (kreditVal > 0) {
        existKredit = true;
      }
      if (debitVal > 0) {
        existDebit = true;
      }
    }
  }
  
  // 5. Jika Kredit belum ada di Buku Kas, buat transaksi Kredit (Kas Keluar)
  if (!existKredit) {
    appendCashRow({
      keterangan_kredit: 'Bon - ' + pic + ' - ' + (keterangan || 'Kasbon Karyawan'),
      keterangan: 'Bon - ' + pic + ' - ' + (keterangan || 'Kasbon Karyawan'),
      kredit: nominal,
      debit: 0,
      jenis: 'KREDIT',
      pic: pic,
      no_id: idBon,
      akun: 'Kasbon',
      tanggal: formatDateISO(tglRaw) || formatDateISO(new Date())
    });
    recalculateSaldoAkhir();
  }
  
  // 6. Jika status diset ke SUDAH / LUNAS, dan Debit belum ada, buat transaksi Debit (Kas Masuk / Pertanggungan)
  if ((status === 'SUDAH' || status === 'LUNAS') && !existDebit) {
    appendCashRow({
      keterangan_debit: 'Pertanggungan Bon - ' + pic + ' - ' + (keterangan || 'Kasbon Karyawan'),
      keterangan: 'Pertanggungan Bon - ' + pic + ' - ' + (keterangan || 'Kasbon Karyawan'),
      debit: nominal,
      kredit: 0,
      jenis: 'DEBIT',
      pic: pic,
      no_id: idBon,
      akun: 'Pertanggungan Bon',
      tanggal: formatDateISO(new Date())
    });
    recalculateSaldoAkhir();
  }
}

/**
 * Pindai & Sinkronkan SELURUH baris di Buku Bon ke Buku Kas
 */
function syncAllBonsToCash() {
  var sheet = getBonSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 'TIDAK_ADA_BON';
  for (var r = 2; r <= lastRow; r++) {
    _syncBonRowToCash(r);
  }
  return 'SINKRONISASI_SELESAI';
}

function testOnEdit() {
  var sheet = getBonSheet();
  var lastRow = sheet.getLastRow();
  Logger.log('Last row of Bon_log: ' + lastRow);
  if (lastRow >= 2) {
    _syncBonRowToCash(lastRow);
  }
}

function inspectSheets() {
  var ss = getSpreadsheet();
  var result = {};
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    var lastRow = sheets[i].getLastRow();
    var lastCol = sheets[i].getLastColumn();
    var rowsToFetch = Math.max(1, Math.min(lastRow, 30));
    var colsToFetch = Math.max(1, Math.min(lastCol, 15));
    var range = sheets[i].getRange(1, 1, rowsToFetch, colsToFetch);
    result[name] = {
      dimensions: { rows: lastRow, cols: lastCol },
      values: range.getValues(),
      formulas: range.getFormulas()
    };
  }
  return successResponse(result);
}
