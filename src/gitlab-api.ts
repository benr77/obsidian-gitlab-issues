import {requestUrl, RequestUrlParam, RequestUrlResponse} from 'obsidian';

export default class GitlabApi {

	static load<T>(url: string, gitlabToken: string): Promise<T> {

		const headers = { 'PRIVATE-TOKEN': gitlabToken };

		const params: RequestUrlParam = { url: url, headers: headers };

		return requestUrl(params)
			.then((response: RequestUrlResponse) => {
				if (response.status !== 200) {
					throw new Error(response.text);
				}

				return response.json as Promise<T>;
			});
	}
}
