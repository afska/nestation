import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Buffer } from "buffer";
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));

const DEMO = async () => {
	const response = await fetch("testroms/rom.nes");
	const arrayBuffer = await response.arrayBuffer();
	const bytes = Buffer.from(arrayBuffer);

	window.bytes = bytes;
};

DEMO();
