import React, { Component } from "react";
import strings from "../locales";
import styles from "./Controls.module.css";
import classNames from "classnames";

export default class Controls extends Component {
	render() {
		return (
			<div className={styles.controls}>
				<b className={classNames(styles.title, styles.centered)}>
					{strings.controls}
				</b>
				<br />
				<div className={styles.controller}>
					<span className={styles.dpad}>🠜 🠞 🠝 🠟</span>
					<span className={styles.buttons}>d [space]</span>
				</div>
				<div className={styles.centered}>[supr] [enter]</div>
			</div>
		);
	}
}
