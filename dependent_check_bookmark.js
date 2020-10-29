javascript: mu = "";
var trgtStr = window.getSelection().toString();
trgtStr = trgtStr.replace(/\r?\n/g, "__br__");
var toolUrl = "https://rriku.github.io/tools/dependent_check.html";
window.open( toolUrl + "?trgtStr=" + trgtStr);