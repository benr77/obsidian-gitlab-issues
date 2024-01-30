import {requestUrl, RequestUrlParam, RequestUrlResponse} from 'obsidian';

export default class GitlabApi {

	static load<T>(url: string, gitlabToken: string, page?: string): Promise<T> {

		const headers = { 'PRIVATE-TOKEN': gitlabToken };
        let req_url: string;

        if (!!page) {
            req_url = `${url}&page=${page}`;
        } else {
            req_url = url;
        }
        
		const params: RequestUrlParam = { url: req_url, headers: headers };
        
		return requestUrl(params)
			.then((response: RequestUrlResponse) => {
				if (response.status !== 200) {
					throw new Error(response.text);
				}

                if ("x-next-page" in response.headers && response.headers["x-next-page"] != "") {
                    return GitlabApi.load(url, gitlabToken, response.headers["x-next-page"]).then((j) => {
				        return response.json.concat(j) as Promise<T>;
                    }) as Promise<T>;
                } else {
                    return response.json as Promise<T>;
                }
            });
	}
}
