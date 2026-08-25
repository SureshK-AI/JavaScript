@reports @agents
Feature: Reports and agents
  As a candidate
  I want to generate daily reports and run agents
  So that I can track progress

  Scenario: Candidate generates a daily report
    Given I am logged in
    When I open the reports page and generate a daily report
    Then I see the report summary

  Scenario: Candidate runs the full agent pipeline
    Given I am logged in
    When I open the agents page and run the pipeline
    Then I see the pipeline success count
