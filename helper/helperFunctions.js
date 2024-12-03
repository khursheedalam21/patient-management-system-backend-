exports.generateRegestrationNumber = (lastNumber) => {
	const lastNumericPart = parseInt(lastNumber.replace(/[^0-9]/g, ''), 10);
	return `R-${String(lastNumericPart + 1).padStart(6, '0')}`;
}
