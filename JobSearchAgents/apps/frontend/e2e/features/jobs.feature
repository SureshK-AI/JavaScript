@jobs @search @apply
Feature: Job search and application
  As a candidate
  I want to search jobs and apply
  So that I can track my applications

  Scenario: Candidate searches jobs and sees results
    Given I am logged in with an uploaded resume
    When I search for "software engineer" jobs
    Then I see job cards from multiple portals

  Scenario: Candidate matches a job against the resume
    Given I am logged in with an uploaded resume
    And I search for "software engineer" jobs
    When I click Match on the first job
    Then I see a match score result

  Scenario: Candidate applies to a job
    Given I am logged in with an uploaded resume
    And I search for "software engineer" jobs
    When I click Apply on the first job
    Then I see an application result for the job

  Scenario: Candidate sees their applications in history
    Given I am logged in with an application
    When I open the applications page
    Then I see at least 1 application row
