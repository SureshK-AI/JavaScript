@candidate @authentication
Feature: Candidate onboarding and authentication
  As a candidate
  I want to register, log in, and authenticate with OAuth
  So that I can use the job search platform securely

  Scenario: Candidate registers with a valid email and password
    Given a candidate registers with email "alice@example.com", password "password123", and name "Alice"
    Then the API returns status 201
    And the response contains a JWT token
    And the response contains the candidate profile with email "alice@example.com"

  Scenario: Candidate cannot register with a duplicate email
    Given a candidate with email "bob@example.com" already exists
    When the candidate registers with email "bob@example.com", password "password123", and name "Bob"
    Then the API returns status 409

  Scenario: Candidate logs in with valid credentials
    Given a candidate with email "carol@example.com" and password "password123" exists
    When the candidate logs in with email "carol@example.com" and password "password123"
    Then the API returns status 200
    And the response contains a JWT token

  Scenario: Candidate login fails with a wrong password
    Given a candidate with email "carol@example.com" and password "password123" exists
    When the candidate logs in with email "carol@example.com" and password "wrong-password"
    Then the API returns status 401

  Scenario: Candidate can authenticate with the OAuth demo provider
    When the candidate authenticates with OAuth provider "linkedin"
    Then the API returns status 200
    And the response contains a JWT token
    And the response identifies the provider as "linkedin"
