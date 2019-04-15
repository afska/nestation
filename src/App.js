import React, { Component } from "react";
import styles from "./App.module.css";

export default class App extends Component {
	render() {
		return (
			<div className={styles.app}>
				<div className={styles.header}>
					<section className={`${styles.link} message -left`}>
						<div className="nes-balloon from-left is-small">
							<p>
								Share <a href="">/room</a>
							</p>
						</div>
					</section>

					<h2 className={styles.title}>
						<i className="nes-logo" />
						<span className={styles.titleText}>NEStation</span>
					</h2>
				</div>

				<div className={styles.main}>
					<section className={`${styles.game} nes-container with-title`}>
						<h3 className="title">Game</h3>
					</section>
				</div>
			</div>
		);
	}
}
