
export default `---
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
