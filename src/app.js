import './main.sass'
import Kuroshiro from "./kuroshiro.min.js"
import KuromojiAnalyzer from "./kuroshiro-analyzer-kuromoji.min.js"
let isActive = false
const src = document.getElementById('inputText')
const dist = document.getElementById('resulttxt')

const kuroshiro = new Kuroshiro()
const analyzer = new KuromojiAnalyzer(
  {
  dictPath : "./dict"
  }
)

async function initrubyize(){
  console.log("initializing...")
  loadingNotice()
  await kuroshiro.init(analyzer)
  console.log("active!")
  activateNotice()
  isActive = true
}
initrubyize()

async function rubyize(string){
  let result = await kuroshiro.convert(string, { mode: "furigana", to: "hiragana" })
  result = result.replace(/<ruby>/g,'[')
  result = result.replace(/<rp>\(<\/rp><rt>/g,'|')
  result = result.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g,']')
  dist.style.backgroundColor = '#efeada'
  dist.innerText = result
}

src.addEventListener('input', activateTranslateButton)
function activateTranslateButton(){
  if(src.value.length > 1 && isActive){
    rubyize(src.value)
  }
  copybutton.innerText = "結果をコピー"
}

function loadingNotice(){
  const afterActivateText = "<span id = 'loading'>★</span>起動中です。少々お待ち下さい。初回の起動には10秒程度かかる場合があります。"
  dist.innerHTML = afterActivateText
  dist.style.backgroundColor = '#ffcccc'
}

function activateNotice(){
  const beforeActivateText = "文章を入力してください。（例：自動で回るようにしよう）"
  dist.innerHTML = beforeActivateText
  dist.style.backgroundColor = '#efeada'
}

//クリップボードコピー用
const copybutton = document.getElementById("copybutton")
copybutton.addEventListener("click", function(e) {
  textSelect()
  copybutton.innerText = "✅コピーしました！"
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
