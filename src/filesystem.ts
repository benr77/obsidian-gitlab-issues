import {Issue} from "./issue";
import {DataAdapter, ListedFiles} from "obsidian";
import {GitlabIssuesSettings} from "./settings";
import {compile} from 'handlebars';

export default class Filesystem {

	private fs: DataAdapter;
	private settings: GitlabIssuesSettings;

	constructor(fs: DataAdapter, settings: GitlabIssuesSettings) {
		this.fs = fs;
		this.settings = settings;
	}

	public createOutputDirectory() {
		this.fs.exists(this.settings.outputDir)
			.then((dirExists: boolean) => {
				if (!dirExists) {
					this.fs.mkdir(this.settings.outputDir)
						.catch(() => console.log('Could not create output directory'));
				}
			});
	}

	public purgeExistingIssues() {
		this.fs.list(this.settings.outputDir)
			.then(
				(fileList: ListedFiles) => fileList.files.map(
					(file: string) => this.fs.remove(file)
				)
			)
			.catch(
				(error) => console.log(error.message)
			);
	}

	public processIssues(issues: Array<Issue>)
	{
		this.fs.read(this.templateLocation())
			.then((rawTemplate: string) => {
				const template = compile(rawTemplate);
				issues.map(
					(issue: Issue) => this.writeFile(issue, template)
				);
			})
			.catch((error) => console.log(error.message));
	}

	private writeFile(issue: Issue, template: HandlebarsTemplateDelegate)
	{
		this.fs.write(this.fileName(issue), template(issue))
			.catch((error) => console.log(error.message))
		;
	}

	private templateLocation(): string
	{
		const defaultTemplate = '/.obsidian/plugins/obsidian-gitlab-issues/src/default-template.md.hb';

		if (this.settings.templateFile.length) {
			return this.settings.templateFile;
		}

		return defaultTemplate;
	}

	private fileName(issue: Issue): string
	{
		return this.settings.outputDir + issue.title + '.md';
	}
}
