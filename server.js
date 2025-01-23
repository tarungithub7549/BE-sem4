const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
    };
    const logString = JSON.stringify(logDetails) + '\n';
    const logFilePath = path.join(__dirname, 'requests.log');
    const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1 MB

    fs.stat(logFilePath, (err, stats) => {
        if (err || (stats && stats.size < MAX_LOG_SIZE)) {
            fs.appendFile(logFilePath, logString, (err) => {
                if (err) console.error(err);
            });
        } else {
            const archivePath = path.join(__dirname, `requests_${Date.now()}.log`); // Corrected template literal
            fs.rename(logFilePath, archivePath, (err) => {
                if (!err) {
                    fs.writeFile(logFilePath, logString, (err) => {
                        if (err) console.error(err);
                    });
                }
            });
        }
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the home page!');
});

app.get('/submit', (req, res) => {
    res.send('Form submitted!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Corrected template literal
});
