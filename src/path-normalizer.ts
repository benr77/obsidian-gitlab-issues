
export default class PathNormalizer {
	static normalize(path: string): string {

		if (path.charAt(0) != '/') {
			path = '/' + path;
		}

		if (path.charAt(path.length - 1) != '/') {
			path = path + '/';
		}

		return path;
	}
}
