import {Notice, Plugin, addIcon} from 'obsidian';
import {DEFAULT_SETTINGS, GitlabIssuesSettings, GitlabIssuesSettingTab} from './settings';
import Filesystem from "./filesystem";
import GitlabLoader from "./gitlab-loader";
import gitlabIcon from './assets/gitlab-icon.svg';

export default class GitlabIssuesPlugin extends Plugin {
	settings: GitlabIssuesSettings;

	async onload() {
		console.log('Starting Gitlab Issues plugin');

		await this.loadSettings();
		this.addSettingTab(new GitlabIssuesSettingTab(this.app, this));

		if (this.settings.gitlabToken) {
			this.createOutputFolder();
			this.addIconToLeftRibbon();
			this.addCommandToPalette();
			this.refreshIssuesAtStartup();
			this.scheduleAutomaticRefresh();
		}
	}

	private addIconToLeftRibbon() {
		if (this.settings.showIcon)
		{
			addIcon("gitlab", gitlabIcon);
			this.addRibbonIcon('gitlab', 'Gitlab Issues', (evt: MouseEvent) => {
				this.fetchFromGitlab();
			});
		}
	}

	private addCommandToPalette() {
		this.addCommand({
			id: 'import-gitlab-issues',
			name: 'Import Gitlab Issues',
			callback: () => {
				this.fetchFromGitlab();
			}
		});
	}

	private refreshIssuesAtStartup() {
		this.registerInterval(window.setTimeout(() => {
			this.fetchFromGitlab();
		}, 5 * 1000)); // after 5 seconds
	}

	private scheduleAutomaticRefresh() {
		this.registerInterval(window.setInterval(() => {
			this.fetchFromGitlab();
		}, 15 * 60 * 1000)); // every 15 minutes
	}

	private createOutputFolder() {
		const fs = new Filesystem(app.vault, this.settings);
		fs.createOutputDirectory();
	}

	private fetchFromGitlab () {
		new Notice('Updating issues from Gitlab');
		const loader = new GitlabLoader(this.app, this.settings);
		loader.loadIssues();
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
