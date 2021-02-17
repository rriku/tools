var divideNumber = "";

// 一般会員のCSV取り込み内容
var csvArray_1;
var csvHeader_1;

// 法人会員のCSV取り込み内容
var csvArray_2;
var csvHeader_2;

var csvArray;
var csvHeader;
var replaceCommaChar = "%%COMMA%%";


var array = [];
var fileName = "";
const readingChrset = "Shift_JIS";
const writingChrset = "sjis";

// 一般会員
var fileInput_1 = document.getElementById('file_1');
var fileReader_1 = new FileReader();
fileInput_1.onchange = () => {
  var file_1 = fileInput_1.files[0];
  fileReader_1.readAsText(file_1,readingChrset);
};
fileReader_1.onload = function () {
  var csvString = fileReader_1.result;
  // ダブルクオーテーションの中のカンマは一旦置換する
  csvString = replaceComma(csvString);

  csvArray_1 = csvString.split('\n');
  csvHeader_1 = csvArray_1[0].split(",");
  // データからヘッダー削除
  csvArray_1.shift();
}

// 法人会員
var fileInput_2 = document.getElementById('file_2');
var fileReader_2 = new FileReader();
fileInput_2.onchange = () => {
  var file_2 = fileInput_2.files[0];
  fileReader_2.readAsText(file_2,readingChrset);
};
fileReader_2.onload = function () {
  var csvString = fileReader_2.result;
  // ダブルクオーテーションの中のカンマは一旦置換する
  csvString = replaceComma(csvString);

  csvArray_2 = csvString.split('\n');
  csvHeader_2 = csvArray_2[0].split(",");
  // データからヘッダー削除
  csvArray_2.shift();
}





function splitCsv(){
  document.getElementById("result").innerHTML = "";
  divideNumber = parseInt(document.getElementById("splitNum").value);

  // 一般会員CSV未選択
  if(!csvArray_1){
    alert("正しい一般会員CSVを選択してください。");
    return false;
  }

  // 法人会員CSV未選択
  if(!csvArray_2){
    alert("正しい法人会員CSVを選択してください。");
    return false;
  }

  // 分割数
  if(isNaN(divideNumber) || divideNumber < 1){
    alert("正しい分割数を入力してください。");
    return false;
  }else if(divideNumber>100){
    alert("分割数は100以下で入力してください。");
    return false;
  }

  csvHeader = csvHeader_1;
  // ヘッダーから改行を取り除く
  for(var i=0; i<csvHeader.length; i++){
    csvHeader[i] = csvHeader[i].trim();
  }
  csvArray = csvArray_1.concat(csvArray_2);

  // カンマ区切りを配列にする
  for(var i=0; i<csvArray.length; i++){
    var tempArray = csvArray[i].split(',');
    csvArray[i] = tempArray;
    array[i] = {};
    for(var j=0; j<csvArray[i].length; j++){
      array[i][csvHeader[j]] = csvArray[i][j].trim();
    }
  }

  // フィルター
  var filteredArray;
  filteredArray = array.filter(x => x["メルマガ可否(数値)"] == "1");

  console.log(filteredArray);

  // 出力用CSV文字列
  var outputCsvStringArray = [];


  // 配列をシャッフル trueだとシャッフルする
  var shuffledArray = shuffleArray(filteredArray,true);

  // 配列を分割 trueだと分割する
  var dividedArray = divideArray(shuffledArray,divideNumber,true);

  for(var i=0;i<dividedArray.length;i++){
    outputCsvStringArray.push( createCsvString(dividedArray[i],csvHeader));
  }

  for(var i=0;i<outputCsvStringArray.length;i++){

    var codes = Encoding.stringToCode(outputCsvStringArray[i]);
    var shiftJisCodeList = Encoding.convert(codes, writingChrset, 'Unicode');
    var outputData = new Uint8Array(shiftJisCodeList);

    var blob = new Blob([outputData], {type: "text/csv"})
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.innerHTML = "分割CSV_" + String(i+1);
    a.id = "csv_1"
    a.style = "";
    a.href = url;
    a.download = "filterd_" + fileName.replace(".csv","_") + String(i+1) + ".csv";
    document.getElementById("result").appendChild(a);

  }

}

// 配列をシャッフル
function shuffleArray(trgtArray,flgBool){
  if(flgBool){
    for(var i = trgtArray.length - 1; i > 0; i--){
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = trgtArray[i];
      trgtArray[i] = trgtArray[r];
      trgtArray[r] = tmp;
    }
  }
  return trgtArray;
}

// CSV文字列を作る
function createCsvString(trgtArray,trgtHeader){
  var tmpOutputCsvString = "";
  //ヘッダー生成
  for( var j=0; j<trgtHeader.length;j++ ){
    tmpOutputCsvString += trgtHeader[j];
    if( j == trgtHeader.length-1){
      tmpOutputCsvString += "\n";
    }else{
      tmpOutputCsvString += ",";
    }
  }

  //データ生成
  for(var i=0; i<trgtArray.length;i++){
    for( var j=0; j<trgtHeader.length;j++ ){
      tmpOutputCsvString += trgtArray[i][trgtHeader[j]];
      if( j == trgtHeader.length-1){
        tmpOutputCsvString += "\n";
      }else{
        tmpOutputCsvString += ",";
      }
    }
  }
  return tmpOutputCsvString.replace(replaceCommaChar,",");
}

// 配列分割
function divideArray(trgtArray,divideNum,flgBool){
    var dividedArray = [];
    if(flgBool){
      // 配列分割個数
      var dividedArrayNum = parseInt(trgtArray.length / divideNum) ;

      // 配列分割あまり
      var dividedRestNum = (trgtArray.length % divideNum) ;

      for(var i=0;i<divideNum;i++){
        if(i == 0){
          dividedArray.push(trgtArray.slice(0,dividedArrayNum));
        }else if( i == divideNum-1){
          dividedArray.push(trgtArray.slice(i*dividedArrayNum , ((i+1) * dividedArrayNum) + dividedRestNum));
        }else{
          dividedArray.push(trgtArray.slice(i*dividedArrayNum,(i+1) * dividedArrayNum));
        }
      }

      trgtArray = dividedArray;
    }
    return trgtArray;
}

// カンマを一旦置換する
function replaceComma(csvString){
  csvString = csvString.split("\"");
  for(var i=0;i<csvString.length;i++){
    if(i>0 && !Number.isInteger(i/2)){
      csvString[i] = csvString[i].replace(",",replaceCommaChar);
    }
  }
  return csvString.join("\"");
}