/* Test Environment Config
In CI/CD pipelines, tests run against different environments. Write a JavaScript program using a switch statement that takes an environment name stored in a variable and prints the base URL, API key pattern, and timeout. Use const for fixed values and let for the assembled config.

Environments: dev, staging, qa, production/prod. Each has different base URL, API key prefix, timeout, and description.

Input Format
A string variable containing the environment name (dev/staging/qa/prod)

Output Format
Environment configuration details: URL, API key, timeout, description

Examples
Input
envName = "staging"
Output
Environment: STAGING Base URL: https://staging-api.testingacademy.com API Key: stg_key_xxxx-xxxx Timeout: 8000ms Description: Staging - Pre-production mirror
 */