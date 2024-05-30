import {sanitizeFileName} from './util';
import {Assignee, Epic, Issue, ObsidianIssue, References, ShortIssue, TimeStats} from "./types";

export class GitlabIssue implements ObsidianIssue {

	id: number;
	title: string;
	description: string;
	due_date: string;
	web_url: string;
	references: string | References;

	get filename() {
		return sanitizeFileName(this.title);
	}

	constructor(issue: Issue) {
		Object.assign(this, issue);
	}

	_links: {
		self: string;
		notes: string;
		award_emoji: string;
		project: string;
		closed_as_duplicate_of: string
	};
	assignees: Assignee[];
	author: Assignee;
	closed_by: Assignee;
	confidential: boolean;
	created_at: string;
	discussion_locked: boolean;
	downvotes: number;
	epic: Epic;
	has_tasks: boolean;
	iid: number;
	imported: boolean;
	imported_from: string;
	issue_type: string;
	labels: string[];
	merge_requests_count: number;
	milestone: ShortIssue;
	project_id: number;
	severity: string;
	state: string;
	task_completion_status: { count: number; completed_count: number };
	task_status: string;
	time_stats: TimeStats;
	updated_at: string;
	upvotes: number;
	user_notes_count: number;
}
