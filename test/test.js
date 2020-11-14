import Kuroshiro from "kuroshiro.min.js"

// import Kuroshiro from './kuroshiro-analyzer-kuromoji.min.js'
var kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer({ dictPath: "url/to/dictFiles" }))
    .then(function () {
        return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
    })
    .then(function(result){
        console.log(result);
    })