import {App, normalizePath, PluginSettingTab, Setting} from "obsidian";
import GitlabIssuesPlugin from "./main";

type GitlabIssuesLevel = 'personal' | 'project' | 'group'

export interface GitlabIssuesSettings {
	gitlabUrl: string;
	gitlabToken: string;
	gitlabIssuesLevel: GitlabIssuesLevel;
	gitlabAppId: string;
	templateFile: string;
	outputDir: string;
	filter: string;
	showIcon: boolean;
	purgeIssues: boolean;
	gitlabApiUrl(): string;
}

export const DEFAULT_SETTINGS: GitlabIssuesSettings = {
	gitlabUrl: 'https://gitlab.com',
	gitlabToken: '',
	gitlabIssuesLevel: 'personal',
	gitlabAppId: '',
	templateFile: '',
	outputDir: '/Gitlab Issues/',
	filter: 'due_date=month',
	showIcon: false,
	purgeIssues: true,
	gitlabApiUrl(): string {
		return `${this.gitlabUrl}/api/v4`;
	}
};

export class GitlabIssuesSettingTab extends PluginSettingTab {
	plugin: GitlabIssuesPlugin;

	constructor(app: App, plugin: GitlabIssuesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'GitLab Issues Configuration'});

		new Setting(containerEl)
			.setName('Gitlab instance URL')
			.setDesc('Use your own Gitlab instance instead of the public hosted Gitlab.')
			.addText(text => text
				.setPlaceholder('https://gitlab.com')
				.setValue(this.plugin.settings.gitlabUrl)
				.onChange(async (value) => {
					this.plugin.settings.gitlabUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Personal Access Token')
			.setDesc('Create a personal access token in your Gitlab account and enter it here.')
			.addText(text => text
				.setPlaceholder('Token')
				.setValue(this.plugin.settings.gitlabToken)
				.onChange(async (value) => {
					this.plugin.settings.gitlabToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Template File')
			.setDesc('Path to an Obsidian note to use as the template.')
			.addText(text => text
				.setPlaceholder('your-template-file.md')
				.setValue(this.plugin.settings.templateFile)
				.onChange(async (value) => {
					this.plugin.settings.templateFile = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Output Folder')
			.setDesc('Path to an Obsidian folder to write output files to.')
			.addText(text => text
				.setPlaceholder('/Gitlab Issues/')
				.setValue(normalizePath(this.plugin.settings.outputDir))
				.onChange(async (value) => {
					value = normalizePath(value);
					this.plugin.settings.outputDir = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Issues Filter')
			.setDesc('The query string used to filter the issues.')
			.addText(text => text
				.setPlaceholder('due_date=month')
				.setValue(this.plugin.settings.filter)
				.onChange(async (value) => {
					this.plugin.settings.filter = value;
					await this.plugin.saveSettings();
				}));


		new Setting(containerEl)
			.setName('GitLab Level')
			.addDropdown(value => value
				.addOptions({personal: "Personal", project: "Project", group: "Group"})
				.setValue(this.plugin.settings.gitlabIssuesLevel)
				.onChange(async (value: GitlabIssuesLevel) => {
					this.plugin.settings.gitlabIssuesLevel = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Set Gitlab Project/Group Id')
			.setDesc('If Group or Project is set, add the corresponding ID.')
			.addText(value => value
				.setValue(this.plugin.settings.gitlabAppId)
				.onChange(async (value: string) => {
					this.plugin.settings.gitlabAppId = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Purge issues that are no longer in Gitlab?')
			.addToggle(value => value
				.setValue(this.plugin.settings.purgeIssues)
				.onChange(async (value) => {
					this.plugin.settings.purgeIssues = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Show refresh Gitlab issues icon in left ribbon?')
			.addToggle(value => value
				.setValue(this.plugin.settings.showIcon)
				.onChange(async (value) => {
					this.plugin.settings.showIcon = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', {text: 'More Information'});
		containerEl.createEl('a', {
			text: 'View the Gitlab documentation',
			href: 'https://docs.gitlab.com/ee/api/issues.html#list-issues'
		});
	}
}
