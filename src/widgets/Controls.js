import React, { Component } from "react";
import strings from "../locales";
import styles from "./Controls.module.css";

export default class Controls extends Component {
	render() {
		return (
			<div className={styles.controls}>
				<b style={{ color: "#0e85b0" }}>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{strings.controls}
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				</b>
				<br />
				<span>
					<span style={{ color: "#999999" }}>
						🠜&nbsp;&nbsp;🠞&nbsp;&nbsp;🠝&nbsp;&nbsp;🠟&nbsp;&nbsp;&nbsp;
					</span>
					<span style={{ color: "#d02604" }}>d&nbsp;&nbsp;[space]</span>
				</span>
				<br />
				<span>
					&nbsp;&nbsp;&nbsp;[supr]&nbsp;&nbsp;[enter]&nbsp;&nbsp;&nbsp;
				</span>
			</div>
		);
	}
}
