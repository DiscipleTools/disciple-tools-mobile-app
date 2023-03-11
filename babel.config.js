module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      [
        "@babel/preset-react",
        {
          importSource: "@welldone-software/why-did-you-render",
          runtime: "automatic",
          development: process.env.NODE_ENV === "development" || false,
        },
      ],
    ],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            tests: ["./tests/"],
            "@components": "./components",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: true,
          allowUndefined: true,
        },
      ],
    ],
  };
};
