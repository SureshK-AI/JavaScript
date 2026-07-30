/* Response Time SLA Analyzer
As a performance tester, you collect API response times in milliseconds. Write a JavaScript program using a while loop that analyzes an array of response times and prints a performance report with min, max, average, and how many responses breached the SLA threshold (> 500ms). Use comparison operators for min/max tracking.

Input Format
An array of response times in milliseconds and SLA_LIMIT = 500

Output Format
Performance report with min, max, avg, SLA breach count and percentage

Examples
Input
responseTimes = [120, 230, 450, 510, 180, 620], SLA_LIMIT = 500
Output
Total Requests: 6 Min Response: 120ms Max Response: 620ms SLA Breaches: 2 (33.33%) Overall Status: ❌ SLA VIOLATED */