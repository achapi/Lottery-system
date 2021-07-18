// 1クラスの当選人数
const win_count = 40;

// 一回当たった人がもう一回当たる確率(%)
const winning_probability = 75;

// グローバル変数の宣言(いろんなとこで使う)
var csv,json,json2,n,delete_json,lott,won;

// CSVファイルが読み込まれてるかを判定する変数
var iscsv = 0;

// 当たったことがある人のファイルが読み込まれてるかを判定する変数
var iswinner = 0;

// 現在の日付を取得したのを変数に代入する
var date = new Date();

// 当たった人を保存する配列
var save_winner = '';

// CSVファイルを読み込んだ時に動く関数
document.getElementById("inputFile").addEventListener('change', function(e) {

  // 読み込んだファイルのプロパティを取得する
  var file_reader = new FileReader();

  // ファイルの読み込みが終了したら動く関数
  file_reader.addEventListener('load', function(e) {

    // CSVファイルが読み込まれたと判定するために1にする
    iscsv = 1;

    // ファイルの内容を変数に代入する
    csv = file_reader.result;

    // csvを二次元配列にしたのを変数に代入する
    json = getCsv(csv); 

    // csvを二次元配列にしたのを変数に代入する(バックアップ用)
    json2 = JSON.parse(JSON.stringify(json));
  });

  //　ファイルの内容をfile_reader.resultで読み込ませるようにする
  file_reader.readAsText(e.target.files[0]);
});


// 当たったことがある人のファイルを読み込んだ時に動く関数
document.getElementById("inputFile_won").addEventListener('change', function(e) {

  // 読み込んだファイルのプロパティを取得する
  var file_reader = new FileReader();

  // ファイルの読み込みが終了したら動く関数
  file_reader.addEventListener('load', function(e) {
    
    // 当たったことがある人のファイルが読み込まれたと判定するために1にする
    iswinner = 1;

    // ファイルの内容を変数に代入する
    won = file_reader.result;

    // 読み込まれたファイルを出力するテキストに入れとく
    save_winner = won + '\n';
  });

  //　ファイルの内容をfile_reader.resultで読み込ませるようにする
  file_reader.readAsText(e.target.files[0]);
});

// ボタンが押されたら実行する関数
function button_lot(){

    if(iscsv==0){
      document.getElementById('p').innerHTML = `<b>ファイルを読み込んでください。</b>`
      return;
    }

    // 処理速度の計測始め
    var start = performance.now();

    // 当たったことがある人のファイルが読み込まれたら実行する
    if(iswinner==1)winnerpush();
    
    // 抽選した結果を変数に入れる
    lott = lottery();

    // 処理速度の計測終わり
    var end = performance.now();

    // 処理速度をp要素に表示させる
    document.getElementById('p').innerHTML = `ボタンを押してからダウンロードを開始するまでにかかった時間は<b>${(end - start)/1000}</b>秒です。`;

    // 結果をダウンロードする
    download(output(),'の抽選結果','txt');
    download(save_winner.slice(0,-1),'現在当たった人','winnertxt');
}

// 当たったことがあるならその人の情報に当たったことがあると入れる関数
function winnerpush(){

  // csvファイルをカンマ区切りの文字列にする
  var winner_json = won.replace('\n',',');

  // 生徒の人数回繰り返す
  for(var i = 0;i < json.length;i++){

    // 当たったことがあるならその人の情報に1をないなら0を入れる

    if (winner_json.indexOf(`${json[i][0]},${json[i][1]},${json[i][2]}`) != -1){
      json[i].push('1')
    }else{
      json[i].push('0')
    }
  }

  // バックアップ用の変数に値渡しする
  json2 = JSON.parse(JSON.stringify(json));
}

// 二次元配列をシャッフルするのに必要な配列を返す関数(jにはシャッフルさせたい配列が入る)
function shufflejson(j) {

  // シャッフルしたものを入れる配列
  var r = [];

  // 0から二次元配列の長さ-1までの配列を作る
  for (var i = 0; i < j.length; i++) {
    r.push(i);
  }
  
  //シャッフルに使う変数
  var k;

  //作成した配列の長さ-1回繰り返す
  for (var i = r.length; 1 < i; i--) {

    // kに0から添字-1までの乱数を代入する
    k = Math.floor(Math.random() * i);

    //添字-1番目とk番目を交換する
    [r[k], r[i - 1]] = [r[i - 1], r[k]];
  }

  return r; //シャッフルした配列を返す
}

// 結果の文を返す関数
function output(){
  var text = `●5年A組の当選者は${o(0)}\n\n●5年B組の当選者は${o(1)}\n\n●5年C組の当選者は${o(2)}\n\n●5年D組の当選者は${o(3)}\n\n●6年A組の当選者は${o(4)}\n\n●6年B組の当選者は${o(5)}\n\n●6年C組の当選者は${o(6)}\n\n●6年D組の当選者は${o(7)}`;
  return text;
}

// クラスごとの結果の文を作成して返す関数(cにはクラスごとに当たった人の情報が入る)
function o(c){

  //返す文を入れる変数を作成する
  var out='';

  // 二次元配列の配列を保存する変数と学年クラス出席番号を保存する変数を作成する
  var j,o_g,o_c,o_n;

  // 二次元配列を学年クラス出席番号順に並び変える
  json2.sort();

  // 桁を揃えたのを入れる配列
  var json_sort = [];
  
  // 当たったクラスの人数回繰り返す
  for(var i=0;i<lott[c].length;i++){
    //作成した配列に桁を揃えた配列を入れる
    json_sort.push(json2[lott[c][i]]);
  }

  // 二次元配列を学年クラス出席番号順に並び変える
  json_sort.sort();

  // 当たったクラスの人数回繰り返す
  for(var i=0;i<lott[c].length;i++){

    //並び替えた配列のi番目の配列を代入する
    j=json_sort[i];

    // i番目の学年を代入する
    o_g = j[0];

    // i番目のクラスを代入する
    o_c = j[1];

    // i番目の出席番号を代入する
    o_n = j[2];

    //当たった人を保存する配列に当たった人を入れる
    if(save_winner.indexOf(`${o_g},${o_c},${o_n}`) == -1)save_winner += `${o_g},${o_c},${o_n}\n`;

    // 返す文にi番目の情報を付け加える
    out += `${o_g}年${o_c}組${o_n}番、`;
  }

  //最後の文字に「、」が入るのでそれを削除して返す
  return out.slice(0, -1);
}

// 第一希望と第二希望から抽選したものを返す関数
function lottery() {

  // 第一希望から抽選したものを代入する
  var hope_1 = selectclass(0);

  // 抽選した人の二次元配列から第一希望に当選した人の配列を削除する
  for (var i = 0; i < delete_json.length; i++) {
    json.splice(delete_json[i] - i, 1);
  }

  // 第一希望に外れた人から第二希望を抽選する
  var hope_2 = selectclass(1);

  // 定員割れしてるクラスに第二希望で当たった人の中から定員が埋まるまでか第二希望で当たった人が全員埋められるまでランダムに入れる
  for (var i = 0; i < 8; i++) {

    // 定員割れしてなければ実行する
    if (hope_1[i].length != win_count) {

      // 第二希望に当たった人の中からランダムに一人を代入する変数を作成する
      var hope_2_i;

      // 定員が埋まるまでか第二希望で当たった人が全員埋められるまで繰り返す
      while (!(hope_1[i].length == win_count || hope_2[i].length == 0)) {

        // 第二希望に当たった人の中から一人ランダムに選んで代入する
        hope_2_i = Math.floor(Math.random() * hope_2[i].length);

        // 全員埋められてたら処理をやめる
        if (hope_2[i].length == 0) break;

        // ランダムに選んだ一人が当たったことがあるかで条件分岐する
        if (json2[hope_2[i][hope_2_i]][7] == 1) {
          
          // ランダムに選んだ一人が当たったことがあるならn%の確率でクラスに埋める
          if (Math.random() <= winning_probability / 100) {
            hope_1[i].push(hope_2[i][hope_2_i])

            // 第二希望に当たった人の配列から削除する
            hope_2[i].splice(hope_2_i, 1);

          }
        } else {

          // ランダムに選んだ一人が当たったことがないなら必ずクラスに埋める
          hope_1[i].push(hope_2[i][hope_2_i])

          //第二希望に当たった人の配列から削除する
          hope_2[i].splice(hope_2_i, 1);

        }
      }
    }
  }

  // 第一希望と第二希望から抽選したものを返す
  return hope_1;
}

// クラスごとに第一希望と第二希望から抽選したものを返す関数(hは第h希望)
function selectclass(h) {

  // 第n希望に当選した人を入れる関数
  var A_5 = [];
  var B_5 = [];
  var C_5 = [];
  var D_5 = [];
  var A_6 = [];
  var B_6 = [];
  var C_6 = [];
  var D_6 = [];

  // 消す予定の人の配列を作成する
  delete_json = [];

  // 二次元配列の中身をシャッフルするのに必要な配列を代入する
  var shuffle_number = shufflejson(json);

  // 二次元配列の長さ回繰り返す
  for (var i = 0; i < shuffle_number.length; i++) {

    // シャッフルした配列のi番目を代入する
    n = shuffle_number[i];

    // 第n希望の学年を代入する
    var h1 = json2[n][3 + h * 2];

    // 第n希望のクラスを代入する
    var h2 = json2[n][4 + h * 2];

    // 第n希望の学年クラスごとに配列に入れる
    if (h1 == 5) {
      if (h2 == 'A')A_5.push(n);
      if (h2 == 'B')B_5.push(n);
      if (h2 == 'C')C_5.push(n);
      if (h2 == 'D')D_5.push(n);
    } else {
      if (h2 == 'A')A_6.push(n);
      if (h2 == 'B')B_6.push(n);
      if (h2 == 'C')C_6.push(n);
      if (h2 == 'D')D_6.push(n);
    }
  }

  // それぞれの配列から抽選したのをクラスごとに配列にして返す
  return [lotteryclass(A_5), lotteryclass(B_5), lotteryclass(C_5), lotteryclass(D_5), lotteryclass(A_6), lotteryclass(B_6), lotteryclass(C_6),
    lotteryclass(D_6)];
}

// 第n希望のクラスごとに分けた配列から定員の人数まで抽選したのを返す関数(cにはクラスごとに分けた配列が入る)
function lotteryclass(c) {

  // 定員割れしてるなら抽選した人の二次元配列から全員を削除してクラス後に分けた配列をそのまま返す
  if (c.length <= win_count) {
    for (var i = 0; i < c.length; i++) {
      delete_json.push(n);
    }
    return c;
  }

  // 抽選するために必要な変数
  var r;

  // 当選した人を保存する配列を作成する
  var winlottery = [];

  // 定員の人数で埋まるまで繰り返す
  while (winlottery.length != win_count) {

    // クラスごとに分けた配列の中から一人ランダムに選ぶ
    r = Math.floor(Math.random() * c.length)

    // ランダムに選んだ一人が当たったことあるかで条件分岐する
    if (json2[c[r]][7] == 1) {

      // ランダムに選んだ一人当たったことがあるならn%の確率で当選した人の配列に入れる
      if (Math.random() <= winning_probability / 100) {
        winlottery.push(c[r]);

        // 抽選した人の配列から削除する
        delete_json.push(n);

        // クラスごとに分けた配列からも削除する
        c.splice(r, 1);
      }
    } else {

      // ランダムに選んだ一人当たったことがないなら必ず当選した人の配列に入れる
      winlottery.push(c[r]);

      // 抽選した人の配列から削除する
      delete_json.push(n);

      // クラスごとに分けた配列からも削除する
      c.splice(r, 1);
    }
  }

  // 当選した人の配列を返す
  return winlottery;
}

//csvファイルを二次元配列に変換して返す(cにはcsvファイルが入る)
function getCsv(c) {

  // 最終的な二次元配列を入れるための配列
  var result = [];

  // 改行を区切り文字として行を要素とした配列を作成する
  var tmp = c.split("\n");

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を作成する
  for (var i = 0; i < tmp.length; ++i) {
    result[i] = tmp[i].split(',');
  }
  // 配列の長さ回繰り返す
  for(var i=0;i<result.length;i++){

    // 出席番号が1桁なら2桁にする(1が01になる)
    result[i][2] = ('00' + result[i][2]).slice(-2);
  }
  //作成した二次元配列を返す
  resurt = result.pop();
  return result;
}

//結果をダウンロードする関数
function download(file,name,extension){
    // テキストファイルをBlob形式に変換する
    var blob = new Blob([file]);

    // Blobデータに対するURLを発行する
    var blobURL = window.URL.createObjectURL(blob);

    // URLをaタグに設定する
    var a = document.createElement('a');
    a.href = blobURL;

    // download属性でダウンロード時のファイル名を指定
    a.download = `${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒${name}.${extension}`;

    // Firefoxの場合は、実際にDOMに追加しておく必要がある
    document.body.appendChild(a);

    // CLickしてダウンロード
    a.click();

    // 終わったら不要なので要素を削除
    a.parentNode.removeChild(a);
}