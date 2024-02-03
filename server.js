const express = require('express');
const { spawnSync } = require('child_process');
const { readFile, appendFile } = require('fs/promises');
const fileUpload = require('express-fileupload');
const { join } = require('path');
const app = express();
app.use(fileUpload());
app.use(express.static('public'));
app.get('/', async (req, res, next) => { 
    res.sendFile('index.html');
})
const convertToPdf = async (fileName, res) => {
  //   res.send('hello anji');
  const pythonProcess = await spawnSync('python3', [
    '/Users/anji/git/POC/nodepy/scripts/pdf-converter.py',
    'get_text_from_pdf',
    `/Users/anji/git/POC/nodepy/scripts/${fileName}`,
    '/Users/anji/git/POC/nodepy/scripts/results.json',
  ]);

  const result = pythonProcess.stdout?.toString().trim();
  const error = pythonProcess.stderr?.toString().trim();
  if (result) {
    const buffer = await readFile('/Users/anji/git/POC/nodepy/scripts/results.json');
    const resultsParsed = JSON.stringify(buffer?.toString());
    res.send(resultsParsed.toString());
  } else {
    console.log(error);
    res.send(JSON.stringify({ status: 500, message: 'Server error anji l' + error + result }));
  }
};
app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/scripts/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    // res.send('File uploaded!');
    convertToPdf(sampleFile.name, res);
  });
});


const port = '3001';
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
