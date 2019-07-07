import React, { Component } from "react";

export default class KeyBinding extends Component {
	state = { isAssigning: false };

	render() {
		const { displayName } = this.props;

		return (
			<button
				type="button"
				className="nes-btn is-primary"
				onClick={this._onAssign}
			>
				{this.state.isAssigning ? "..." : displayName}
			</button>
		);
	}

	_onAssign = () => {
		if (this.state.isAssigning) return;

		this.setState({ isAssigning: true });
		window.addEventListener("keydown", this._onKeyDown);
	};

	_onKeyDown = (e) => {
		this.props.onKeyAssigned(e.key);
		window.removeEventListener("keydown", this._onKeyDown);
		this.setState({ isAssigning: false });
	};
}
