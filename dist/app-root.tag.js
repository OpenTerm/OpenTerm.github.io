console.log('app-root', import.meta.url);


//[ HTML
const HTML = document.createElement('template');
HTML.innerHTML = `<navi-gation></navi-gation>
	<main>
		<table-view></table-view>
	</main>`;
// console.log("HTML", HTML);
//] HTML





//[ CSS
let STYLE = document.createElement('style');
STYLE.appendChild(document.createTextNode(`htm {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	navi-gation {
		background: #333;
		width: 15rem;
		height: 100%;
	}

	main {
		background: #222;
		width: 100%;
		overflow: auto;
		scrollbar-color: #444 #333;
		scrollbar-width: thin;
	}

	::-webkit-scrollbar {
		width: .7rem;
	}

	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px #333;
	}

	::-webkit-scrollbar-thumb {
		background-color: #444;
	}`));
//] CSS





import './navi-gation.tag.js'
	import './table-view.tag.js';
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



	


	



	


	//--------------------------------------------
	//--------------------------------------------

	
		$onReady() {
			// document.querySelector('#data>div').innerHTML = data.html({ headRow: true });
			// document.querySelector('footer>a').setAttribute('href', editLink(request[0], request[1]))

			// document.querySelector('#data>div').innerHTML = await fetch('intro.html').then(x => x.text())
			this.addEventListener('search',event=>this.search(event.detail.terms))
			window.addEventListener('hashchange', () => this.route())
			this.route()
		}
		async route() {
			console.log('set route')
			await customElements.whenDefined('table-view')
			this.$q1('table-view').setAttribute('path', document.location.hash.substr(1))
		}
		async search(terms){
			let result = data.search(terms);
			console.log('search result',result);
			this.$q1('table-view').table = result.html();
		}

};
// console.log(WebTag)
window.customElements.define('app-root', WebTag)


