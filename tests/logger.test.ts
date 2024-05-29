import logMessage from '../src/logger';

describe('logger', () => {
	it('should log the message with the correct prefix', () => {
		const message = 'This is a test message';
		const expectedOutput = 'Gitlab Issues: This is a test message';
		const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

		logMessage(message);

		expect(consoleLogSpy).toHaveBeenCalledWith(expectedOutput);
		consoleLogSpy.mockRestore();
	});
});
