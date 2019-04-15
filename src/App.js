import React, { Component } from "react";
import styles from "./App.module.css";

export default class App extends Component {
	render() {
		return (
			<div className={styles.app}>
				<section className={`${styles.game} nes-container with-title`}>
					<h3 className="title">Game</h3>
				</section>
			</div>
		);
	}
}
