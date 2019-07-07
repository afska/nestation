import React, { Component } from "react";
import styles from "./BalloonMessage.module.css";
import haluImage from "../assets/halu.svg";
import classNames from "classnames";

export default class BalloonMessage extends Component {
	render() {
		const { children } = this.props;

		return (
			<section className="message -left">
				<div
					className={classNames(
						styles.balloon,
						"nes-balloon",
						"from-left",
						"is-small"
					)}
				>
					<p>{children}</p>
				</div>
				<br />
				<img className={styles.character} src={haluImage} alt="character" />
			</section>
		);
	}
}
