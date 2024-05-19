import './index.css'
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import { MoonPayProvider } from '@moonpay/moonpay-react';

ReactDOM.render(
  <Provider store={store}>
    {/* <MoonPayProvider
      apiKey="pk_test_6AUYYGG5IlfOXmeiTfmWJNhFGNaCsyJ"
      environment="sandbox"
      debug
    > */}
      <App />
    {/* </MoonPayProvider> */}
  </Provider>
  ,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
