const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  bufferPages: true
});

const outDir = path.join(__dirname, '../../'); // root repo directory
const outPath = path.join(outDir, 'Manual_Book_PettyCash_BABJM.pdf');
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

// Styling constants
const COLOR_PRIMARY = '#1A73E8'; // Professional Blue
const COLOR_SECONDARY = '#2D3748'; // Dark charcoal
const COLOR_MUTED = '#718096'; // Cool gray
const COLOR_LIGHT = '#F8FAFC'; // Very light gray
const COLOR_BORDER = '#E2E8F0'; // Border light gray
const COLOR_DEBIT = '#275623'; // Dark green
const COLOR_KREDIT = '#C00000'; // Dark red
const COLOR_BG_DEBIT = '#E2EFDA'; // Light green
const COLOR_BG_KREDIT = '#F2DCDB'; // Light red

// Helper function for adding headings
function addHeading1(text) {
  doc.addPage();
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(16).text(text);
  doc.moveDown(0.4);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).stroke(COLOR_PRIMARY);
  doc.moveDown(0.8);
}

function addHeading2(text) {
  doc.moveDown(0.8);
  doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').fontSize(12).text(text);
  doc.moveDown(0.3);
}

function addHeading3(text) {
  doc.moveDown(0.6);
  doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').fontSize(9.5).text(text);
  doc.moveDown(0.2);
}

// Helper for standard paragraph
function addParagraph(text) {
  doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.5).text(text, {
    align: 'justify',
    lineGap: 2.5
  });
  doc.moveDown(0.5);
}

// Helper for bullet points
function addBullet(boldText, normalText) {
  doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').fontSize(9.5).text('•  ' + boldText, {
    continued: true
  }).font('Helvetica').text(normalText, {
    lineGap: 2
  });
  doc.moveDown(0.3);
}

// Helper for code/command block
function addCodeBlock(code) {
  const padding = 8;
  const startY = doc.y;
  doc.font('Courier').fontSize(8.5);
  
  const height = doc.heightOfString(code, { width: 475 }) + (padding * 2);
  
  doc.rect(50, startY, 495, height).fill(COLOR_LIGHT);
  doc.rect(50, startY, 495, height).lineWidth(0.5).stroke(COLOR_BORDER);
  
  doc.fillColor('#2D3748').text(code, 50 + padding, startY + padding, {
    width: 495 - (padding * 2)
  });
  
  doc.y = startY + height;
  doc.moveDown(0.5);
}

// Helper for embedding visual images into PDF
function addImage(imageRelPath, caption) {
  const fullPath = path.join(__dirname, '../../public', imageRelPath);
  if (fs.existsSync(fullPath)) {
    doc.moveDown(0.4);
    const imgWidth = 420;
    const startX = (595.28 - imgWidth) / 2; // Center horizontally on A4
    doc.image(fullPath, startX, doc.y, {
      fit: [imgWidth, 180],
      align: 'center'
    });
    doc.y += 185;
    doc.fillColor(COLOR_MUTED).font('Helvetica-Oblique').fontSize(8).text(caption, { align: 'center' });
    doc.moveDown(0.5);
  }
}

// Helper for note/callout box
function addCalloutBox(title, text, type = 'info') {
  const padding = 8;
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(9);
  
  const fullText = title.toUpperCase() + '\n' + text;
  const height = doc.heightOfString(fullText, { width: 465 }) + (padding * 2);
  
  let bgColor = COLOR_LIGHT;
  let borderColor = COLOR_PRIMARY;
  let textColor = COLOR_SECONDARY;
  
  if (type === 'debit') {
    bgColor = COLOR_BG_DEBIT;
    borderColor = COLOR_DEBIT;
    textColor = COLOR_DEBIT;
  } else if (type === 'kredit') {
    bgColor = COLOR_BG_KREDIT;
    borderColor = COLOR_KREDIT;
    textColor = COLOR_KREDIT;
  }
  
  doc.rect(50, startY, 495, height).fill(bgColor);
  doc.rect(50, startY, 4, height).fill(borderColor);
  
  doc.fillColor(textColor).font('Helvetica-Bold').fontSize(8.5).text(title.toUpperCase(), 50 + padding + 4, startY + padding);
  doc.font('Helvetica').fontSize(8.5).text(text, 50 + padding + 4, doc.y + 2, {
    width: 495 - (padding * 2) - 4
  });
  
  doc.y = startY + height;
  doc.moveDown(0.5);
}

// ─── COVER PAGE ─────────────────────────────
doc.rect(0, 0, 595.28, 841.89).fill('#1A202C'); // Dark slate background

doc.rect(0, 140, 595.28, 12).fill(COLOR_PRIMARY);

doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(24).text('MANUAL BOOK PEMULA', 50, 220);
doc.fontSize(16).text('PANDUAN OPERASIONAL SISTEM PETTY CASH & KASBON', 50, 255);

doc.fillColor('#A0AEC0').font('Helvetica').fontSize(11).text('Panduan Lengkap Langkah demi Langkah untuk Staf Baru PT BABJM\nIntegrasi Google Sheets, Aplikasi Website & Telegram Bot', 50, 290, {
  lineGap: 4
});

doc.rect(50, 390, 495, 120).fill('#2D3748');
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9.5).text('TAUTAN AKSES EKOSISTEM AKTIF:', 65, 405);
doc.fillColor(COLOR_PRIMARY).font('Courier-Bold').fontSize(9.5).text('Aplikasi Website : https://petty-cash-babjm.vercel.app', 65, 425);
doc.text('Telegram Bot     : https://t.me/BABJM_PettyCash_bot', 65, 445);
doc.text('Username Bot     : @BABJM_PettyCash_bot', 65, 465);
doc.fillColor('#A0AEC0').font('Helvetica-Oblique').fontSize(8.5).text('Catatan: Bot Telegram dapat langsung dicari di aplikasi Telegram hp/laptop.', 65, 490);

doc.rect(50, 620, 495, 120).fill('#2D3748');
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10.5).text('KEPEMILIKAN SISTEM & HAK CIPTA:', 65, 635);
doc.font('Helvetica').fontSize(9.5).text('PT BERKAH AMANAH BERSAMA JAYA MAKMUR (PT BABJM)', 65, 655);
doc.fillColor('#A0AEC0').fontSize(8.5).text('Pengembangan Sistem: Next.js Web App | Google Apps Script Backend | Telegram API\nVersi Dokumentasi: v2.0 (Edisi Khusus Training Karyawan Baru - Agustus 2026)', 65, 680, { lineGap: 3 });

// ─── PAGE 2: DAFTAR ISI ─────────────────────
doc.addPage();
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(16).text('DAFTAR ISI');
doc.moveDown(0.4);
doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).stroke(COLOR_PRIMARY);
doc.moveDown(1.2);

const toc = [
  { title: '1. Pendahuluan & Gambaran Umum Ekosistem', page: 3 },
  { title: '2. MODUL 1: Panduan Penggunaan Google Sheets (GSheet)', page: 4 },
  { title: '   - Structure Tab Cash_log, Bon_log, dan Dashboard', page: 4 },
  { title: '   - Aturan Input Manual & Formula Otomatis Saldo', page: 5 },
  { title: '3. MODUL 2: Panduan Penggunaan Aplikasi Website', page: 6 },
  { title: '   - Membaca Dashboard & Kartu Metrik Saldo', page: 6 },
  { title: '   - Pencatatan Transaksi (Single Form & Grid Edit)', page: 7 },
  { title: '   - Ekspor/Impor Excel & Cetak Laporan Fisik PDF', page: 8 },
  { title: '   - Manajemen Kasbon Karyawan & Settle Selisih Nota', page: 9 },
  { title: '4. MODUL 3: Panduan Koneksi & Penggunaan Telegram Bot', page: 10 },
  { title: '   - Cara Menghubungkan Bot Pertama Kali (@BABJM_PettyCash_bot)', page: 10 },
  { title: '   - Menggunakan Persistent Keyboard Menu (6 Tombol Utam)', page: 11 },
  { title: '   - Format Pesan Teks Cepat (Smart Nominal Parser)', page: 12 },
  { title: '   - Direct Slash Commands (/kas, /bon, /saldo, /rekap)', page: 13 },
  { title: '   - Fitur Tautan Biru Pelunasan Sekali Klik & Auto-Reminder', page: 14 },
  { title: '5. TroubleShooting & Pertanyaan Umum (FAQ)', page: 15 }
];

toc.forEach(item => {
  const startY = doc.y;
  doc.fillColor(COLOR_SECONDARY).font(item.title.startsWith('   -') ? 'Helvetica' : 'Helvetica-Bold').fontSize( item.title.startsWith('   -') ? 9 : 10).text(item.title, 50, startY);
  
  const dots = '.'.repeat(75 - item.title.length);
  doc.fillColor(COLOR_MUTED).font('Helvetica').fontSize(9).text(dots, 360, startY, { width: 140 });
  
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text(String(item.page), 520, startY, { align: 'right' });
  doc.moveDown(1);
});


// ─── PAGE 3: PENDAHULUAN ────────────────────
addHeading1('1. Pendahuluan & Gambaran Umum Ekosistem');
addParagraph('Selamat datang di PT BERKAH AMANAH BERSAMA JAYA MAKMUR (PT BABJM). Buku panduan ini disusun secara rinci untuk membantu Anda sebagai karyawan/staf baru dalam memahami dan mengoperasikan Sistem Keuangan Petty Cash (Kas Kecil) dan Bon (Kasbon Karyawan).');

addParagraph('Ekosistem keuangan PT BABJM terdiri dari 3 komponen utama yang saling terhubung secara real-time:');

addCalloutBox('1. Google Sheets (Database Terpusat)', 'Menjadi database utama penyimpanan data transaksi kas (`Cash_log`) dan kasbon (`Bon_log`). Seluruh data yang diinput dari Web maupun Telegram secara otomatis bermuara di sini.', 'info');

addCalloutBox('2. Aplikasi Website (Pusat Kendali Admin)', 'Tautan: https://petty-cash-babjm.vercel.app\nDigunakan oleh Admin Keuangan untuk memantau dashboard, filter laporan, edit massal (Grid Mode), ekspor-impor Excel, dan mencetak laporan fisik.', 'debit');

addCalloutBox('3. Telegram Bot (Alat Input Cepat Lapangan)', 'Tautan: https://t.me/BABJM_PettyCash_bot | Username: @BABJM_PettyCash_bot\nDigunakan oleh seluruh staf untuk mencatat transaksi kas & bon secara instan dari hp/laptop menggunakan tombol menu interaktif atau perintah chat.', 'info');

addHeading2('Diagram Alur Kerja Ekosistem:');
addCodeBlock(
  '+--------------------+       +--------------------+       +--------------------+\n' +
  '|  TELEGRAM BOT      | ----> |  GOOGLE SHEETS     | <---- |  APLIKASI WEBSITE  |\n' +
  '|  (@BABJM_PettyCash)|       |  (Cash_log & Bon)  |       |  (Vercel Web App)  |\n' +
  '+--------------------+       +--------------------+       +--------------------+\n' +
  '          |                            ^                            |\n' +
  '          +--- Input Cepat / Status ---+--- Sinkronisasi Realtime --+'
);


// ─── PAGE 4: MODUL 1 - GSHEET ───────────────
addHeading1('2. MODUL 1: Panduan Penggunaan Google Sheets (GSheet)');
addParagraph('Google Sheets berfungsi sebagai spreadsheet terpusat yang menyimpan seluruh data mentah transaksi. Sebagai staf baru, Anda perlu memahami struktur tab dan kolom berikut:');

addImage('/images/gsheet_tutorial_guide.png', 'Diagram Visual Structure Google Sheets (Cash_log & Bon_log)');

addHeading2('1. Tab `Cash_log` (Log Transaksi Kas Kecil)');
addParagraph('Tab ini mencatat seluruh arus kas masuk (Debit) dan kas keluar (Kredit). Terdiri dari 12 Kolom Utama (A s/d L):');

addBullet('Kolom A (Tanggal):', ' Tanggal transaksi kas dilakukan (format: YYYY-MM-DD).');
addBullet('Kolom B (Tgl. Nota):', ' Tanggal yang tertera pada bukti fisik nota/kuitansi belanja.');
addBullet('Kolom C (Akun):', ' Kategori pengeluaran (misal: ATK, Operasional, Konsumsi, Bensin, dll.).');
addBullet('Kolom D (Keterangan Debit):', ' Deskripsi transaksi penerimaan dana (Kas Masuk).');
addBullet('Kolom E (Keterangan Kredit):', ' Deskripsi transaksi pengeluaran dana (Kas Keluar).');
addBullet('Kolom F (PIC):', ' Nama penanggung jawab transaksi.');
addBullet('Kolom G (NO. ID):', ' Nomor ID atau kode referensi unik transaksi.');
addBullet('Kolom H (Debit):', ' Nominal uang kas masuk (penerimaan).');
addBullet('Kolom I (Kredit):', ' Nominal uang kas keluar (pengeluaran).');
addBullet('Kolom J (Saldo Akhir):', ' Sisa saldo akumulasi berjalan (Dihitung Otomatis).');
addBullet('Kolom K (Tgl. Penagihan):', ' Tanggal jatuh tempo penagihan (opsional).');
addBullet('Kolom L (Lampiran):', ' Catatan tambahan atau link file pendukung.');


// ─── PAGE 5: GSHEET ATURAN ──────────────────
addHeading1('2. MODUL 1: Panduan Penggunaan GSheet (Lanjutan)');

addHeading2('2. Tab `Bon_log` (Buku Kasbon Karyawan)');
addParagraph('Tab ini khusus mencatat transaksi pinjaman sementara (bon/panjar) karyawan sebelum diserahkan bukti nota belanjanya:');

addBullet('Kolom A (ID BON):', ' Kode unik bon (contoh: BON-202608-001).');
addBullet('Kolom B (Tanggal):', ' Tanggal bon diajukan oleh karyawan.');
addBullet('Kolom C (PIC):', ' Nama karyawan yang mengambil kasbon.');
addBullet('Kolom D (Keterangan):', ' Tujuan penggunaan dana kasbon.');
addBullet('Kolom E (Nominal):', ' Total nilai uang kasbon yang diambil.');
addBullet('Kolom F (Status):', ' Status kelunasan: `BELUM` (aktif/outstanding) atau `SUDAH` (lunas).');

addHeading2('3. Tab `Dashboard`');
addParagraph('Tab visual di Google Sheets yang menampilkan KPI Saldo, Total Masuk, Total Keluar, dan Filter Tanggal Awal/Akhir.');

addCalloutBox('ATURAN PENTING INPUT MANUAL DI GSHEET', 
  '1. DILARANG MENGEDIT KOLOM J (Saldo Akhir) di Cash_log karena berisi rumus akumulasi otomatis.\n' +
  '2. Jika menambah baris data manual di GSheet, pastikan format Tanggal ditulis benar (YYYY-MM-DD).\n' +
  '3. Untuk memperbarui visual tab Dashboard GSheet jika berantakan, jalankan fungsi setupGSheetDashboard() di Apps Script Editor.', 
  'kredit'
);


// ─── PAGE 6: MODUL 2 - WEBSITE ──────────────
addHeading1('3. MODUL 2: Panduan Penggunaan Aplikasi Website');
addParagraph('Aplikasi website adalah antarmuka utama bagi Admin Keuangan. Buka browser dan akses tautan: https://petty-cash-babjm.vercel.app');

addImage('/images/webapp_tutorial_guide.png', 'Diagram Visual Antarmuka Website Petty Cash PT BABJM');

addHeading2('1. Halaman Dashboard (Ringkasan Eksekutif)');
addParagraph('Saat pertama kali membuka web, Anda akan disajikan 3 Kartu Metrik Saldo:');
addBullet('Kartu 1 - Saldo Kas Aktif:', ' Menampilkan sisa dana tunai riil di brankas kas kecil saat ini.');
addBullet('Kartu 2 - Netto Bulan Ini:', ' Selisih total pemasukan dikurangi total pengeluaran dalam bulan berjalan.');
addBullet('Kartu 3 - Status Kasbon Outstanding:', ' Menampilkan ringkasan jumlah kasbon karyawan yang belum lunas beserta indikator warna statusnya.');

addHeading2('Indikator Warna Umur Kasbon:');
addBullet('🟢 Normal (Umur 1 - 9 hari):', ' Kasbon dalam batas waktu wajar.');
addBullet('🟡 Warning (Umur 10 - 13 hari):', ' Kasbon mendekati batas jatuh tempo (14 hari).');
addBullet('🔴 Overdue (Umur >= 14 hari):', ' Kasbon melebihi batas waktu 14 hari dan wajib ditagih.');


// ─── PAGE 7: WEBSITE TRANSAKSI ─────────────
addHeading1('3. MODUL 2: Panduan Penggunaan Website (Lanjutan)');

addHeading2('2. Halaman Transaksi (Pencatatan Kas)');
addParagraph('Digunakan untuk melihat dan mencatat seluruh transaksi kas masuk & keluar.');

addHeading3('A. Cara Input Transaksi Baru (+ Transaksi Baru):');
addParagraph('1. Klik tombol "+ Transaksi Baru" di kanan atas.\n' +
  '2. Isi Tanggal Transaksi & Tgl. Nota.\n' +
  '3. Pilih Akun Pengeluaran (misal: ATK, Konsumsi, Bensin).\n' +
  '4. Pilih Jenis Kas: Debit (Masuk) atau Kredit (Keluar).\n' +
  '5. Masukkan Nominal & Keterangan detail.\n' +
  '6. Klik Simpan.');

addHeading3('B. Cara Edit Banyak Data (Grid Edit Mode):');
addParagraph('1. Centang baris-baris transaksi yang ingin diubah pada tabel.\n' +
  '2. Klik tombol "Edit Grid Mode" pada baris melayang di bawah.\n' +
  '3. Ubah teks/angka pada sel tabel yang dapat diketik seperti Excel.\n' +
  '4. Klik "Simpan Perubahan".');


// ─── PAGE 8: IMPOR EKSPOR PDF ───────────────
addHeading1('3. MODUL 2: Panduan Penggunaan Website (Lanjutan)');

addHeading2('3. Fitur Impor & Ekspor Excel');
addBullet('Impor Excel (Batch Upload):', ' Klik tombol "Import" untuk mengunggah puluhan transaksi sekaligus via file Excel. Gunakan templat resmi dengan kode warna:\n' +
  '  • Kolom Merah: Wajib diisi (Tanggal).\n' +
  '  • Kolom Kuning: Diisi sesuai jenis transaksi (Debit/Kredit).\n' +
  '  • Kolom Biru: Opsional (Nota, Akun, PIC, No. ID).\n' +
  '  • Kolom Abu-abu: Dibiarkan kosong (Otomatis).');

addBullet('Ekspor Excel:', ' Klik tombol "Export" untuk mengunduh laporan kas bersih terformat rapi tanpa kolom ### terpotong.');

addHeading2('4. Cetak Laporan Fisik (Cetak PDF)');
addParagraph('Klik tombol "Cetak PDF" untuk mencetak laporan resmi kas kecil. Sistem akan menyembunyikan navigasi web dan menambahkan Kotak Tanda Tangan resmi di bagian bawah laporan:');

addCodeBlock(
  '  Disiapkan Oleh:             Diperiksa Oleh:             Disetujui Oleh:\n\n\n' +
  '  ( Admin Keuangan )          ( Supervisor )              ( Pimpinan/Direktur )'
);


// ─── PAGE 9: MANAJEMEN KASBON ───────────────
addHeading1('3. MODUL 2: Panduan Penggunaan Website (Lanjutan)');

addHeading2('5. Halaman Bon (Kasbon Karyawan & Settle)');
addParagraph('Halaman ini khusus mengelola pinjaman kasbon karyawan dari saat diambil hingga bukti nota belanja diserahkan.');

addHeading3('Alur Pelunasan Bon (Settle):');
addParagraph('Saat karyawan menyerahkan nota belanja riil, klik tombol "Lunas" di samping nama bon pada tabel Halaman Bon. Masukkan nominal belanja nota riil:');

addBullet('Skenario A (Belanja = Bon):', ' Jika nominal belanja nota pas dengan nilai bon, bon langsung berstatus SUDAH (lunas).');
addBullet('Skenario B (Belanja < Bon - Ada Sisa Uang):', ' Karyawan mengembalikan sisa uang tunai. Bon lunas, dan sistem OTOMATIS membuat transaksi Kas Masuk (Debit) baru sebesar selisih sisa uang yang dikembalikan ke brankas.');
addBullet('Skenario C (Belanja > Bon - Kurang Diganti):', ' Admin mengganti uang nomok belanja karyawan. Bon lunas, dan sistem OTOMATIS membuat transaksi Kas Keluar (Kredit) baru sebesar selisih kekurangan uang.');

addCalloutBox('Otomatisasi Rekonsiliasi Kasbon', 'Dengan fitur Settle ini, Admin TIDAK PERLU mencatat selisih sisa uang bon secara manual di Halaman Transaksi. Sistem web menghitung dan mencatatnya otomatis!', 'debit');


// ─── PAGE 10: MODUL 3 - TELEGRAM BOT ────────
addHeading1('4. MODUL 3: Panduan Koneksi & Penggunaan Telegram Bot');
addParagraph('Telegram Bot (@BABJM_PettyCash_bot) adalah alat tercepat untuk mencatat kas & bon langsung dari hp atau laptop tanpa perlu membuka browser web.');

addImage('/images/telegram_bot_tutorial_guide.png', 'Diagram Visual Mockup & Navigasi Telegram Bot @BABJM_PettyCash_bot');

addHeading2('1. Cara Menghubungkan Telegram Bot Pertama Kali');
addParagraph('Langkah-langkah koneksi bagi karyawan baru:');
addBullet('Langkah 1:', ' Buka aplikasi Telegram di smartphone atau laptop Anda.');
addBullet('Langkah 2:', ' Ketik di kolom pencarian Telegram: `@BABJM_PettyCash_bot`');
addBullet('Langkah 3:', ' Pilih bot bernama "BABJM Petty Cash Bot", lalu klik tombol **`START`** di bawah layar (atau ketik `/start`).');
addBullet('Langkah 4:', ' Bot akan membalas pesan selamat datang dan memunculkan **Persistent Keyboard Menu** (6 Tombol Utama di atas kolom mengetik).');

addCalloutBox('Tautan Akses Cepat Telegram', 'Anda juga dapat langsung mengeklik link berikut untuk membuka chat bot:\nhttps://t.me/BABJM_PettyCash_bot', 'info');


// ─── PAGE 11: TELEGRAM KEYBOARD MENU ────────
addHeading1('4. MODUL 3: Penggunaan Telegram Bot (Lanjutan)');

addHeading2('2. Menggunakan Tombol Menu Keyboard Interaktif');
addParagraph('Di bagian bawah ruang chat bot terdapat 6 tombol menu utama yang dapat diklik langsung:');

addBullet('🟢 Kas Masuk:', ' Untuk mencatat pemasukan kas kecil (Debit). Bot akan meminta Anda mengisi nominal dan keterangan.');
addBullet('🔴 Kas Keluar:', ' Untuk mencatat pengeluaran kas kecil (Kredit).');
addBullet('📋 Bon Baru:', ' Untuk mencatat pinjaman kasbon baru karyawan.');
addBullet('🔍 Monitor Bon:', ' Untuk melihat daftar kasbon aktif yang belum diselesaikan beserta sisa hari jatuh temponya.');
addBullet('💳 Cek Saldo:', ' Untuk mengecek sisa saldo brankas kas kecil saat ini secara instan.');
addBullet('📊 Rekap Transaksi:', ' Untuk melihat ringkasan 5 transaksi kas terakhir.');


// ─── PAGE 12: TELEGRAM SMART PARSER ──────────
addHeading1('4. MODUL 3: Penggunaan Telegram Bot (Lanjutan)');

addHeading2('3. Format Pesan Teks Cepat (Smart Nominal Parser)');
addParagraph('Saat mencatat transaksi via Telegram Bot, Anda dapat menulis nominal angka menggunakan singkatan kata umum di Indonesia. Bot akan otomatis mengonversinya menjadi angka rupiah lengkap:');

addBullet('Singkatan Ribuan (`rb` / `k`):', ' 50rb atau 50k dibaca sebagai 50.000.');
addBullet('Singkatan Ratusan Ribu:', ' 250rb atau 250k dibaca sebagai 250.000.');
addBullet('Singkatan Jutaan (`jt` / `juta`):', ' 1.5jt atau 1.5juta dibaca sebagai 1.500.000.');

addHeading3('Contoh Format Penulisan Pesan:');
addCodeBlock(
  'Pencatatan Kas Keluar:\n' +
  '120rb Beli konsumsi rapat internal operasional\n\n' +
  'Pencatatan Kas Masuk:\n' +
  '2.5jt Pengisian dana kas kecil dari kantor pusat\n\n' +
  'Pencatatan Bon Baru:\n' +
  'Rian 300k Panjar bensin & tol dinas luar'
);


// ─── PAGE 13: TELEGRAM COMMANDS ─────────────
addHeading1('4. MODUL 3: Penggunaan Telegram Bot (Lanjutan)');

addHeading2('4. Perintah Chat Langsung (Direct Slash Commands)');
addParagraph('Selain menggunakan tombol menu, Anda dapat mengetik perintah garis miring (/) langsung di chat room:');

addBullet('/start', ' Mengaktifkan bot dan memunculkan keyboard menu.');
addBullet('/help', ' Menampilkan panduan format perintah bot.');
addBullet('/saldo', ' Mengecek sisa saldo kas kecil aktif secara instan.');
addBullet('/rekap', ' Menampilkan 5 histori transaksi kas terakhir.');
addBullet('/monitor', ' Menampilkan daftar kasbon karyawan yang belum lunas.');
addBullet('/kas [debit/kredit] [nominal] [keterangan]', ' Mencatat transaksi kas dalam 1 baris chat.\nContoh: `/kas kredit 75k Beli ATK Kertas HVS`');
addBullet('/bon [nama_pic] [nominal] [keterangan]', ' Mencatat kasbon baru dalam 1 baris chat.\nContoh: `/bon Fita 200k Panjar Beli Banner`');
addBullet('/lunas [ID_BON]', ' Melunasi kasbon via chat Telegram.\nContoh: `/lunas BON-202608-002`');


// ─── PAGE 14: TELEGRAM LINK & REMINDER ──────
addHeading1('4. MODUL 3: Penggunaan Telegram Bot (Lanjutan)');

addHeading2('5. Fitur Tautan Biru Pelunasan Sekali Klik (Clickable Links)');
addParagraph('Saat Anda menjalankan perintah `/monitor`, bot akan menampilkan daftar bon outstanding lengkap dengan tautan biru di samping nama PIC, contoh: `/lunas_BON_202608_001`.');
addBullet('Kelunasan Sekali Klik:', ' Cukup sentuh/klik tautan biru `/lunas_BON_xxx` tersebut di Telegram. Kasbon akan langsung otomatis berstatus LUNAS di GSheet tanpa mengetik manual!');

addHeading2('6. Pengingat Otomatis Harian (Daily Auto-Reminder)');
addParagraph('Setiap hari kerja pukul **08:00 WIB**, sistem akan memindai database dan mengirimkan notifikasi pengingat otomatis ke grup Telegram default jika ada kasbon karyawan yang mendekati atau melewati batas waktu 14 hari (Warning/Overdue).');

addCalloutBox('Manfaat Pengingat Otomatis', 'Pengingat harian memastikan karyawan segera menyerahkan nota belanja fisik tepat waktu sehingga saldo kas selalu akurat.', 'debit');


// ─── PAGE 15: TROUBLESHOOTING & FAQ ──────────
addHeading1('5. TroubleShooting & Pertanyaan Umum (FAQ)');

addHeading2('Pertanyaan yang Sering Ditanyakan Staf Baru:');

addBullet('Q1: Bagaimana jika saya salah menginput transaksi di Telegram?', 'A1: Anda dapat membuka Aplikasi Web di Halaman Transaksi, cari transaksi tersebut, lalu klik tombol Edit atau Hapus di baris transaksi.');

addBullet('Q2: Mengapa tombol keyboard menu di Telegram hilang?', 'A2: Ketik perintah `/start` di ruang chat bot Telegram untuk memunculkan kembali persistent keyboard menu.');

addBullet('Q3: Apakah saldo di Website, GSheet, dan Telegram sama?', 'A3: Ya! Seluruh sistem terintegrasi penuh ke database Google Sheets yang sama secara real-time.');

addBullet('Q4: Siapa yang harus dihubungi jika bot Telegram tidak merespons?', 'A4: Hubungi Supervisor Keuangan untuk memastikan koneksi Webhook dan Token Telegram Bot di Halaman Pengaturan Web aktif.');

addCalloutBox('SELAMAT BEKERJA!', 'Semoga buku panduan ini membantu Anda menjalankan tugas administrasi keuangan di PT BABJM dengan sukses, tertib, dan akurat!', 'debit');


// ─── FOOTER & PAGINATION GENERATOR ──────────
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  if (i > 0) { // Skip cover page
    doc.fillColor(COLOR_MUTED).font('Helvetica').fontSize(8);
    doc.text('PT BABJM — Manual Book Operasional Petty Cash & Kasbon Karyawan', 50, 30, { align: 'left' });
    
    doc.moveTo(50, 42).lineTo(545, 42).lineWidth(0.5).stroke(COLOR_BORDER);
    doc.moveTo(50, 792).lineTo(545, 792).lineWidth(0.5).stroke(COLOR_BORDER);
    
    doc.text(`Halaman ${i + 1} dari ${range.count}`, 50, 800, { align: 'right' });
  }
}

doc.end();
console.log('PDF Manual Book updated & generated successfully at: ' + outPath);
