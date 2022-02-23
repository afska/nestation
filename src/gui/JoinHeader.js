import React, { Component } from "react";
import Header from "../widgets/Header";
import { SlaveSyncer } from "../networking";
import quickp2p from "quickp2p";
import strings from "../locales";

export default class JoinHeader extends Component {
	render() {
		return (
			<Header>
				<span>{strings.connecting}</span>
			</Header>
		);
	}

	async componentDidMount() {
		const { onSyncer, onError } = this.props;

		try {
			const channel = await quickp2p.joinChannel(this.props.token);
			channel
				.on("connected", () => {
					onSyncer(new SlaveSyncer(channel));
				})
				.on("timeout", onError)
				.on("disconnected", onError);
		} catch (e) {
			onError();
		}
	}
}
