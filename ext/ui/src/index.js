import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css";



if(process.env.NODE_ENV !== "production"){
  let el = document.querySelector('body');
  el.style.backgroundColor = "transparent";
  el.style.backgroundImage = "url(bf3.PNG)";
  el.style.backgroundSize = "100% 100%";
}else{
  let el = document.querySelector('body');
  el.style.backgroundColor = "transparent";
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);