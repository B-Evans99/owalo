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
  console.log("GIVVING TO THE GET NEXT " + JSON.stringify(probDict));

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

let getProbs = (f1, f2, f3, f4, f5, f6) => {
  let probDict1 = require("./irishFlavour.json");
  let probDict2 = require("./indianFlavour.json");
  let probDict3 = require("./italianFlavour.json");
  let probDict4 = require("./dutchFlavour.json");
  let probDict5 = require("./polishFlavour.json");
  let probDict6 = require("./russianFlavour.json");

  let probDict = {};

  f1 = Math.floor(parseInt(f1 - 1));
  f2 = Math.floor(parseInt(f2 - 1));
  f3 = Math.floor(parseInt(f3 - 1));
  f4 = Math.floor(parseInt(f4 - 1));
  f5 = Math.floor(parseInt(f5 - 1));
  f6 = Math.floor(parseInt(f6 - 1));

  let total = f1 + f2 + f3 + f4 + f5 + f6;

  f1 = f1 / total;
  f2 = f2 / total;
  f3 = f3 / total;
  f4 = f4 / total;
  f5 = f5 / total;
  f6 = f6 / total;

  Object.keys(probDict1).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict1[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict1[key][k] * f1;
    });
  });

  Object.keys(probDict2).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict2[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict2[key][k] * f2;
    });
  });

  Object.keys(probDict3).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict3[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict3[key][k] * f3;
    });
  });

  Object.keys(probDict4).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict4[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict4[key][k] * f4;
    });
  });

  Object.keys(probDict5).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict5[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict5[key][k] * f5;
    });
  });

  Object.keys(probDict6).forEach(key => {
    if (!Object.keys(probDict).includes(key)) probDict[key] = {};
    Object.keys(probDict6[key]).forEach(k => {
      if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
      probDict[key][k] += probDict6[key][k] * f6;
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
  console.log(JSON.stringify(mix));

  return (
    <div className="App">
      {title}
      {Object.keys(mix).map((flavour, i) => {
        return (
          <Bar key={i} name={flavour} val={mix[flavour]} setMix={setMix} />
        );
      })}

      {/* <button
        onClick={() => {
          setTitle(getProbs(ireVal, idaVal, itaVal, gerVal, polVal, rusVal));
        }}
      >
        MAKE A WORD
      </button> */}
    </div>
  );
}

export default App;
