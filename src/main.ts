import {addIcon, Notice, Plugin} from 'obsidian';
import Filesystem from "./filesystem";
import GitlabLoader from "./GitlabLoader/gitlab-loader";
import gitlabIcon from './assets/gitlab-icon.svg';
import {GitlabIssuesSettingTab} from "./SettingsTab/settings-tab";
import {GitlabIssuesSettings} from "./SettingsTab/settings-types";
import {DEFAULT_SETTINGS} from "./SettingsTab/settings";
import {logger} from "./utils/utils";

export default class GitlabIssuesPlugin extends Plugin {
	settings: GitlabIssuesSettings;
	startupTimeout: number | null = null;
	automaticRefresh: number | null = null;
	iconAdded = false;

	async onload() {
		logger('Starting plugin');

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

	scheduleAutomaticRefresh() {
		if (this.automaticRefresh) {
			window.clearInterval(this.automaticRefresh);
		}
		if (this.settings.intervalOfRefresh !== "off") {
			const intervalMinutes = parseInt(this.settings.intervalOfRefresh);

			this.automaticRefresh = this.registerInterval(window.setInterval(() => {
				this.fetchFromGitlab();
			}, intervalMinutes * 60 * 1000)); // every settings interval in minutes
		}
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private addIconToLeftRibbon() {
		if (this.settings.showIcon) {
			// Ensure we did not already add an icon
			if (!this.iconAdded) {
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
		if(this.settings.refreshOnStartup) {
			this.startupTimeout = this.registerInterval(window.setTimeout(() => {
				this.fetchFromGitlab();
			}, 30 * 1000)); // after 30 seconds
		}
	}

	private createOutputFolder() {
		const fs = new Filesystem(app.vault, this.settings);
		fs.createOutputDirectory();
	}

	private fetchFromGitlab() {
		new Notice('Updating issues from Gitlab');
		const loader = new GitlabLoader(this.app, this.settings);
		loader.loadIssues();
	}
}
