// <!-- API Response Status Code Validator
// As an SDET, you receive an API response status code and need to classify it. Write a JavaScript program using a switch statement that takes an HTTP status code stored in a variable and prints the category and a QA-friendly message.

// - 200 → "PASS - OK: Request successful"
// - 201 → "PASS - Created: Resource created successfully"
// - 301 → "WARNING - Moved Permanently: URL has changed"
// - 400 → "FAIL - Bad Request: Check request payload"
// - 401 → "FAIL - Unauthorized: Check auth token"
// - 403 → "FAIL - Forbidden: Insufficient permissions"
// - 404 → "FAIL - Not Found: Check endpoint URL"
// - 500 → "FAIL - Internal Server Error: Backend issue"
// - Any other → "UNKNOWN - Unhandled status code" -->


let responseCode = 200;

switch (responseCode) {
    case 200:
        console.log(`Res code is: ${responseCode}  PASS - OK: Request successful`);
        break;
    case 201:
        console.log("Res code is: " + responseCode + "PASS - Created: Resource created successfully");
        break;
      case 301:
        console.log("Res code is: " + responseCode + "WARNING - Moved Permanently: URL has changed");
        break;
      case 400:
        console.log("Res code is: " + responseCode + "FAIL - Bad Request: Check request payload");
        break;
      case 401:
        console.log("Res code is: " + responseCode + "FAIL - Unauthorized: Check auth token");
        break;
      case 403:
        console.log("Res code is: " + responseCode + "FAIL - Forbidden: Insufficient permissions");
        break;
      case 404:
        console.log("Res code is: " + responseCode + "FAIL - Not Found: Check endpoint URL");
        break;
       case 500:
        console.log("Res code is: " + responseCode + "FAIL - Internal Server Error: Backend issue");
        break;
    default:
        console.log("Res code is: " + responseCode + "UNKNOWN - Unhandled status code");
}