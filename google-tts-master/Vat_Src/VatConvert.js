const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const urlParse = require('url').parse;
const googleTTS = require('../dist/index');
let filename = "Vat_Src/input/hellow.txt"
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  // console.log('OK: ' + filename);
  // console.log(data);
  Trigger(data)
});
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const info = urlParse(url);
    const httpClient = info.protocol === 'https:' ? https : http;
    const options = {
      host: info.host,
      path: info.path,
      headers: {
        'user-agent': 'WHAT_EVER',
      },
    };

    httpClient
      .get(options, (res) => {
        // check status code
        if (res.statusCode !== 200) {
          const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
          reject(new Error(msg));
          return;
        }

        const file = fs.createWriteStream(dest);
        file.on('finish', function () {
          // close() is async, call resolve after close completes.
          file.close(resolve);
        });
        file.on('error', function (err) {
          // Delete the file async. (But we don't check the result)
          fs.unlink(dest);
          reject(err);
        });

        res.pipe(file);
      })
      .on('error', reject)
      .end();
  });
}

const article = `The Beauty and Wellness sector is growing at a fast pace and is an important industry in India.

It contributes a lot to the country’s economic growth and is gradually becoming a leading employer creating millions of employment opportunities. 

The reason for this exponential growth is rising consumerism   globalization and changing lifestyles of Indian consumers. 

Currently a talent gap exists between the growth and expansion and the existing skilled personnel.

The industry is booming and it is mainly due to the growing desire among both men and women to look stylish.
`;

// 1. all audio URLs
function Trigger(article){
  const results = googleTTS.getAllAudioUrls(article,{ lang: 'en', slow: false,splitPunct:"." });
results.forEach((item, i) => {
  // console.log(`${i + 1}. ${item.shortText.length} characters`, item, '\n');
 let dest = path.resolve(__dirname, `output/${i}.mp3`);

  // console.log(item.url);
downloadFile(item.url,dest);


});
}


// 2. all audio base64 texts
// googleTTS.getAllAudioBase64(article).then((results) => {
//   results.forEach((item, i) => {
//     console.log(`${i + 1}. ${item.shortText.length} characters`, item, '\n');
//   });
// });
