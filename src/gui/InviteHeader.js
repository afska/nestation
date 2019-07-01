import React, { Component } from "react";
import Header from "../widgets/Header";
import { MasterSyncer } from "../networking";
import quickp2p from "quickp2p";
import strings from "../locales";

const COPIED_MESSAGE_TIME = 1000;

export default class InviteHeader extends Component {
	state = { token: null, copied: false };

	render() {
		const { needsRom } = this.props;
		const { token, copied } = this.state;

		return (
			<Header>
				{copied ? (
					<span>{strings.copied}</span>
				) : needsRom ? (
					<span>{strings.dragARomHere}</span>
				) : token ? (
					<span>
						{strings.shareThis}{" "}
						<a href={`?token=${token}#/join`} onClick={this._copyLink}>
							{strings.link}
						</a>{" "}
						{strings.toPlayWithSomeone}
					</span>
				) : (
					<span>{strings.loading}</span>
				)}
			</Header>
		);
	}

	async componentDidUpdate(nextProps) {
		const { needsRom, onSyncer } = this.props;
		if (needsRom || this.channel) return;

		this.channel = await quickp2p.createChannel();
		this.channel.on("connected", () => {
			onSyncer(new MasterSyncer(this.channel));
		});
		this.setState({ token: this.channel.token });
	}

	_copyLink = (e) => {
		e.preventDefault();

		navigator.clipboard.writeText(e.target.href); // TODO: Fix, it doesn't work outside local domain
		this.setState({ copied: true });
		setTimeout(() => {
			this.setState({ copied: false });
		}, COPIED_MESSAGE_TIME);
	};
}
