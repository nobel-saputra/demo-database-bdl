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

// --- TAMBAHKAN KODE INI UNTUK DELETE ---
// Route untuk menghapus transaksi berdasarkan ID
app.delete('/api/transaksi/:id', async (req, res) => {
    const transaksiId = req.params.id; // Mengambil ID dari URL
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM transaksi WHERE id = ?', [transaksiId]);

        if (result.affectedRows === 0) {
            // Jika tidak ada baris yang terpengaruh, berarti ID tidak ditemukan
            res.status(404).json({ message: `Transaksi dengan ID ${transaksiId} tidak ditemukan.` });
        } else {
            res.status(200).json({ message: `Transaksi dengan ID ${transaksiId} berhasil dihapus.` });
        }
    } catch (error) {
        console.error(`Error deleting transaction ID ${transaksiId}:`, error);
        res.status(500).json({ message: 'Error deleting transaction', error: error.message });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});
// --- AKHIR KODE TAMBAHAN UNTUK DELETE ---


// --- TAMBAHKAN KODE INI UNTUK UPDATE ---
// Route untuk mengupdate transaksi berdasarkan ID
app.put('/api/transaksi/:id', async (req, res) => {
    const transaksiId = req.params.id; // Mengambil ID dari URL
    const newData = req.body; // Mengambil data JSON baru dari body request

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // Pertama, ambil data JSON yang ada
        const [rows] = await connection.execute('SELECT data FROM transaksi WHERE id = ?', [transaksiId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: `Transaksi dengan ID ${transaksiId} tidak ditemukan.` });
        }

        // Gabungkan data lama dengan data baru (newData)
        const existingData = rows[0].data; // Ini sudah objek JS dari mysql2
        const updatedData = { ...existingData, ...newData }; // Gabungkan objek JSON

        // Konversi kembali ke string JSON untuk disimpan di database
        const updatedDataString = JSON.stringify(updatedData);

        // Update kolom 'data' di database
        const [result] = await connection.execute('UPDATE transaksi SET data = ? WHERE id = ?', [updatedDataString, transaksiId]);

        if (result.affectedRows === 0) {
            res.status(500).json({ message: 'Gagal mengupdate transaksi (affectedRows = 0).' });
        } else {
            res.status(200).json({ message: `Transaksi dengan ID ${transaksiId} berhasil diupdate.`, updatedTransaction: { id: transaksiId, data: updatedData } });
        }
    } catch (error) {
        console.error(`Error updating transaction ID ${transaksiId}:`, error);
        res.status(500).json({ message: 'Error updating transaction', error: error.message });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});
// --- AKHIR KODE TAMBAHAN UNTUK UPDATE ---
// Melayani file statis dari folder 'public' (kita akan buat nanti)
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
    console.log(`Akses data di http://localhost:${port}/api/transaksi`);
    console.log(`Buka halaman web di http://localhost:${port}/index.html`);
});