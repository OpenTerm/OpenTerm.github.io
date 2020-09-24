console.log('table-view', import.meta.url);


//[ HTML
const HTML = document.createElement('template');
HTML.innerHTML = `.`;
// console.log("HTML", HTML);
//] HTML





//[ CSS
let STYLE = document.createElement('style');
STYLE.appendChild(document.createTextNode(`@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');

	* {
		color: white;
		font-family: Quicksand;
	}

	table {
		margin: 1rem;
		border-collapse: collapse;
	}

	tr:nth-child(even) {
		background: #333
	}

	tr:hover {
		background: #555;
		cursor: pointer;
	}

	td {
		vertical-align: top;
		padding: .5rem;
	}

	tr:first-child>td {
		color: #ccf;
	}

	td:first-child {
		font-family: Inconsolata;
		font-weight: 300;
		color: #ccf;
	}

	td:not(:first-child) {
		border-left: 1px solid #444;
	}



	table {
		outline: none;
	}`));
//] CSS





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
		this.$onFrameChange();  //: onFrameChange



		this.$onReady(); //: onReady
	}


	$attachMutationObservers() {
		//[XSLT
		this.modelObserver = new MutationObserver(events => {
			// console.log('model change', events, events[0].type, events[0].target, events[0].target == this)
			if ((events[0].type == 'attributes') && (events[0].target == this)) {
				//[ onFrameChange
				this.$onFrameChange(
					this.att,//Object.fromEntries(events.map(e => [e.attributeName, this.getAttribute(e.attributeName)])),
					Object.fromEntries(events.map(e => [e.attributeName, e.oldValue]))
				);
				//] onFrameChange
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








	$q1(q) { return this.shadowRoot.querySelector(q) } //: viewQS1



	//[ attr
	get $a() {  // attributes
		return new Proxy(
			Object.fromEntries(Array.from(this.attributes).map(x => [x.nodeName, x.nodeValue])),
			{
				set: (target, key, value) => {
					// console.log('SET', target, '.', key, '.', value);
					this.setAttribute(key, value);
					return Reflect.set(target, key, value);
				}
			}
		)
	}
	//] attr


	



	


	//--------------------------------------------
	//--------------------------------------------

	
		async $onReady() {
			console.log('load all')
			await data.loadAll();
			console.log('data', data);
			data.search('mum');
			window.addEventListener('loaded', e => {
				if (document.location.hash.substr(1) == e.detail.base + '/' + e.detail.item) {
					console.log("MATCHHHH");
					// await customElements.whenDefined('table-view');
					this.reload();
				}
			})

		}
		$onFrameChange() {
			// console.log('frame',this)
			// let a = this.getAttribute('path');
			// console.log('pa',a)
			// console.log(this.$a)
			this.reload();
		}
		reload() {
			let path = this.$a.path?.split('/');
			if (!path) return;
			console.log("RELOAD", path)
			this.table = data.table(path[0], path[1])
		}
		set table(html) {
			this.$q1('htm').innerHTML = html;
		}

};
// console.log(WebTag)
window.customElements.define('table-view', WebTag)


