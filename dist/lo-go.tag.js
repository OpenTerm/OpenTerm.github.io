console.log('lo-go', import.meta.url);


//[ HTML
const HTML = document.createElement('template');
HTML.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<g id='T' stroke-width='30' stroke-linecap="round">
			<line x1='62' x2='450' y1='164' y2='164' />
			<line x1='256' x2='256' y1='164' y2='470' />
		</g>
		<g id='O' stroke-width='30' fill='transparent'>
			<circle cx='256' cy='256' r='240' />
			<!-- <circle cx='256' cy='164' r='1' /> -->
		</g>
	</svg>

	<h1>
		<div id='open'>Open</div>
		<div id='term'>Term</div>
	</h1>`;
// console.log("HTML", HTML);
//] HTML





//[ CSS
let STYLE = document.createElement('style');
STYLE.appendChild(document.createTextNode(`:host {
		--color1: hsla(254, 50%, 50%, 90%);
		--color2: hsla(254, 50%, 70%, 90%);
	}

	* {
		font-weight: 300;
	}

	svg {
		width: 80px;
	}

	htm>* {
		display: inline-block;
		vertical-align: middle;
	}

	#O {
		stroke: var(--color1);
	}

	#open {
		color: var(--color1)
	}

	#T {
		stroke: var(--color2);
	}

	#term {
		color: var(--color2)
	}`));
//] CSS







class WebTag extends HTMLElement {

	constructor() {
		super();
		// console.log('constructor', this.innerHTML);
		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.shadowRoot.appendChild(STYLE.cloneNode(true)); //: CSS
		this.$HTM = document.createElement('htm')
		this.shadowRoot.appendChild(this.$HTM)
		this.$viewUpdateCount = 0;


	}


	async connectedCallback() {

		this.$applyHTML(); //: HTML

		this.$attachMutationObservers();
		this.$attachEventListeners();





	}


	$attachMutationObservers() {
		//[XSLT
		this.modelObserver = new MutationObserver(events => {
			// console.log('model change', events, events[0].type, events[0].target, events[0].target == this)
			if ((events[0].type == 'attributes') && (events[0].target == this)) {
				
			} else {


			}

		}).observe(this, { attributes: true, characterData: true, attributeOldValue: true, childList: true, subtree: true });
		//] XSLT

		

	}
	// window.addEventListener('load', () => this.applyXSLT());

	//[x  on-tap  on-key  $onSlotChange
	$attachEventListeners() {
		let action = (event, key) => {
			try {
				let target = event.composedPath()[0];
				// let target = event.target;
				let action = target.closest(`[${key}]`);
				// console.log('EEE', key, event.composedPath(), target, action, 'called by', this, event)
				// console.log('PATH', event.composedPath().map(x => this.$1(x)))
				this[action.getAttribute(key)](action, event, target)
			}
			catch  { }
		}








	}
	//]  on-tap  on-key  $onSlotChange


	//[ HTML
	$applyHTML() {
		// this.shadowRoot.innerHTML = `<style>${STYLE.textContent}</style>` + new XMLSerializer().serializeToString(HTML);
		this.$view = HTML.content.cloneNode(true)
		// 	this.$clearView();
		// this.shadowRoot.appendChild(STYLE.cloneNode(true));
		// this.shadowRoot.appendChild(HTML.content.cloneNode(true));
		// this.shadowRoot.insertAdjacentElement('afterbegin',STYLE);
	}
	//] HTML



	// $clearView() {
	// 	this.$clear(this.shadowRoot);
	// }
	$clear(R) {
		// https://jsperf.com/innerhtml-vs-removechild/15  >> 3 times faster
		while (R.lastChild)
			R.removeChild(R.lastChild);
	}


	// set $style(HTML) {
	// 	this.shadowRoot.innerHTML = HTML;
	// }
	get $view() {
		return this.$HTM;
		// return this.shadowRoot.lastChild;
	}
	set $view(HTML) {
		this.$clear(this.$view);
		this.$view.appendChild(HTML);
	}

	


	// 	let treeWalker = document.createTreeWalker(temp1, NodeFilter.SHOW_ELEMENT);
	// let node = null;
	// let list = [];
	// while (node = treeWalker.nextNode()) {
	// 	list.push(currentNode)
	// }












	


	



	


	//--------------------------------------------
	//--------------------------------------------

	


};
// console.log(WebTag)
window.customElements.define('lo-go', WebTag)


