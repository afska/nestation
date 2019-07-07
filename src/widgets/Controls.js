import React, { Component } from "react";
import strings from "../locales";
import styles from "./Controls.module.css";

export default class BalloonMessage extends Component {
	render() {
		const { children } = this.props;

		return (
			<div className={styles.controls}>
				<b style={{ color: "#0e85b0" }}>
					&nbsp;&nbsp;&nbsp;{strings.controls}&nbsp;&nbsp;&nbsp;
				</b>
				<br />
				<span>
					<span style={{ color: "#999999" }}>
						🠜&nbsp;&nbsp;🠞&nbsp;&nbsp;🠝&nbsp;&nbsp;🠟&nbsp;&nbsp;
					</span>
					<span style={{ color: "#d02604" }}>s&nbsp; d</span>
				</span>
				<br />
				<span>[supr]&nbsp;&nbsp; [enter]</span>
			</div>
		);
	}
}
