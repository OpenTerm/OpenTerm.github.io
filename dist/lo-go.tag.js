console.log('lo-go', import.meta.url);
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
HTML.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<g id='O' stroke-width='64' fill='transparent'>
			<circle cx='256' cy='256' r='220' />
			<!-- <circle cx='256' cy='164' r='1' /> -->
		</g>
		<g id='T' stroke-width='64' stroke-linecap="round">
			<line x1='62' x2='450' y1='164' y2='164' />
			<line x1='256' x2='256' y1='164' y2='470' />
		</g>
	</svg>
	<h1>
		<div id='open'>Open</div>
		<div id='term'>Term</div>
	</h1>`;
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
};
class lo_go extends WebTag {
	}
window.customElements.define('lo-go', lo_go)