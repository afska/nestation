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
					<div>
						<i className={classNames(styles.titleLogo, "nes-logo")} />
						<span className={styles.titleText}>NEStation</span>
					</div>

					<div>
						<a
							href="https://github.com/rodri042/nestation#nestation"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i
								className={classNames(
									styles.link,
									styles.titleLogo,
									"nes-octocat"
								)}
							/>
						</a>
					</div>
				</h2>
			</div>
		);
	}
}
