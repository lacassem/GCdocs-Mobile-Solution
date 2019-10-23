Feature: Document overview
  In order to view documents
  As a user
  I want to be able to view a document overview and perform actions on the document

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
    And   I set the element "#comment" value to "This item is added as part of the automated mobile integration tests.  It can be safely deleted."    
    And   I click the button "#AddVersion input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is on the page

 Scenario: View document overview page
    When  I wait for 2 seconds
    And   I click the button "[data-doc='Automatedtestitem'] button"
    And   the element ".mdc-dialog [data-action='details']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='details']" and wait for the element "h1.title"
    And   I set the element ".modify-date" style "visibility" to "hidden"
    Then  I expect the screenshot of "behaviour-document-overview" matches the web page
    And   I expect the "document-overview" page has no accessibility errors
    And   I set the element ".modify-date" style "visibility" to "visible"

 Scenario: Download, document owner and email link check
    Given the attribute "href" from element ".well a" contain "objAction=download"
    And   the attribute "href" from element "[data-action='email-owner']" contain "mailto:Patrick.Heard@tpsgc-pwgsc.gc.ca"
    And   the attribute "href" from element "[data-action='email']" contain "mailto:?body=Automated%20test%20item"

 Scenario: Add document version
    Given the element "[data-action='versions']" contains text "1 version"
    When  I click the link "[data-action='add-version']" and wait for the element "#AddVersion"
    And   I set the file element "#versionFile" value to "./features/screenshots/ref/behaviour-reserve.png"
    And   I set the element "#comment" value to "New version for the automated test item."
    And   I click the button "#AddVersion input[type='submit']" and wait for the element "h1.title"
    Then  I expect the element "[data-action='versions']" contains text "2 versions"

 Scenario: View document versions
   When  I click the link "[data-action='versions']" and wait for the element "[data-doc='versions']"
   And   I set the element ".modify-date" style "visibility" to "hidden"
   Then  I expect the screenshot of "behaviour-document-versions" matches the web page
   And   I set the element ".modify-date" style "visibility" to "visible"
   And   I expect the "document-versions" page has no accessibility errors   

 Scenario: View a document version
   When  I click the link ".border-item-list li:first-child a" and wait for the element "h1.title"
   Then  I expect the attribute "href" from element ".well a" contain "objAction=download&vernum=2"
   And   I set the element ".modify-date" style "visibility" to "hidden"
   And   I expect the screenshot of "behaviour-document-version" matches the web page
   And   I set the element ".modify-date" style "visibility" to "visible"
   And   I expect the "document-version" page has no accessibility errors

 Scenario: More actions
    When  I click the link "[data-action='current-version']" and wait for the element "h1.title"
    And   I wait for 2 seconds
    And   I click the button "[data-action='more-actions']"
    And   the element ".mdc-dialog [data-action='rename']" is visible after "30" seconds
    Then  I expect the "document-overview-more-actions" page has no accessibility errors

 Scenario: More actions: Download and add to favorites
    Given the attribute "href" from element "[data-action='download']" contain "objAction=download"
    And   the attribute "href" from element "[data-action='add-favorite']" contain "func=ll&objaction=MakeFavorite"

 Scenario: Rename the document
    When  I click the link ".mdc-dialog [data-action='rename']" and wait for the element "#RenameForm"
    And   I set the element "#docName" value to "Automated test folder renamed"
    And   I click the button "#RenameForm input[type='submit']" and wait for the element "h1.title"
    Then  I expect the element "h1.title .name" contains text "Automated test folder renamed"   

 Scenario: Reserve the document
    When  I wait for 2 seconds
    And   I click the button "[data-action='more-actions']"
    And   the element ".mdc-dialog [data-action='reserve']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='reserve']" and wait for the element "[name='ReservedByForm']"
    And   I click the button "[name='ReservedByForm'] input[type='submit']" and wait for the element "h1.title"
    Then  I expect the element ".reserved" is on the page

 Scenario: Unreserve the document     
    When  I wait for 2 seconds
    And   I click the button "[data-action='more-actions']"
    And   the element ".mdc-dialog [data-action='unreserve']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='unreserve']" and wait for the element "[name='ReservedByForm']"
    And   I click the button "[name='ReservedByForm'] input[type='submit']" and wait for the element "h1.title"
    Then  I expect the element ".reserved" is not on the page

 Scenario: Document audit history     
    When  I click the link "[data-action='audit']" and wait for the element ".border-item-list"
    And   I set the element "small.colour-dark-gray" style "visibility" to "hidden"
    Then  I expect the screenshot of "behaviour-document-audit" matches the web page
    And   I set the element "small.colour-dark-gray" style "visibility" to "visible"
    And   I expect the "document-audit" page has no accessibility errors  

 Scenario: Help link   
    When  I click the link ".breadcrumbs a" and wait for the element "h1.title"
    And   I wait for 2 seconds
    And   I click the link ".dialog-help"
    And   the element "#dialog-help" is visible after "30" seconds
    Then  I expect the "document-overview-help" page has no accessibility errors
    And   I press the "Escape" key
    And   I expect the element "#dialog-help" is not visible after "30" seconds

 Scenario: Delete the document
    When  I wait for 2 seconds
    And   I click the button "[data-action='more-actions']"
    And   the element ".mdc-dialog [data-action='delete']" is visible after "30" seconds 
    And   I click the link ".mdc-dialog [data-action='delete']" and wait for the element "#deleteForm"
    And   I click the button "#deleteForm input[type='submit']" and wait for the element ".doc-list"
    Then  I expect the element "[data-doc='Automatedtestitem']" is not on the page  
    And   I expect the element "[data-doc='Automatedtestitemrenamed']" is not on the page    
          