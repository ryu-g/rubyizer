import './main.sass'
const kanjichecker = require('./kanjicheck.js')
import Kuroshiro from "./kuroshiro.min.js"
import KuromojiAnalyzer from "./kuroshiro-analyzer-kuromoji.min.js"
let isActive = false
const src = document.getElementById('inputText')
const dist = document.getElementById('resulttxt')
const message = document.getElementById('message')
let currentModeDisplay = document.getElementById('currentModeDisplay')
let currentMode = 1
let currentEscapeModeDisplay = document.getElementById('currentEscapeModeDisplay')
let currentEscapeMode = 1

const modeSwitcher = document.querySelector(".modeSwitcher")
modeSwitcher.addEventListener("click", ()=>{
  const mode_data = new FormData(modeSwitcher)
  let mode_output = 0
  for (const entry of mode_data) {
    mode_output = Number(entry[1])
  }
  currentMode = mode_output
  // currentModeDisplay.innerText=`現在のルビ振りモード：${mode_output}`
})

const newLineCodeSwitcher = document.querySelector(".newLineCodeSwitcher")
newLineCodeSwitcher.addEventListener("click", ()=>{
  const escape_data = new FormData(newLineCodeSwitcher)
  let escape_output = 0
  for (const entry of escape_data) {
    escape_output = Number(entry[1])
  }
  currentEscapeMode = escape_output
  // currentEscapeModeDisplay.innerText=`現在の改行コード：${escape_output}`
  }
)

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

const devcheck = () => {
  const current_path = window.location
  console.log(current_path)
  const hrefContent = ""+current_path.href
  if ( hrefContent.indexOf("localhost") > 0){
    console.log("dev")
    document.getElementsByTagName("body")[0].style.background = "#f2f2f2";
    document.getElementsByTagName("h1")[0].innerText += "(dev)"
  } else if (hrefContent.indexOf("netlify") > 0 ){
    console.log("published")
  } else {
    console.log("hello")
  }
}

document.addEventListener('DOMContentLoaded', () =>{
  devcheck()
}) //onloadをオーバーライドしないように避けておく

initrubyize() // initialize dictionary

//kuromojiの機能で排出されるルビタグ記法を変換
//もともとの出力: <ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
//変換先の形式: [漢字|かんじ]
////rubyizeはボタンクリック時・テキスト入力時に都度走る
async function rubyize(string){
  let result = await kuroshiro.convert(string, { mode: "furigana", to: "hiragana" })
  // console.log(testStrings) デバッグ用
  if(currentMode == 1){ //square brackets ruby mode
    result = result.replace(/<ruby>/g,'[')
    result = result.replace(/<rp>\(<\/rp><rt>/g,'|')
    result = result.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g,']')

  }else if(currentMode == 2){ //round brackets ruby mode
    result = result.replace(/<ruby>/g,'')
    result = result.replace(/<rp>\(<\/rp><rt>/g,'(')
    result = result.replace(/<\/rt><rp>\)<\/rp><\/ruby>/g,')')

  }else if(currentMode == 3){
    //HTML形式で吐き出し
  }else if(currentMode == 4){
    console.log(`ruby mode is ${currentMode} now.`)
    result = string
  }
  
  if(currentEscapeMode == 1 ){
    //なにもしない
  }else if( currentEscapeMode == 2){
    result = result.replace(/\n/g,"\\\\n")
  }else if( currentEscapeMode == 3){
    result = result.replace(/\n/g,"<br>")
  }else if( currentEscapeMode == 4){
    result = result.replace(/\n/g,"\\r")
  }else if( currentEscapeMode == 5){
    result = result.replace(/\n/g,"\\n")
  }else if( currentEscapeMode == 6){
    result = result.replace(/\n/g,"\\r\\n")
  }

  dist.style.backgroundColor = '#efeada'
  const kanjichecked = kanjichecker.check(result)[0]
  const judgedmessage = kanjichecker.check(result)[1]
  dist.innerHTML = kanjichecked
  message.innerHTML = judgedmessage
}

//
src.addEventListener('input', activateTranslateButton)
modeSwitcher.addEventListener('click', activateTranslateButton)
newLineCodeSwitcher.addEventListener('click', activateTranslateButton)
function activateTranslateButton(){
  if(src.value.length > 1 && isActive){
    rubyize(src.value)
  }
  copybutton.innerText = "結果をコピー"
}

//displpay loading message
function loadingNotice(){
  const afterActivateText = "<span id = 'loading'>★</span>起動中です。少々お待ち下さい。初回の起動には10秒程度かかる場合があります。"
  dist.innerHTML = afterActivateText
  dist.style.backgroundColor = '#ffcccc'
}

//then activated rubyizer, diaplay ruby sample to user
function activateNotice(){
  const beforeActivateText = "[入力|にゅうりょく]した[文章|ぶんしょう]にルビを[付|つ]けるよ"
  dist.innerHTML = beforeActivateText
  dist.style.backgroundColor = '#efeada'
}

//クリップボードコピー用
const copybutton = document.getElementById("copybutton")
copybutton.addEventListener("click", function(e) {
  textSelect()
  copybutton.innerText = "コピーしました！"
})

//func when clicked copybutton
const textSelect = () => {
  let element= document.getElementById("resulttxt")
  let rng = document.createRange()
  rng.selectNodeContents(element)
  window.getSelection().removeAllRanges() //selectionの中身を初期化しないと、連続使用にリロードが必用になってしまう
  window.getSelection().addRange(rng)
  const result = document.execCommand("copy")
  return result
}


