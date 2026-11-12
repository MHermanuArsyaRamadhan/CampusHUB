CampusHub adalah platform manajemen kegiatan kampus terintegrasi yang memudahkan mahasiswa menjelajahi kegiatan kampus dan membantu organisasi mahasiswa (UKM, LAB, dan Panitia Event) mengelola serta mempublikasikan jadwal mereka. Seluruh jadwal terintegrasi dalam satu kalender resmi yang diverifikasi langsung oleh Super Admin Universitas.

---

## 🚀 Fitur Utama

1. **5 Role Pengguna Terpisah**:
   - **SUPER_ADMIN**: Administrator universitas yang meninjau, menyetujui/menolak/meminta revisi jadwal, mengelola akun organisasi, dan memantau analitik.
   - **UKM_ADMIN**: Administrator Unit Kegiatan Mahasiswa (UKM) dengan dashboard khusus untuk mengelola jadwal organisasinya sendiri.
   - **LAB_ADMIN**: Administrator Laboratorium & Riset Mahasiswa yang dibimbing dosen.
   - **EVENT_ADMIN**: Administrator Panitia Event Kampus dengan kemampuan mengelola kapasitas kuota peserta dan buka/tutup pendaftaran.
   - **STUDENT**: Mahasiswa yang dapat menjelajahi kegiatan, mendaftar ke acara, menyimpan favorit, serta melihat kalender.

2. **Sistem Alur Persetujuan (Approval Workflow)**:
   - Status jadwal: `PENDING`, `APPROVED`, `REVISION_REQUIRED`, `REJECTED`, `CANCELLED`, `COMPLETED`.
   - Hanya jadwal dengan status **APPROVED** yang tampil di kalender publik.
   - Super Admin dapat memberikan catatan revisi atau alasan penolakan.
   - Organisasi dapat memperbaiki revisi dan mengajukannya kembali.

3. **Kalender Kampus Terintegrasi**:
   - Ditenagai oleh **FullCalendar.js** (tampilan Bulan, Minggu, Hari, dan Daftar).
   - Warna otomatis standar:
     - 🔵 **EVENT**: `#2563EB` (Biru)
     - 🟣 **UKM**: `#9333EA` (Ungu)
     - 🟢 **LAB**: `#16A34A` (Hijau)
   - Filter instan berdasarkan jenis kegiatan, organisasi, dan pencarian teks.
   - Modal detail kegiatan lengkap dengan informasi tanggal, waktu, lokasi, dan penyelenggara.

4. **Pemeriksaan Konflik Jadwal (Conflict Checker)**:
   - Peringatan otomatis apabila terdapat benturan jadwal pada lokasi dan waktu yang sama.

5. **Simulasi Keamanan & Kepemilikan (Ownership Enforcement)**:
   - UKM/LAB/Event hanya memiliki hak akses untuk mengedit atau menghapus jadwal milik organisasinya sendiri.

6. **Sistem Notifikasi & Registrasi In-App**:
   - Notifikasi badge real-time di navbar untuk pengajuan baru, persetujuan, penolakan, dan revisi.
   - Pendaftaran event mahasiswa dengan proteksi kuota kapasitas dan pencegahan pendaftaran ganda.

7. **Frontend-Only & Zero-Backend**:
   - Menggunakan `localStorage` browser sebagai penyimpanan data persisten yang siap didemokan tanpa memerlukan setup database atau backend server.
   - Fitur **Reset Data Demo** tersedia di pengaturan Super Admin.

---

## 🛠️ Teknologi yang Digunakan

- **React.js 19**
- **Vite** (Build Tool & Dev Server)
- **Tailwind CSS v4**
- **React Router DOM v7**
- **FullCalendar.js** (DayGrid, TimeGrid, Interaction, List)
- **Lucide React** (Modern Icons)
- **HTML5 Canvas / FileReader** (Unggah Poster Kegiatan)
- **Browser localStorage API**

---

## 🔑 Akun Demo (Demo Accounts)

Aplikasi telah dilengkapi data simulasi awal (*seeded automatically*). Gunakan akun-akun berikut untuk menguji masing-masing role:

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@campushub.test` | `admin123` | Administrator Universitas |
| **UKM Admin** | `ukm@campushub.test` | `demo123` | UKM Basket |
| **LAB Admin** | `lab@campushub.test` | `demo123` | LAB Multimedia |
| **Event Admin** | `event@campushub.test` | `demo123` | Campus Festival Committee |
| **Mahasiswa** | `student@campushub.test` | `demo123` | Budi Santoso (NIM: 20210001) |

> **Akun Organisasi Tambahan:**
> - UKM Musik: `ukm.musik@campushub.test` / `demo123`
> - UKM Fotografi: `ukm.foto@campushub.test` / `demo123`
> - LAB Riset: `lab.riset@campushub.test` / `demo123`
> - Panitia Seminar: `event.seminar@campushub.test` / `demo123`
