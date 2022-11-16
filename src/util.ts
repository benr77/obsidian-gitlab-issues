export function sanitizeFileName(value: string) {
	return value
		.replace(/[:]/g, '')
		.replace(/[*"/\\<>|?]/g, '-');
}
