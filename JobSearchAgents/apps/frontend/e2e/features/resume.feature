@resume @dashboard
Feature: Resume upload and dashboard
  As a candidate
  I want to upload my resume and see parsed data
  So that I can tailor it for jobs

  Scenario: Candidate uploads a text resume and sees the parsed skills
    Given I am logged in
    When I upload a text resume with skills "TypeScript, React, Node.js"
    Then I see a success message mentioning "skills"
    And I see a resume card with the filename

  Scenario: Dashboard shows uploaded resume count
    Given I am logged in
    And I upload a text resume with skills "Python, Docker"
    When I open the dashboard
    Then the resume stat shows at least 1
