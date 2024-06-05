/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "tests/.*\\.(js|jsx|ts)$",
	moduleNameMapper: {
		'^obsidian$': '<rootDir>/__mocks__/obsidian',
	},
};
