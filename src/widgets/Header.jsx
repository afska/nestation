import React, { Component } from "react";
import BalloonMessage from "./BalloonMessage";
import styles from "./Header.module.css";
import classNames from "classnames";
import _ from "lodash";

export default class Header extends Component {
	state = { bytes: null };

	render() {
		const { children } = this.props;

		return (
			<div className={styles.header}>
				<div className={styles.small}>
					{!_.isEmpty(children) && (
						<BalloonMessage
							className={classNames(styles.message, styles.small)}
						>
							{children}
						</BalloonMessage>
					)}
				</div>

				<h2 className={styles.title}>
					<div className={styles.link}>
						<a
							href="https://github.com/afska/nestation#nestation"
							target="_blank"
							rel="noopener noreferrer"
							tabIndex="-1"
							className={styles.hyperlink}
						>
							<i className={classNames(styles.titleLogo, "nes-logo")} />
							<span className={styles.titleText}>NEStation</span>
						</a>
					</div>
				</h2>
			</div>
		);
	}
}
