import React, { Component } from "react";
import Loader from "react-loader-spinner";
import bus from "../events";
import styles from "./Spinner.module.css";

export default class Spinner extends Component {
	state = { isVisible: false };

	render() {
		return this.state.isVisible ? (
			<div className={styles.loader}>
				<Loader type="Watch" color="#CCCCCC" height="50" width="50" />
			</div>
		) : (
			<div />
		);
	}

	componentDidMount() {
		bus.on("isLoading", (isVisible) => {
			this.setState({ isVisible });
		});
	}

	componentWillUnmount() {
		bus.removeListener("isLoading");
	}
}
