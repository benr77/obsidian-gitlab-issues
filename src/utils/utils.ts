export function sanitizeFileName(value: string) {
	return value
		.replace(/[:]/g, '')
		.replace(/[*"/\\<>|?]/g, '-');
}

export function logger(message: string) {

	const pluginNamePrefix = 'Gitlab Issues: ';

	console.log(pluginNamePrefix + message);
}

export const DEFAULT_TEMPLATE = `---
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
`;
