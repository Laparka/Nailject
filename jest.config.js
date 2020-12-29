module.exports = {
    verbose: true,
    globals: {
        'ts-jest': {
            tsConfig: {
                allowJs: true
            }
        }
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.js$': 'ts-jest'
    },
    testMatch: [
        '**/__tests__/**/*.ts?(x)',
        '!**/__tests__/**/test-utils/*.ts?(x)',
        '**/?(*.)+(spec|test).ts?(x)'
    ],
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/$1',
        '^.+\\.(svg)$': '<rootDir>/__mocks__/file.js',
        '^.+\\.(css|scss)': '<rootDir>/__mocks__/style.js',
    }
};