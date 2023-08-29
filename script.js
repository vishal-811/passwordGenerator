const inputSlider=document.querySelector("[ data-len-slider]");
const lengthDisplay =document.querySelector("[data-len-number]");
const passwordDisplay =document.querySelector("[data-PasswordDisplay]");
const copyButton =document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-copyMsg]");
const upperCaseCheck =document.querySelector("#uppercase");
const lowerCaseCheck =document.querySelector("#lowercase");
const numberCheck =document.querySelector("#numbers");
const symbolCheck =document.querySelector("#symbols");
const generateBtn =document.querySelector(".generatebutton");
const indicator =document.querySelector("[data-indicator]");
const allcheckboxes =document.querySelectorAll("input[type=checkbox]");

const symbols='+,.></?:-_=`~!@#$%^&*()|'

// BY default nature
let password="" //bcz in starting it is empty.
let passwordlen =10; //bcz in starting password len ===10.
let checkcount=1; //by default our one checkbox is already ticked
// set strength colour to grey in the starting by default
setIndicator('#ccc');
// set  passwordLength
handleSlider();
function handleSlider(){
    inputSlider.value=passwordlen
    lengthDisplay.innerText=passwordlen;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordlen - min)*100/(max - min)) + "% 100%"  //this is used to fill the color in our slider.
}

function setIndicator(color){
    indicator.style.backgroundColor =color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function generateRandomInteger(min,max){  //this function generate random integer from range min to max.
    return Math.floor(Math.random()*(max-min))+min;    //random method generate number from 0(inclusive) t0 1(exclusive).
                                                        // we use floor here to get a integer value not a double value.
                                                        // we use random *(max-min) to produce number from 0 to max 
                                                        //but we need a number from min to max for that we add min.
}

function generateRandomNumber(){
    return generateRandomInteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(generateRandomInteger(97,123));  //inorder to convert this integers in to character we use a method string.fromCharCode
}

function generateuppercase(){
    return String.fromCharCode(generateRandomInteger(65,91));
}

function generatesymbols(){
     const randSymbol= generateRandomInteger(0,symbols.length);
     return symbols.charAt(randSymbol);
}

// function to calculate the strength of a password.

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCaseCheck .checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlen >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordlen >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// function to copy a text.

async function copyText(){
    
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    } catch (error) { 
        copyMsg.innerText="failed";
    }
    // to make copy wala span visible 
    copyMsg.classList.add("active");

    setTimeout(function(){
        copyMsg.classList.remove("active");
    },2000);

}

inputSlider.addEventListener('input',(e)=>{
    passwordlen=e.target.value;
    handleSlider();
})

copyButton.addEventListener("click",function(){
    if(passwordDisplay.value){
        copyText();
    }
})

function handleAllcheckboxchange(){
    checkcount=0;
    allcheckboxes.forEach((checkbox)=>{
            if(checkbox.checked)checkcount++;
    })
}

allcheckboxes.forEach(function(checkbox){
    checkbox.addEventListener("click",handleAllcheckboxchange);
})
  
// working of generate password button

generateBtn.addEventListener("click" ,function(){
    // none of the checkboxes are clicked than koi password nhi milega.
    if(checkcount==0){
        return; 
    }

// special case
  if(passwordlen<checkcount){
    passwordlen=checkcount;
    handleSlider();
    }

    // chal new password dhundte hn
    // new password find krne ja rha hu toh old wale ko hta dete hn
     password="";
     
    //  let put the element mentioned by checkboxes
    // if(upperCaseCheck.checked){
    //     password+=generateuppercase();
    // }
    // if(lowerCaseCheck.checked){
    //     password+=generatelowercase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password+=generatesymbols();   
    // }

      let funcArr =[];
       if(upperCaseCheck.checked){
           funcArr.push(generateuppercase);
       }
        
       if(lowerCaseCheck.checked){
        funcArr.push(generatelowercase);
    }

    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolCheck.checked){
        funcArr.push(generatesymbols);
    }
        // jo jo chechkbox ticked hn woh wala element ek br toh ana hee chaiye (compulsory work)
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
       
    }

    // bakki bccha hua kaam koi b alphabet,number ,symbol dal skta hu jb tk equal to password length nhi ho jata (remaining index)

    for(let i=0;i<passwordlen-funcArr.length;i++){
       let randIndex=generateRandomInteger(0,funcArr.length);
       password+=funcArr[randIndex]();
    }
 

    // shuffle the password
    password=shufflepassword(Array.from(password)); //pass our password in the form of an array.

    // password show in UI.
    passwordDisplay.value=password;
    // calculate strength
    calStrength();
})


// shuffle password
function shufflepassword(array){
    // in order to do shuffle we have an algrotihm called "FISHER YATES METHOD " we can use this on an array and shuffle its value.
         for(let i=array.length-1;i>0;i--){
                //  find the j index
               const j=Math.floor(Math.random() *(i+1));
            //    swap i with j index
               const temp=array[i];
               array[i]=array[j];
               array[j]=temp;
         }

         let str="";
         array.forEach(function(ele){
            str+=ele;
         })
         return str;
}