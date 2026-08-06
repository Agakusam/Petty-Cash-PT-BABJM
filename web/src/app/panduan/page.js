"use client";

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Globe, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  BookOpen,
  DollarSign,
  Calendar,
  Layers,
  Zap,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function PanduanPage() {
  const [activeTab, setActiveTab] = useState('gsheet');

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div className="glass-card mb-8" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.15), rgba(15, 23, 42, 0.4))', border: '1px solid rgba(26, 115, 232, 0.3)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              <BookOpen size={14} /> MANUAL BOOK & PANDUAN PEMULA
            </div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              Panduan Operasional Sistem Keuangan
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '650px', fontSize: '0.95rem' }}>
              Tutorial visual lengkap bagi karyawan & staf baru PT BABJM. Pelajari cara menggunakan <strong>Google Sheets</strong>, <strong>Aplikasi Website</strong>, dan <strong>Telegram Bot</strong> secara praktis.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a 
              href="https://petty-cash-babjm.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              <Globe size={16} /> Web App <ExternalLink size={14} />
            </a>
            <a 
              href="https://t.me/BABJM_PettyCash_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              <Send size={16} /> Telegram Bot <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('gsheet')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'gsheet' ? 'var(--primary)' : 'var(--bg-glass)',
            color: activeTab === 'gsheet' ? '#FFFFFF' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <FileSpreadsheet size={18} /> Modul 1: Google Sheets (GSheet)
        </button>
        <button
          onClick={() => setActiveTab('website')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'website' ? 'var(--primary)' : 'var(--bg-glass)',
            color: activeTab === 'website' ? '#FFFFFF' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Globe size={18} /> Modul 2: Aplikasi Website
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'telegram' ? 'var(--primary)' : 'var(--bg-glass)',
            color: activeTab === 'telegram' ? '#FFFFFF' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Send size={18} /> Modul 3: Telegram Bot
        </button>
      </div>

      {/* MODUL 1: GSHEET */}
      {activeTab === 'gsheet' && (
        <div className="space-y-6">
          {/* Main Visual Image Card */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileSpreadsheet size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Panduan Visual Structure Google Sheets</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Google Sheets berfungsi sebagai database terpusat. Seluruh input dari Website maupun Telegram disimpan di spreadsheet ini.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
              <div style={{ width: '50%', maxWidth: '550px', minWidth: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: '#0f172a', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <img 
                  src="/images/gsheet_tutorial_guide.png" 
                  alt="Panduan Visual Structure Google Sheets" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Section: Cash_log */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Layers size={18} /> 1. Structure Tab <code style={{ background: 'rgba(26, 115, 232, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Cash_log</code> (Buku Kas Kecil)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Tab ini mencatat transaksi kas masuk (Debit) dan kas keluar (Kredit). Terdiri dari 12 Kolom Utama (A s/d L):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Kolom A - C</span>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li><strong>A (Tanggal):</strong> Tanggal transaksi (YYYY-MM-DD)</li>
                  <li><strong>B (Tgl. Nota):</strong> Tanggal yang tertera pada nota fisik</li>
                  <li><strong>C (Akun):</strong> Kategori akun (ATK, Bensin, Konsumsi, dll.)</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Kolom D - G</span>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li><strong>D (Keterangan Debit):</strong> Detail kas masuk</li>
                  <li><strong>E (Keterangan Kredit):</strong> Detail kas keluar</li>
                  <li><strong>F (PIC):</strong> Nama penanggung jawab</li>
                  <li><strong>G (NO. ID):</strong> Kode transaksi unik</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Kolom H - I</span>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li><strong>H (Debit):</strong> Uang Kas Masuk (Nominal)</li>
                  <li><strong>I (Kredit):</strong> Uang Kas Keluar (Nominal)</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>Kolom J - WARNING</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  <strong>J (Saldo Akhir):</strong> ⚠️ FORMULA OTOMATIS AKUMULASI DANA. Dilarang mengetik/mengubah kolom J secara manual!
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Section: Bon_log & Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                2. Structure Tab <code style={{ background: 'rgba(26, 115, 232, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Bon_log</code>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Mencatat kasbon pinjaman sementara karyawan sebelum nota diserahkan:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Kolom A:</strong> ID BON (contoh: <code>BON-202608-001</code>)</li>
                <li><strong>Kolom B:</strong> Tanggal Bon diajukan</li>
                <li><strong>Kolom C:</strong> Nama PIC Karyawan</li>
                <li><strong>Kolom D:</strong> Keperluan Kasbon</li>
                <li><strong>Kolom E:</strong> Nominal Pinjaman</li>
                <li><strong>Kolom F:</strong> Status (<code>BELUM</code> atau <code>SUDAH</code>)</li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                3. Tab <code style={{ background: 'rgba(26, 115, 232, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Dashboard</code> & Tips Reset
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Menampilkan filter rentang tanggal dan grafik akumulasi kas.
              </p>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  💡 <strong>Tips Reset Dashboard:</strong> Jika visual tab Dashboard di GSheet berantakan, buka menu <strong>Extensions &gt; Apps Script</strong>, pilih fungsi <code>setupGSheetDashboard()</code> dan klik <strong>Run</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODUL 2: WEBSITE */}
      {activeTab === 'website' && (
        <div className="space-y-6">
          {/* Visual Image Card */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Globe size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Panduan Visual Antarmuka Website</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Aplikasi Website (https://petty-cash-babjm.vercel.app) digunakan oleh Admin Keuangan untuk manajemen visual penuh.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
              <div style={{ width: '50%', maxWidth: '550px', minWidth: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: '#0f172a', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <img 
                  src="/images/webapp_tutorial_guide.png" 
                  alt="Panduan Visual Website" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} /> 1. Kartu Saldo Dashboard
              </h3>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Saldo Kas Aktif:</strong> Menunjukkan sisa dana brankas tunai riil.</li>
                <li><strong>Netto Bulan Ini:</strong> Pemasukan dikurangi Pengeluaran bulan ini.</li>
                <li><strong>Status Kasbon:</strong> Memantau bon berdasarkan usia:
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem' }}>
                    <li>🟢 <strong>Normal (1-9hr):</strong> Aman</li>
                    <li>🟡 <strong>Warning (10-13hr):</strong> Segera jatuh tempo</li>
                    <li>🔴 <strong>Overdue (≥14hr):</strong> Melebihi batas, wajib ditagih</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} /> 2. Grid Edit Mode & Input Form
              </h3>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Form "+ Transaksi Baru":</strong> Untuk entri transaksi tunggal kas masuk/keluar.</li>
                <li><strong>Grid Edit Mode:</strong> Centang baris-baris transaksi yang ingin diubah pada tabel, lalu klik <em>"Edit Grid Mode"</em> di bawah layar untuk mengedit langsung sel tabel seperti Excel.</li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} /> 3. Settle Bon & Rekonsiliasi Otomatis
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Saat karyawan menyerahkan nota belanja, klik <strong>"Lunas"</strong> di halaman Bon, lalu masukkan nominal belanja nota riil:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Sisa Uang (Belanja &lt; Bon):</strong> Bon lunas, sistem OTOMATIS mencatat Kas Masuk sebesar sisa pengembalian.</li>
                <li><strong>Kurang Uang (Belanja &gt; Bon):</strong> Bon lunas, sistem OTOMATIS mencatat Kas Keluar sebesar penggantian nomok.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODUL 3: TELEGRAM BOT */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          {/* Visual Image Card */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Send size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Panduan Visual Telegram Bot</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Telegram Bot (@BABJM_PettyCash_bot) adalah alat input tercepat langsung dari hp/laptop Anda.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
              <div style={{ width: '50%', maxWidth: '550px', minWidth: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', background: '#0f172a', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <img 
                  src="/images/telegram_bot_tutorial_guide.png" 
                  alt="Panduan Visual Telegram Bot" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Connection Steps & Keyboard buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} /> 1. Cara Menghubungkan Bot
              </h3>
              <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                <li>Buka aplikasi <strong>Telegram</strong> di hp/laptop.</li>
                <li>Cari di kolom pencarian: <code>@BABJM_PettyCash_bot</code></li>
                <li>Klik tombol <strong>START</strong> (atau ketik <code>/start</code>).</li>
                <li>Bot akan membalas dan memunculkan <strong>6 Tombol Persistent Keyboard Menu</strong> di bagian bawah layar.</li>
              </ol>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} /> 2. Smart Nominal Parser
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Ketik nominal menggunakan singkatan sehari-hari:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><code>50rb</code> atau <code>50k</code> = Rp 50.000</li>
                <li><code>1.5jt</code> atau <code>1.5juta</code> = Rp 1.500.000</li>
              </ul>
              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-glass)', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                Contoh: 120rb Beli konsumsi rapat operasional
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} /> 3. Link Biru Pelunasan Sekali Klik
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Saat ketik <code>/monitor</code>, bot menyajikan daftar bon dengan tautan biru:
              </p>
              <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(26, 115, 232, 0.1)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                👉 Klik untuk pelunasan: /lunas_BON_202608_001
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>
                Cukup sentuh tautan biru tersebut, bon langsung LUNAS di GSheet tanpa ngetik manual!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
