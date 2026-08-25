@ats @optimization
Feature: ATS resume optimization
  As a candidate
  I want my resume optimized for a job description
  So that I can achieve an ATS score of at least 90

  Scenario: Resume is ATS-optimized for a matching job
    Given a registered candidate with a parsed resume
    And a job posting for "Senior Frontend Engineer" requiring "TypeScript, React, CSS"
    When the candidate optimizes the resume for the job
    Then the API returns status 200
    And the ATS score is at least 90
    And the ATS report lists the missing keywords

  Scenario: Resume with weak keyword coverage gets an improvement plan
    Given a registered candidate with a resume missing "Kubernetes, Terraform, AWS"
    And a job posting for "DevOps Engineer" requiring "Kubernetes, Terraform, AWS"
    When the candidate optimizes the resume for the job
    Then the API returns status 200
    And the ATS report contains suggestions to add missing keywords
