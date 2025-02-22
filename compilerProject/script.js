

///get elements 
const outPutEle = document.querySelector('.output');
const createLoading = document.createElement('div');
const selectThemeEle = document.getElementById('selectTheme');
const langEle = document.querySelector('#selectLang');
const inputEle = document.querySelector('.input');
const editorEle = document.querySelector('#editor');



//editor setup 

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");  // Set the theme
editor.session.setMode("ace/mode/python");
//we dont need to get the editor element we can use ace editor 
//but if we need some editor customize then we create it it 

// editorEle.addEventListener('input',function(e){
//  editorData = e.target.value+'';
//  console.log(e.target.value);
// });



//change theme needs to be change the theme of editor
//function for change theme
const changeTheme = function(themeName){
  editor.setTheme(`ace/theme/${themeName}`);  // Set the theme
}
selectThemeEle.addEventListener('change',function(){
  const selectedTheme = selectThemeEle.value;
  changeTheme(selectedTheme)
});

//append child 


//change editor font size

const slider = document.getElementById('fontSizeSlider');
console.log(slider);

slider.addEventListener('input', function() {
    // Get the current value of the slider
    const fontSize = +slider.value;

    // Set the font size of the text element
    editor.setFontSize(fontSize);
    // Display the current font size next to the slider
    fontSizeValue.textContent = fontSize + 'px';
});

//get all languages ............................


// const fetchAllLang = async function(){
//   const res = await fetch('https://ce.judge0.com/languages/');
//   const data =await res.json();
//   console.log(data);
// }
// fetchAllLang();
//...............................................
//get the all languages with id
// C - 75
// C++  - 52
//Java - 91
//Python - 70
//Javascript- 63
//all themes available

// monokai
// solarized_dark
// solarized_light
// terminal
// twilight
// github
// dracula
// chaos
// textmate
// xcode


//get the option language data

let languageId;

langEle.addEventListener('change',function(){
  languageId = +langEle.value;
  const selectedId = langEle.options[langEle.selectedIndex]
  console.log(selectedId.dataset.id);
  editor.session.setMode(`ace/mode/${selectedId.dataset.id}`);

})


const fetchData = async function(editorData,inputData='',languageId=70){
const url = 'https://judge029.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': '36ab48dfacmshd43d949f2c59babp11801bjsn73f7dbd79d52',
		'x-rapidapi-host': 'judge029.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
	body:JSON.stringify( {
		source_code:editorData,
		language_id: languageId,
    stdin:inputData,
	}
)
};

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(response);
    return result.token;
  } catch (error) {
    console.error(error);
  }
}

// output request after get token
const getRequest = async function(token){
  const url = `https://judge029.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '36ab48dfacmshd43d949f2c59babp11801bjsn73f7dbd79d52',
      'x-rapidapi-host': 'judge029.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
     if(response.ok){
      createLoading.classList.remove('loading');

     }
    outPutEle.innerHTML = result.stdout;
  } catch (error) {
    console.error(error);
  }
}


const getLanguageId = function(){
  const selectEle = langEle.options[langEle.selectedIndex];
  console.log(+selectEle.value);
  return +selectEle.value;
}
langEle.addEventListener('change',getLanguageId);

const btnEle = document.querySelector('.run-btn');
// btnEle.addEventListener('click',function(){
//   console.log(inputEle.value);
// })
btnEle.addEventListener('click',async function(){
  outPutEle.appendChild(createLoading);
  createLoading.classList.add('loading');
 const editorData =editor.getValue();
 const inputData = inputEle.value;
const languageId = getLanguageId();
 const token = await fetchData(editorData,inputData,languageId);
  await getRequest(token);
});


const clearBtn = document.querySelector('.clear-btn');
clearBtn.addEventListener('click',()=>{
  outPutEle.innerHTML ='';
  createLoading.classList.remove('loading');


})