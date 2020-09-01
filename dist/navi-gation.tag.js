console.log('navi-gation', import.meta.url);


//[ HTML
const HTML = document.createElement('template');
HTML.innerHTML = `<lo-go></lo-go>

	<input type='text' id='search' placeholder='search...' on-input='search'/>

	<h3>Infectiology</h3>
	<div id='infectio'></div>


	<h3>Clinical Chemistry</h3>
	<div id='lab'></div>


	<h3>Anatomy</h3>
	<a href='#anatomy/bones'>Bones</a>
	<a href='#anatomy/directions'>directions</a>
	<a href='#anatomy/organs'>organs</a>

	<footer>
		<a href='https://github.com/OpenTerm' target='blank'>edit on GitHub</a>
	</footer>`;
// console.log("HTML", HTML);
//] HTML





//[ CSS
let STYLE = document.createElement('style');
STYLE.appendChild(document.createTextNode(`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');
	/* @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap'); */
	:host {
		display: block;
		color: white;
		padding: .5rem;
		box-sizing: border-box;
		font-weight: 300;
		font-size: 1.1rem;
	}

	* {
		font-family: Quicksand;
	}

	h3 {
		color: #ccf;
		margin-bottom: 0;
		font-weight: 300;
	}

	a {
		text-decoration: none;
		color: white;
		display: block;
		font-weight: 300;
	}

	a:hover {
		color: #ccf;
	}

	input {
		background: #444;
		color: #ddf;
		border: none;
		outline: none;
		font-size: 1.2rem;
		width: 100%;
	}`));
//] CSS





import './lo-go.tag.js';
	import data from '../data.js';


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




		this.$onReady(); //: onReady
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



		this.addEventListener('input', e => action(e, 'on-input')); //: onInput




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








	$q1(q) { return this.shadowRoot.querySelector(q) } //: viewQS1



	


	//[ event
	$event(name, options) {
		console.log('send EVENT', name, options)
		this.dispatchEvent(new CustomEvent(name, {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: options
		}));
	}
	//] event



	


	//--------------------------------------------
	//--------------------------------------------

	
		$onReady() {
			for (let base in data.sources) {
				for(let item in data.sources[base]){
					console.log('base',this.$q1('#'+base))
					this.$q1('#'+base).innerHTML += `<a href='#${base}/${item}'>${data.sources[base][item]}</a>`
				}
				// console.log('base', base)
			}
		}
		search(node){
			console.log('search',node)
			this.$event('search',{terms:node.value})
		}

};
// console.log(WebTag)
window.customElements.define('navi-gation', WebTag)


