
Feature: My First Test
  This is a comment on the feature
  Could be multiple lines

  Background:
    Can also have comments

    Given a user visits "https://example.cypress.io"

  @focus @regression @important @sanity
  Scenario: Navigates on click
    When they click the link labeled "type"
    Then the URL should include '/commands/actions'

  @optional
  Scenario: Types and asserts
    Comments here too
    
    Given a user visits "https://example.cypress.io/commands/actions"
    When they type "fake@email.com" into the ".action-email" input
    Then the '.action-email' input has "fake@email.com" as its value