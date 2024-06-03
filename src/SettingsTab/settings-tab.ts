import {App, normalizePath, PluginSettingTab, Setting} from "obsidian";
import GitlabIssuesPlugin from "../main";
import {settings} from "./settings";
import {GitlabIssuesLevel, GitlabRefreshInterval} from "./settings-types";


export class GitlabIssuesSettingTab extends PluginSettingTab {
	plugin: GitlabIssuesPlugin;

	constructor(app: App, plugin: GitlabIssuesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		const {settingInputs, dropdowns, checkBoxInputs, gitlabDocumentation, getGitlabIssuesLevel, title} = settings

		containerEl.empty();
		containerEl.createEl('h2', {text: title});

		settingInputs.forEach((setting) => {
			const handleSetValue = () => {
				if (setting.modifier === 'normalizePath') {
					return normalizePath(this.plugin.settings[setting.value])
				}
				return this.plugin.settings[setting.value]
			};

			new Setting(containerEl)
				.setName(setting.title)
				.setDesc(setting.description)
				.addText(text => text
					.setPlaceholder(setting.placeholder ?? "")
					.setValue(handleSetValue())
					.onChange(async (value) => {
						if (setting.modifier === "normalizePath") {
							this.plugin.settings[setting.value] = normalizePath(value);
						} else {
							this.plugin.settings[setting.value] = value;
						}
						await this.plugin.saveSettings();
					}));
		});

		dropdowns.forEach((dropwdown) => {
			const currentValue = dropwdown.value;

			new Setting(containerEl)
				.setName(dropwdown.title)
				.setDesc(dropwdown.description)
				.addDropdown(value => value
					.addOptions(dropwdown.options)
					.setValue(this.plugin.settings[currentValue])
					.onChange(async (value) => {
						if (currentValue === 'gitlabIssuesLevel') {
							this.plugin.settings[currentValue] = value as GitlabIssuesLevel;
						} else {
							this.plugin.settings[currentValue] = value as GitlabRefreshInterval;
							this.plugin.scheduleAutomaticRefresh();
						}
						await this.plugin.saveSettings();
						this.display();
					}));
		});

		if (this.plugin.settings.gitlabIssuesLevel !== "personal") {
			const gitlabIssuesLevelIdObject = getGitlabIssuesLevel(this.plugin.settings.gitlabIssuesLevel);
			const descriptionDocumentFragment = document.createDocumentFragment();
			const descriptionLinkElement = descriptionDocumentFragment.createEl('a', {
				href: gitlabIssuesLevelIdObject.url,
				text: `Find your ${gitlabIssuesLevelIdObject.title} Id.`,
				title: `Goto ${gitlabIssuesLevelIdObject.url}`
			});
			descriptionDocumentFragment.appendChild(descriptionLinkElement);

			new Setting(containerEl)
				.setName(`Set Gitlab ${gitlabIssuesLevelIdObject.title} Id`)
				.setDesc(descriptionDocumentFragment)
				.addText(value => value
					.setValue(this.plugin.settings.gitlabAppId)
					.onChange(async (value: string) => {
						this.plugin.settings.gitlabAppId = value;
						await this.plugin.saveSettings();
					}));
		}
		checkBoxInputs.forEach(checkboxSetting => {
			new Setting(containerEl)
				.setName(checkboxSetting.title)
				.addToggle(value => value
					.setValue(this.plugin.settings[checkboxSetting.value])
					.onChange(async (value) => {
						this.plugin.settings[checkboxSetting.value] = value;
						await this.plugin.saveSettings();
					}));
		});

		containerEl.createEl('h3', {text: 'More Information'});
		containerEl.createEl('a', {
			text: gitlabDocumentation.title,
			href: gitlabDocumentation.url
		});
	}
}
