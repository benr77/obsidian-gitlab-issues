
export interface Issue {
	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string;
	project_id: number;
	project: Project;
}

export class GitlabIssue implements Issue {

	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string;
	project_id: number;
	project: GitlabProject;

	constructor(issue: Issue) {
		this.id = issue.id;
		this.title = issue.title
						.replace(/[:]/g, '')
						.replace(/[*"/\\<>|?]/g, '-');
		this.description = issue.description;
		this.due_date = issue.due_date;
		this.web_url = issue.web_url;
		this.references = issue.references;
		this.project_id = issue.project_id;
	}
}

export interface Project {
	id: number;
	description: string;
	name: string;
	web_url: string;
}

export class GitlabProject implements Project {
	id: number;
	description: string;
	name: string;
	web_url: string;

	constructor(project: Project) {
		this.id = project?.id;
		this.description = project.description;
		this.name = project.name
						.replace(/[:]/g, '')
						.replace(/[*"/\\<>|?]/g, '-');
		this.web_url = project.web_url;
	}
}
