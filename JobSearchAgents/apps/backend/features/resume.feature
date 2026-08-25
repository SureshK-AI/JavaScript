@resume @parsing
Feature: Resume upload and parsing
  As a candidate
  I want to upload my resume and have it parsed into structured data
  So that the system can tailor it to jobs and track my profile

  Scenario: Candidate uploads a TXT resume and it is parsed
    Given a registered candidate
    And a text resume with skills "TypeScript, React, Node.js, Playwright" and email "dev@example.com"
    When the candidate uploads the resume as "resume.txt"
    Then the API returns status 201
    And the parsed resume contains the skill "typescript"
    And the parsed resume contains the skill "react"
    And the parsed resume contains the email "dev@example.com"
    And the resume parse completed in under 5 seconds

  Scenario: Candidate uploads a DOCX resume and it is parsed
    Given a registered candidate
    And a docx resume with skills "Python, Docker, Kubernetes"
    When the candidate uploads the resume as "resume.docx"
    Then the API returns status 201
    And the parsed resume contains the skill "python"

  Scenario: Candidate uploads a PDF resume and it is parsed
    Given a registered candidate
    And a pdf resume with skills "Java, Spring"
    When the candidate uploads the resume as "resume.pdf"
    Then the API returns status 201
    And the parsed resume contains the skill "java"

  Scenario: Unsupported file format is rejected
    Given a registered candidate
    And a binary file with invalid extension
    When the candidate uploads the resume as "resume.exe"
    Then the API returns status 415

  Scenario: Candidate lists their uploaded resumes
    Given a registered candidate with an uploaded resume
    When the candidate lists their resumes
    Then the API returns status 200
    And the response contains at least 1 resume
