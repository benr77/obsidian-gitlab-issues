import {GitlabIssuesSettings} from "../../src/SettingsTab/settings-types";
import {DEFAULT_SETTINGS, settings} from "../../src/SettingsTab/settings";

describe('DEFAULT_SETTINGS', () => {
	it('should have the correct default values', () => {
		const expectedDefaults: Omit<GitlabIssuesSettings, 'gitlabApiUrl'> = {
			gitlabUrl: 'https://gitlab.com',
			gitlabToken: '',
			gitlabIssuesLevel: 'personal',
			gitlabAppId: '',
			templateFile: '',
			outputDir: '/Gitlab Issues/',
			filter: 'due_date=month',
			showIcon: false,
			purgeIssues: true,
			refreshOnStartup: true,
			intervalOfRefresh: '15',
		};

		expect(DEFAULT_SETTINGS).toEqual({...expectedDefaults, gitlabApiUrl: expect.any(Function)});
	});

	it('gitlabApiUrl should return correct API URL', () => {
		expect(DEFAULT_SETTINGS.gitlabApiUrl()).toBe('https://gitlab.com/api/v4');
	});
});

describe('settings', () => {
	it('should have the correct title', () => {
		expect(settings.title).toBe('GitLab Issues Configuration');
	});

	it('should have the correct setting inputs', () => {
		const expectedSettingInputs = [
			{
				title: 'Gitlab instance URL',
				description: 'Use your own Gitlab instance instead of the public hosted Gitlab.',
				placeholder: 'https://gitlab.com',
				value: 'gitlabUrl',
			},
			{
				title: 'Personal Access Token',
				description: 'Create a personal access token in your Gitlab account and enter it here.',
				placeholder: 'Token',
				value: 'gitlabToken',
			},
			{
				title: 'Template File',
				description: 'Path to an Obsidian note to use as the template.',
				placeholder: 'your-template-file.md',
				value: 'templateFile',
			},
			{
				title: 'Output Folder',
				description: 'Path to an Obsidian folder to write output files to.',
				placeholder: 'Gitlab Issues',
				value: 'outputDir',
				modifier: 'normalizePath',
			},
			{
				title: 'Issues Filter',
				description: 'The query string used to filter the issues.',
				placeholder: 'due_date=month',
				value: 'filter',
			},
		];

		expect(settings.settingInputs).toEqual(expectedSettingInputs);
	});

	it('should have the correct dropdowns', () => {
		const expectedDropdowns = [
			{
				title: 'Refresh Rate',
				description: 'That rate at which gitlab issues will be pulled.',
				options: { off: 'off', '15': '15', '30': '30', '45': '45', '60': '60', '120': '120' },
				value: 'intervalOfRefresh',
			},
			{
				title: 'GitLab Scope',
				description: 'The scope at which the api request will pull.',
				options: { personal: 'Personal', project: 'Project', group: 'Group' },
				value: 'gitlabIssuesLevel',
			},
		];

		expect(settings.dropdowns).toEqual(expectedDropdowns);
	});

	it('should have the correct checkBoxInputs', () => {
		const expectedCheckBoxInputs = [
			{
				title: 'Purge issues that are no longer in Gitlab?',
				value: 'purgeIssues',
			},
			{
				title: 'Show refresh Gitlab issues icon in left ribbon?',
				value: 'showIcon',
			},
			{
				title: 'Should refresh Gitlab issues on Startup?',
				value: 'refreshOnStartup',
			},
		];

		expect(settings.checkBoxInputs).toEqual(expectedCheckBoxInputs);
	});

	it('should correctly return Gitlab Issues Level information', () => {
		expect(settings.getGitlabIssuesLevel('group')).toEqual({
			title: 'Group',
			url: 'https://docs.gitlab.com/ee/user/group/#get-the-group-id',
		});

		expect(settings.getGitlabIssuesLevel('project')).toEqual({
			title: 'Project',
			url: 'https://docs.gitlab.com/ee/user/project/working_with_projects.html#access-the-project-overview-page-by-using-the-project-id',
		});
	});

	it('should have the correct Gitlab documentation information', () => {
		expect(settings.gitlabDocumentation).toEqual({
			title: 'View the Gitlab documentation',
			url: 'https://docs.gitlab.com/ee/api/issues.html#list-issues',
		});
	});
});
