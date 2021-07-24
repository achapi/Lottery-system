//グローバル変数などを設定
const win_count = 40;
const winning_probability = 75;
var csv, json, json2, n, delete_json, lott, won;
var iscsv = 0;
var iswinner = 0;
var date = new Date();
var save_winner = '';

//CSVファイルが読み込まれたときに実行する関数
document.getElementById("inputFile").addEventListener('change', function(e) {
  var file_reader = new FileReader();
  file_reader.addEventListener('load', function(e) {
    //CSVファイルを二次元配列にする
    iscsv = 1;
    csv = file_reader.result;
    json = getCsv(csv);
    json2 = JSON.parse(JSON.stringify(json))
  });
  file_reader.readAsText(e.target.files[0])
});

//winnertxtファイルが読み込まれたときに実行する関数
document.getElementById("inputFile_won").addEventListener('change', function(e) {
  var file_reader = new FileReader();
  file_reader.addEventListener('load', function(e) {
    // 当たったことがある人を判定できるようにする
    iswinner = 1;
    won = file_reader.result;
    save_winner = won + '\n'
  });
  file_reader.readAsText(e.target.files[0])
});

//ボタンが押されたときに実行する関数
function button_lot() {
  if (iscsv == 0) {
    document.getElementById('p').innerHTML = `<b>ファイルを読み込んでください。</b>`
    return;
  }
  var start = performance.now();
  if (iswinner == 1) winnerpush();
  lott = lottery();
  var end = performance.now();
  document.getElementById('p').innerHTML =
    `ボタンを押してからダウンロードを開始するまでにかかった時間は<b>${(end - start)/1000}</b>秒です。`;
  download(output(), 'の抽選結果', 'txt');
  download(save_winner.slice(0, -1), '現在当たった人', 'winnertxt');
}

// 当たったことがある人とない人で区別出来るようにする関数
function winnerpush() {
  var winner_json = won.replace('\n', ',');
  for (var i = 0; i < json.length; i++) {
    if (winner_json.indexOf(`${json[i][0]},${json[i][1]},${json[i][2]}`) != -1) {
      json[i].push('1')
    } else {
      json[i].push('0')
    }
  }
  json2 = JSON.parse(JSON.stringify(json))
}

//二次元配列をシャッフルするために必要な配列を返す関数
function shufflejson(j) {
  var r = [];
  for (var i = 0; i < j.length; i++) {
    r.push(i)
  }
  var k;
  for (var i = r.length; 1 < i; i--) {
    k = Math.floor(Math.random() * i);
    [r[k], r[i - 1]] = [r[i - 1], r[k]]
  }
  return r
}

//出力するために分を作る関数
function output() {
  var text =
    `●5年A組の当選者は${o(0)}\n\n●5年B組の当選者は${o(1)}\n\n●5年C組の当選者は${o(2)}\n\n●5年D組の当選者は${o(3)}\n\n●6年A組の当選者は${o(4)}\n\n●6年B組の当選者は${o(5)}\n\n●6年C組の当選者は${o(6)}\n\n●6年D組の当選者は${o(7)}`;
  return text
}

//出力する生徒一人一人の情報を返す関数
function o(c) {
  var out = '';
  var j, o_g, o_c, o_n;
  json2.sort();
  var json_sort = [];
  for (var i = 0; i < lott[c].length; i++) {
    json_sort.push(json2[lott[c][i]])
  }
  json_sort.sort();
  for (var i = 0; i < lott[c].length; i++) {
    j = json_sort[i];
    o_g = j[0];
    o_c = j[1];
    o_n = j[2];
    if (save_winner.indexOf(`${o_g},${o_c},${o_n}`) == -1) save_winner +=
      `${o_g},${o_c},${o_n}\n`;
    out += `${o_g}年${o_c}組${o_n}番、`
  }
  return out.slice(0, -1)
}

// 抽選した後定員割れしてるクラスを第二希望にした生徒で埋める関数
function lottery() {
  var hope_1 = selectclass(0);
  for (var i = 0; i < delete_json.length; i++) {
    json.splice(delete_json[i] - i, 1);
  }
  var hope_2 = selectclass(1);
  for (var i = 0; i < 8; i++) {
    if (hope_1[i].length != win_count) {
      var hope_2_i;
      while (!(hope_1[i].length == win_count || hope_2[i].length == 0)) {
        hope_2_i = Math.floor(Math.random() * hope_2[i].length);
        if (hope_2[i].length == 0) break;
        if (json2[hope_2[i][hope_2_i]][7] == 1) {
          if (Math.random() <= winning_probability / 100) {
            hope_1[i].push(hope_2[i][hope_2_i]);
            hope_2[i].splice(hope_2_i, 1);
          }
        } else {
          hope_1[i].push(hope_2[i][hope_2_i]);
          hope_2[i].splice(hope_2_i, 1);
        }
      }
    }
  }
  return hope_1
}

//抽選した生徒を希望したクラスごとに分ける関数
function selectclass(h) {
  var A_5 = [];
  var B_5 = [];
  var C_5 = [];
  var D_5 = [];
  var A_6 = [];
  var B_6 = [];
  var C_6 = [];
  var D_6 = [];
  delete_json = [];
  var shuffle_number = shufflejson(json);
  for (var i = 0; i < shuffle_number.length; i++) {
    n = shuffle_number[i];
    var h1 = json2[n][3 + h * 2];
    var h2 = json2[n][4 + h * 2];
    if (h1 == 5) {
      if (h2 == 'A') A_5.push(n);
      if (h2 == 'B') B_5.push(n);
      if (h2 == 'C') C_5.push(n);
      if (h2 == 'D') D_5.push(n)
    } else {
      if (h2 == 'A') A_6.push(n);
      if (h2 == 'B') B_6.push(n);
      if (h2 == 'C') C_6.push(n);
      if (h2 == 'D') D_6.push(n)
    }
  }
  return [lotteryclass(A_5), lotteryclass(B_5), lotteryclass(C_5), lotteryclass(
      D_5), lotteryclass(A_6), lotteryclass(B_6), lotteryclass(C_6),
    lotteryclass(D_6)
  ]
}

//第一希望のみで抽選する関数
function lotteryclass(c) {
  if (c.length <= win_count) {
    for (var i = 0; i < c.length; i++) {
      delete_json.push(n)
    }
    return c
  }
  var r;
  var winlottery = [];
  while (winlottery.length != win_count) {
    r = Math.floor(Math.random() * c.length);
    if (json2[c[r]][7] == 1) {
      if (Math.random() <= winning_probability / 100) {
        winlottery.push(c[r]);
        delete_json.push(n);
        c.splice(r, 1);
      }
    } else {
      winlottery.push(c[r]);
      delete_json.push(n);
      c.splice(r, 1);
    }
  }
  return winlottery
}

//csvファイルを二次元配列にする関数
function getCsv(c) {
  var result = [];
  var tmp = c.split("\n");
  for (var i = 0; i < tmp.length; ++i) {
    result[i] = tmp[i].split(',')
  }
  for (var i = 0; i < result.length; i++) {
    result[i][2] = ('00' + result[i][2]).slice(-2)
  }
  resurt = result.pop();
  return result
}

//ファイルをダウンロードする関数
function download(file, name, extension) {
  var blob = new Blob([file]);
  var blobURL = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = blobURL;
  a.download =
    `${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒${name}.${extension}`;
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a)
}
