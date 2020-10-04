export default class Table {
	data = [];

	constructor(columnDelimiter = '\t', lineDelimiter = '\n') {
		this.lineDelimiter = lineDelimiter;
		this.columnDelimiter = columnDelimiter;
	}

	addRows(p) {
		if (typeof p == 'string') p = p.split(this.lineDelimiter)
		if (Array.isArray(p)) p.map(row => this.addRow(row))
		return this;
	}
	addRow(p) {
		if (typeof p == 'string') p = p.split(this.columnDelimiter).map(col => col.trim())
		this.data.push(p);
		return this;
	}

	get headRow() {
		return this.data[0];
	}
	get contentRows() {
		return this.data.slice(1);
	}
	get headColumn() {
		return this.data.map(line => line[0]);
	}
	columnIndex(index) {
		return (typeof index == 'string') ? this.headRow.indexOf(index) : index;
	}
	row(index) { // get one row
		return this.data[index];
	}
	col(index) { // get full column as a 1d array
		// if (typeof index == 'string') index = this.rowHeader().indexOf(index);
		index = this.columnIndex(index)
		return this.data.map(line => line[index])
	}
	keepColumns(indices) {
		indices = indices.map(index => this.columnIndex(index))
		this.data = this.data.map(line => line.filter((col, index) => indices.includes(index)))
		return this;
	}
	removeColumns(indices) {
		indices = indices.map(index => this.columnIndex(index))
		this.data = this.data.map(line => line.filter((col, index) => !indices.includes(index)))
		return this;
	}
	removeEmptyRows() {
		// console.log(this.data.map(row=>row.join('').trim()))
		this.data = this.data.filter(row => row.join('').trim())
		return this;
	}

	clone(){
		return new Table().addRows(this.text())
	}

	searchFilter(terms) {
		if (typeof terms == 'string') terms = terms.split(' ');
		terms = terms.map(x=>x.toLowerCase());

		this.data = this.data.filter(row=>{
			for(let cell of row){
				for(let term of terms){
					if(cell.toLowerCase().includes(term)){
						console.log('MATCH',terms,cell)
						return true;
					}
				}
			}
			return false;
		});
		return this;
	}



	json() {
		return JSON.stringify(this.data)
	}
	text() {
		return this.data
			.map(line => line.join(this.columnDelimiter))
			.join(this.lineDelimiter);
	}
	html(options = {}) {
		return `<table>`
			+ this.data
				.map(line => line.map(column => `<td>${column?.replace('\\','\n')}</td>`).join('\t\n'))
				.map(line => `<tr>${line}</tr>`).join('\n')
			+ `</table>`;
	}
}

// export default function(){return new Table();}

export function TSV(string) { return new Table().addRows(string) }