import React, { Component } from "react";

export default class KeyBinding extends Component {
	render() {
		const { displayName, isAssigning, verticalMirror = false } = this.props;

		return (
			<button
				type="button"
				className="nes-btn is-primary"
				onClick={this._onAssign}
			>
				<span
					style={
						verticalMirror
							? { transform: "scale(1, -1)", display: "inline-block" }
							: null
					}
				>
					{isAssigning ? "..." : displayName}
				</span>
			</button>
		);
	}

	_onAssign = () => {
		if (this.props.isAssigning) this.props.onAssignCancel();
		else this.props.onAssignStart();
	};
}
