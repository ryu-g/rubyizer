import './main.sass'
import Kuroshiro from "./kuroshiro.min.js"
import KuromojiAnalyzer from "./kuroshiro-analyzer-kuromoji.min.js"

const kuroshiro = new Kuroshiro()
const analyzer = new KuromojiAnalyzer(
  {
  dictPath : "./dict"
  }
)

async function initrubyize(){
  console.log("initializing...")
  await kuroshiro.init(analyzer)
  console.log("active!")
}
initrubyize()

async function rubyize(string){
  let result = await kuroshiro.convert(string, { mode: "furigana", to: "hiragana" })
  result = result.replace(/<ruby>/g,'[')
  result = result.replace(/<rp>\(<\/rp><rt>/g,'|')
  result = result.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g,']')
  console.log(result)
  dist.style.backgroundColor = '#efeada'
  dist.innerText = result
}

const src = document.getElementById('inputText')
const dist = document.getElementById('resulttxt')
const translate = document.getElementById('translate')

src.addEventListener('input', activateTranslateButton)
function activateTranslateButton(){
  if(src.value.length < 1){
    translate.disabled = true;
  }else{
    translate.disabled = false;
  }
}

translate.addEventListener('click', update)

function update(){
  copybutton.innerText = "結果をコピー"
  copybutton.disabled = false
  dist.innerText = "処理中です。少々お待ち下さい....少し待っても表示されない場合、もう一度ボタンを押してください。"
  dist.style.backgroundColor = '#ffcccc'
  rubyize(src.value)
  console.log(src.value);
}

//クリップボードコピー用
const copybutton = document.getElementById("copybutton")
copybutton.disabled = true
copybutton.addEventListener("click", function(e) {
  textSelect()
  copybutton.innerText = "コピーしました！"
})

const textSelect = () => {
  let element= document.getElementById("resulttxt")
  let rng = document.createRange()
  rng.selectNodeContents(element)
  window.getSelection().removeAllRanges()　//selectionの中身を初期化しないと、連続使用にリロードが必用になってしまう
  window.getSelection().addRange(rng)
  const result = document.execCommand("copy");
  return result;
}
