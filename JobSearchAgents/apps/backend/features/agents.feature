@agents @reporting @career
Feature: Specialized agents
  As a candidate
  I want specialized agents for reporting, interview prep, skill gaps, and fraud detection
  So that I can track progress and avoid bad opportunities

  Scenario: Reporting agent generates a daily report
    Given a registered candidate with an application
    When the candidate generates a daily report
    Then the API returns status 201
    And the report summarizes at least 1 application

  Scenario: Reporting agent delivers the report via email
    Given a registered candidate with an application
    When the candidate requests a report via "email"
    Then the API returns status 201
    And the report is marked as delivered via "email"

  Scenario: Interview prep agent generates at least 10 questions
    Given a registered candidate with a parsed resume
    And a stored job posting for "Backend Engineer"
    When the candidate runs the "interview-prep" agent
    Then the API returns status 200
    And the agent response contains at least 10 interview questions

  Scenario: Skill gap analyzer highlights missing skills
    Given a registered candidate with a parsed resume
    And a stored job posting for "Machine Learning Engineer"
    When the candidate runs the "skill-gap" agent
    Then the API returns status 200
    And the agent response contains missing skills

  Scenario: Fraud detection flags suspicious postings
    Given a registered candidate
    And a stored job posting that is fraudulent
    When the candidate runs the "fraud-detection" agent on the job
    Then the API returns status 200
    And the fraud verdict is "fraudulent"

  Scenario: Career coach provides advice and salary benchmark
    Given a registered candidate with a parsed resume
    When the candidate runs the "career-coach" agent
    Then the API returns status 200
    And the agent response contains salary benchmark

  Scenario: Cover letter agent generates a tailored cover letter
    Given a registered candidate with a parsed resume
    And a stored job posting for "QA Automation Engineer"
    When the candidate runs the "cover-letter" agent
    Then the API returns status 200
    And the agent response contains a cover letter mentioning the job title

  Scenario: Full pipeline runs all steps end to end
    Given a registered candidate with a parsed resume
    And a stored job posting for "Full-Stack Developer"
    When the candidate runs the full agent pipeline
    Then the API returns status 200
    And the pipeline reports at least 4 successful agents

  Scenario: Agent run history is recorded
    Given a registered candidate with a parsed resume
    When the candidate runs the "resume-parser" agent
    Then the API returns status 200
    And the agent run history contains the "resume-parser" agent
