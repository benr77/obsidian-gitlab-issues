import GitlabApi from "./gitlab-api";
import {GitlabIssue} from "./issue";
import {App} from "obsidian";
import {GitlabIssuesSettings} from "./settings";
import Filesystem from "./filesystem";
import {Issue} from "./types";

export default class GitlabLoader {

	private fs: Filesystem;
	private settings: GitlabIssuesSettings;

	constructor(app: App, settings: GitlabIssuesSettings) {
		this.fs = new Filesystem(app.vault, settings);
		this.settings = settings;
	}

	getUrl() {
		switch (this.settings.gitlabIssuesLevel) {
			case "project":
				return `${this.settings.gitlabApiUrl()}/projects/${this.settings.gitlabAppId}/issues?${this.settings.filter}`;
			case "group":
				return `${this.settings.gitlabApiUrl()}/groups/${this.settings.gitlabAppId}/issues?${this.settings.filter}`;
			case "personal":
			default:
				return `${this.settings.gitlabApiUrl()}/issues?${this.settings.filter}`;
		}
	}

	loadIssues() {
		GitlabApi.load<Array<Issue>>(encodeURI(this.getUrl()), this.settings.gitlabToken)
			.then((issues: Array<Issue>) => {
				const gitlabIssues = issues.map((rawIssue: Issue) => new GitlabIssue(rawIssue));

				if(this.settings.purgeIssues) {
					this.fs.purgeExistingIssues();
				}
				this.fs.processIssues(gitlabIssues);
			})
			.catch(error => {
				console.error(error.message);
			});
	}
}
