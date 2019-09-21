process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = config => {
  config.set({
    basePath: "",
    frameworks: ["karma-typescript", "mocha", "chai"],
    files: [
      { pattern: "../../node_modules/phaser/dist/phaser.js", include: true },
      { pattern: "./src/**/*.ts", include: true },
      { pattern: "./tests/*.test.ts", include: true },
    ],
    preprocessors: {
      "./src/**/*.ts": ["karma-typescript"],
      "./tests/*.test.ts": ["karma-typescript"],
    },
    plugins: ["karma-mocha-reporter", "karma-mocha", "karma-chai", "karma-chrome-launcher", "karma-typescript"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
  });
};
