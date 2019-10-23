Feature: Visual regression testing of Add version screen
  In order to make changes to the GCdocs mobile styles
  As a developer
  I want to make sure I don't break the current visual style of the screens.  

  Scenario: Add version
    When  I open the url "http://localhost:8080/Mobile_AddVersion.html" with device "iPhone X"
    Then  I expect the screenshot of "visual-add-version" matches the web page
    And   I expect the "add-version" page has no accessibility errors       
