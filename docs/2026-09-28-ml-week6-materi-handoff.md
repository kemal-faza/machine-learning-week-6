# Handoff: Deck "ml-week6-materi" — Materi Lengkap Week 6 (kNN, Decision Tree, SVM)

Tanggal: 2026-09-28 · Repo: `/mnt/DATA/Documents/Praktikum/Machine Learning/Transkrip Pembelajaran Mesin Week 6` · Branch: `main`

## Ringkasan

Deck baru **`slides/ml-week6-materi/index.tsx`** (42 halaman, 3.633 baris) selesai dibuat sebagai rangkuman penuh 21 seksi transkrip Week 6 (7 kNN + 8 Decision Tree + 6 SVM). Gaya visual mengikuti opsi **"Poster riso hangat"** (dipilih user dari 3 preview frontend-slides), kepadatan *reading-first*, animasi halus + reveal bertahap di halaman hitung, dan **42 catatan pembicara** berbahasa Indonesia.

Deck lama `slides/ml-week6/` **tidak disentuh** (atas permintaan user: "buat yang baru, jangan ubah yang sudah ada, independen").

## Current State

- **Ditambahkan (belum di-commit):** `slides/ml-week6-materi/index.tsx`
  - 42 halaman (`export default [...] satisfies Page[]`), 42 entri `notes`, meta `createdAt: '2026-09-27T17:32:54.332Z'`.
  - `design` const: bg `#F3EAD8`, text `#211A14`, accent `#DD3B2C`; font Anton (display), Work Sans (body); plus IBM Plex Mono & Caveat dimuat lewat injeksi `<link>` module-level (`osd-webfont-ml-week6-materi`).
  - 63 `<Step>` dipakai sebagai reveal bertahap pada halaman hitung.
  - Tanpa aset eksternal: semua diagram inline SVG (folder `assets/` tidak dibuat). `visuals/*.svg` di root tidak dipakai (dibuat untuk deck lama).
- **Tidak ada perubahan lain** oleh sesi ini. `git status` menunjukkan `README.md` sudah termodifikasi sejak sebelum sesi (bukan dari sesi ini), dan `slides/` memang seluruhnya untracked di repo ini.
- **Artefak verifikasi (di luar repo, `/tmp/opencode/`):**
  - `ml-week6-previews/style-{a,b,c}.html` + `shots/` → 3 preview gaya (A graph-paper kobalt, B blueprint gelap, C poster riso) yang dibuka user; C dipilih.
  - `ml-week6-materi-shots/page-01..42.png` → screenshot hasil akhir per halaman (canvas 1496×842 @ dpr 1.5).
  - Skrip: `shot.mjs`, `shots-materi.mjs` (capture deck), `overflow-check.mjs`/`overlap-check.mjs` (deteksi overflow & tabrakan footer), `probe2.mjs` (ukur elemen meluber). Semua pakai CDP `http://127.0.0.1:9222` dan dev server `http://localhost:5173`.

## Struktur Deck (petunjuk navigasi cepat)

| Hal. | Halaman | Isi |
| --- | --- | --- |
| 01–04 | Cover, Peta, Fondasi, Lazy vs Eager | Pembuka + pipeline supervised learning |
| 05–16 | kNN (12 hal.) | intuisi, Voronoi, algoritma, 5 ukuran jarak, contoh kertas tisu, 5 isu (k, missing, normalisasi, k optimal, efisiensi) |
| 17–31 | Decision Tree (15 hal.) | anatomi, dua pohon, studi kasus tenis, entropi, information gain, rekursi, rules, overfitting, pruning, C4.5, kontinu, representasi, one-hot |
| 32–40 | SVM (9 hal.) | intuisi, margin/SV, formulasi, derivasi, contoh hitung + prediksi, kernel trick, polinomial, implementasi Python |
| 41–42 | Rekap + Tugas | tabel perbandingan + latihan & penutup |

Helper utama (di bagian atas file): `Sheet` (frame + header/footer + nomor halaman via `useSlidePageNumber`), `Head` (kicker/judul/lead), `Card`, `Formula`, `Li`, `Calc`, `Tag`, `Note`, `Arrow`, `Halftone`, `Th`/`Td`, `Steps`/`Step`. Animasi masuk memakai kelas `.w6r-*` + `data-still` (nonaktif saat halaman tidak aktif) dan dihormati `prefers-reduced-motion`.

## Key Decisions

- **Gaya C (poster riso)** dipilih user dari preview visual; system fonts sengaja diganti webfont (Anton/Work Sans/Caveat/IBM Plex Mono) karena tipografi adalah inti gaya ini.
- **Konten 42 halaman** untuk memenuhi permintaan "materi penuh / 30+ halaman": satu ide per halaman, setiap contoh hitung transkrip ditampilkan langkah demi langkah.
- **Reveal bertahap hanya di halaman hitung** (tisu, voting, split, entropy/gain, rekursi, derivasi margin, contoh SVM, polinomial) — halaman lain tampil utuh; halaman tetap terbaca lengkap saat di-jump dari overview.
- **Catatan pembicara Indonesia** di `notes` (bukan file terpisah), index-aligned dengan halaman.
- **Transisi halaman** `SlideTransition` rumah: rise 6px / 260 ms (satu DNA), cover memakai settle 280 ms + blur halus.
- Contoh data yang dipakai konsisten dengan narasi transkrip (mis. kertas tisu U=(3,7) dengan jarak 4 / 5 / 3,61 / 3,61; tenis 9 yes / 5 no; SVM 4 titik → w₁=w₂=1, b=−1). Karena transkrip ASR banyak angka yang kabur, beberapa koordinat dipilih agar konsisten dengan hasil perhitungan yang disebutkan (didokumentasikan di catatan bila perlu).

## Verifikasi yang Sudah Dijalankan (bukti)

- `npx -y -p typescript@5.7 tsc --noEmit -p tsconfig.json` → **exit 0** (setelah setiap batch edit besar).
- `node /tmp/opencode/overlap-check.mjs 1 42` → **semua 42 halaman "ok"** (tidak ada overflow canvas, tidak ada tabrakan header/footer). Catatan: beberapa kali muncul `ERR no canvas` karena timing Vite (p05/p09/p10/p11/p12/p22) — dijalankan ulang per halaman dan hasilnya ok; bukan bug deck.
- Uji play mode via CDP: masuk p36 dari p35 → 7 step `pending`; tiap ArrowRight mengurangi 1; jump langsung ke p36 → 0 pending (semua tampil). Perilaku `<Steps>` sesuai kontrak.
- Review visual 42 screenshot: semua halaman diperiksa; temuan yang sudah diperbaiki antara lain: `<Steps>` sebagai anak langsung `grid` (Fragment → pecah sel) di 6 halaman, tinggi SVG yang meluber (p18/p38), label bertabrakan/tarpotong di beberapa diagram (p05, p17, p18, p20, p21, p26, p32, p36, p37), kurva error-vs-k yang salah bentuk di p15, serta spacing halaman p03/p08.

## Next Steps (untuk sesi berikutnya)

1. **Buka & lihat hasil**: dev server sudah jalan di `http://localhost:5173` → `http://localhost:5173/s/ml-week6-materi` (present mode: tombol Present / `F`; catatan pembicara muncul di presenter view & notes drawer).
2. **Tindak lanjut masukan user** — kemungkinan besar user akan menandai perbaikan lewat inspector (`@slide-comment`). Gunakan skill `apply-comments`; sebelum mengedit baca `slide-authoring`.
3. **Verifikasi ulang setelah setiap edit**: `tsc --noEmit` + `node /tmp/opencode/overlap-check.mjs` + screenshot halaman terdampak (`node /tmp/opencode/shots-materi.mjs <from> <to>`).
4. **Opsional**: ekspor PDF/HTML dari dev UI; atau commit `slides/ml-week6-materi/` bila user minta (jangan commit file lain tanpa izin).
5. **Opsional**: rapikan preview di `/tmp/opencode/ml-week6-previews/` bila user sudah selesai membandingkan gaya.

## Open Questions

- Apakah user ingin deck ini di-commit ke git? (Repo belum pernah men-commit `slides/` sama sekali.)
- Apakah ada permintaan ekspor PDF / tema (`themes/` masih kosong) dari user?
- Perlu koreksi konten dari dosen/user (mis. angka transkrip yang ambigu) — tunggu masukan.

## Suggested Skills

- `apply-comments` — memproses komentar inspector pada deck ini.
- `slide-authoring` — referensi teknis wajib sebelum mengedit `slides/<id>/index.tsx` (kanvas 1920×1080, aturan `<Steps>`, transisi, dsb.).
- `current-slide` — kalau user menyebut "halaman ini"/"elemen ini" tanpa menyebut nama.
- `verification-before-completion` — sebelum menyatakan pekerjaan selesai (jalankan tsc + overlap check + screenshot).
- `create-slide` — bila user minta deck baru lagi (jangan lupa bertanya lewat `question`).

## Risks / Gotchas

- **`<Steps>` merender Fragment** — jangan pernah menaruhnya sebagai anak langsung `display: grid`/flex dengan makna "satu kolom"; bungkus `<div>` dulu (sudah diperbaiki di 6 tempat; jangan terulang saat menambah halaman).
- **Entitas JSX**: hindari entitas HTML di dalam nilai atribut string (`note="..."`) — pakai karakter Unicode langsung; `&lt;`/`&gt;` aman dipakai di teks JSX (sudah terbukti di deck getting-started).
- **Area konten `Sheet`** = `top 108 / bottom 88` dari kanvas; footer mulai ~y=1022 → jaga konten berakhir ≤ ~980. Konsekuensinya: SVG besar harus diberi `style={{ height: N }}` eksplisit, karena `width: 100%` pada kolom grid lebar bisa membengkakkan tinggi.
- **Panel Format (inspector)** di dev app kadang terbuka dan menutupi sebagian kanvas pada screenshot; tutup dengan klik tombol berlabel `Close Format panel` sebelum capture, atau abaikan karena clip canvas-nya tetap benar.
- **Jangan sentuh** `slides/ml-week6/`, `slides/getting-started/`, `package.json`, `open-slide.config.ts`.
- Error konsol "Encountered a script tag while rendering React component" muncul juga di deck lama → perilaku framework, bukan bug deck ini.
