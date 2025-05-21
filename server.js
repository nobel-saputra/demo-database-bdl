// server.js

const express = require('express');
const mysql = require('mysql2/promise'); // Menggunakan versi promise
const cors = require('cors'); // Import cors

const app = express();
const port = 3000; // Port untuk server Node.js

// Middleware
app.use(express.json()); // Untuk parsing body request JSON
app.use(cors()); // Mengizinkan semua origin untuk akses API

// --- TAMBAHKAN KODE INI ---
// Route untuk melayani index.html saat akses root URL (/)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// --- AKHIR KODE TAMBAHAN ---

// Konfigurasi koneksi database MySQL Anda
const dbConfig = {
    host: 'localhost',
    user: 'user',        // Sesuai dengan yang di docker-compose.yml dan DataGrip
    password: 'admin123',  // Sesuai dengan yang di docker-compose.yml dan DataGrip
    database: 'transaksi',
    port: 3310
};

// Route untuk mendapatkan semua transaksi
app.get('/api/transaksi', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        // Query untuk mendapatkan semua data transaksi
        const [rows] = await connection.execute('SELECT * FROM transaksi');

        res.json(rows); // Mengirimkan data sebagai JSON
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    } finally {
        if (connection) {
            connection.end(); // Tutup koneksi
        }
    }
});

// Melayani file statis dari folder 'public' (kita akan buat nanti)
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
    console.log(`Akses data di http://localhost:${port}/api/transaksi`);
    console.log(`Buka halaman web di http://localhost:${port}/index.html`);
});