import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Settings from "./Settings";
import bus from "../events";
import styles from "./Overlay.module.css";
import classNames from "classnames";

export default class Overlay extends Component {
	state = { isSettingsMenuOpen: false, isLoading: false, message: null };

	render() {
		const { isVisible } = this;
		const { isSettingsMenuOpen, isLoading, message } = this.state;

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
						isLoading && (
							<Loader type="Watch" color="#CCCCCC" height="50" width="50" />
						)
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
			.on("openSettings", () => {
				this.setState({ isSettingsMenuOpen: true });
			})
			.on("closeSettings", () => {
				this.setState({ isSettingsMenuOpen: false });
			});
	}

	componentWillUnmount() {
		bus.removeListener("isLoading");
		bus.removeListener("message");
		bus.removeListener("openSettings");
		bus.removeListener("closeSettings");
	}

	get isVisible() {
		return (
			this.state.isSettingsMenuOpen ||
			this.state.isLoading ||
			this.state.message != null
		);
	}
}
