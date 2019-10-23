import {MDCDialog} from '@material/dialog';
import {MDCDrawer} from "@material/drawer";
import {MDCRipple} from '@material/ripple';
import {MDCSnackbar} from '@material/snackbar';
import * as Events from './Events'
import * as Message from './Message'

/**
 * Create MDC components and bind all event handlers if we're in a browser context.
 */
export function init() {
  if(typeof document !== 'undefined'){
    initDialogs();
    initFloatingAction();
    initMainMenu();
    initRipple();
    initSnackbar();
  }
}

/**
 * Initializes all dialog object and click event handlers.
 */
function initDialogs() {
  const dialogs = ['dialog-activity', 'dialog-breadcrumbs', 'dialog-help', 'dialog-more-actions', 'dialog-versions'];

  dialogs.forEach((dialogSelector) => {
    const dialogDom = document.querySelector(`#${dialogSelector}`);
    const dialogDomTrigger = document.querySelectorAll(`.${dialogSelector}`);

    if(dialogDom && dialogDomTrigger.length){
      const dialog = new MDCDialog(dialogDom);   
      
      Events.bindOpenEvents(dialog, dialogDomTrigger, 'MDCDialog', () => dialog.open());
      if(dialogSelector === 'dialog-more-actions'){
        Events.bindA11yEvents(dialog, () => dialog.close());
      }
    }
  });
}

/**
 * Initializes the floating action menu
 */
function initFloatingAction(){
  Array.from(document.querySelectorAll('.floating-action')).forEach((el) => Events.bindFloatingActionEvents(el));
}

/**
 * Create the main menu and bind a click handler to its triggering (open/close) element.
 */
function initMainMenu() {
  const mainMenuDom = document.querySelector('.mdc-drawer');
  const mainMenuTriggerDom = document.querySelectorAll('.menu');

  if(mainMenuDom && mainMenuTriggerDom.length){
    const mainMenu = MDCDrawer.attachTo(mainMenuDom);

    Events.bindOpenEvents(mainMenu, mainMenuTriggerDom, 'MDCDrawer', () => mainMenu.open = true);
    Events.bindA11yEvents(mainMenu, () =>  mainMenu.open = false);
  }
}

/**
 * Create a ripple effect for all `.mdc-button` elements
 */
function initRipple() {
  Array.from(document.querySelectorAll('.mdc-button')).forEach((el) => MDCRipple.attachTo(el));
}

/**
 * Initializes the snackbar element and displays a message if one exists in sessionStorage.
 */
function initSnackbar() {
  const message = Message.getSnackbarMessage();
  const snackbarElem = document.querySelector('.mdc-snackbar');

  // If there's a snackbar message and element, make the magic happen
  if(message && snackbarElem){
    openSnackbar(snackbarElem, message, Message.isSnackbarIndefinite());
    Message.clearSnackbarMessage();
  }
}

/**
 * Opens a snackbar with no timeout close.  This can be used for cases where the message is
 * longer and you need to make sure the user has time to read it.
 * @param {DOM object} snackbarElem The snackbar DOM element.
 */
function openSnackbarIndefinitely(snackbarElem){
  snackbarElem.classList.add('mdc-snackbar--opening');

  // Wait for the parent element to become display: block before animating scale/opacity
  setTimeout(() => snackbarElem.classList.add('mdc-snackbar--open'), 1); 

  // Close event handler for snackbar button
  snackbarElem.querySelector('.mdc-button').addEventListener('click', () => snackbarElem.classList.remove('mdc-snackbar--opening', 'mdc-snackbar--open'));
}

/**
 * Opens a snackbar to display a message to the user.  By default, it closes automatically after
 * 10 seconds, but can be kept open permanently by setting `isIndefinite` to `true`.
 * @param {DOM object} snackbarElem The DOM element that will be used to display the snackbar.
 * @param {String} message Message to display in the snackbar.
 * @param {Boolean} isIndefinite Should the snackbar stay open or close automatically?
 */
export function openSnackbar(snackbarElem, message, isIndefinite){

  // Set the text of the snackbar and create the MDC object
  snackbarElem.querySelector('.mdc-snackbar__label').textContent = message;
  const snackbar = new MDCSnackbar(snackbarElem);
  
  // Determine if snackbar should stay open indefinitely
  if(isIndefinite){
    openSnackbarIndefinitely(snackbarElem);
  } else {
    snackbar.timeoutMs = 10000;
    snackbar.open();
  }
}


