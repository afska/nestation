import React, { Component } from "react";
import Header from "../widgets/Header";
import { MasterSyncer } from "../networking";
import quickp2p from "quickp2p";
import strings from "../locales";

const COPIED_MESSAGE_TIME = 1000;

export default class InviteHeader extends Component {
	state = { token: null, copied: false, isDown: false };

	render() {
		const { needsRom } = this.props;
		const { token, copied, isDown } = this.state;

		return (
			<Header>
				{copied ? (
					<span>{strings.copied}</span>
				) : needsRom ? (
					<span>{strings.dragARomHere}</span>
				) : token ? (
					<span>
						{strings.shareThis}{" "}
						<a
							href={`?token=${token}#/join`}
							onClick={this._copyLink}
							tabIndex="-1"
						>
							{strings.link}
						</a>{" "}
						{strings.toPlayWithSomeone}
					</span>
				) : isDown ? (
					<span>{strings.errors.serverIsDown}</span>
				) : (
					<span>{strings.loading}</span>
				)}
			</Header>
		);
	}

	async componentDidUpdate(nextProps) {
		const { needsRom, onSyncer, onError } = this.props;
		if (needsRom || this.channel) return;

		const onConnectionError = () => {
			this.channel = null;
			this.setState({ token: null, copied: false });
			onError();
		};

		try {
			this.channel = await quickp2p.createChannel();
			this.channel
				.on("connected", () => {
					onSyncer(new MasterSyncer(this.channel));
				})
				.on("timeout", onConnectionError)
				.on("disconnected", onConnectionError);
			this.setState({ token: this.channel.token, isDown: false });
		} catch (e) {
			this.setState({ isDown: true });
		}
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
