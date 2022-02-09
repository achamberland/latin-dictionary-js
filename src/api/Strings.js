export function splitAndTrim(str, deliminator) {
	const result = str.split(deliminator, -1);
	for (let i = 0; i < result.length; i++) {
		result[i] = result[i].trim();
	}
	return result;
}

export function fill(str, length) {
	for (let i = 0; i < length - str.length; i++) {
		str += ' ';
	}
	return str;
}

export function supertrim(str) {
	let wasSpace = true;
	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c <= ' ') {
			if (!wasSpace) {
				str += ' ';
				wasSpace = true;
			} 
		} else {
			str += c;
			wasSpace = false;
		}
	}
	if (wasSpace && str.length > 0) {
		str = str.slice(0, str.length - 1);
	}		
	return str;
}
