
export default class GitlabApi {

	static load<T>(url: string, gitlabToken: string): Promise<T> {

		const requestHeaders: HeadersInit = new Headers();
		requestHeaders.set('PRIVATE-TOKEN', gitlabToken);

		return fetch(url, {headers: requestHeaders})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}

				return response.json() as Promise<T>;
			});
	}
}
