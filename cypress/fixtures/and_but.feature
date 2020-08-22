Feature: My First Test
Scenario: Navigates on click
  Given a user visits "https://example.cypress.io"
    And something
  When they click the link labeled "type"
  Then the URL should include '/commands/actions'
    But something else