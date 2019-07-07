import React, { Component } from "react";
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

					<button type="button" class="nes-btn is-primary">
						🠜
					</button>
					<button type="button" class="nes-btn is-primary">
						🠞
					</button>
					<button type="button" class="nes-btn is-primary">
						🠝
					</button>
					<button type="button" class="nes-btn is-primary">
						🠟
					</button>
					<button type="button" class="nes-btn is-primary">
						B
					</button>
					<button type="button" class="nes-btn is-primary">
						A
					</button>
					<button type="button" class="nes-btn is-primary">
						SELECT
					</button>
					<button type="button" class="nes-btn is-primary">
						START
					</button>
				</section>
			</div>
		);
	}
}
