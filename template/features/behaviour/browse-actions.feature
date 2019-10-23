Feature: Browse page actions
  In order to interact with documents on a mobile device
  As a user
  I want to be able to perform actions from the Browse screen

  Scenario: Open the browse page
    Given the user is logged into GCdocs
    When  I open the url "$PARENT_TEST_FOLDER" with device "iPhone X"

  Scenario: Add folder page
    When  I wait for 2 second
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:last-child a" and wait for the element "#AddVersion"
    Then  I expect the screenshot of "behaviour-add-folder" matches the web page
    And   I expect the "add-folder" page has no accessibility errors

  Scenario: Add a new folder
    When  I set the element "#name" value to "Automated test folder"
    And   I click the link "#AddVersion button[aria-controls='name-alt']" and wait for the element "#name-alt"
    And   I set the element "#name_fr_CA" value to "Dossier de test automatisé"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestfolder']" is on the page  

  Scenario: Check the english and french names of the folder
    Given the element "[data-doc='Automatedtestfolder'] .doc-name" contains text "Automated test folder"
    When  I wait for 2 seconds
    And   I click the link "#lang-swap" and wait for the element "#lang-swap[lang='en']"
    Then  I expect the element "[data-doc='Dossierdetestautomatis%E9'] .doc-name" contains text "Dossier de test automatisé" 

  Scenario: Change back to english
    Given the attribute "lang" from element "html" is "fr"
    When  I wait for 2 seconds
    And   I click the link "#lang-swap" and wait for the element "#lang-swap[lang='fr']"     

  Scenario: Rename page
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestfolder'] button"
    And   the element ".mdc-dialog [data-action='rename']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='rename']" and wait for the element "#RenameForm"
    Then  I expect the screenshot of "behaviour-rename" matches the web page
    And   I expect the "rename" page has no accessibility errors

  Scenario: Rename the folder
    When  I set the element "#docName" value to "Automated test folder renamed"
    And   I click the button "#RenameForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestfolderrenamed']" is on the page

  Scenario: Click into new folder
    When  I click the button "[data-doc='Automatedtestfolderrenamed'] a:first-child" and wait for the element "h1[data-doc='Automatedtestfolderrenamed']"  
    Then  I expect the screenshot of "behaviour-browse" matches the web page

  Scenario: Browse page add item page
    When  I wait for 2 second
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:first-child a" and wait for the element "#AddVersion"
    Then  I expect the screenshot of "behaviour-add-item" matches the web page
    And   I expect the "add-item" page has no accessibility errors

  Scenario: Add a new item
    When  I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-add-item.png"
    And   I set the element "#name" value to "Automated test item"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page

  Scenario: Add another new item
    When  I wait for 2 second
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    And   I click the link ".floating-action .actions li:first-child a" and wait for the element "#AddVersion"
    And   I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-add-folder.png"
    And   I set the element "#name" value to "Another test item"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Anothertestitem']" is on the page

  Scenario: Add new item version page
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Anothertestitem'] button"
    And   the element ".mdc-dialog [data-action='add-version']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='add-version']" and wait for the element "#AddVersion"
    Then  I expect the screenshot of "behaviour-add-version" matches the web page
    And   I expect the "add-version" page has no accessibility errors

  Scenario: Add new item version
    When  I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-reserve.png"
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Anothertestitem']" is on the page

  Scenario: Reserve item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Anothertestitem'] button"
    And   the element ".mdc-dialog [data-action='reserve']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='reserve']" and wait for the element "[name='ReservedByForm']"
    Then  I expect the screenshot of "behaviour-reserve" matches the web page
    And   I expect the "reserve" page has no accessibility errors

  Scenario: Reserve the item
    When  I click the button "[name='ReservedByForm'] input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Anothertestitem'] .mi-lock" is on the page

  Scenario: Unreserve item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Anothertestitem'] button"
    And   the element ".mdc-dialog [data-action='unreserve']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='unreserve']" and wait for the element "[name='ReservedByForm']"
    Then  I expect the screenshot of "behaviour-unreserve" matches the web page
    And   I expect the "unreserve" page has no accessibility errors

  Scenario: Unreserve the item
    When  I click the button "[name='ReservedByForm'] input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Anothertestitem'] .mi-lock" is not on the page    

  Scenario: Filter items
    When  I set the element "#filterValue" value to "Auto"
    And   I press the "Enter" key on the "#filterValue" element    
    Then  I expect the element ".filter-count" is visible after "30" seconds
    And   I expect the element "[data-doc='Automatedtestitem']" is on the page
    And   I expect the element "[data-doc='Anothertestitem']" is not on the page
    And   I expect the element ".filter-count" contains text "Filtering with Auto"

  Scenario: Clear the filter
    When  I click the link ".filter-count a" and wait for the element "#filterValue[value='']"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page
    And   I expect the element "[data-doc='Anothertestitem']" is on the page
    And   I expect the element ".filter-count" is not on the page

  Scenario: Email action
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"  
    Then  I expect the attribute "href" from element ".mdc-dialog [data-action='email']" contain "mailto:?body=Automated%20test%20item"
    And   I press the "Escape" key

  Scenario: Delete an item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    And   I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is not on the page

  Scenario: Delete another item
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Anothertestitem'] button"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    And   I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Anothertestitem']" is not on the page    

  Scenario: Delete confirmation page
    When  I click the link ".breadcrumbs a" and wait for the element "li[data-doc='Automatedtestfolderrenamed']"
    And   I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestfolderrenamed'] button"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    Then  I expect the screenshot of "behaviour-delete" matches the web page
    And   I expect the "delete" page has no accessibility errors

  Scenario: Delete the folder
    When  I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestfolderrenamed']" is not on the page
