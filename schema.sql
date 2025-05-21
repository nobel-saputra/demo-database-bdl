-- File: schema.sql

-- Menghapus tabel jika sudah ada (opsional, untuk clean slate saat pengembangan)
DROP TABLE IF EXISTS transaksi;

-- Membuat Tabel Transaksi
-- Kolom 'id' untuk primary key, dan 'data' untuk menyimpan JSON
CREATE TABLE transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON
);

-- Catatan: Perintah INSERT data tidak ada di file ini.
-- Data akan dimasukkan menggunakan script Node.js dari file JSON terpisah.

-- Anda bisa menambahkan perintah SELECT di sini untuk verifikasi skema,
-- tapi tidak akan ada data setelah menjalankan ini sendirian.
SELECT * FROM transaksi;