const { Given } = require('cucumber');

Given(
    'the user is logged into GCdocs', async function() {
        
        // Trigger the login
        this.page = await this.browser.newPage();
        await this.page.goto(this.config.rootUrl + '/llisapi.dll?func=llworkspace', {waitUntil: 'networkidle0'});

        // Click the sign in button and wait for the ADFS sign in page
        await Promise.all([
            this.page.waitForSelector("#loginForm"), 
            this.page.click('input.button-lg')
        ]);

        // Enter username and password
        await this.page.evaluate((username, password) => {
            document.querySelector('input[name="UserName"]').value = username;
            document.querySelector('input[name="Password"]').value = password;
        }, process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

        // Click ADFS sign in button and wait for GCdocs to load
        await Promise.all([
            this.page.waitForSelector("#LLOuterContainer"), 
            this.page.click('#submitButton')
        ]);
    }    
);