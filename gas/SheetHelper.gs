/**
 * ============================================
 * SheetHelper.gs — Google Sheets Utilities
 * Sistem Petty Cash PT BABJM
 * ============================================
 * Kolom sesuai struktur aktual spreadsheet (Buku Kas & Buku Bon)
 */

var SPREADSHEET_ID = '18_zWVbJZOX90vkPl9NHikXimgOUSZDSE5EOGiVqbYpk';

var SHEETS = {
  CASH_LOG: 'Buku Kas',
  BON_LOG: 'Buku Bon',
  DASHBOARD: 'Dashboard'
};

// Kolom Buku Kas: A-L (index 1-12)
var CASH_COLS = {
  TANGGAL: 1,           // A: Tanggal
  TGL_NOTA: 2,          // B: Tgl. Nota
  AKUN: 3,              // C: Akun
  KETERANGAN_DEBIT: 4,  // D: Keterangan Debit
  KETERANGAN_KREDIT: 5, // E: Keterangan Kredit
  PIC: 6,               // F: PIC
  NO_ID: 7,             // G: NO. ID
  DEBIT: 8,             // H: Debit
  KREDIT: 9,            // I: Kredit
  SALDO_AKHIR: 10,      // J: Saldo Akhir (OTOMATIS)
  TGL_PENAGIHAN: 11,    // K: Tgl. Penagihan
  LAMPIRAN: 12          // L: Lampiran
};

// Kolom Buku Bon: A-F (index 1-6)
var BON_COLS = {
  ID_BON: 1,        // A: ID BON (OTOMATIS)
  TANGGAL: 2,       // B: Tanggal (OTOMATIS)
  PIC: 3,           // C: PIC (MANUAL/TELEGRAM)
  KETERANGAN: 4,    // D: Keterangan (MANUAL/TELEGRAM)
  NOMINAL: 5,       // E: Nominal (MANUAL/TELEGRAM)
  STATUS: 6         // F: Status (OTOMATIS 'BELUM' JIKA KOSONG)
};

// ─── SPREADSHEET ACCESS ─────────────────────

var _ssCache = null;

function getSpreadsheet() {
  if (!_ssCache) {
    try {
      _ssCache = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      // ignore
    }
    if (!_ssCache) {
      _ssCache = SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  }
  return _ssCache;
}

function getSheet(name) {
  var ss = getSpreadsheet();
  var targetName = (name || '').trim();
  var sheet = ss.getSheetByName(targetName);
  
  if (!sheet) {
    // Cari fleksibel: Buku Kas vs Cash_log, Buku Bon vs Bon_log
    var allSheets = ss.getSheets();
    for (var i = 0; i < allSheets.length; i++) {
      var sName = allSheets[i].getName().trim();
      if ((targetName === 'Buku Kas' || targetName === 'Cash_log') && (sName === 'Buku Kas' || sName === 'Cash_log')) {
        return allSheets[i];
      }
      if ((targetName === 'Buku Bon' || targetName === 'Bon_log') && (sName === 'Buku Bon' || sName === 'Bon_log')) {
        return allSheets[i];
      }
    }
    
    // Jika benar-benar belum ada, buat sheet baru dengan nama resmi
    sheet = ss.insertSheet(targetName);
    if (targetName === 'Buku Kas' || targetName === SHEETS.CASH_LOG) {
      sheet.appendRow(["Tanggal", "Tgl. Nota", "Akun", "Keterangan Debit", "Keterangan Kredit", "PIC", "NO. ID", "Debit", "Kredit", "Saldo Akhir", "Tgl. Penagihan", "Lampiran"]);
    } else if (targetName === 'Buku Bon' || targetName === SHEETS.BON_LOG) {
      sheet.appendRow(["ID BON", "Tanggal", "PIC", "Keterangan", "Nominal", "Status"]);
    }
  }
  return sheet;
}

function getCashSheet() { return getSheet(SHEETS.CASH_LOG); }
function getBonSheet() { return getSheet(SHEETS.BON_LOG); }

// ─── BUKU KAS OPERATIONS ────────────────────

/**
 * Append row ke Buku Kas
 */
function appendCashRow(data) {
  var sheet = getCashSheet();
  // Pastikan debit/kredit/saldo adalah angka
  var debitVal = typeof data.debit === 'number' ? data.debit : parseRupiah(data.debit);
  var kreditVal = typeof data.kredit === 'number' ? data.kredit : parseRupiah(data.kredit);
  var saldoVal = typeof data.saldo_akhir === 'number' ? data.saldo_akhir : parseRupiah(data.saldo_akhir);

  var row = [
    data.tanggal || formatDateISO(new Date()),
    data.tgl_nota || '',
    data.akun || '',
    data.keterangan_debit || (data.keterangan || ''),
    data.keterangan_kredit || (data.keterangan || ''),
    data.pic || '',
    data.no_id || '',
    debitVal,
    kreditVal,
    saldoVal,
    data.tgl_penagihan || '',
    data.lampiran || ''
  ];
  sheet.appendRow(row);
  var newRow = sheet.getLastRow();
  // Set format Rupiah pada kolom H, I, J
  sheet.getRange(newRow, 8, 1, 3).setNumberFormat('[$Rp-421] #,##0');
  return newRow;
}

/**
 * Baca semua data Buku Kas
 */
function readCashData() {
  var sheet = getCashSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var startRow = 2;
  var data = sheet.getRange(startRow, 1, lastRow - startRow + 1, 12).getValues();
  var result = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var tgl = row[0];
    if (!tgl && !row[6] && !row[7] && !row[8]) continue; // Skip empty rows

    // parseRupiah sebagai safety net: jika sel berisi angka, langsung return angka.
    // Jika sel berisi string "Rp50.000", parse ke 50000.
    var debitVal = (typeof row[7] === 'number') ? row[7] : parseRupiah(row[7]);
    var kreditVal = (typeof row[8] === 'number') ? row[8] : parseRupiah(row[8]);
    var saldoVal = (typeof row[9] === 'number') ? row[9] : parseRupiah(row[9]);

    result.push({
      _row: startRow + i,
      row_index: startRow + i,
      tanggal: formatDateISO(tgl),
      tgl_nota: formatDateISO(row[1]),
      akun: String(row[2] || ''),
      keterangan_debit: String(row[3] || ''),
      keterangan_kredit: String(row[4] || ''),
      keterangan: String(row[4] || row[3] || ''),
      pic: String(row[5] || ''),
      no_id: String(row[6] || ''),
      debit: debitVal,
      kredit: kreditVal,
      saldo_akhir: saldoVal,
      tgl_penagihan: formatDateISO(row[10]),
      lampiran: String(row[11] || '')
    });
  }

  return result;
}

/**
 * Alias untuk kompatibilitas
 */
function readCashRows(options) {
  var rows = readCashData();
  if (options && options.limit && options.limit > 0 && rows.length > options.limit) {
    return rows.slice(rows.length - options.limit);
  }
  return rows;
}

/**
 * Ambil transaksi kas berdasarkan rentang tanggal
 */
function getCashByDateRange(startDate, endDate) {
  var rows = readCashData();
  if (!startDate || !endDate) return rows;
  
  var sTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
  var eTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).getTime();

  return rows.filter(function(r) {
    if (!r.tanggal) return false;
    var d = parseDate(r.tanggal);
    if (!d) return false;
    var t = d.getTime();
    return t >= sTime && t <= eTime;
  });
}

/**
 * Cari row Buku Kas berdasarkan NO. ID (kolom G)
 */
function findCashRowByNoId(noId) {
  var sheet = getCashSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var ids = sheet.getRange(2, 7, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === String(noId).trim()) {
      return i + 2;
    }
  }
  return null;
}

/**
 * Update row Buku Kas
 */
function updateCashRow(rowIndex, data) {
  var sheet = getCashSheet();
  if (data.tanggal !== undefined) sheet.getRange(rowIndex, 1).setValue(data.tanggal);
  if (data.tgl_nota !== undefined) sheet.getRange(rowIndex, 2).setValue(data.tgl_nota);
  if (data.akun !== undefined) sheet.getRange(rowIndex, 3).setValue(data.akun);
  if (data.keterangan_debit !== undefined) sheet.getRange(rowIndex, 4).setValue(data.keterangan_debit);
  if (data.keterangan_kredit !== undefined) sheet.getRange(rowIndex, 5).setValue(data.keterangan_kredit);
  if (data.pic !== undefined) sheet.getRange(rowIndex, 6).setValue(data.pic);
  if (data.debit !== undefined) sheet.getRange(rowIndex, 8).setValue(data.debit);
  if (data.kredit !== undefined) sheet.getRange(rowIndex, 9).setValue(data.kredit);
  if (data.tgl_penagihan !== undefined) sheet.getRange(rowIndex, 11).setValue(data.tgl_penagihan);
  if (data.lampiran !== undefined) sheet.getRange(rowIndex, 12).setValue(data.lampiran);
}

/**
 * Hapus row Buku Kas
 */
function deleteCashRow(rowIndex) {
  var sheet = getCashSheet();
  sheet.deleteRow(rowIndex);
}

// ─── BUKU BON OPERATIONS ────────────────────

/**
 * Append row ke Buku Bon
 */
function appendBonRow(data) {
  var sheet = getBonSheet();
  // Pastikan nominal adalah angka
  var nominalVal = typeof data.nominal === 'number' ? data.nominal : parseRupiah(data.nominal);
  var row = [
    data.id_bon || generateNoId('BON'),
    data.tanggal || formatDateISO(new Date()),
    data.pic || '',
    data.keterangan || '',
    nominalVal,
    data.status || 'BELUM'
  ];
  sheet.appendRow(row);
  var newRow = sheet.getLastRow();
  // Set format Rupiah pada kolom E (Nominal)
  sheet.getRange(newRow, 5).setNumberFormat('[$Rp-421] #,##0');
  return newRow;
}

/**
 * Baca semua data Buku Bon
 */
function readBonData() {
  var sheet = getBonSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var result = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[2]) continue;

    var tgl = row[1];
    var daysAgo = calculateDaysAgo(tgl);
    // parseRupiah safety net: backward compat dengan data lama yang masih string
    var nominalVal = (typeof row[4] === 'number') ? row[4] : parseRupiah(row[4]);

    result.push({
      _row: i + 2,
      row_index: i + 2,
      id_bon: String(row[0] || ''),
      tanggal: formatDateISO(tgl),
      pic: String(row[2] || ''),
      keterangan: String(row[3] || ''),
      nominal: nominalVal,
      status: String(row[5] || 'BELUM').toUpperCase(),
      days_ago: daysAgo,
      alert_level: getAlertLevel(daysAgo, row[5])
    });
  }

  return result;
}

/**
 * Alias untuk kompatibilitas
 */
function readBonRows(options) {
  var rows = readBonData();
  if (options && options.limit && options.limit > 0 && rows.length > options.limit) {
    return rows.slice(rows.length - options.limit);
  }
  return rows;
}

/**
 * Ambil daftar bon yang belum dipertanggungjawabkan
 */
function getPendingBons() {
  var all = readBonData();
  return all.filter(function(b) {
    var st = String(b.status || '').trim().toUpperCase();
    return st === 'BELUM' || st === 'PENDING' || st === '';
  });
}

function getWarningBons() {
  return getPendingBons().filter(function(b) {
    return b.alert_level === 'WARNING';
  });
}

function getOverdueBons() {
  return getPendingBons().filter(function(b) {
    return b.alert_level === 'OVERDUE';
  });
}

/**
 * Cari bon berdasarkan ID BON (kolom A)
 */
function findBonById(idBon) {
  if (!idBon) return null;
  var rows = readBonData();
  var target = String(idBon).trim().toUpperCase();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].id_bon).trim().toUpperCase() === target) {
      return rows[i];
    }
  }
  return null;
}

/**
 * Cari row Buku Bon berdasarkan ID BON (kolom A)
 */
function findBonRowById(idBon) {
  var bon = findBonById(idBon);
  return bon ? bon._row : null;
}

/**
 * Update status Buku Bon
 */
function updateBonStatus(rowIndex, newStatus) {
  var sheet = getBonSheet();
  sheet.getRange(rowIndex, 6).setValue(newStatus);
}

/**
 * Update status Buku Bon ke SUDAH (Lunas)
 */
function markBonLunas(idBon) {
  var rowIndex = findBonRowById(idBon);
  if (!rowIndex) return false;
  updateBonStatus(rowIndex, 'SUDAH');
  return true;
}

// ─── REKALKULASI SALDO AKHIR ─────────────────────

/**
 * Hitung Ulang Kolom J (Saldo Akhir) di Buku Kas dari atas ke bawah.
 */
function recalculateSaldoAkhir() {
  var sheet = getCashSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var runningSaldo = 0;
  var saldos = [];

  for (var i = 0; i < data.length; i++) {
    // parseRupiah safety net: jika angka, langsung return angka. Jika string Rp, parse.
    var debit = (typeof data[i][7] === 'number') ? data[i][7] : parseRupiah(data[i][7]);
    var kredit = (typeof data[i][8] === 'number') ? data[i][8] : parseRupiah(data[i][8]);
    runningSaldo += (debit - kredit);
    saldos.push([runningSaldo]);
  }

  // Write bulk back to column J sebagai angka
  sheet.getRange(2, 10, saldos.length, 1).setValues(saldos);
  // Set format Rupiah pada kolom J
  sheet.getRange(2, 10, saldos.length, 1).setNumberFormat('[$Rp-421] #,##0');
  return runningSaldo;
}

/**
 * Alias kompatibilitas untuk rekalkulasi saldo kas
 */
function _recalculateCashBalances(sheet, startRow) {
  return recalculateSaldoAkhir();
}

/**
 * MIGRASI DATA (jalankan sekali):
 * Convert kolom Debit/Kredit/Saldo (Buku Kas) dan Nominal (Buku Bon)
 * dari string "Rp50.000" ke angka 50000 + format display Rupiah.
 */
function migrateStringToNumber() {
  var cashSheet = getCashSheet();
  var bonSheet = getBonSheet();

  // ─── Migrasi Buku Kas: Kolom H (Debit), I (Kredit), J (Saldo Akhir) ───
  var cashLastRow = cashSheet.getLastRow();
  if (cashLastRow >= 2) {
    var cashData = cashSheet.getRange(2, 8, cashLastRow - 1, 3).getValues(); // H, I, J
    var converted = [];
    for (var i = 0; i < cashData.length; i++) {
      var debit = (typeof cashData[i][0] === 'number') ? cashData[i][0] : parseRupiah(cashData[i][0]);
      var kredit = (typeof cashData[i][1] === 'number') ? cashData[i][1] : parseRupiah(cashData[i][1]);
      var saldo = (typeof cashData[i][2] === 'number') ? cashData[i][2] : parseRupiah(cashData[i][2]);
      converted.push([debit, kredit, saldo]);
    }
    cashSheet.getRange(2, 8, converted.length, 3).setValues(converted);
    cashSheet.getRange(2, 8, converted.length, 3).setNumberFormat('[$Rp-421] #,##0');
    Logger.log('✅ Migrasi Buku Kas: ' + converted.length + ' baris dikonversi');
  }

  // ─── Migrasi Buku Bon: Kolom E (Nominal) ───
  var bonLastRow = bonSheet.getLastRow();
  if (bonLastRow >= 2) {
    var bonData = bonSheet.getRange(2, 5, bonLastRow - 1, 1).getValues(); // E
    var bonConverted = [];
    for (var j = 0; j < bonData.length; j++) {
      var nom = (typeof bonData[j][0] === 'number') ? bonData[j][0] : parseRupiah(bonData[j][0]);
      bonConverted.push([nom]);
    }
    bonSheet.getRange(2, 5, bonConverted.length, 1).setValues(bonConverted);
    bonSheet.getRange(2, 5, bonConverted.length, 1).setNumberFormat('[$Rp-421] #,##0');
    Logger.log('✅ Migrasi Buku Bon: ' + bonConverted.length + ' baris dikonversi');
  }

  // ─── Rekalkulasi saldo dari awal ───
  recalculateSaldoAkhir();
  Logger.log('✅ Migrasi selesai. Saldo telah dihitung ulang.');
  return 'Migrasi selesai.';
}

// ─── SETUP DASHBOARD VISUAL ─────────────────────

function setupGSheetDashboard() {
  var ss = getSpreadsheet();
  var d = ss.getSheetByName(SHEETS.DASHBOARD);
  if (!d) {
    d = ss.insertSheet(SHEETS.DASHBOARD);
  }
  d.clear();

  // Styling layout
  d.setColumnWidth(1, 20); // A margin
  d.setColumnWidth(2, 110); // B: Tanggal
  d.setColumnWidth(3, 110); // C: Tgl. Nota
  d.setColumnWidth(4, 130); // D: Akun
  d.setColumnWidth(5, 200); // E: Ket. Debit
  d.setColumnWidth(6, 200); // F: Ket. Kredit
  d.setColumnWidth(7, 120); // G: PIC
  d.setColumnWidth(8, 140); // H: NO. ID
  d.setColumnWidth(9, 110); // I: Debit
  d.setColumnWidth(10, 110); // J: Kredit
  d.setColumnWidth(11, 130); // K: Saldo Akhir
  d.setColumnWidth(12, 110); // L: Tgl. Penagihan
  d.setColumnWidth(13, 100); // M: Lampiran

  // Title Block
  d.getRange('B2:M2').merge().setValue('🏦 PETTY CASH PT BABJM').setFontSize(16).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1e3a8a').setHorizontalAlignment('center').setVerticalAlignment('middle');
  d.getRange('B3:M3').merge().setValue('Dashboard Ringkasan Kas & Filter Tanggal').setFontSize(10).setFontStyle('italic').setFontColor('#e2e8f0').setBackground('#1e3a8a').setHorizontalAlignment('center').setVerticalAlignment('middle');
  d.setRowHeight(2, 35);
  d.setRowHeight(3, 20);

  // Filters Block
  d.getRange('B5').setValue('Tanggal Awal').setFontWeight('bold').setBackground('#f1f5f9').setHorizontalAlignment('center');
  d.getRange('B6').setValue('Tanggal Akhir').setFontWeight('bold').setBackground('#f1f5f9').setHorizontalAlignment('center');
  
  // Default values: 1 week ago to today
  d.getRange('C5').setFormula('=TODAY()-7').setNumberFormat('yyyy-mm-dd').setBackground('#fffbeb').setHorizontalAlignment('center');
  d.getRange('C6').setFormula('=TODAY()').setNumberFormat('yyyy-mm-dd').setBackground('#fffbeb').setHorizontalAlignment('center');
  
  // Set Date Validation
  var dateValidation = SpreadsheetApp.newDataValidation().requireDate().build();
  d.getRange('C5:C6').setDataValidation(dateValidation);
  
  // Summary Metrics Headers
  d.getRange('E5').setValue('TOTAL DEBIT').setBackground('#15803d').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  d.getRange('F5').setValue('TOTAL KREDIT').setBackground('#b91c1c').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  d.getRange('G5').setValue('BARIS DATA').setBackground('#475569').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  d.getRange('H5').setValue('SALDO AWAL').setBackground('#0369a1').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  d.getRange('I5').setValue('SALDO AKHIR').setBackground('#0f172a').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  
  // Summary Metrics Values Formulations
  d.getRange('E6').setFormula('=SUMIFS(\'Buku Kas\'!H2:H; \'Buku Kas\'!A2:A; ">="&C5; \'Buku Kas\'!A2:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('F6').setFormula('=SUMIFS(\'Buku Kas\'!I2:I; \'Buku Kas\'!A2:A; ">="&C5; \'Buku Kas\'!A2:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('G6').setFormula('=COUNTIFS(\'Buku Kas\'!A2:A; ">="&C5; \'Buku Kas\'!A2:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('#,##0');
  d.getRange('H6').setFormula('=XLOOKUP(C5-1; FILTER(\'Buku Kas\'!A$2:A; ISNUMBER(\'Buku Kas\'!A$2:A) * (\'Buku Kas\'!J$2:J<>"")); FILTER(\'Buku Kas\'!J$2:J; ISNUMBER(\'Buku Kas\'!A$2:A) * (\'Buku Kas\'!J$2:J<>"")); \'Buku Kas\'!J$2; -1; -1)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('I6').setFormula('=H6+E6-F6').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');

  // Borders for Summary Cards and Input
  d.getRange('B5:C6').setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  d.getRange('E5:I6').setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);

  // Table Title Block
  d.getRange('B8:M8').merge().setValue('📋 LOG TRANSAKSI FILTERED').setFontWeight('bold').setFontSize(11).setFontColor('#FFFFFF').setBackground('#334155').setHorizontalAlignment('center').setVerticalAlignment('middle');
  d.setRowHeight(8, 25);

  // Table Headers
  var headers = [
    ["Tanggal", "Tgl. Nota", "Akun", "Keterangan Debit", "Keterangan Kredit", "PIC", "NO. ID", "Debit", "Kredit", "Saldo Akhir", "Tgl. Penagihan", "Lampiran"]
  ];
  d.getRange('B9:M9').setValues(headers).setBackground('#475569').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  d.setRowHeight(9, 25);

  // Table Data Filter Formula
  d.getRange('B10').setFormula('=IFERROR(FILTER(\'Buku Kas\'!A2:L; \'Buku Kas\'!A2:A>=C5; \'Buku Kas\'!A2:A<=C6); "Tidak ada transaksi dalam rentang ini")');
  
  // Format table data columns
  d.getRange('B10:B1000').setHorizontalAlignment('center');
  d.getRange('C10:C1000').setHorizontalAlignment('center');
  d.getRange('D10:D1000').setHorizontalAlignment('center');
  d.getRange('G10:G1000').setHorizontalAlignment('center');
  d.getRange('H10:H1000').setHorizontalAlignment('center');
  d.getRange('I10:K1000').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('L10:L1000').setHorizontalAlignment('center');
  d.getRange('M10:M1000').setHorizontalAlignment('center');
  
  return 'Dashboard Google Sheet berhasil dibangun!';
}
