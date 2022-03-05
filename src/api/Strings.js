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

// Todo: This could be improved
export function supertrim(str) {
	let wasSpace = true;
	let output = str.split("").reduce((accumulator, currentValue) => {
		const isLetter = currentValue > " ";
		if (isLetter) {
			wasSpace = false;
			return accumulator + currentValue;
		} else if (wasSpace) {
			return accumulator;
		} else {
			wasSpace = true;
			return `${accumulator} `;
		}
	}, "");

	if (wasSpace && output.length > 0) {
		output = output.slice(0, output.length - 1);
	}		
	return output;
}

export function capitalize(words) {
	return words.split(" ").map(word => (
		word.charAt(0).toUpperCase() + word.slice(1)
	)).join(" ");
}