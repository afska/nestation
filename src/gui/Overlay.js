import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Settings from "./Settings";
import bus from "../events";
import styles from "./Overlay.module.css";
import classNames from "classnames";

export default class Overlay extends Component {
	state = { isSettingsMenuOpen: true, isLoading: false, message: null };
	// TODO: false

	render() {
		const { isVisible } = this;
		const { isSettingsMenuOpen, message } = this.state;

		return (
			<div className={classNames(styles.overlay, isVisible && styles.show)}>
				<div
					className={classNames(styles.loader, message == null && styles.dark)}
				>
					{isSettingsMenuOpen ? (
						<Settings />
					) : message != null ? (
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
				this.setState({ isLoading });
			})
			.on("message", (message) => {
				this.setState({ isLoading: false, message });
			})
			.on("settings", () => {
				this.setState({ isSettingsMenuOpen: !this.state.isSettingsMenuOpen });
			});
	}

	componentWillUnmount() {
		bus.removeListener("isLoading");
		bus.removeListener("message");
	}

	get isVisible() {
		return (
			this.state.isSettingsMenuOpen ||
			this.state.isLoading ||
			this.state.message != null
		);
	}
}
