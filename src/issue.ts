
export interface Issue {
	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string;
}

export class GitlabIssue implements Issue {

	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string;

	get filename() {
		return this.title
			.replace(/[:]/g, '')
			.replace(/[*"/\\<>|?]/g, '-');
	}

	constructor(issue: Issue) {
		this.id = issue.id;
		this.title = issue.title;
		this.description = issue.description;
		this.due_date = issue.due_date;
		this.web_url = issue.web_url;
		this.references = issue.references;
	}
}
