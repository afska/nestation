import React, { Component } from "react";
import BalloonMessage from "../widgets/BalloonMessage";
import styles from "./Header.module.css";
import _ from "lodash";

export default class PlayScreen extends Component {
	state = { bytes: null };

	render() {
		const { children } = this.props;

		return (
			<div className={styles.header}>
				{!_.isEmpty(children) && <BalloonMessage>{children}</BalloonMessage>}

				<h2>
					<i className="nes-logo" />
					<span className={styles.titleText}>NEStation</span>
				</h2>
			</div>
		);
	}
}
