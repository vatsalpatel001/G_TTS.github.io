const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const urlParse = require('url').parse;
const googleTTS = require('../google-tts-master/dist/index');
let filename = "./input/hellow.txt"
var x=-1;
var y=0;
var z=0;
var Abcd = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";


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


// 1. all audio URLs

function Trigger(article){
  // console.log(article.length);
  const results = googleTTS.getAllAudioUrls(article,{ lang: 'en', slow: false,splitPunct:"." });
results.forEach((item, i) => {
    if(((i)%10)==0){x++;};
  // console.log(`${i + 1}. ${item.shortText.length} characters`, item, '\n');
 let dest = path.resolve(__dirname, `output/${Abcd.split(",")[x]+Abcd.split(",")[y]+(i)%10}.mp3`);


downloadFile(item.url,dest);
console.log(`created ${i}`);

  if(x==25){x=0;y++};

});
}


// 2. all audio base64 texts
// googleTTS.getAllAudioBase64(article).then((results) => {
//   results.forEach((item, i) => {
//     console.log(`${i + 1}. ${item.shortText.length} characters`, item, '\n');
//   });
// });
