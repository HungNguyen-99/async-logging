const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Mô phỏng bộ đệm vòng tròn (sử dụng mảng)
const bufferSize = 100; // Kích thước bộ đệm
let buffer = new Array(bufferSize).fill(null);
let writeIndex = 0;
let readIndex = 0;

// Hàm ghi log vào bộ đệm
function writeLog(log) {
    buffer[writeIndex] = log;
    writeIndex = (writeIndex + 1) % bufferSize;
}

// Hàm đọc và ghi log vào file
function flushLogs() {
    const logsToWrite = buffer.slice(readIndex, writeIndex);
    fs.appendFile('logs.txt', logsToWrite.join('\n') + '\n', (err) => {
        if (err) {
            console.error(err);
        } else {
            readIndex = writeIndex;
        }
    });
}

// Endpoint nhận log
app.post('/log', (req, res) => {
    console.log(req.body);
    const log = req.body.log;
    writeLog(log);
    res.send('Log received');
});

// Định kỳ flush logs
setInterval(flushLogs, 5000); // Flush every 5 seconds

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});