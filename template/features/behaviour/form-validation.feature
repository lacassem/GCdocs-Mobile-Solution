Feature: Form validation
  In order to help with data integrity
  As a developer
  I want to provide useable and accessible form validation

  Scenario: Add item validation
    Given the user is logged into GCdocs
    When  I open the url "$PARENT_TEST_FOLDER" with device "iPhone X"
    And   I wait for 2 seconds
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:first-child a" and wait for the element "#AddVersion"
    And   I wait for 2 seconds
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".error-messages"
    Then  I expect the screenshot of "behaviour-add-item-validation" matches the web page
    And   I expect the "add-item-validation" page has no accessibility errors

  Scenario: Click error message for file to focus field in error
    Given the element "#versionFile" has no focus
    When  I click the link ".error-messages li:first-child a"
    Then  I expect the element "#versionFile" has focus

  Scenario: Click error message for name to focus field in error
    Given the element "#name" has no focus
    When  I click the link ".error-messages li:last-child a"
    Then  I expect the element "#name" has focus

  Scenario: Fix errors and add item
    When  I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-add-item.png"
    And   I set the element "#name" value to "Automated test item"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page

  Scenario: Attempt to add duplicate item
    When  I wait for 2 seconds
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:first-child a" and wait for the element "#AddVersion"
    And   I wait for 2 seconds
    And   I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-add-item.png"
    And   I set the element "#name" value to "Automated test item"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".error-messages"
    Then  I expect the screenshot of "behaviour-add-item-validation-duplicate" matches the web page

  Scenario: Delete the test item
    When  I click the link ".breadcrumbs a" and wait for the element ".doc-list"
    And   I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    And   I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is not on the page      



     
