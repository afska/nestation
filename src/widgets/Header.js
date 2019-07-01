import React, { Component } from "react";
import BalloonMessage from "./BalloonMessage";
import styles from "./Header.module.css";
import _ from "lodash";

export default class Header extends Component {
	state = { bytes: null };

	render() {
		const { children } = this.props;

		return (
			<div className={styles.header}>
				<div className={styles.small}>
					{!_.isEmpty(children) && (
						<BalloonMessage className={`${styles.message} ${styles.small}`}>
							{children}
						</BalloonMessage>
					)}
				</div>

				<h2 className={styles.title}>
					<i className={`nes-logo ${styles.titleLogo}`} />
					<span className={styles.titleText}>NEStation</span>
				</h2>
			</div>
		);
	}
}
