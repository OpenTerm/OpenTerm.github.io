export default class SV {
    constructor(columnDelimiter = '\t', lineDelimiter = '\n') {
        this.lineDelimiter = lineDelimiter;
        this.columnDelimiter = columnDelimiter;
    }
    parse(string) {
        this.data = string
            .split(this.lineDelimiter)
            // .map(row=>row.trim())
            .map(line => line.split(this.columnDelimiter).map(col=>col.trim()));
        return this;
    }

    get headRow() {
        return this.data[0];
    }
    get contentRows(){
        return this.data.slice(1);
    }
    get headColumn() {
        return this.data.map(line => line[0]);
    }
    columnIndex(index) {
        return (typeof index == 'string') ? this.headRow.indexOf(index) : index;
    }
    col(index) {
        // if (typeof index == 'string') index = this.rowHeader().indexOf(index);
        index = this.columnIndex(index)
        return this.data.map(line => line[index])
    }
    filterColumns(indices) {
        indices = indices.map(index => this.columnIndex(index))
        this.data = this.data.map(line => line.filter((col, index) => indices.includes(index)))
        return this;
    }
    removeEmptyRows(){
        // console.log(this.data.map(row=>row.join('').trim()))
        this.data = this.data.filter(row=>row.join('').trim())
        return this;
    }



    get string() {
        return this.data
            .map(line => line.join(this.columnDelimiter))
            .join(this.lineDelimiter);
    }
     html(options={}) {
        return `<table>`
            + this.data
                .map(line => line.map(column => `<td>${column}</td>`).join('\t\n'))
                .map(line => `<tr>${line}</tr>`).join('\n')
            + `</table>`;
    }
}



export function TSV(string) { return new SV().parse(string) }