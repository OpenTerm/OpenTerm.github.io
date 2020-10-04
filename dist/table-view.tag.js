console.log('table-view', import.meta.url);
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
HTML.innerHTML = `.`;
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
	tr:nth-child(odd) {
		background: #272727;
	}
	tr:first-child {
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
		font-family: "Lucida Console", Monaco, monospace;
		font-weight: 100;
		color: #ccf;
		position: sticky;
		top: 0;
		background: #333;
	}
	td:first-child {
		font-family: "Lucida Console", Monaco, monospace;
		font-weight: 100;
		color: #ccf;
	}
	td:not(:first-child) {
		border-left: 1px solid #444;
	}
	table {
		outline: none;
	}`));
class WebTag extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open', delegatesFocus: true });
		this.shadowRoot.appendChild(STYLE.cloneNode(true)); //: CSS
		this.$HTM = document.createElement('htm')
		this.shadowRoot.appendChild(this.$HTM)
	}
	async connectedCallback() {
		this.$applyHTML(); //: HTML
		this.$attachMutationObservers();
		this.$attachEventListeners();
		this.$onFrameChange();  //: onFrameChange
		this.$onReady(); //: onReady
	}
	$attachMutationObservers() {
		this.modelObserver = new MutationObserver(events => {
			if ((events[0].type == 'attributes') && (events[0].target == this)) {
				this.$onFrameChange(
					this.att,//Object.fromEntries(events.map(e => [e.attributeName, this.getAttribute(e.attributeName)])),
					Object.fromEntries(events.map(e => [e.attributeName, e.oldValue]))
				);
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
	get $frame() {  // attributes
		return new Proxy(
			Object.fromEntries(Array.from(this.attributes).map(x => [x.nodeName, x.nodeValue])),
			{
				set: (target, key, value) => {
					this.setAttribute(key, value);
					return Reflect.set(target, key, value);
				}
			}
		)
	}
};
import data from '../data.js';
	class table_view extends WebTag {
		async $onReady() {
			console.log('load all')
			await data.loadAll();
			console.log('data', data);
			data.search('mum');
			window.addEventListener('loaded', e => {
				if (document.location.hash.substr(1) == e.detail.base + '/' + e.detail.item) {
					console.log("MATCHHHH");
					this.reload();
				}
			})
		}
		$onFrameChange() {
			this.reload();
		}
		reload() {
			let path = this.$frame.path?.split('/');
			if (!path) return;
			console.log("RELOAD", path)
			this.table = data.table(path[0], path[1])
		}
		set table(html) {
			this.$view = html;
		}
	}
window.customElements.define('table-view', table_view)