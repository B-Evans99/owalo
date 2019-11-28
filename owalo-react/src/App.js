import React, {useState} from "react";
import logo from "./logo.svg";
import "./App.css";

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let getNext = (rot,probDict) => {
  let keys = Object.keys(probDict);
  shuffle(keys);
  if(keys.includes(" ")){
  keys.splice(keys.indexOf(" "),1);
  keys.unshift(" ");
  }
  let waterLevel = Math.random();
  let total = 0;


  let i = 0;
  while (waterLevel > total && i < keys.length - 1) {
    if(keys[i]==" "){
      rot = rot-4>0?rot-4:0;
      total += probDict[keys[i]] * rot;
    }
    else{
      total += probDict[keys[i]];
    }
    if(waterLevel>total){
      i += 1;
    }
  }

  return keys[i];
};

let getWord = probDict => {
  let keys = Object.keys(probDict);
  let seed = keys[Math.floor(Math.random() * keys.length)];
  let retStr = seed;

  let next = getNext(retStr.length,probDict[retStr.charAt(retStr.length - 1)]);

  while (next != " ") {
    retStr += next;
    next = getNext(retStr.length,probDict[retStr.charAt(retStr.length - 1)]);
  }

  return retStr;
};

let getProbs = (f1,f2) => {
  let probDict1 = require("./irishFlavour.json");
  let probDict2 = require("./obviousFlavour.json");

  let probDict = {}

  let total = parseInt(f1)+parseInt(f2);
  f1 = parseInt(f1)/total;
  f2 = parseInt(f2)/total;

  Object.keys(probDict1).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict1[key]).forEach(k=>{
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] +=  probDict1[key][k] * f1;
    });
  });

  Object.keys(probDict2).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict2[key]).forEach(k=>{
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] +=  probDict2[key][k] * f2;
    });
  });

  return getWord(probDict);
};

function App() {
  let [title,setTitle] = useState("");

  if(title=="") setTitle(getProbs("irish"));

  let [ireVal,setIreVal] = useState(100);
  let [idaVal,setIdaVal] = useState(0);

  return (<div className="App">{title}
  <br/>
  irish
  <input type="range" min="1" max="100" value={ireVal} onChange={(e)=>{
    setIreVal(e.target.value)
    
    }} id="ireVal"/>
    <br/>
  alpha
  <input type="range" min="1" max="100" value={idaVal} onChange={(e)=>{setIdaVal(e.target.value)  }} id="idaVal"/>
  <button onClick={()=>{
      setTitle(getProbs(ireVal,idaVal));

  }}>MAKE A WORD</button>
  </div>);
}

export default App;
