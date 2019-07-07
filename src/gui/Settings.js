import React, { Component } from "react";
import KeyBinding from "../widgets/KeyBinding";
import strings from "../locales";
import styles from "./Settings.module.css";
import classNames from "classnames";

export default class Settings extends Component {
	render() {
		return (
			<div className={styles.settings}>
				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">Sound</div>
					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>100%</span>
					</label>
					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>50%</span>
					</label>
					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>25%</span>
					</label>
					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>Disabled</span>
					</label>

					<span>&nbsp;</span>
				</section>
				<br />
				<br />

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">Buffering</div>

					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>Disabled</span>
					</label>

					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>Low</span>
					</label>

					<label>
						<input type="radio" class="nes-radio is-dark" name="answer-dark" />
						<span>High</span>
					</label>

					<span>&nbsp;</span>
				</section>
				<br />
				<br />

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">Input</div>

					<KeyBinding name="BUTTON_LEFT" displayName="🠜" />
					<KeyBinding name="BUTTON_RIGHT" displayName="🠞" />
					<KeyBinding name="BUTTON_UP" displayName="🠝" />
					<KeyBinding name="BUTTON_DOWN" displayName="🠟" />
					<KeyBinding name="BUTTON_B" displayName="B" />
					<KeyBinding name="BUTTON_A" displayName="A" />
					<KeyBinding name="BUTTON_SELECT" displayName="SELECT" />
					<KeyBinding name="BUTTON_START" displayName="START" />
				</section>
			</div>
		);
	}
}
