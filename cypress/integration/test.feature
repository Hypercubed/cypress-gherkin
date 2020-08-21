Feature: My First Test
  Background:
    Given the background

  Rule: A rule
    Scenario: Navigates on click
      Given a user visits "https://example.cypress.io"
      When they click the link labeled "type"
      Then the URL should include '/commands/actions'

    Scenario: Types and asserts
      Given a user visits "https://example.cypress.io/commands/actions"
      When they type "fake@email.com" into the ".action-email" input
      Then the '.action-email' input has "fake@email.com" as its value