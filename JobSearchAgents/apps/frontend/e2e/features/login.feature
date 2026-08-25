@login @candidate
Feature: Candidate login
  As a candidate
  I want to log in to the portal
  So that I can access my dashboard

  Scenario: Candidate can register and is taken to the dashboard
    Given I am on the login page
    When I register with name "E2E Candidate", email "e2e-register@example.com", and password "password123"
    Then I see the dashboard with the heading "Dashboard"

  Scenario: Candidate can log in with existing credentials
    Given a candidate with email "e2e-login@example.com" and password "password123" exists
    When I log in with email "e2e-login@example.com" and password "password123"
    Then I see the dashboard with the heading "Dashboard"

  Scenario: Candidate can log in via the OAuth demo provider
    Given I am on the login page
    When I log in with the OAuth provider "linkedin"
    Then I see the dashboard with the heading "Dashboard"
