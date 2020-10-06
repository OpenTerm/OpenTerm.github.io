function list(path) {
	let output = {};
	for (const item of Deno.readDirSync(path)) {
		if (item.name[0] == '.') continue;
		if (item.isDirectory) {
			output[item.name] = list(path + '/' + item.name);
		}
		if (item.isFile) {
			if (!item.name.endsWith('.tsv')) continue;
			output[item.name] = Deno.lstatSync(path + '/' + item.name).size;
		}
	}
	return output;
}

let res = list('../codes/')
Deno.writeTextFileSync('tables.js', 'export default ' + JSON.stringify(res, null, '\t'))