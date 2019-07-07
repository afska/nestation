import React, { Component } from "react";
import Loader from "react-loader-spinner";
import bus from "../events";
import styles from "./Overlay.module.css";

export default class Overlay extends Component {
	state = { isLoading: false, error: null };

	render() {
		const { isVisible } = this;
		const { error } = this.state;

		return (
			<div className={`${styles.overlay} ${isVisible ? styles.show : ""}`}>
				<div className={`${styles.loader} ${error == null ? styles.dark : ""}`}>
					{error != null ? (
						<div>{error}</div>
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
				this.setState({ isLoading, error: null });
			})
			.on("error", (error) => {
				this.setState({ isLoading: false, error });
			});
	}

	componentWillUnmount() {
		bus.removeListener("isLoading");
		bus.removeListener("error");
	}

	get isVisible() {
		return this.state.isLoading || this.state.error != null;
	}
}
