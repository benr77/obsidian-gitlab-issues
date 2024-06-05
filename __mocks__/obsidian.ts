
export interface RequestUrlParam {
	/** @public */
	url: string;
	/** @public */
	method?: string;
	/** @public */
	contentType?: string;
	/** @public */
	body?: string | ArrayBuffer;
	/** @public */
	headers?: Record<string, string>;
	/**
	 * Whether to throw an error when the status code is >= 400
	 * Defaults to true
	 * @public
	 */
	throw?: boolean;
}

/** @public */
export interface RequestUrlResponse {
	/** @public */
	status: number;
	/** @public */
	headers: Record<string, string>;
	/** @public */
	arrayBuffer: ArrayBuffer;
	/** @public */
	json: any;
	/** @public */
	text: string;
}
export function requestUrl(): Promise<RequestUrlResponse>{
	return Promise.resolve({json: "mockJson", text: '', status: 200} as RequestUrlResponse)
}
export class App {
	keymap: any;
	scope: any;
	workspace: any;
	vault: any;
	metadataCache: any;
	fileManager: any;
	lastEvent: any | null;
	constructor() {
	}
}
