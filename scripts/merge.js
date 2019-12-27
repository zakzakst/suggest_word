//==============================
// ■取得した各種JSONのデータを一つにまとめる
//==============================

// 利用モジュールの取り込み
const fs = require('fs');
let json = {
  google: [],
  rakuten: [],
  bing: [],
  amazon: [],
  trends: []
};
mergeGoogle();
mergeRakuten();
mergeBing();
mergeAmazon();
mergeTrends();

// JSONファイルへ書き込み
let mergeJson = JSON.stringify(json);
let jsonPath = 'dist/merge.json';
fs.writeFileSync(jsonPath, mergeJson);
console.log('ファイル書き出し完了');

function mergeGoogle() {
  const filePath = 'dist/google.json';
  const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  const obj = JSON.parse(data);
  const suggestArray = obj.toplevel.CompleteSuggestion;
  for(let i = 0; i < suggestArray.length; i++) {
    json.google.push(suggestArray[i].suggestion[0].$.data);
  }
}

function mergeRakuten() {
  const filePath = 'dist/rakuten.json';
  const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  const obj = JSON.parse(data);
  const resultArray = obj.result;
  for(let i = 0; i < resultArray.length; i++) {
    json.rakuten.push(resultArray[i][0]);
  }
}

function mergeBing() {
  const filePath = 'dist/bing.json';
  const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  const obj = JSON.parse(data);
  json.bing = obj[1];
}

function mergeAmazon() {
  const filePath = 'dist/amazon.json';
  const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  const obj = JSON.parse(data);
  json.amazon = obj[1];
}

function mergeTrends() {
  const filePath = 'dist/trends.json';
  const data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  const obj = JSON.parse(data);
  for(let i = 0; i < obj.length; i++) {
    json.trends.push(obj[i].query);
  }
}
