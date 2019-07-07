import React, { Component } from "react";
import Loader from "react-loader-spinner";
import bus from "../events";
import styles from "./Overlay.module.css";
import classNames from "classnames";

export default class Overlay extends Component {
	state = { isLoading: false, message: null };

	render() {
		const { isVisible } = this;
		const { message } = this.state;

		return (
			<div className={classNames(styles.overlay, isVisible && styles.show)}>
				<div
					className={classNames(styles.loader, message == null && styles.dark)}
				>
					{message != null ? (
						<div className={styles.message}>{message}</div>
					) : (
						<Loader type="Watch" color="#CCCCCC" height="50" width="50" />
					)}
				</div>
			</div>
		);
	}

	componentDidMount() {
		bus
			.on("isLoading", (isLoading) => {
				this.setState({ isLoading, message: null });
			})
			.on("message", (message) => {
				this.setState({ isLoading: false, message });
			});
	}

	componentWillUnmount() {
		bus.removeListener("isLoading");
		bus.removeListener("message");
	}

	get isVisible() {
		return this.state.isLoading || this.state.message != null;
	}
}
