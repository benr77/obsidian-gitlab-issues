export function sanitizeSpecialChars(value: string) {
	return value
		.replace(/[:]/g, '')
		.replace(/[*"/\\<>|?]/g, '-');
}
