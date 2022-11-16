import { sanitizeFileName } from './util';

export interface Issue {
	readonly id: number;
	readonly title: string;
	readonly description: string;
	readonly due_date: string;
	readonly web_url: string;
	readonly references: string;
	readonly filename: string;
}

export class GitlabIssue implements Issue {

	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string;

	get filename() {
		return sanitizeFileName(this.title);
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
