import React, { useState } from "react";
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

let getNext = (rot, probDict) => {
  let keys = Object.keys(probDict);
  shuffle(keys);
  if (keys.includes(" ")) {
    keys.splice(keys.indexOf(" "), 1);
    keys.unshift(" ");
  }
  let waterLevel = Math.random();
  let total = 0;

  let i = 0;
  while (waterLevel > total && i < keys.length - 1) {
    if (keys[i] == " ") {
      rot = rot - 4 > 0 ? rot - 4 : 0;
      total += probDict[keys[i]] * rot * 1.14;
    } else {
      total += probDict[keys[i]];
    }
    if (waterLevel > total) {
      i += 1;
    }
  }

  return keys[i];
};

let getWord = probDict => {
  let keys = Object.keys(probDict[" "]);
  let seed = keys[Math.floor(Math.random() * keys.length)];
  let retStr = seed;

  let next = getNext(retStr.length, probDict[retStr.charAt(retStr.length - 1)]);

  while (next != " ") {
    retStr += next;
    next = getNext(retStr.length, probDict[retStr.charAt(retStr.length - 1)]);
  }

  return retStr;
};

let getProbs = mix => {
  let probDict = {};

  let total = 0;

  Object.keys(mix).forEach(key => {
    total += parseInt(mix[key]);
  });

  Object.keys(mix).forEach(key => {
    let add = require("./" + key + "Flavour.json");
    let weight = Math.floor(parseInt(mix[key] - 1));
    weight = weight / total;

    Object.keys(add).forEach(key => {
      if (!Object.keys(probDict).includes(key)) probDict[key] = {};
      Object.keys(add[key]).forEach(k => {
        if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
        probDict[key][k] += add[key][k] * weight;
      });
    });
  });

  return getWord(probDict);
};

let setup = () => {
  let flavours = require("./flavours.json");
  let retMix = {};

  flavours.forEach(flavour => {
    retMix[flavour] = 0;
  });

  return retMix;
};

let Bar = ({ name, val, setMix }) => {
  return (
    <div>
      {name}
      <input
        step="2"
        type="range"
        min="1"
        max="100"
        value={val}
        onChange={e => {
          let newVal = e.target.value;
          setMix(mix => {
            mix[name] = newVal;
            return JSON.parse(JSON.stringify(mix));
          });
        }}
        id="idaVal"
      />
    </div>
  );
};

function App() {
  let [title, setTitle] = useState("");

  let [mix, setMix] = useState(setup());

  return (
    <div>
      <div className="App">
        {Object.keys(mix).map((flavour, i) => {
          return (
            <Bar key={i} name={flavour} val={mix[flavour]} setMix={setMix} />
          );
        })}

        <button
          onClick={() => {
            setTitle(getProbs(mix));
          }}
        >
          MAKE A WORD
        </button>
      </div>
      <h1>{title}</h1>
    </div>
  );
}

export default App;
