/**
 * ============================================
 * SheetHelper.gs — Google Sheets Utilities
 * Sistem Petty Cash PT BABJM
 * ============================================
 * Kolom sesuai struktur aktual spreadsheet
 */

var SPREADSHEET_ID = '18_zWVbJZOX90vkPl9NHikXimgOUSZDSE5EOGiVqbYpk';

var SHEETS = {
  CASH_LOG: 'Cash_log',
  BON_LOG: 'Bon_log',
  DASHBOARD: 'Dashboard'
};

// Kolom Cash_log: A-J (index 1-10)
var CASH_COLS = {
  TANGGAL: 1,           // A: PT BABJM LAPORAN PETTY CASH Tanggal
  TGL_NOTA: 2,          // B: Tgl. Nota
  AKUN: 3,              // C: Akun
  KETERANGAN_DEBIT: 4,  // D: Keterangan Debit
  KETERANGAN_KREDIT: 5, // E: Keterangan Kredit (labeled "Keterangan")
  PIC: 6,               // F: PIC
  NO_ID: 7,             // G: NO. ID
  DEBIT: 8,             // H: Debit (nominal)
  KREDIT: 9,            // I: Kredit (nominal)
  SALDO_AKHIR: 10,      // J: Saldo Akhir
  TGL_PENAGIHAN: 11,    // K: Tgl. Penagihan
  LAMPIRAN: 12          // L: Lampiran
};

// Kolom Bon_log: A-F (index 1-6)
var BON_COLS = {
  ID_BON: 1,        // A: ID BON
  TANGGAL: 2,       // B: Tanggal
  PIC: 3,           // C: PIC
  KETERANGAN: 4,    // D: Keterangan
  NOMINAL: 5,       // E: Nominal
  STATUS: 6         // F: Status
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
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEETS.CASH_LOG) {
      sheet.appendRow(["Tanggal", "Tgl. Nota", "Akun", "Keterangan Debit", "Keterangan Kredit", "PIC", "NO. ID", "Debit", "Kredit", "Saldo Akhir", "Tgl. Penagihan", "Lampiran"]);
    } else if (name === SHEETS.BON_LOG) {
      sheet.appendRow(["ID BON", "Tanggal", "PIC", "Keterangan", "Nominal", "Status"]);
    }
  }
  return sheet;
}

function getCashSheet() { return getSheet(SHEETS.CASH_LOG); }
function getBonSheet() { return getSheet(SHEETS.BON_LOG); }

// ─── CASH_LOG OPERATIONS ────────────────────

/**
 * Append row ke Cash_log
 * @param {Object} data {tanggal, tgl_nota, akun, keterangan, pic, no_id, debit, kredit, saldo_akhir, tgl_penagihan}
 * @return {number} New row number
 */
function appendCashRow(data) {
  var sheet = getCashSheet();
  var row = [
    data.tanggal || formatDateISO(new Date()),
    data.tgl_nota || '',
    data.akun || 'Operasional',
    data.keterangan_debit || '',
    data.keterangan_kredit || (data.keterangan || ''),
    data.pic || '',
    data.no_id || generateNoId('CASH'),
    data.debit || 0,
    data.kredit || 0,
    data.saldo_akhir || 0,
    data.tgl_penagihan || '',
    data.lampiran || ''
  ];
  sheet.appendRow(row);
  return sheet.getLastRow();
}

/**
 * Baca semua data Cash_log
 * Skip header (row 1 s/d 6 if formatted, or row 1)
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

    result.push({
      row_index: startRow + i,
      tanggal: formatDateISO(tgl),
      tgl_nota: formatDateISO(row[1]),
      akun: String(row[2] || ''),
      keterangan_debit: String(row[3] || ''),
      keterangan_kredit: String(row[4] || ''),
      keterangan: String(row[4] || row[3] || ''),
      pic: String(row[5] || ''),
      no_id: String(row[6] || ''),
      debit: Number(row[7]) || 0,
      kredit: Number(row[8]) || 0,
      saldo_akhir: Number(row[9]) || 0,
      tgl_penagihan: formatDateISO(row[10]),
      lampiran: String(row[11] || '')
    });
  }

  return result;
}

/**
 * Cari row Cash_log berdasarkan NO. ID (kolom G)
 */
function findCashRowByNoId(noId) {
  var sheet = getCashSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var ids = sheet.getRange(2, 7, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === String(noId).trim()) {
      return i + 2; // 1-based row index
    }
  }
  return null;
}

/**
 * Update row Cash_log
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
 * Hapus row Cash_log
 */
function deleteCashRow(rowIndex) {
  var sheet = getCashSheet();
  sheet.deleteRow(rowIndex);
}

// ─── BON_LOG OPERATIONS ────────────────────

/**
 * Append row ke Bon_log
 * @param {Object} data {id_bon, tanggal, pic, keterangan, nominal, status}
 */
function appendBonRow(data) {
  var sheet = getBonSheet();
  var row = [
    data.id_bon || generateNoId('BON'),
    data.tanggal || formatDateISO(new Date()),
    data.pic || '',
    data.keterangan || '',
    data.nominal || 0,
    data.status || 'BELUM'
  ];
  sheet.appendRow(row);
  return sheet.getLastRow();
}

/**
 * Baca semua data Bon_log
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

    result.push({
      row_index: i + 2,
      id_bon: String(row[0] || ''),
      tanggal: formatDateISO(tgl),
      pic: String(row[2] || ''),
      keterangan: String(row[3] || ''),
      nominal: Number(row[4]) || 0,
      status: String(row[5] || 'BELUM').toUpperCase(),
      days_ago: daysAgo,
      alert_level: getAlertLevel(daysAgo, row[5])
    });
  }

  return result;
}

/**
 * Cari row Bon_log berdasarkan ID BON (kolom A)
 */
function findBonRowById(idBon) {
  var sheet = getBonSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() === String(idBon).trim().toUpperCase()) {
      return i + 2;
    }
  }
  return null;
}

/**
 * Update status Bon_log ke SUDAH (Lunas)
 */
function markBonLunas(idBon) {
  var rowIndex = findBonRowById(idBon);
  if (!rowIndex) return false;

  var sheet = getBonSheet();
  sheet.getRange(rowIndex, 6).setValue('SUDAH');
  return true;
}

// ─── REKALSULASI SALDO AKHIR ─────────────────────

/**
 * Hitung Ulang Kolom J (Saldo Akhir) di Cash_log dari atas ke bawah.
 * PENTING: Dijalankan tiap kali ada insert/update/delete kas!
 */
function recalculateSaldoAkhir() {
  var sheet = getCashSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var runningSaldo = 0;
  var saldos = [];

  for (var i = 0; i < data.length; i++) {
    var debit = Number(data[i][7]) || 0;
    var kredit = Number(data[i][8]) || 0;
    runningSaldo += (debit - kredit);
    saldos.push([runningSaldo]);
  }

  // Write bulk back to column J
  sheet.getRange(2, 10, saldos.length, 1).setValues(saldos);
  return runningSaldo;
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
  
  // Summary Metrics Values Formulations (using Indonesian semicolon divider as required by sheet locale)
  d.getRange('E6').setFormula('=SUMIFS(Cash_log!H7:H; Cash_log!A7:A; ">="&C5; Cash_log!A7:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('F6').setFormula('=SUMIFS(Cash_log!I7:I; Cash_log!A7:A; ">="&C5; Cash_log!A7:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
  d.getRange('G6').setFormula('=COUNTIFS(Cash_log!A7:A; ">="&C5; Cash_log!A7:A; "<="&C6)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('#,##0');
  d.getRange('H6').setFormula('=XLOOKUP(C5-1; FILTER(Cash_log!A$6:A; ISNUMBER(Cash_log!A$6:A) * (Cash_log!J$6:J<>"")); FILTER(Cash_log!J$6:J; ISNUMBER(Cash_log!A$6:A) * (Cash_log!J$6:J<>"")); Cash_log!J$6; -1; -1)').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('[$Rp-421] #,##0');
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
  d.getRange('B10').setFormula('=IFERROR(FILTER(Cash_log!A7:L; Cash_log!A7:A>=C5; Cash_log!A7:A<=C6); "Tidak ada transaksi dalam rentang ini")');
  
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
