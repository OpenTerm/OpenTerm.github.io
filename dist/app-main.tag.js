console.log('app-main', import.meta.url);


//[ HTML
const HTML = document.createElement('template');
HTML.innerHTML = `<navi-gation></navi-gation>`;
// console.log("HTML", HTML);
//] HTML





//[ CSS
let STYLE = document.createElement('style');
STYLE.appendChild(document.createTextNode(``));
//] CSS





import './navi-gation.tag.js'


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
window.customElements.define('app-main', WebTag)


