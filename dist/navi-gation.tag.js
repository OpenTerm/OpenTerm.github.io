console.log('navi-gation', import.meta.url);
export default class XML {
    static parse(string, type = 'text/xml') { // like JSON.parse
        return new DOMParser().parseFromString(string.replace(/xmlns=".*?"/g, ''), type)
    }
    static stringify(DOM) { // like JSON.stringify
        return new XMLSerializer().serializeToString(DOM).replace(/xmlns=".*?"/g, '')
    }
     static async fetch(url) {
        return XML.parse(await fetch(url).then(x => x.text()))
    }
    static tag(tagName, attributes){
        let tag = XML.parse(`<${tagName}/>`);
        for(let key in attributes) tag.firstChild.setAttribute(key,attributes[key]);
        return tag.firstChild;
    }
    static transform(xml, xsl, stringOutput = true) {
        let processor = new XSLTProcessor();
        processor.importStylesheet(typeof xsl == 'string' ? XML.parse(xsl) : xsl);
        let output = processor.transformToDocument(typeof xml == 'string' ? XML.parse(xml) : xml);
        return stringOutput ? XML.stringify(output) : output;
    }
}
XMLDocument.prototype.stringify = XML.stringify
Element.prototype.stringify = XML.stringify
const HTML = document.createElement('template');
HTML.innerHTML = `<flexbox>
		<header>
			<lo-go></lo-go>
			<input type='text' id='search' placeholder='search...' on-input='search' />
		</header>
		<main>
		</main>
		<footer>
			<a href='https://github.com/OpenTerm' target='blank'>edit on GitHub</a>
		</footer>
	</flexbox>`;
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
		height: 100%;
	}
	flexbox {
		display: flex;
		flex-direction: column;
	}
	header {
		/* position: absolute; */
		top: 0;
		height: 170px;
		padding: .5rem;
		background: #333;
	}
	main {
		flex: 1 1 auto;
		height: calc(100vh - 250px);
		overflow-y: auto;
		scrollbar-color: #444 #333;
		scrollbar-width: thin;
	}
	footer {
		/* position: absolute; */
		bottom: 0;
		padding: .5rem;
		background: #333;
	}
	::-webkit-scrollbar {
		width: .7rem;
	}
	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px #333;
	}
	::-webkit-scrollbar-thumb {
		background-color: #444;
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
	}
	.loading {
		color: gray;
	}`));
function QQ(query, i) {
	let result = Array.from(this.querySelectorAll(query));
	return i ? result?.[i - 1] : result;
}
Element.prototype.Q = QQ
ShadowRoot.prototype.Q = QQ
DocumentFragment.prototype.Q = QQ
class WebTag extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.shadowRoot.appendChild(STYLE.cloneNode(true)); //: CSS
		this.$HTM = document.createElement('htm')
		this.shadowRoot.appendChild(this.$HTM)
		this.$onLoad(); //: onLoad
	}
	async connectedCallback() {
		this.$applyHTML(); //: HTML
		this.$attachMutationObservers();
		this.$attachEventListeners();
		this.$onReady(); //: onReady
	}
	$attachMutationObservers() {
		this.modelObserver = new MutationObserver(events => {
			if ((events[0].type == 'attributes') && (events[0].target == this)) {
			} else {
			}
		}).observe(this, { attributes: true, characterData: true, attributeOldValue: true, childList: true, subtree: true });
	}
	$attachEventListeners() {
		let action = (event, key) => {
			try {
				let target = event.composedPath()[0];
				let action = target.closest(`[${key}]`);
				this[action.getAttribute(key)](action, event, target)
			}
			catch { }
		}
		this.addEventListener('input', e => action(e, 'on-input')); //: onInput
	}
	$applyHTML() {
		this.$view = HTML.content.cloneNode(true)
	}
	$clear(R) {
		while (R.lastChild)
			R.removeChild(R.lastChild);
	}
	get $view() {
		return this.$HTM;
	}
	set $view(HTML) {
		this.$clear(this.$view);
		if (typeof HTML == 'string')
			HTML = new DOMParser().parseFromString(HTML, 'text/html').firstChild
		this.$view.appendChild(HTML);
	}
	$event(name, options) {
		console.log('send EVENT', name, options)
		this.dispatchEvent(new CustomEvent(name, {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: options
		}));
	}
};
import './lo-go.tag.js';
	import data from '../data.js';
	import MAPPINGS from '../tables.js';
	String.prototype.toTitleCase = function () {
		return this.toLowerCase()
			.replace(/_/g, ' ')
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
	}
	class navi_gation extends WebTag {
		$onLoad() {
		}
		$onReady() {
			let html = '';
			for (let base in MAPPINGS) {
				html += `<h3>${base.toTitleCase()}</h3>`
				for (let item in MAPPINGS[base]) {
					html += `<a class='loading' href='#${base}/${item}'>${item.replace('.tsv', '').toTitleCase()}</a>`
				}
				this.$view.Q('main',1).innerHTML = html;
			}
			window.addEventListener('loaded', e => {
				this.activate(e.detail.base, e.detail.item)
			})
			window.addEventListener('hashchange', e => {
				this.updateEditLink();
			})
		}
		updateEditLink() {
			let path = document.location.hash.substr(1).split('/')
			this.$view.Q('footer a', 1).setAttribute('href', data.editLink(path[0], path[1]))
		}
		activate(base, item) {
			console.log('activate', base, item, `a[href='#${base}/${item}']`);
			this.$view.Q(`a[href='#${base}/${item}']`, 1)?.classList?.remove('loading')
		}
		search(node) {
			console.log('search', node)
			this.$event('search', { terms: node.value })
		}
	}
window.customElements.define('navi-gation', navi_gation)