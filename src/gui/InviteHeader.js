import React, { Component } from "react";
import Header from "../widgets/Header";
import quickp2p from "quickp2p";

const COPIED_MESSAGE_TIME = 1000;

export default class InviteHeader extends Component {
	state = { token: null, copied: false };

	render() {
		const { needsRom } = this.props;
		const { token, copied } = this.state;

		return (
			<Header>
				{copied ? (
					"Copied!"
				) : needsRom ? (
					<span>Drag a NES rom file here!</span>
				) : token ? (
					<span>
						Share this{" "}
						<a href={`/?token=${token}#/join`} onClick={this._copyLink}>
							link
						</a>{" "}
						to play with someone!
					</span>
				) : (
					<span>Loading...</span>
				)}
			</Header>
		);
	}

	async componentDidUpdate(nextProps) {
		const { needsRom, onChannel } = this.props;
		if (needsRom) return;

		const channel = await quickp2p.createChannel();
		channel.on("connected", () => {
			onChannel(channel);
		});
		this.setState({ token: channel.token });
	}

	_copyLink = (e) => {
		e.preventDefault();

		navigator.clipboard.writeText(e.target.href);
		this.setState({ copied: true });
		setTimeout(() => {
			this.setState({ copied: false });
		}, COPIED_MESSAGE_TIME);
	};
}
