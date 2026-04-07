import uglify from "@gesslar/uglier"

export default [
  ...uglify({
    with: [
      "lints-js", // default files: ["**/*.{js,mjs,cjs}"]
      "lints-jsdoc", // default files: ["**/*.{js,mjs,cjs}"]
      "node", // default files: ["**/*.{js,mjs,cjs}"]
      "vscode-extension", // default files: ["src/**/*.{js,mjs,cjs}"]
    ],
  })
]
