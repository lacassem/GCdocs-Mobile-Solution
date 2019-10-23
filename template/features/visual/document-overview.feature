Feature: Visual regression testing of document overview screen
  In order to make changes to the GCdocs mobile styles
  As a developer
  I want to make sure I don't break the current visual style of the screens.  

  Scenario: Document overview
    When  I open the url "http://localhost:8080/Mobile_DocumentOverview.html" with device "iPhone X"
    Then  I expect the screenshot of "visual-document-overview" matches the web page
    And   I expect the "document-overview" page has no accessibility errors      

  Scenario: Document overview action menu
    When  I click the button ".button-group li:last-child button"
    And   I wait for 2 seconds
    Then  I expect the screenshot of "visual-document-overview-action-menu" matches the web page
    And   I expect the "document-overview-action-menu" page has no accessibility errors          
