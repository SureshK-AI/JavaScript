@jobs @search @playwright
Feature: Job search across portals
  As a candidate
  I want the system to search jobs across multiple portals
  So that I can see relevant opportunities

  Scenario: Jobs are collected from all portals in demo mode
    Given a registered candidate
    When the candidate searches for "software engineer" jobs
    Then the API returns status 200
    And the response contains jobs from the "naukri" portal
    And the response contains jobs from the "linkedin" portal
    And the response contains jobs from the "indeed" portal
    And the response contains jobs from the "glassdoor" portal
    And the search completed in under 30 seconds

  Scenario: Jobs can be filtered by a single portal
    Given a registered candidate
    When the candidate searches for "devops" jobs on the "indeed" portal
    Then the API returns status 200
    And every job in the response is from the "indeed" portal

  Scenario: Stored jobs can be listed
    Given a registered candidate with stored jobs
    When the candidate lists jobs
    Then the API returns status 200
    And the response contains at least 1 job

  Scenario: A job can be matched against a resume
    Given a registered candidate with a parsed resume
    And a stored job posting for "Backend Engineer" requiring "Node.js, TypeScript, PostgreSQL"
    When the candidate matches the job against the resume
    Then the API returns status 200
    And the match score is at least 0.5
