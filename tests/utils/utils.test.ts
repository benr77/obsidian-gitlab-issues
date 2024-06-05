import {DEFAULT_TEMPLATE, logger, sanitizeFileName} from '../../src/utils/utils';

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
			({input, output}) => {
				const sanitizedResult = sanitizeFileName(input);
				expect(sanitizedResult).toBe(output);
			}
		);
	});

	describe('logger', () => {
		it('should log the message with the correct prefix', () => {
			const message = 'This is a test message';
			const expectedOutput = 'Gitlab Issues: This is a test message';
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

			logger(message);

			expect(consoleLogSpy).toHaveBeenCalledWith(expectedOutput);
			consoleLogSpy.mockRestore();
		});
	});

	describe('DEFAULT_TEMPLATE', () => {
		it('should return the DEFAULT TEMPLATE', () => {
			expect(DEFAULT_TEMPLATE).toStrictEqual(`---
id: {{id}}
title: {{{title}}}
dueDate: {{due_date}}
webUrl: {{web_url}}
project: {{references.full}}
---

### {{{title}}}
##### Due on {{due_date}}

{{{description}}}

[View On Gitlab]({{web_url}})
`);
		})
	})
});
