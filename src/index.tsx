import React from "react";
import { App } from "./App";
import ReactDOM from "react-dom";
import { smartOutline } from "@theorem/react";

smartOutline();
ReactDOM.render(<App />, document.querySelector(".app"));
