import * as FormValidation from './FormValidation';

jest.mock('./Ajax');
import * as Ajax from './Ajax';

describe('Init form validation', () => {

    let form;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `<form></form>`;
        form = document.querySelector('form');
    });

    it('should not have error message elements', () => { 
        expect(form.getAttribute('novalidate')).toBeNull();    
        expect(form.querySelector('.error-messages')).toBeNull();
        expect(form.querySelector('.error-messages h2')).toBeNull();
        expect(form.querySelector('.error-messages ul')).toBeNull();

    });    

    it('should init the form for validation', () => {
        FormValidation.init(form);        
        
        expect(form.getAttribute('novalidate')).toBe('novalidate');  
        expect(form.querySelector('.error-messages')).not.toBeNull();
        expect(form.querySelector('.error-messages h2')).not.toBeNull();
        expect(form.querySelector('.error-messages ul')).not.toBeNull();
        expect(form.querySelector('.error-messages').classList.contains('inv')).toBe(true);
        expect(form.firstChild).toBe(form.querySelector('.error-messages'));

    });
});

describe('Validate the form', () => {

    let form;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <form>
                <label for="name"><span class="field-name">Name</span></label>
                <input type="text" id="name" name="name" required>

                <label for="phone"><span class="field-name">Phone number</span></label>
                <input type="text" id="phone" name="phone">

                <label for="salutation"><span class="field-name">Salutation</span></label>
                <select id="salutation" name="salutation" required>
                    <option value="" selected></option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                </select>
            </form>
        `;

        form = document.querySelector('form');
        FormValidation.init(form); 
    });

    it('should identify a form that is not valid', async () => {
        expect(await FormValidation.isValid(form, 'en')).toBe(false);
    });
    
    it('should display error messages on fields', () => {
        expect(form.querySelector('#name').getAttribute('aria-describedby')).toBe('name_is_required');
        expect(form.querySelector('#name').getAttribute('aria-invalid')).toBe('true');
        expect(form.querySelector('#name + .error').textContent).toBe('Name is required.');
        expect(form.querySelector('#salutation').getAttribute('aria-describedby')).toBe('salutation_is_required');
        expect(form.querySelector('#salutation').getAttribute('aria-invalid')).toBe('true');        
        expect(form.querySelector('#salutation + .error').textContent).toBe('Salutation is required.');
    }); 

    it('should display error messages on the form', () => {
        expect(form.querySelector('.error-messages').classList.contains('inv')).toBe(false); 
        expect(form.querySelector('.error-messages h2').textContent).toBe('You have the following 2 errors:');
        expect(form.querySelectorAll('.error-messages ul li').length).toBe(2);
    }); 

    it('should clear error messages', () => {
        FormValidation.clearErrors(form);

        expect(form.querySelector('#name').getAttribute('aria-describedby')).toBe(null);
        expect(form.querySelector('#name').getAttribute('aria-invalid')).toBe(null);
        expect(form.querySelector('#salutation').getAttribute('aria-describedby')).toBe(null);
        expect(form.querySelector('#salutation').getAttribute('aria-invalid')).toBe(null);        

        expect(form.querySelector('.error-messages').classList.contains('inv')).toBe(true);
        expect(form.querySelector('.error-messages h2').textContent).toBe('');
        expect(form.querySelectorAll('.error-messages ul li').length).toBe(0);
        expect(form.querySelectorAll('.error').length).toBe(0);        
    });

    it('should identify a form that is valid', async () => {
        form.querySelector('#name').value = 'Bort';
        form.querySelector('#salutation').value = 'Mr';
        expect(await FormValidation.isValid(form, 'en')).toBe(true);
    });   
   
});

describe('Utility methods', () => {

    let form;

    // Mock the global document
    beforeAll(() =>{
        document.body.innerHTML = `
            <form>
                <input type="hidden" name="parentId" value="1234">
                <input type="hidden" name="objType" value="0">

                <label for="name"><span class="field-name">Name</span></label>
                <input type="text" id="name" name="name" required>

                <label for="lastname">Last name</label>
                <input type="text" id="lastname" name="lastname">                

                <label for="phone"><span class="field-name">Phone number</span></label>
                <input type="text" id="phone" name="phone">

                <label for="unique-name"><span class="field-name">Unique name</span></label>
                <input type="text" id="unique-name" name="unique-name" data-valid-name-unique="true">                

                <label for="salutation"><span class="field-name">Salutation</span></label>
                <select id="salutation" name="salutation" required>
                    <option value="" selected></option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                </select>
            </form>
        `;

        form = document.querySelector('form');
        FormValidation.init(form); 

        Ajax.post = jest.fn();
        Ajax.post.mockResolvedValue({ok: false});        
    });
   
    it('should identify required fields', () => {
        expect(FormValidation.isRequiredValid(form.querySelector('#name'))).toBe(false);
        expect(FormValidation.isRequiredValid(form.querySelector('#salutation'))).toBe(false);
        expect(FormValidation.isRequiredValid(form.querySelector('#phone'))).toBe(true);
    }); 

    it('should identify fields that need a unique name', async () => {
        expect(await FormValidation.isNameUnique(form.querySelector('#name'))).toBe(true);
        expect(await FormValidation.isNameUnique(form.querySelector('#unique-name'))).toBe(true);

        const uniqueName = form.querySelector('#unique-name');
        uniqueName.value = "foo";
        expect(await FormValidation.isNameUnique(uniqueName)).toBe(false);        
    });
    
    it('should get a label that exists', () => {
        expect(FormValidation.getLabel('error', 'en')).toBe('Error');
        expect(FormValidation.getLabel('error', 'fr')).toBe('Erreur');
    }); 
    
    it('should not get a label that does not exist', () => {
        expect(FormValidation.getLabel('foo', 'en')).toBeNull();
    });
    
    it('should populate a label with parameters', () => {
        expect(FormValidation.getLabel('is_required', 'fr', ['Meeseeks'])).toBe('Meeseeks est requis.');
    });
    
    it('should not populate parameters that do not exist', () => {
        expect(FormValidation.getLabel('is_required', 'en')).toBe('{0} is required.');
    }); 
    
    it('should get a field name that exists', () => {
        expect(FormValidation.getFieldName(form.querySelector('#name'))).toBe('Name');
        expect(FormValidation.getFieldName(form.querySelector('#phone'))).toBe('Phone number');
    });
    
    it('should not get a field name for an element that does not exist', () => {
        expect(FormValidation.getFieldName(form.querySelector('#foo'))).toBeNull();
    });
    
    it('should not get a field name for when the .field-name class does not exist', () => {
        expect(FormValidation.getFieldName(form.querySelector('#lastname'))).toBeNull();
    });
    
    it('should get form level error messages', () => {
        const errorMessage = FormValidation.getErrorMessageFormElement(form.querySelector('#salutation'), 'is_required', 'fr');
        expect(errorMessage.querySelector('a').textContent).toBe('Salutation est requis.');
        expect(errorMessage.querySelector('a').getAttribute('href')).toBe('#salutation');
    }); 
    
    it('should get field level error messages', () => {
        const errorMessage = FormValidation.getErrorMessageFieldElement(form.querySelector('#name'), 'is_required', 'en');
        expect(errorMessage.textContent).toBe('Name is required.');
        expect(errorMessage.classList.contains('error')).toBe(true);
    });
    
    it('should get an array of error elements', async () => {
        const errors = await FormValidation.getErrors(form.elements);
        expect(errors[0]).toEqual({element: form.querySelector('#name'), labelKey: 'is_required'});
        expect(errors[1]).toEqual({element: form.querySelector('#unique-name'), labelKey: 'is_name_unique'});
        expect(errors[2]).toEqual({element: form.querySelector('#salutation'), labelKey: 'is_required'});
    });    
   
});