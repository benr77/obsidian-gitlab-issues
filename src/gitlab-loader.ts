import GitlabApi from './gitlab-api';
import { GitlabIssue, GitlabProject, Issue, Project } from './issue';
import { App } from 'obsidian';
import { GitlabIssuesSettings } from './settings';
import Filesystem from './filesystem';

export default class GitlabLoader {

	private app: App;
	private fs: Filesystem;
	private settings: GitlabIssuesSettings;

	constructor(app: App, settings: GitlabIssuesSettings) {
		this.app = app;
		this.fs = new Filesystem(app.vault, settings);
		this.settings = settings;
	}

	loadIssues() {
		// URL Encode the user filter settings
		const apiURL = `${this.settings.gitlabApiUrl()}/issues?${this.settings.filter}`;
		GitlabApi.load<Array<Issue>>(encodeURI(apiURL), this.settings.gitlabToken)
			.then((issues: Array<Issue>) => {
				this.loadProjects(issues.map((rawIssue: Issue) => new GitlabIssue(rawIssue)));
			})
			.catch(error => {
				console.error(error.message);
			});
	}

	private loadProjects(issues: Array<GitlabIssue>) {
		// get distinct project ids
		const projectIds = new Set(issues.map(issue => issue.project_id));

		// retrieve all projects
		const promises = Array.from(projectIds).map(projectId => {
			const apiURL = `${this.settings.gitlabApiUrl()}/projects/${projectId}`;
			return GitlabApi.load<Project>(encodeURI(apiURL), this.settings.gitlabToken);
		});

		Promise.all(promises).then((projects: Array<Project>) => {
			projects = projects.map((rawProject: Project) => new GitlabProject(rawProject));
			this.augmentIssues(projects, issues);
		}).catch(error => {
			console.error(error.message);
		});
	}

	private augmentIssues(projects: Array<GitlabProject>, issues: Array<GitlabIssue>) {
		const notFound = new GitlabProject({id: -1, name: '404', web_url: '', description: ''});
		issues.forEach(issue => issue.project = projects.find(p => p.id === issue.project_id) || notFound);
		this.fs.purgeExistingIssues();
		this.fs.processIssues(issues);
	}
}
