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

		const urlParts: Array<string> = [
			this.settings.gitlabUrl,
			'/issues?' + this.settings.filter,
		];

		GitlabApi.load<Array<Issue>>(urlParts.join(''), this.settings.gitlabToken)
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
