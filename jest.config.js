// eslint-disable-next-line
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "./",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts"],
    setupFiles: ["./scripts/traced.js"],
    modulePathIgnorePatterns: [
        "<rootDir>/build",
    ],
    verbose: true,
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.jest.json",
            compiler: "ttypescript"
        }
    }
}
