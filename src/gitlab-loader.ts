import GitlabApi from "./gitlab-api";
import {GitlabIssue, Issue} from "./issue";
import {App} from "obsidian";
import {GitlabIssuesSettings} from "./settings";
import Filesystem from "./filesystem";

export default class GitlabLoader {

	private fs: Filesystem;
	private settings: GitlabIssuesSettings;

	constructor(app: App, settings: GitlabIssuesSettings) {
		this.fs = new Filesystem(app.vault, settings);
		this.settings = settings;
	}

	loadIssues() {
		// URL Encode the user filter settings
		const apiURL = `${this.settings.gitlabApiUrl()}/issues?${this.settings.filter}`;
		GitlabApi.load<Array<Issue>>(encodeURI(apiURL), this.settings.gitlabToken)
			.then((issues: Array<Issue>) => {
				const gitlabIssues = issues.map((rawIssue: Issue) => new GitlabIssue(rawIssue));
				this.fs.purgeExistingIssues();
				this.fs.processIssues(gitlabIssues);
			})
			.catch(error => {
				console.error(error.message);
			});
	}
}
