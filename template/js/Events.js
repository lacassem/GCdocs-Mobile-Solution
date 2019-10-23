import * as FormValidation from './FormValidation';
import * as Menu from './Menu';

/**
 * Binds the events needed for an MDC that opens/closes (Drawer, Dialog, etc.)
 * @param {MDC Object} elem The MDC element to bind events to.
 * @param {NodeList} elemTrigger The DOM elements that trigger the open of the MDC element.
 * @param {String} componentName Name of the MDC component.  Used for 'opened' and 'closed' event binding.
 * @param {Function} elemOpen Callback function that closes the menu.
 */
export function bindOpenEvents(elem, elemTrigger, componentName, elemOpen){
    const elemTriggerArray = Array.from(elemTrigger); // Fix support for older browsers that don't have forEach support on NodeLists

    // Open on click for each element in the elemTrigger NodeList
    elemTriggerArray.forEach(e => e.addEventListener('click', elemOpen));

    // Update ARIA attributes as the element opens/closes
    elem.listen(`${componentName}:opened`, () => elemTriggerArray.forEach(e => e.setAttribute('aria-expanded', 'true')));
    elem.listen(`${componentName}:closed`, () => elemTriggerArray.forEach(e => e.setAttribute('aria-expanded', 'false')));
}

/**
 * Binds accessibility events to a menu.
 * @param {Object} menu The MDC or DOM menu element object.
 * @param {Function} menuClose Callback function that closes the menu.
 */
export function bindA11yEvents(menu, menuClose){
    // MDC object
    if(typeof menu.listen === "function"){
        menu.listen('keyup', (event) => menuA11yEventsHandler(event.code, menuClose));

    // DOM object
    } else if (typeof menu.addEventListener === "function"){
        menu.addEventListener('keyup',  (event) => menuA11yEventsHandler(event.key, menuClose));
    }
}

/**
 * Binds keyboard events to improve accessibility of menus.  These are based on recommendations from the 
 * AccDC Technical Style Guide: http://whatsock.com/tsg/
 * @param {String} key The key that was pressed. 
 * @param {Function} menuClose Callback function that closes the menu.
 */
export function menuA11yEventsHandler(key, menuClose){

    // Tab/Escape closes the menu and returns focus to the last focused element
    if(key === 'Tab' || key === 'Escape'){
        menuClose();
    }

    // Arrow up/down navigate up and down through the menu
    else if(key === 'ArrowUp' || key === 'ArrowDown'){
        const activeParent = document.activeElement.parentElement;
        const nextParent = key === 'ArrowUp' ? activeParent.previousElementSibling : activeParent.nextElementSibling;
        const nextTarget = nextParent && nextParent.querySelector('a, button') ? nextParent.querySelector('a, button') : null;

        if(nextTarget){
            nextTarget.focus();
        } else {
            menuClose();
        }
    }  
}

/**
 * Binds the click event behaviour when the "More actions" button is clicked on a document
 * browse screen.
 */
export function bindBrowseMoreActions(){
    const dialogMoreActions = document.querySelector('.mdc-dialog .action-menu');
    const dialogMoreActionsTitle = document.querySelector('#dialog-more-actions-title');
    const dialogMoreActionsTriggers = Array.from(document.querySelectorAll('.dialog-more-actions'));

    // When clicked, find the button's next sibling, which are the actions for that item.  These
    // actions are then set in the "More actions" dialog when it opens.  This is done to optimize performance
    // so that we only have 1 dialog created, instead of 1 for each document ("n" dialogs).
    dialogMoreActionsTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            dialogMoreActionsTitle.textContent = trigger.querySelector('.doc-name').textContent;
            dialogMoreActions.innerHTML = trigger.nextElementSibling.innerHTML;
        });
    });    
}

/**
 * Binds the submit handler on the filter form.
 */
export function filterSubmit(){
    const filterForm = document.querySelector('#filterForm');
    if(filterForm){
        filterForm.addEventListener('submit', (event) => filterSubmitHandler(event, filterForm));
    } 
}

/**
 * Handles a filter form submit. Takes the filterValue and appends it to the existing URL and
 * then reloads the page.  If an existing fitlerValue URL param exists, it is removed first.
 * @param {JavaScript event object} event The event dispatched for the submit event.
 * @param {DOM element} filterForm The filter form DOM element.
 */
export function filterSubmitHandler(event, filterForm){
    event.preventDefault();
    
    const filterValue = encodeURI(filterForm.querySelector('#filterValue').value);
    const filterValueParam = filterValue ? `&filterValue=${filterValue}` : '';
    const url = filterForm.getAttribute('action').replace(/&filterValue=([^&]+)?/, '');

    if(filterValue){
        window.location.href = url + filterValueParam;
    }
}

/**
 * Binds event handlers for the Floating Action Button (FAB) menu.  These event handlers include
 * open, close and keyboard accessibility.
 * @param {DOM element} parent The floating action element to init.
 */
export function bindFloatingActionEvents(parent){

    // Get references to the DOM elements    
    const fab = parent.querySelector('button');
    const actions = parent.querySelector('.actions');
    const scrim = parent.querySelector('.scrim');

    // If the DOM elements exist, bind the event handlers
    if(fab && actions && scrim){

        // Open the FAB menu when the FAB is clicked.
        fab.addEventListener('click', () => Menu.openFloatingActionMenu(fab, parent, actions));

        // Close the FAB menu when the action menu or scrim overlay is clicked
        actions.addEventListener('click', () => Menu.closeFloatingActionMenu(fab, parent));
        scrim.addEventListener('click', () => Menu.closeFloatingActionMenu(fab, parent));

        // Bind accessibility events for the FAB menu
        bindA11yEvents(actions, Menu.closeFloatingActionMenu.bind(Menu, fab, parent));
    }
}

/**
 * Binds form validation events for a given form.
 * @param {DOM element} form The form to validate.
 */
export function bindFormValidation(form){
    const lang = document.querySelector('html').getAttribute('lang');
    const locale = lang === 'fr' ? 'fr' : 'en';
    FormValidation.init(form);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if(await FormValidation.isValid(form, locale)){
            form.submit();
        }
    });
}

/**
 * Initializes click even for elements with the `.toggle-display` class.  These are elements that toggle
 * the display of another element between `block` and `none`.
 */
export function initTogglers(){
    Array.from(document.querySelectorAll('.toggle-display')).forEach((el) => {
        el.addEventListener('click', () => toggleDisplay(el));
    });
}

/**
 * Given a DOM element with an `aria-controls` attribute, toggles between the `.display-none` and `.display-block` CSS classes.
 * @param {DOM element} el The DOM element that users click to toggle the display class of another element.
 */
export function toggleDisplay(el){
    const toggleId = el.getAttribute('aria-controls');
    const toggleElem = document.querySelector(`#${toggleId}`);
    if(toggleElem){
        const isHiddenClass = toggleElem.classList.toggle('display-none');
        toggleElem.setAttribute('aria-hidden', isHiddenClass);
    }
}