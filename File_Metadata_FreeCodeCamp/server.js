const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// ROUTE FOR FILE ANALYSE
app.post('/api/fileanalyse', (req, res) => {
  let uploaded = req.files.upfile;
  res.json({
    name: uploaded.name,
    type: uploaded.mimetype,
    size: uploaded.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
