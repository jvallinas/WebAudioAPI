import { html, css, unsafeCSS, LitElement } from 'lit-element';

let gridColumnSize = 200;

export class ImageGallery extends LitElement {

	static get styles() {
		const backgroundColor = css`aliceblue`;

		return css`
			:host {
				display: block;
				background-color: ${backgroundColor};
			}

			#grid.gallery {
				display: grid;
				grid-gap: 20px;
				color: #444;
				background-color: inherit;
			}

			.box {
				height: 100px;
				background-color: #aaa;
				color: #fff;
				border-radius: 5px;
				padding: 5px;
				font-size: 150%;
			}

			img {
				max-width: 100%;
				max-height: 100%;
				vertical-align: middle;
			}

			.slider {
				margin-bottom: 8px;
			}
			.slider-info {
				font-size: 0.9em;
			}

		`;
	}
	static get properties() {
		return {
			images: Array,
			currentGridSize: Number,
		};
	}

	constructor() {
		super();
		this.images = [];
		this.minGridSize = 120;
		this.maxGridSize = 200;
		this.currentGridSize = gridColumnSize;
	}

	render() {
		if (this.images && this.images.length > 0) {
			return html`
				<h1 class="title">CSS Grid example</h1>
				<div class="slider">
					<input type="range" class="slider" id="filterRange"
						min="${this.minGridSize}" 
						max="${this.maxGridSize}" 
						value="${this.currentGridSize}" 
						@input="${this.updateGridSize}"
					> 
					<span class="slider-info">
						Grid column size: ${this.currentGridSize}px
					</span>
				</div>

				<div id="grid" class="gallery" 
					style="
						grid-template-columns: repeat(3, ${unsafeCSS(`${gridColumnSize}px`)});
					"
				>
					${this.images.map(image => 
						html` <div class="box a">${image}</div>`)
					}
				</div>
		`;
		}
	}

	/** Checks for changes in the defined properties */
	updated(changedProps) {
		if (changedProps.has('images')) {
			console.log("Images list has changed");
		}
	}

	/** Will add the img HTML element passed by parameter  */
	addImage(img) {
		this.images.push(img);
		this.requestUpdate();
	}

	/** Updates grid size depending on user input */
	updateGridSize(e) {
		this.currentGridSize = e ? e.target.value : this.currentGridSize;
		gridColumnSize = this.currentGridSize;		 
	}

}

customElements.define('custom-image-gallery', ImageGallery);