import { html, css, LitElement } from 'lit-element';

export class AudioWebComponent extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.filter-info {
				font-size: 0.9em;
			}

			/* TODO check how to style audio element */
			audio {
				min-height: 50px;
			}
		`;
	}
	static get properties() {
		return {
			/** Track data that will be passed to audio element "src" attribute */
			track: {
				type: String,
				attribute: 'track',
			},

			/** Only frequencies in Hz below this cutoff value will pass through */
			filterCurrentValue: Number,

			/** Minimum value in Hz for the filter slider */
			filterMinValue: Number,
			/** Maximum value in Hz for the filter slider */
			filterMaxValue: Number,
		};
	}

	constructor() {
		super();
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this._createFilter();
		console.log(this.audioContext);
	}

	render() {
		return html`
				${ this.track ? html` 
					<audio id="audioComponent" controls src="${this.track}"></audio>

					<div class="slidecontainer">
						<input type="range" class="slider" id="filterRange" 
							min="${this.filterMinValue}" 
							max="${this.filterMaxValue}" 
							value="${this.filterCurrentValue}" 
							@input="${this.updateFilter}"
						>
						<span class="filter-info">
							LP filter ${this.filterCurrentValue}hz
						</span>

					</div>`
				: html``
			}
			`
	}

	/** Checks for changes in the defined properties */
	updated(changedProps) {
		if (changedProps.has('track')) {
			// Creating source in audioContext when new track data is received
			let audioComponent = this.shadowRoot.querySelector('#audioComponent');
			this.source = this.audioContext.createMediaElementSource(audioComponent);

			// Setting up connections for audioContext
			this.source.connect(this.filter);
			this.filter.connect(this.audioContext.destination);
		}

		if (changedProps.has('filterCurrentValue')) {
			this.updateFilter();
		}
	}

	/** Update filter with default value or new value from UI event */
	updateFilter(e) {
		this.filter.frequency.value = e ? (this.filterCurrentValue = e.target.value) : this.filterCurrentValue;
	}

	/** Create filter for the current audio context */
	_createFilter() {
		this.filter = this.audioContext.createBiquadFilter();
		this.filterMinValue = 300;
		this.filterMaxValue = 20000;
		this.filterCurrentValue = this.filterMaxValue;
	}
}

customElements.define('audio-web-component', AudioWebComponent);