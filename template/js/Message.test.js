import * as Message from './Message';

/**
 * Get status messages
 */
describe('getStatusMessages', () => {

    let dom;

    beforeAll(() =>{
        document.body.innerHTML = `
            <!DOCTYPE html><html><body>
                <div class="error">Something didn't work</div>
                <div class="another-error">Something else also didn't work</div>
            </body></html>
        `;
    });

    it('should not find errors if the selector does not match', async () => {
        expect(Message.getStatusMessages(document, ['.foobar'])).toEqual([]);
    });
    
    it('should find errors if either selector matches', async () => {
        expect(Message.getStatusMessages(document, ['.foobar', '.error'])).toEqual(["Something didn't work"]);
    });
    
    it('should find errors if all selectors match, in the order the selectors are defined', async () => {
        expect(Message.getStatusMessages(document, ['.another-error', '.error'])).toEqual(["Something else also didn't work", "Something didn't work"]);
    });     
});

/**
 * Get snackbar messages and indefinite properties
 */
describe('get snackbar messages', () => {

    it('should not find a message that has not been defined', async () => {
        expect(Message.getSnackbarMessage()).toBeNull();
    });
    
    it('should be able to set a message and get it', async () => {
        Message.setSnackbarMessage('Why hallo thar');
        expect(Message.getSnackbarMessage()).toBe('Why hallo thar');
    });
    
    it('should be able to clear a snackbar message', async () => {
        Message.clearSnackbarMessage();
        expect(Message.getSnackbarMessage()).toBeNull();
    });
    
    it('should default to false if indefinte has not been set', async () => {
        expect(Message.isSnackbarIndefinite()).toBe(false);
    });
    
    it('should be able to set an indefinite boolean to true', async () => {
        Message.setSnackbarIndefinite(true);
        expect(Message.isSnackbarIndefinite()).toBe(true);
    });

    it('should be able to set an indefinite boolean to false', async () => {
        Message.setSnackbarIndefinite(false);
        expect(Message.isSnackbarIndefinite()).toBe(false);
    });    
 
});
