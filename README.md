# CampusHUB – Integrated Campus Activity Management System
> **One Platform, All Campus Activities.**

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

*Catatan: Pada halaman Login terdapat collapsible **"🔑 Akun Demo Tersedia"** yang dapat diklik untuk mengisi formulir secara instan.*

---

## 📂 Struktur Proyek

```
CampusHUB/
├── public/
├── src/
│   ├── assets/              # Gambar & aset statis
│   ├── components/
│   │   ├── calendar/        # CampusCalendar.jsx (FullCalendar Integration)
│   │   ├── common/          # ProtectedRoute, StatusBadge, OrgTypeBadge, NotificationBell
│   │   ├── dashboard/       # OrgDashboard.jsx
│   │   ├── forms/           # ScheduleForm.jsx (Validation & Conflict check)
│   │   └── modals/          # ScheduleDetailModal, ConfirmModal
│   ├── context/
│   │   ├── AuthContext.jsx  # Otentikasi & Session Role
│   │   └── AppDataContext.jsx # Sinkronisasi State & Reactive Updates
│   ├── data/
│   │   └── seedData.js      # Data awal demo lengkap (Akun, Org, Jadwal, Notifikasi)
│   ├── layouts/
│   │   ├── PublicLayout.jsx # Layout publik (Navbar & Footer)
│   │   ├── AdminLayout.jsx  # Sidebar & Header Super Admin
│   │   ├── OrganizationLayout.jsx # Sidebar dinamis UKM / LAB / EVENT
│   │   └── StudentLayout.jsx # Sidebar portal mahasiswa
│   ├── pages/
│   │   ├── auth/            # LoginPage, RegisterPage
│   │   ├── public/          # LandingPage, CalendarPage, OrganizationsPage, ScheduleDetailPage
│   │   ├── super-admin/     # Dashboard, Accounts, Organizations, Approval, Schedules, Reports, Logs, Settings
│   │   ├── organization/    # Dashboard, Schedules, Add, Edit, History, Registrations, Profile
│   │   └── student/         # Dashboard, Calendar, Activities, Organizations, Favorites, Registrations, Profile
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── organizationService.js
│   │   ├── scheduleService.js
│   │   ├── approvalService.js
│   │   ├── notificationService.js
│   │   ├── registrationService.js
│   │   ├── storageService.js
│   │   └── dataInitService.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── permissions.js
│   │   └── validation.js
│   ├── App.jsx              # Routing & Route Protection
│   ├── main.jsx             # Entry Point
│   └── index.css            # Tailwind & Calendar Custom Styling
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 💻 Cara Menjalankan Secara Lokal

### Prasyarat
- **Node.js** (versi 18 ke atas disarankan)
- **npm**

### Langkah Instalasi

1. **Clone atau buka folder proyek:**
   ```bash
   cd CampusHUB
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Buka aplikasi di peramban (browser):**
   Akses alamat yang ditampilkan oleh terminal (biasanya `http://localhost:5173`).

5. **Build untuk produksi (opsional):**
   ```bash
   npm run build
   ```

---

## 📌 Batasan Demo (Demo Limitations)

- Aplikasi ini merupakan **frontend-only prototype/demo**.
- Penyimpanan data berada pada browser `localStorage`. Menghapus riwayat/cache peramban akan mereset data ke seed awal.
- Pengiriman email konfirmasi disimulasikan secara lokal (tidak ada email nyata yang dikirimkan).
- Fitur reset data demo dapat diakses kapan saja melalui menu **Super Admin -> Pengaturan**.

---

## 🚀 Petunjuk Push ke GitHub

Untuk mengunggah repository ini ke akun GitHub Anda, jalankan perintah-perintah berikut pada terminal:

```bash
git init
git add .
git commit -m "Initial commit - CampusHub"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
*(Gantilah `YOUR_GITHUB_REPOSITORY_URL` dengan URL repository GitHub Anda, contoh: `https://github.com/username/campushub.git`)*
