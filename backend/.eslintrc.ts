// .eslintrc.js
module.exports = {
  extends: [
    // Your other ESLint configurations (e.g., airbnb-base, recommended)
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // If using TypeScript
    "prettier", // Make sure this is the LAST extension
  ],
  plugins: [
    "prettier",
    // Your other plugins
  ],
  rules: {
    "prettier/prettier": "error", // Report Prettier errors as ESLint errors
    // Your other ESLint rules
  },
};
