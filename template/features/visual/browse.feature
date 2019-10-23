Feature: Visual regression testing of browse and favorites screen
  In order to make changes to the GCdocs mobile styles
  As a developer
  I want to make sure I don't break the current visual style of the screens.  

  Scenario: Browse
    When  I open the url "http://localhost:8080/Mobile_Browse.html" with device "iPhone X"
    Then  I expect the screenshot of "visual-browse" matches the web page
    And   I expect the "browse" page has no accessibility errors     

  Scenario: Browse main menu
    When  I open the url "http://localhost:8080/Mobile_Browse.html" with device "iPhone X"
    And   I click the element "header .menu"
    And   I wait for 1 second
    Then  I expect the screenshot of "visual-browse-main-menu" matches the web page
    And   I expect the "browse-main-menu" page has no accessibility errors      

  Scenario: Browse floating action button
    When  I open the url "http://localhost:8080/Mobile_Browse.html" with device "iPhone X"
    And   I click the button ".floating-action button"
    And   I wait for 1 second
    Then  I expect the screenshot of "visual-browse-fab" matches the web page
    And   I expect the "browse-fab" page has no accessibility errors       

  Scenario: Browse action menu
    When  I open the url "http://localhost:8080/Mobile_Browse.html" with device "iPhone X"
    And   I click the button ".doc-list li:first-child button"
    And   I wait for 2 second
    Then  I expect the screenshot of "visual-browse-action-menu" matches the web page
    And   I expect the "browse-action-menu" page has no accessibility errors      

  Scenario: Favorites
    When  I open the url "http://localhost:8080/Mobile_Favorites.html" with device "iPhone X"
    Then  I expect the screenshot of "visual-favorites" matches the web page
    And   I expect the "favorites" page has no accessibility errors            
