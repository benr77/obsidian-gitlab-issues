export type GitlabIssuesLevel = 'personal' | 'project' | 'group';
export type GitlabRefreshInterval = "15" | "30" | "45" |"60" | "120" | "off";

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
	refreshOnStartup: boolean;
	intervalOfRefresh: GitlabRefreshInterval;
	gitlabApiUrl(): string;
}

export interface SettingOutLink {
	url: string;
	title: string;
}
export interface Setting {
	title: string,
	description: string,
	placeholder?: string;
}
export interface SettingInput extends Setting {
	value: keyof Pick<GitlabIssuesSettings, "filter" | "gitlabUrl" | "gitlabToken" | "outputDir" | "templateFile">,
	modifier?: string
}
export interface DropdownInputs extends Setting {
	value: keyof Pick<GitlabIssuesSettings, "gitlabIssuesLevel" | "intervalOfRefresh">
	options: Record<string, string>
}
export interface SettingCheckboxInput extends Omit<Setting, "description"> {
	value: keyof Pick<GitlabIssuesSettings, "refreshOnStartup"| "purgeIssues"| 'showIcon'>
}

export interface SettingsTab {
	title: string,
	settingInputs: SettingInput[],
	dropdowns: DropdownInputs[]
	checkBoxInputs: SettingCheckboxInput[],
	getGitlabIssuesLevel: (currentLevel: Omit<GitlabIssuesLevel, "personal">) => SettingOutLink;
	gitlabDocumentation: SettingOutLink
}
