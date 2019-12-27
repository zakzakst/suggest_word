//==============================
// ■各種APIからキーワードの関連情報を取得する
//==============================

// 利用モジュールの取り込み
const fs = require('fs');
const request = require('request');
const parseString = require('xml2js').parseString;
const iconv = require("iconv-lite");
const https = require('https');
const http = require('http');
const googleTrends = require('google-trends-api');
// const jsonp = require('jsonp');
// const axios = require('axios');
// const jsonpAdapter = require('axios-jsonp');


let keyword = 'テスト';
const api = {
  'google': {fileType: 'xml', url: 'https://www.google.com/complete/search?hl=ja&output=toolbar&q='},
  'rakuten': {fileType: 'jsonp', url: 'https://api.suggest.search.rakuten.co.jp/suggest?cl=dir&rid=0&sid=0&oe=utf-8&cb=cb&q='},
  'amazon': {fileType: 'json', url: 'https://completion.amazon.co.jp/search/complete?method=completion&search-alias=aps&mkt=6&q='},
  'bing': {fileType: 'json', url: 'http://api.bing.net/osjson.aspx?FORM=OPERAS&Market=ja&Query='}
}

googleFile();
amazonFile();
bingFile();
rakutenFile();
trendsFile();


function googleFile() {
  // 出力先のパスを設定
  let outfile = fs.createWriteStream('dist/google.xml', 'utf8');
  // googleサジェストの内容を取得して出力
  let url = api.google.url + encodeURI(keyword);
  https.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
      // 一度Shift_JIS形式のまま出力
      outfile.close();
      fs.readFile("dist/google.xml",  (err, data) => {
        // 文字コードをShift_JISからUTF-8に変換
        var buf = new Buffer.from(data, 'binary');
        var xml = iconv.decode(buf, 'Shift_JIS');
        // XMLファイルを上書き
        fs.writeFileSync('dist/google.xml', xml);
        // XMLファイルをJSON形式で出力
        parseString(xml, function(err, obj) {
          if(err) {console.log(err); return;}
          fs.writeFileSync('dist/google.json', JSON.stringify(obj));
        });
      });
      console.log('ダウンロード完了：google');
    });
  });
}

function amazonFile() {
  // 出力先のパスを設定
  let outfile = fs.createWriteStream('dist/amazon.json', 'utf8');
  // amazonサジェストの内容を取得して出力
  let url = api.amazon.url + encodeURI(keyword);
  https.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
      outfile.close();
      console.log('ダウンロード完了：amazon');
    });
  });
}

function bingFile() {
  // 出力先のパスを設定
  let outfile = fs.createWriteStream('dist/bing.json', 'utf8');
  // bingサジェストの内容を取得して出力
  let url = api.bing.url + encodeURI(keyword);
  http.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
      outfile.close();
      console.log('ダウンロード完了：bing');
    });
  });
}

function rakutenFile() {
  // 出力先のパスを設定
  let outfile = fs.createWriteStream('dist/rakuten.jsonp', 'utf8');
  // rakutenサジェストの内容を取得して出力
  let url = api.rakuten.url + encodeURI(keyword);
  https.get(url, function(res) {
    // 一度JSONP形式で出力
    res.pipe(outfile);
    res.on('end', function() {
      outfile.close();
      fs.readFile("dist/rakuten.jsonp",  (err, data) => {
        // テキストからcallback名部分を削除してJSONとして保存（※ブラウザなしの状態で上手く変換処理が出来なかったため）
        let jsonText = String(data).replace('cb(', '');
        jsonText = jsonText.replace(')', '');
        json = JSON.parse(jsonText);
        fs.writeFileSync('dist/rakuten.json', JSON.stringify(json));
      });
      console.log('ダウンロード完了：rakuten');
    });
  });
}

function trendsFile() {
  const opt = {
    keyword: keyword,
    geo: 'JP',
    hl: 'ja'
  };
  googleTrends
    .relatedQueries(opt)
    .then(results => {
      let json = JSON.parse(results);
      fs.writeFileSync('dist/trends.json', JSON.stringify(json.default.rankedList[1].rankedKeyword));
      console.log('ダウンロード完了：trends');
    })
    .catch(err => {
      console.log(err);
    });
}
