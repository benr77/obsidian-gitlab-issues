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
		const filterItems = this.settings.filter.split("&").map(filterGroup => filterGroup.split('=').map((value, index) =>  index % 2 == 0 ? value : `${encodeURIComponent(value)}` ).join("="));
		const apiURL = `${this.settings.gitlabApiUrl()}/issues?${filterItems.join('&')}`;

		GitlabApi.load<Array<Issue>>(apiURL, this.settings.gitlabToken)
			.then((issues: Array<Issue>) => {
				issues = issues.map((rawIssue: Issue) => new GitlabIssue(rawIssue));
				this.fs.purgeExistingIssues();
				this.fs.processIssues(issues);
			})
			.catch(error => {
				console.error(error.message);
			});
	}
}
