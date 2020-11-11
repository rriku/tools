javascript: mu = "";
/* 対象のDOMリスト */
var cardList = $(".js-card").find("a.progName");
/* 切り出す基準文字列の位置 */
var sliceIndex = "";
/* 切り出す基準文字列 */
var sliceWord = "/episode/";
/* 一時href格納 */
var tempHref = "";
/* 番組リスト */
var programList = "";
for(var i=0; i< cardList.length; i++){
    /* hrefを格納 */
    tempHref = $(cardList[i]).attr("href");
    /* 基準文字列の位置を検索 */
    sliceIndex   = tempHref.indexOf(sliceWord);
    /* 基準文字列より前を切り出し */
    tempHref = tempHref.substring(0, sliceIndex);
    /* 最初のスラッシュが要らない */
    tempHref = tempHref.replace("/","");
    /* 改行で繋ぐ */
    programList += tempHref +"\n";
}
/* preノードを作成 */
var new_element = document.createElement('pre');
/* ノードのテキスト要素を挿入 */
new_element.textContent = programList;
/* タグ挿入 */
document.getElementsByClassName('l-container')[0].prepend(new_element);