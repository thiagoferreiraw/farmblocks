const { format } = require("prettier");

const peerDependencies = {
  react: "^16.9.0",
  "prop-types": "^15.7.2",
  "styled-components": "^4.3.2",
};

const packageTemplate = ({
  shortName,
  description,
  keywords = ["farmblocks"],
}) =>
  format(
    `
{
  "name": "@crave/farmblocks-${shortName}",
  "version": "0.1.0",
  "description": "${description}",
  "author": "Crave Food Systems and AUTHORS",
  "license": "MIT",
  "main": "lib/index.js",
  "files": [
    "AUTHORS",
    "lib"
  ],
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "clean": "rm -rf lib",
    "build": "yarn clean && babel --root-mode upward src -d lib --ignore 'src/**/*.test.js','src/**/*.story.js'"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CraveFood/farmblocks.git"
  },
  "bugs": {
    "url": "https://github.com/CraveFood/farmblocks/issues"
  },
  "homepage": "https://github.com/CraveFood/farmblocks#readme",
  "keywords": ${JSON.stringify(keywords)},
  "peerDependencies": ${JSON.stringify(peerDependencies)},
  "dependencies": {}
}
`,
    { parser: "json" },
  );

module.exports = packageTemplate;
