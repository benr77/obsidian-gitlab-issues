import {Notice, Plugin, addIcon} from 'obsidian';
import {DEFAULT_SETTINGS, GitlabIssuesSettings, GitlabIssuesSettingTab} from './settings';
import log from "./logger";
import Filesystem from "./filesystem";
import GitlabLoader from "./gitlab-loader";
import gitlabIcon from './assets/gitlab-icon.svg';

export default class GitlabIssuesPlugin extends Plugin {
	settings: GitlabIssuesSettings;
	startupTimeout: number|null = null;
	automaticRefresh: number|null = null;
	iconAdded = false;

	async onload() {
		log('Starting plugin');

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
			// Ensure we did not already add an icon
			if (!this.iconAdded)
			{
				addIcon("gitlab", gitlabIcon);
				this.addRibbonIcon('gitlab', 'Gitlab Issues', (evt: MouseEvent) => {
					this.fetchFromGitlab();
				});
				this.iconAdded = true;
			}
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
		// Clear existing startup timeout
		if (this.startupTimeout) {
			window.clearTimeout(this.startupTimeout);
		}
		this.startupTimeout = this.registerInterval(window.setTimeout(() => {
			this.fetchFromGitlab();
		}, 30 * 1000)); // after 30 seconds
	}

	private scheduleAutomaticRefresh() {
		if (this.automaticRefresh) {
			window.clearInterval(this.automaticRefresh);
		}
		this.automaticRefresh = this.registerInterval(window.setInterval(() => {
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
