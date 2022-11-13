import { Issue } from './issue';
import { TAbstractFile, TFolder, Vault } from 'obsidian';
import { GitlabIssuesSettings } from './settings';
import log from './logger';
import { compile } from 'handlebars';
import defaultTemplate from './default-template';

export default class Filesystem {

	private vault: Vault;

	private settings: GitlabIssuesSettings;

	constructor(vault: Vault, settings: GitlabIssuesSettings) {
		this.vault = vault;
		this.settings = settings;
	}

	public createOutputDirectory() {
		this.vault.createFolder(this.settings.outputDir)
			.catch((error) => {
				if(error.message !== 'Folder already exists.') {
					log('Could not create output directory');
				}
			})
		;
	}

	public purgeExistingIssues() {
		const root = this.vault.getAbstractFileByPath('/');
		const gitlabIssueDir: TAbstractFile | null = root && root.vault.getAbstractFileByPath(this.settings.outputDir);

		if(gitlabIssueDir instanceof TFolder) {
			this.vault.delete(gitlabIssueDir, true)
				.catch(error => log(error.message));
		}
	}

	public processIssues(issues: Array<Issue>) {
		this.vault.adapter.read(this.settings.templateFile)
			.then((rawTemplate: string) => {
				issues.forEach(
					(issue: Issue) => this.writeFile(issue, compile(rawTemplate))
				);
			})
			.catch((error) => {
				issues.forEach(
					(issue: Issue) => this.writeFile(issue, compile(defaultTemplate.toString()))
				);
			})
		;
	}

	private writeFile(issue: Issue, template: HandlebarsTemplateDelegate) {
		this.vault.createFolder(this.folderName(issue))
			.then(() => this.vault.create(this.fileName(issue), template(issue)))
			.catch((error) => log(error.message));
	}

	private folderName(issue: Issue): string {
		return this.settings.outputDir + '/' + issue.project.name;
	}

	private fileName(issue: Issue): string {
		return this.settings.outputDir + '/' + issue.project.name + '/' + issue.title + '.md';
	}
}
