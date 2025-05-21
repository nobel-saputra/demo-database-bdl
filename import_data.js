// import_data.js

const fs = require('fs/promises'); // Untuk membaca file
const mysql = require('mysql2/promise'); // Untuk koneksi MySQL

const dbConfig = {
    host: 'localhost',
    user: 'user',
    password: 'admin123',
    database: 'transaksi',
    port: 3310
};

async function importTransaksiData() {
    let connection;
    try {
        // Baca file JSON
        const jsonData = await fs.readFile('transaksi_data.json', 'utf8');
        const transaksiArray = JSON.parse(jsonData); // Parse string JSON menjadi array objek JavaScript

        connection = await mysql.createConnection(dbConfig);
        console.log('Koneksi ke database berhasil!');

        // Loop melalui setiap objek transaksi dalam array
        for (const transaksi of transaksiArray) {
            // Konversi objek transaksi kembali ke string JSON untuk disimpan di kolom 'data'
            const transaksiJsonString = JSON.stringify(transaksi);

            // Perintah INSERT ke tabel transaksi
            const [result] = await connection.execute(
                'INSERT INTO transaksi (data) VALUES (?)',
                [transaksiJsonString]
            );
            console.log(`Berhasil mengimpor transaksi: ${transaksi.product_name || 'Tanpa Nama Produk'} (ID Database: ${result.insertId})`);
        }

        console.log('\nImport data transaksi selesai!');

    } catch (error) {
        console.error('Terjadi kesalahan saat mengimpor data:', error);
        if (error.code === 'ENOENT') {
            console.error('Pastikan file "transaksi_data.json" ada di folder yang sama dengan script ini.');
        }
    } finally {
        if (connection) {
            connection.end();
            console.log('Koneksi database ditutup.');
        }
    }
}

// Pastikan Anda sudah menginstal mysql2: npm install mysql2
importTransaksiData();