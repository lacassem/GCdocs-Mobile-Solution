Feature: Favorites and recent documents
  In order to view documents that get used a lot
  As a user
  I want to be able to add/remove favorites and view recently accesed documents

  Scenario: Open the browse page
    Given the user is logged into GCdocs
    When  I open the url "$PARENT_TEST_FOLDER" with device "iPhone X"

  Scenario: Add a new item
    When  I wait for 2 second
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:first-child a" and wait for the element "#AddVersion"
    And   I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-add-folder.png"
    And   I set the element "#name" value to "Automated test item"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page   

  Scenario: Add item to favorites
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='add-favorite']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='add-favorite']" and wait for the element ".doc-list"

  Scenario: Favorite page
    When  I wait for 2 seconds  
    And   I click the element "header .menu"
    Then  I expect the element "#main-menu" is visible after "30" seconds 
    And   I wait for 1 seconds    
    And   I click the link "#main-menu [data-action='my-favorites']" and wait for the element "[data-doc='Myfavorites']"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page 
    And   I expect the screenshot of "behaviour-my-favorites" matches the web page
    And   I expect the "my-favorites" page has no accessibility errors    

  Scenario: Remove favorite item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='remove-favorite']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='remove-favorite']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is not on the page     

  Scenario: Recent documents page
    When  I click the element "header .menu"
    Then  I expect the element "#main-menu" is visible after "30" seconds
    And   I wait for 1 seconds
    And   I click the link "#main-menu [data-action='recent-documents']" and wait for the element "[data-doc='Myrecentdocuments']"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page 
    And   I wait for 2 seconds
    And   I expect the "recent-documents" page has no accessibility errors 

  Scenario: Delete the automated test item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    And   I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is not on the page
