import React, { Component } from "react";

export default class KeyBinding extends Component {
	render() {
		const { displayName, isAssigning } = this.props;

		return (
			<button
				type="button"
				className="nes-btn is-primary"
				onClick={this._onAssign}
			>
				{isAssigning ? "..." : displayName}
			</button>
		);
	}

	_onAssign = () => {
		if (this.props.isAssigning) this.props.onAssignCancel();
		else this.props.onAssignStart();
	};
}
