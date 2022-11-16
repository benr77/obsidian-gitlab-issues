import { sanitizeFileName } from '../src/util';

describe('Utils', () => {
	describe('sanitizeFileName', () => {
		const dataSet = [
			// No sanitization expected
			{
				input: 'Normal filenames are unchanged',
				output: 'Normal filenames are unchanged'
			},
			{
				input: "Single 'quote' characters are left intact",
				output: "Single 'quote' characters are left intact"
			},
			// Sanitized version is expected
			{
				input: 'Colon : characters are removed completely',
				output: 'Colon  characters are removed completely'
			},
			{
				input: 'Double "quote" characters are replaced with hyphens',
				output: 'Double -quote- characters are replaced with hyphens'
			},
			{
				input: 'Slash / and \\ characters are replaced with hyphens',
				output: 'Slash - and - characters are replaced with hyphens'
			},
			{
				input: 'Angle brackets <> characters are replaced with hyphens',
				output: 'Angle brackets -- characters are replaced with hyphens'
			},
			{
				input: 'Pipe | characters are replaced with hyphens',
				output: 'Pipe - characters are replaced with hyphens'
			},
			{
				input: 'Question mark ? characters are replaced with hyphens',
				output: 'Question mark - characters are replaced with hyphens'
			},
		];

		it.each(dataSet)(
			'$input',
			({ input, output }) => {
				const sanitizedResult = sanitizeFileName(input);
				expect(sanitizedResult).toBe(output);
			}
		);
	});
});
