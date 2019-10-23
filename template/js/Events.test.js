import {MDCDialog} from '@material/dialog';
import * as Events from './Events';
import * as FormValidation from './FormValidation';

describe('bindOpenEvents, bindA11yEvents', () => {

    let dialog;
    let dialogDom;
    let dialogDomTrigger;
    let domElem;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <div class="mdc-dialog-trigger" aria-expanded="false">Dialog trigger</div>
            <div class="mdc-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="my-dialog-title"
                aria-describedby="my-dialog-content">
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface">
                        <h2 class="mdc-dialog__title" id="my-dialog-title">Dialog Title</h2>
                        <div class="mdc-dialog__content" id="my-dialog-content">Dialog Content</div>
                    </div>
                </div>
                <div class="mdc-dialog__scrim"></div>
            </div>
            <div class="dom-elem"></div>
        `;

        // Create the dialog element
        dialogDom = document.querySelector('.mdc-dialog');
        dialogDomTrigger = document.querySelectorAll('.mdc-dialog-trigger');
        dialog = new MDCDialog(dialogDom);

        // Create the dom element
        domElem =  document.querySelector('.dom-elem');

        // Mock the event handlers
        dialogDomTrigger.forEach(e => e.addEventListener = jest.fn());
        dialog.listen = jest.fn();
        domElem.addEventListener = jest.fn();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });    

    it('should bind open events', () => {
        Events.bindOpenEvents(dialog, dialogDomTrigger, 'MDCDialog', () => dialog.open());
        dialogDomTrigger.forEach(e => {
            expect(e.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });        
        expect(dialog.listen).toHaveBeenCalledWith('MDCDialog:closed', expect.any(Function));
        expect(dialog.listen).toHaveBeenCalledWith('MDCDialog:opened', expect.any(Function));
    });

    it('should bind keyboard events on an MDC component', () => {
        Events.bindA11yEvents(dialog, () => dialog.close());
        expect(dialog.listen).toHaveBeenCalledWith('keyup', expect.any(Function));
    }); 
    
    it('should bind keyboard events on a DOM element', () => {
        Events.bindA11yEvents(domElem, () => {});
        expect(domElem.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
    });    

});

describe('bindBrowseMoreActions', () => {

    let dialog;
    let dialogDom;
    let dialogDomTrigger;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <div class="dialog-more-actions">Dialog trigger 1</div>
            <div class="dialog-more-actions">Dialog trigger 2</div>
            <div class="dialog-more-actions">Dialog trigger 3</div>
        `;
        dialogDomTrigger = document.querySelectorAll('.dialog-more-actions');
        dialogDomTrigger.forEach(e => e.addEventListener = jest.fn());      
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should bind more action events', () => {
        Events.bindBrowseMoreActions();
        dialogDomTrigger.forEach(e => {
            expect(e.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        }); 
    });    

});

describe('filterSubmit', () => {

    let form;
    let filterValue;
    let event;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <form id="filterForm" method="get" action="http://localhost/test/foo/bar">
                <input type="text" name="filterValue" id="filterValue" value="bam">
            </form>
        `;

        // Allow the window location to be updated
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                href: 'http://localhost/'
             },            
        });

        filterValue = document.querySelector('#filterValue');
        form = document.querySelector('#filterForm');
        form.addEventListener = jest.fn();
        event = {
            preventDefault: jest.fn()
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should bind a submit handler', () => {
        Events.filterSubmit();
        expect(form.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function)); 
    });  
    
    it('should handle the submit element', () => {
        Events.filterSubmitHandler(event, form);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(window.location.href).toBe('http://localhost/test/foo/bar&filterValue=bam'); 
    });
    
    it('should not change the URL if no filter value', () => {
        filterValue.value = '';
        Events.filterSubmitHandler(event, form);
        expect(window.location.href).toBe('http://localhost/test/foo/bar&filterValue=bam'); 
    });
    
    it('should URL encode the filter value', () => {
        filterValue.value = 'foo bar bam';
        Events.filterSubmitHandler(event, form);
        expect(window.location.href).toBe('http://localhost/test/foo/bar&filterValue=foo%20bar%20bam'); 
    });     

});

describe('bindFloatingActionEvents', () => {

    let parent;
    let fab;
    let actions;
    let scrim;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
           <div class="floating-menu">
                <button></button>
                <div class="actions"></div>
                <div class="scrim"></div>
           </div>
        `;

        parent = document.querySelector('.floating-menu');
        fab = document.querySelector('.floating-menu button');
        actions = document.querySelector('.floating-menu .actions');
        scrim = document.querySelector('.floating-menu .scrim');

        fab.addEventListener = jest.fn();
        actions.addEventListener = jest.fn();
        scrim.addEventListener = jest.fn();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should bind click handlers and a11y events', () => {
        Events.bindFloatingActionEvents(parent);
        expect(fab.addEventListener).toHaveBeenCalledWith('click', expect.any(Function)); 
        expect(actions.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        expect(scrim.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });   

});

describe('bindFormValidation', () => {

    let form;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `<form></form>`;

        form = document.querySelector('form');
        form.addEventListener = jest.fn();
        FormValidation.init = jest.fn();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should init the form validation and bind an event handler', () => {
        Events.bindFormValidation(form);
        expect(FormValidation.init).toHaveBeenCalledWith(form);
        expect(form.addEventListener).toHaveBeenCalledWith('submit', expect.any(Function));
    });   

});


describe('initTogglers', () => {

    let togglers;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <div class="toggle-display" aria-controls="elem-1"></div>
            <div id="elem-1"></div>
            <div class="toggle-display" aria-controls="elem-2"></div>
            <div id="elem-2" class="display-none"></div>         
        `;

        // Mock the addEventListener call
        togglers = document.querySelectorAll('.toggle-display');
        togglers.forEach((el) => el.addEventListener = jest.fn());
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should bind click event hanlders on all toggle elements', () => {
        Events.initTogglers();
        togglers.forEach((el) => expect(el.addEventListener).toHaveBeenCalledWith('click', expect.any(Function)));
    });

    it('should add the class display-none to an element when clicked', () => {
        const elem1 = document.getElementById('elem-1');
        expect(elem1.classList.contains('display-none')).toBe(false);

        Events.toggleDisplay(togglers[0]);

        expect(elem1.classList.contains('display-none')).toBe(true);
        expect(elem1.getAttribute('aria-hidden')).toBe("true");
    });

    it('should remove class display-none from an element when clicked', () => {
        const elem2 = document.getElementById('elem-2');
        expect(elem2.classList.contains('display-none')).toBe(true);

        Events.toggleDisplay(togglers[1]);

        expect(elem2.classList.contains('display-none')).toBe(false);
        expect(elem2.getAttribute('aria-hidden')).toBe("false");
    });    

});