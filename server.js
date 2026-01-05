const express = require('express');
const path = require('path');
const { startScan, getResults } = require('./ea-price-tracker');

const app = express();
const PORT = 3000;

// Statik dosyaları sun (public klasörü)
app.use(express.static(path.join(__dirname, 'public')));

// API: Sonuçları Getir
app.get('/api/prices', (req, res) => {
    res.json(getResults());
});

// API: Taramayı Başlat (Refresh)
app.post('/api/refresh', (req, res) => {
    const status = getResults();
    if (status.isScanning) {
        return res.json({ message: 'Tarama zaten devam ediyor.', status });
    }

    // Arka planda başlat
    startScan().then(() => {
        console.log('Web isteği üzerine tarama tamamlandı.');
    });

    res.json({ message: 'Tarama başlatıldı.', status: getResults() });
});

app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
    // İlk açılışta otomatik tarama başlat
    startScan();
});
