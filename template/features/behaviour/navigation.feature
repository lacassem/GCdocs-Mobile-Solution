Feature: Browse page
  In order to browse documents on a mobile device
  As a user
  I want to view a mobile friendly list of documents and folders in GCdocs

  Scenario: Browse page loads
    Given the user is logged into GCdocs
    When  I open the url "$PARENT_TEST_FOLDER" with device "iPhone X"
    Then  I expect the element "#filterForm" is on the page
    And   I expect the element ".doc-list" is on the page
    And   I expect the element ".floating-action" is on the page

  Scenario: Browse page has no accessibility errors
    Given the "browse" page has no accessibility errors

  Scenario: Main menu opens and has no accessibility errors
    When  I wait for 2 second 
    And   I click the element "header .menu"
    Then  I expect the element "#main-menu" is visible after "1" seconds 
    And   I expect the "browse-main-menu" page has no accessibility errors 

  Scenario: Main menu link check
    Given the attribute "href" from element "#main-menu [data-action='enterprise']" contain "?func=llworkspace&sort=name"
    And   the attribute "href" from element "#main-menu [data-action='my-workspace']" contain "?func=ll&objtype=142&objaction=browse&sort=name" 
    And   the attribute "href" from element "#main-menu [data-action='my-favorites']" contain "?func=Personal.Favorites&sort=name"
    And   the attribute "href" from element "#main-menu [data-action='recent-documents']" contain "?func=ll&objType=327&objAction=browse&sort=name"
    And   the attribute "href" from element "#main-menu [data-action='help-improve']" contain "mailto:TPSGC.GCDOCSBureaudeService-GCDOCSServiceDesk.PWGSC@tpsgc-pwgsc.gc.ca"
    And   the attribute "href" from element "#main-menu [data-action='desktop-site']" contain "&AVID=0"
    And   the attribute "href" from element "#main-menu [data-action='signout']" contain "?func=ll.DoLogout&secureRequestToken="

  Scenario: Main menu closes
    Given the element "#main-menu" is visible
    When  I press the "Escape" key
    Then  I expect the element "#main-menu" is not visible after "1" seconds 

  Scenario: Page can change languages to Francais
    Given the attribute "lang" from element "html" is "en"
    When  I wait for 2 seconds
    And   I click the link "#lang-swap" and wait for the element "#lang-swap[lang='en']"

  Scenario: Page can change languages to English
    Given the attribute "lang" from element "html" is "fr"
    When  I wait for 2 seconds
    And   I click the link "#lang-swap" and wait for the element "#lang-swap[lang='fr']" 

  Scenario: Sign out of GCdocs
    When  I wait for 2 seconds
    And   I click the element "header .menu"
    And   I expect the element "#main-menu" is visible after "30" seconds
    And   I wait for 1 second
    And   I click the link "#main-menu [data-action='signout']" and wait for the element "form[action='login']"
    Then  I expect the page title contains "Sign in - GCdocs"
     
