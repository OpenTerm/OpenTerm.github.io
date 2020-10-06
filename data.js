import Table from './table.js';
import MAPPINGS from './tables.js';
// td = x => `<td>${x}</td>`;
// tr = x => `<tr>${x.map(td).join('\n')}</tr>`;
// table = x => `<table >${x.map(tr).join('\n')}</table>`;
// const raw = (folder, file) => `https://raw.githubusercontent.com/OpenTerm/${folder}/master/${file}.tsv`
// export default new DATA();

export default new class {
	openTermVersion = '20';
	sourceLink = (folder, file) => `https://raw.githubusercontent.com/OpenTerm/codes/${this.openTermVersion}/${folder}/${file}`
	editLink = (folder, file) => `https://github.com/OpenTerm/codes/blob/${this.openTermVersion}/${folder}/${file}`


	json = {}

	async load(base, item) {
		console.log('load', base, item)
		// path = path.split('/')
		let result = await fetch(this.sourceLink(base, item)).then(x => x.text());
		// console.log('result', result);
		let data = new Table().addRows(result);
		// console.log(1,data.string)
		data.keepColumns(['OpenTerm', 'la', 'en', 'de', 'explanation'])
		// console.log(2,data.string)
		data.removeEmptyRows();
		// console.log(3,data.string)
		if (!this.json[base]) this.json[base] = {}
		this.json[base][item] = data;
	}

	table(base, item) {
		return this.json[base]?.[item]?.html();
	}

	async loadAll() {
		let all = [];
		for (let base in MAPPINGS) {
			for (let item in MAPPINGS[base]) {
				this.load(base, item).then(async x => {
					console.log('loaded', base, item)
					// console.log('find link',`[href='#${base}/${item}']`)
					// document.querySelector(`a[href='#${base}/${item}']`)?.classList?.remove('loading')
					await customElements.whenDefined('navi-gation');
					// this.$event('loaded', { base, item })
					window.dispatchEvent(new CustomEvent('loaded', {
						detail: { base, item }
					}));
					// console.log('navi',document.querySelector('navi-gation'))
					// document.querySelector('navi-gation').activate(base, item);
					// if (document.location.hash.substr(1) == base + '/' + item) {
					// 	console.log("MATCHHHH");
					// 	await customElements.whenDefined('table-view');
					// 	document.querySelector('table-view')?.reload();
					// }
				})
			}
		}
		// return Promise.all(all);
	}

	search(terms) {
		console.log('search', terms)
		terms = terms.toLowerCase().split(' ');
		let result = new Table();
		for (let base in this.json) {
			for (let item in this.json[base]) {
				let table = this.json[base][item].clone();
				table.searchFilter(terms)
				console.log(base, item, table.data)
				result.addRows(table.text())
			}
		}
		result.removeEmptyRows();
		return result;
	}
}





// sources = {
// 	germs:{
// 		vir: "Viruses",
// 		bac: "Bacteria",
// 		fung: "Fungi",
// 		pasi: "Parasites",
// 	},

// 	lab: {
// 		// requests: "Requests",
// 		sources: "Sources",
// 		tests: "Tests",
// 		requests: "Requests",
// 		methods: "Methods",
// 		analytes: "Analytes",
// 		results: "Results",
// 		packaging: "Packaging",
// 		// specimen: "Specimen",
// 	},
// 	anatomy: {
// 		// requests: "Requests",
// 		bones: "Bones",
// 		directions: "Directions",
// 		organs: "Organs",
// 	},
// 	etl:{
// 		ukm: "UKM",
// 		request_playfile: "Request Brainstorming",

// 	},
// 	comments:{
// 		assesments: "Assesment",
// 		limitations: "Limitation",
// 		warnings: "Warning",

// 	}

// }