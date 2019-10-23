import * as MaterialDesign from './MaterialDesign';
import * as Message from './Message';

jest.mock('./Events');
jest.mock('@material/dialog');
jest.mock('@material/drawer');
jest.mock('@material/ripple');
jest.mock('@material/snackbar');
import * as Events from './Events';
import {MDCDialog} from '@material/dialog';
import {MDCDrawer} from "@material/drawer";
import {MDCRipple} from '@material/ripple';
import {MDCSnackbar} from '@material/snackbar';


/**
 * Tests the MaterialDesign event binding
 */
describe('initialize MDC components and event handlers', () => {

    beforeAll(() => {

        document.body.innerHTML = `
            <!DOCTYPE html><html><body>
                <a href='#' class='dialog-activity'>Activity</a><div id='dialog-activity'></div>
                <a href='#' class='dialog-breadcrumbs'>Breadcrumbs</a><div id='dialog-breadcrumbs'></div>
                <a href='#' class='dialog-help'>Help</a><div id='dialog-help'></div>
                <a href='#' class='dialog-more-actions'>More actions</a><div id='dialog-more-actions'></div>
                <a href='#' class='dialog-versions'>Versions</a><div id='dialog-versions'></div> 
                <a href='#' class='menu'>Menu</a><div class='mdc-drawer'></div> 
                <a href='#' class="mdc-button">Button</a>
                <a href='#' class="mdc-button">Another button</a>

                <div class="mdc-snackbar">
                    <div class="mdc-snackbar__surface">
                        <div class="mdc-snackbar__label"></div>
                        <button type="button" class="mdc-button"></button>
                    </div>
                </div>                                                      
            </body></html>
        `;   
   
        MDCSnackbar.prototype.open = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    }); 

    it('should bind event handlers on the selectors using addEventListener', () => {
        MaterialDesign.init();
        expect(MDCDialog).toHaveBeenCalledTimes(5);
        expect(Events.bindOpenEvents).toHaveBeenCalledTimes(6);
        expect(Events.bindA11yEvents).toHaveBeenCalledTimes(2);
    }); 

    it('should attach MDCDrawer components', () => {
        MaterialDesign.init();
        expect(MDCDrawer.attachTo).toHaveBeenCalledTimes(1);
    });    

    it('should attach MDCRipple components', () => {
        MaterialDesign.init();
        expect(MDCRipple.attachTo).toHaveBeenCalledTimes(3);
    });

    it('should not init a snackbar if there is not a message', () => {
        MaterialDesign.init();
        expect(MDCSnackbar).toHaveBeenCalledTimes(0);
    });    

    it('should init and open a snackbar if there is a message', () => {
        Message.setSnackbarMessage('You listen here meow!');
        MaterialDesign.init();

        expect(MDCSnackbar).toHaveBeenCalledTimes(1);
        expect(MDCSnackbar.prototype.open).toHaveBeenCalledTimes(1);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('You listen here meow!');
    });
    
    it('should init and open an indefinite snackbar if there is an indefinite message', () => {
        Message.setSnackbarMessage('I said listen here meow!');
        Message.setSnackbarIndefinite(true);
        MaterialDesign.init();

        expect(MDCSnackbar).toHaveBeenCalledTimes(1);
        expect(MDCSnackbar.prototype.open).toHaveBeenCalledTimes(0);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('I said listen here meow!');
        expect(document.querySelector('.mdc-snackbar').classList.contains('mdc-snackbar--opening')).toBe(true);
    });
    
    it('should open and display a temporary message', () => {
        const snackbarElem = document.querySelector('.mdc-snackbar');
        MaterialDesign.openSnackbar(snackbarElem, 'Whale hallo thar', false);

        expect(MDCSnackbar).toHaveBeenCalledTimes(1);
        expect(MDCSnackbar.prototype.open).toHaveBeenCalledTimes(1);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('Whale hallo thar');
        expect(document.querySelector('.mdc-snackbar').classList.contains('mdc-snackbar--opening')).toBe(true);
    });
    
    it('should open and display a permanent message', () => {
        const snackbarElem = document.querySelector('.mdc-snackbar');
        MaterialDesign.openSnackbar(snackbarElem, 'Un autre message!', true);

        expect(MDCSnackbar).toHaveBeenCalledTimes(1);
        expect(MDCSnackbar.prototype.open).toHaveBeenCalledTimes(0);
        expect(document.querySelector('.mdc-snackbar__label').textContent).toBe('Un autre message!');
        expect(document.querySelector('.mdc-snackbar').classList.contains('mdc-snackbar--opening')).toBe(true);
    });    

});
 