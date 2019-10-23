import * as Ajax from './Ajax';

/**
 * Labels used for translation.
 */
const labels = {
    'error':            ['Error', 'Erreur'],    
    'following_error':  ['You have the following error:', 'Vous avez l\'erreur suivante :'],
    'following_errors': ['You have the following {0} errors:', 'Vous avez les {0} erreurs suivantes :'],
    'is_name_unique':   ['An item with this name already exists.', 'Un élément portant ce nom existe déjà.'],
    'is_required':      ['{0} is required.', '{0} est requis.']
};

/**
 * Creates the DOM elements required to display a form level error messages.
 * @param {DOM element} form The form element to be validated
 */
export function init(form){
    const messages = document.createElement('div');

    messages.classList.add('error-messages', 'inv');
    messages.setAttribute('aria-live', 'polite');
    messages.appendChild(document.createElement('h2'));
    messages.appendChild(document.createElement('ul'));

    form.insertBefore(messages, form.firstChild);
    form.setAttribute('novalidate', 'novalidate');
}

/**
 * Clears any existing form validation errors.
 * @param {DOM element} form The form element to be validated
 */
export function clearErrors(form){
    // Remove form level errors
    form.querySelector('.error-messages').classList.add('inv');
    form.querySelector('.error-messages h2').textContent = '';
    form.querySelector('.error-messages ul').innerHTML = '';

    // Remove field level errors
    Array.from(form.querySelectorAll('.error')).forEach(e => e.parentNode.removeChild(e));

    // Remove field errors
    Array.from(form.querySelectorAll('[aria-invalid]')).forEach(e => {
        e.removeAttribute('aria-describedby');
        e.removeAttribute('aria-invalid');
    });
}

/**
 * Checks an array of form DOM elements for validation errors.
 * @param {Array of DOM elements} elements The form elements to validate.
 * @return {Array of objects} Each object contains an element (DOM element) and labelKey (String) property.
 */
export async function getErrors(elements){
    const errors = [];

    // Loop over all elements and validate according to their HTML5 validation rules.
    for(let i = 0, len = elements.length; i < len; i++){
        let element = elements[i];

        if(!isRequiredValid(element)){
            errors.push({element: element, labelKey: 'is_required'});
        }

        let isElementNameUnique = await isNameUnique(element);
        if(!isElementNameUnique){            
            errors.push({element: element, labelKey: 'is_name_unique'});
        }
    }

    return errors;
}

/**
 * Creates an error message element to display the error to the user.
 * @param {DOM element} element The form element with an error.
 * @param {String} labelKey Error message label key.
 * @param {String} locale The user's two letter code locale (en/fr).
 * @return {DOM element} The DOM element error message.
 */
export function getErrorMessageFieldElement(element, labelKey, locale){
    let message = document.createElement('strong');

    message.classList.add('error');
    message.setAttribute('aria-label', getLabel('error', locale));
    message.setAttribute('id', `${element.id}_${labelKey}`);
    message.textContent = getLabel(labelKey, locale, [getFieldName(element)]);

    return message;
}

/**
 * Creates an error message element to display at the top of a form.  Error message contains a link to the field in error.
 * @param {DOM element} element The form element with an error.
 * @param {String} labelKey Error message label key.
 * @param {String} locale The user's two letter code locale (en/fr).
 * @return {DOM element} The DOM element error message.
 */
export function getErrorMessageFormElement(element, labelKey, locale){
    const message =  document.createElement('li');
    const link = document.createElement('a');

    link.setAttribute('href', `#${element.id}`);
    link.textContent = getLabel(labelKey, locale, [getFieldName(element)]);
    message.appendChild(link);

    return message;
}

/**
 * Gets the field name for a form element.  This is dependent on the form element having a <label> that 
 * contains a `.field-name` element.
 * @param {DOM element} element The form element to get the name of. 
 * @return {String} The field's name
 */
export function getFieldName(element){
    const fieldName = element && element.parentNode.querySelector(`label[for="${element.id}"] .field-name`);
    return fieldName ? fieldName.textContent : null;
}

/**
 * Retrieves an error message based on the label key and locale.
 * @param {String} key Error message label key.
 * @param {String} locale The user's two letter code locale (en/fr).
 * @param {Array} params Array of string parameters to substitute in the error message.
 * @param {String} The localized error message.
 */
export function getLabel(key, locale, params){
    const index = locale.toLowerCase() === 'fr' ? 1 : 0;
    let label = labels.hasOwnProperty(key) ? labels[key][index] : null;

    if(label && params){
        params.forEach((param, index) => label = label.replace(`{${index}}`, param));
    }

    return label;
}

/**
 * Checks if a form element that is required has a value.
 * @param {DOM element} element The form element to check.
 * @return {Boolean} True if the field marked as required is valid.
 */
export function isRequiredValid(element){
    return element.getAttribute("required") === null || element.value.length > 0;
}

/**
 * Checks if a name is unique in the parent folder.  Assumes the field being checked is part of a form element
 * that has `[name="objType"]` and `[name="parentId"]` input elements with valid values.  The POST request
 * to validate is sent to the same URL as the form's action attribute.
 * @param {DOM element} element The form element whose value is the name that needs to be unique in the parent folder.
 */
export async function isNameUnique(element){
    let isValid = !element.value || element.getAttribute("data-valid-name-unique") !== "true";

    // Only validate if the element has a value and needs the unique name check
    if(!isValid){
        const form = element.form;
        const params = {
            func: 'll.CheckObjectNameExists',
            parentID: form.querySelector('[name="parentId"]').value,
            name: element.value,
            secureRequestToken: decodeURIComponent(element.getAttribute("data-secure-token")),
            objType: form.querySelector('[name="objType"]').value,
            isTransport: false
        };        

        if(params.objType && params.parentID && params.secureRequestToken){
            const response = await Ajax.post(form.action, params, "json"); 
            isValid = response.ok;

        } else {
            console.error(`Could not ll.CheckObjectNameExists.  Missing objType (${params.objType}), parentId (${params.parentID}) or secureToken (${params.secureRequestToken})`);
        }
    }    
    return isValid;
}

/**
 * Creates and outputs the validation error messages for the user.
 * @param {Array} errors Array of error objects that contain the element and validation error.
 * @param {DOM element} form Form DOM element that contains the errors.
 * @param {String} locale The user's two letter code locale (en/fr).
 */
export function setErrorMessages(errors, form, locale){
    const formMessage = form.querySelector('.error-messages');
    const formMessageList = form.querySelector('.error-messages ul');
    const messageHeading = errors.length === 1 ? getLabel('following_error', locale) : getLabel('following_errors', locale, [errors.length]);  

    errors.forEach(error => {
        let element = error.element;
        let labelKey = error.labelKey;

        element.setAttribute('aria-describedby', `${element.id}_${labelKey}`);
        element.setAttribute('aria-invalid', true);

        element.parentNode.insertBefore(getErrorMessageFieldElement(element, labelKey, locale), element.nextSibling);
        formMessageList.appendChild(getErrorMessageFormElement(element, labelKey, locale));        
    });
    
    form.querySelector('.error-messages h2').textContent = messageHeading;
    formMessage.classList.remove('inv');
    formMessage.focus();
}

/**
 * Validates a form's data according to the specified HTML5 validation rules.
 * @param {DOM element} form The form element to be validated
 * @param {String} locale The user's two letter code locale (en/fr).
 * @return {Boolean} True if errors exist.
 */
export async function isValid(form, locale){
    clearErrors(form);

    const errors = await getErrors(form.elements);
    const isValid = errors.length === 0;

    if(!isValid){
        setErrorMessages(errors, form, locale);
    }

    return isValid;
}