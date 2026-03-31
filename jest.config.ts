export default {
	testEnvironment: 'jsdom',
	preset: 'ts-jest', // TypeScript 사용
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	moduleNameMapper: {
		'^.+\\.svg$': 'jest-svg-transformer',
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy',
		'@/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
