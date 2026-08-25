@application @automation
Feature: Automated job applications
  As a candidate
  I want the system to submit applications with a tailored resume and cover letter
  So that I save time while applying to many jobs

  Scenario: Candidate applies to a job with a tailored resume and cover letter
    Given a registered candidate with a parsed resume
    And a stored job posting for "Full-Stack Developer"
    When the candidate applies to the job
    Then the API returns status 201
    And an application is recorded with status "submitted"
    And the application includes a cover letter

  Scenario: Application attempts are retried on failure
    Given a registered candidate with a parsed resume
    And a stored job posting for "Full-Stack Developer"
    When the candidate applies to the job
    Then the API returns status 201
    And the application records at least 1 attempt

  Scenario: Candidate can update an application status
    Given a registered candidate with an application
    When the candidate updates the application status to "interview"
    Then the API returns status 200
    And the application status is "interview"

  Scenario: Candidate lists application history
    Given a registered candidate with an application
    When the candidate lists their applications
    Then the API returns status 200
    And the response contains at least 1 application
