import React, { useState, useEffect, Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, NavLink, HashRouter } from "react-router-dom";

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

  //for checking if there is rounding error and your total is soemthing like 0.997 but the waterlevel was 0.999
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
    let weight = Math.floor(parseInt(mix[key]));
    weight = weight / total;

    Object.keys(add).forEach(key => {
      if (!Object.keys(probDict).includes(key)) probDict[key] = {};
      Object.keys(add[key]).forEach(k => {
        if (!Object.keys(probDict[key]).includes(k)) probDict[key][k] = 0;
        probDict[key][k] += add[key][k] * weight;
      });
    });
  });

  console.log(probDict);

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
    <div className="flavourBox">
      <span className="flavourName">{name}</span>
      <input
        className={
          val > 90
            ? "slider fullActivation"
            : val > 40
            ? "slider highActivation"
            : val > 12
            ? "slider midActivation"
            : "slider lowActivation"
        }
        step="2"
        type="range"
        min="1"
        max="99"
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

let Main = () => {
  let [title, setTitle] = useState("");

  let [mix, setMix] = useState(setup());

  let [tag, setTag] = useState("");

  let makeWord = e => {
    setTitle(() => {
      try {
        let title = getProbs(mix);
        let tags = require("./tags.json");

        let newTag = tags[Math.floor(tags.length * Math.random())];
        newTag = newTag.replace("TK", title[0] + title.slice(1).toLowerCase());

        setTag(newTag);

        let fade = document.getElementById("tagline");
        fade.style.animation = "none";
        setTimeout(() => {
          fade.style.animation = "";
        }, 10);

        return title;
      } catch (e) {
        document.getElementById("tagline").innerHTML =
          "Something went wrong! Try again!";
        return "";
      }
    });
  };

  return (
    <div className="holder">
      <div className="App">
        <div className="word">
          <h1>{title}</h1>
          <h2 id="tagline">{tag}</h2>
        </div>
      </div>

      <div className="touchBox">
        <div className="scrollyBox">
          {Object.keys(mix).map((flavour, i) => {
            return (
              <Bar key={i} name={flavour} val={mix[flavour]} setMix={setMix} />
            );
          })}
        </div>
        <div className="btnHolder">
          <button onClick={e => makeWord(e)}>MAKE A WORD</button>
        </div>
      </div>
    </div>
  );
};

let About = () => {
  return (
    <div className="aboutPage">
      <div className="aboutContent">
        <h3>Why is this a thing?</h3>
        <p>
          I'm Bronwen Evans and I'm in my third year of Computing Science at
          Thompson Rivers University, Canada. I made (the self-named) Owalo as a
          tool for myself because I was tired of "fantasy" name generators that
          spat out <i>John Nightwhisper</i> and <i>Lucy Pathseer</i>. My friends
          started using it for their writing projects and D&D characters, and I
          figured there might be other people out there as frustrated as we
          were. So here we are.
        </p>
        <h3>This thing could be better.</h3>
        <p>
          Excellent news, brave wanderer! This is an open source project. Submit
          any requests as{" "}
          <a href="https://github.com/B-Evans99/owalo/issues">
            issues on the Github.
          </a>{" "}
          (Or, if you are an unnaturally kindhearted person, any bug reports.)
        </p>
        <h3>I have a language you should add!</h3>
        <p>
          <a href="https://github.com/B-Evans99/owalo/issues">
            Let me know about it!
          </a>
        </p>
        <h3>Owalo was the best name it could give you?</h3>
        <p>
          In my heart, the little engine is actually called
          BOWHAMSOURTHERINIMOF, which it proudly declared after eating the
          communist manifesto.
        </p>
        <h3>
          BOWHAMSOURTHERINIMOF is a good word. Why doesn't it make words like
          BOWHAMSOURTHERINIMOF!
        </h3>
        <p>
          Right now, Owalo is optimized for consistency and mass appeal. If
          there's an interest shown in having a "this train has no brakes"
          version of Owalo, I'll add it.
        </p>
        <h3>I want to hear about other things you make.</h3>
        <p>
          Follow me on <a href="https://github.com/B-Evans99">Github</a> or{" "}
          <a href="https://twitter.com/BronwenEvans11">Twitter</a>.
        </p>
        <p>
          (No offense meant to anyone with characters named John Nightwhisper or
          Lucy Pathseer.)
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <div>
        <div className="header">
          <h2>Owalo</h2>
          <div className="navLinks">
            <span>
              <NavLink to="/">Home</NavLink>
            </span>
            <span>
              <NavLink to="/about">About</NavLink>
            </span>
          </div>
        </div>
        <Route exact path="/" component={Main} />
        <Route path="/about" component={About} />
      </div>
    </HashRouter>
  );
}

export default App;
