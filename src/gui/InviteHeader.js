import React, { Component } from "react";
import Header from "../widgets/Header";
import quickp2p from "quickp2p";

const COPIED_MESSAGE_TIME = 1000;

export default class InviteHeader extends Component {
	state = { token: null, copied: false };

	render() {
		const { token, copied } = this.state;

		return (
			<Header>
				{copied ? (
					"Copied!"
				) : token ? (
					<span>
						Share this{" "}
						<a href={`/#/join?token=${token}`} onClick={this._copyLink}>
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

	async componentDidMount() {
		const channel = await quickp2p.createChannel();
		this.props.onChannel(channel);
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
