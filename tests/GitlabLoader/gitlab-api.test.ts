import {RequestUrlParam, RequestUrlResponse} from 'obsidian';
import * as ObsidianMock from 'obsidian';
import GitlabApi from "../../src/GitlabLoader/gitlab-api";

const mockRequestUrl = jest.spyOn(ObsidianMock, 'requestUrl');

describe('GitlabApi', () => {
	const mockUrl = 'https://gitlab.com/api/v4/issues';
	const mockToken = 'mock-token';
	const mockParams: RequestUrlParam = {
		url: mockUrl,
		headers: { 'PRIVATE-TOKEN': mockToken },
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should load data successfully', async () => {
		const mockData = [{ id: 1, title: 'Test Issue' }];
		const mockResponse= {
			status: 200,
			json: Promise.resolve(mockData),
			text: 'Success',
		};

		mockRequestUrl.mockResolvedValue(mockResponse as RequestUrlResponse);

		const result = await GitlabApi.load<typeof mockData>(mockUrl, mockToken);
		expect(mockRequestUrl).toHaveBeenCalledWith(mockParams);
		expect(result).toEqual(mockData);
	});

	it('should throw an error for non-200 response', async () => {
		const mockResponse = {
			status: 404,
			json: Promise.resolve(null),
			text: 'Not Found',
		};

		mockRequestUrl.mockResolvedValue(mockResponse as RequestUrlResponse);

		await expect(GitlabApi.load(mockUrl, mockToken)).rejects.toThrow('Not Found');
		expect(mockRequestUrl).toHaveBeenCalledWith(mockParams);
	});
});
