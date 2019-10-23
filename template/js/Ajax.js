/**
 * Uses XMLHttpRequest to send a GET request to a URL.  The resonse is returned 
 * @param {String} url The URL to GET.
 * @param {String} responseType The expected response type.  Can be one 
 * of https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType and 
 * defaults to 'document' if not specified.
 */
export function get(url, responseType) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Setup callbacks
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(`Failed to GET ${url}`);

        // Get the HTML
        xhr.open('GET', url, true);
        xhr.responseType = responseType ? responseType : 'document';
        xhr.send();
    });
};

/**
 * Uses XMLHttpRequest to send a POST request to a URL.
 * @param {String} url The URL to GET.
 * @param {Object} data Key/value object of data to post.
 * @param {String} responseType The expected response type.  Can be one 
 * of https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType and 
 * defaults to 'document' if not specified.
 */
export function post(url, data, responseType) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const params = objectToParams(data);

        // Setup callbacks
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(`Failed to POST ${url}`);

        // Get the response
        xhr.open('POST', url, true);
        xhr.responseType = responseType ? responseType : 'document';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    });
};

/**
 * Takes a key/value object and converts it to a key/value parameter string 'foo=bar&bam=baz'
 * @param {Object} data Key/value object data to convert to parameter string.
 * @return {String} key/value parameter string.  Returns empty string if no data specified.
 */
export function objectToParams(data) {
    let params = '';
    if(data){
        params = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    }
    return params;
}

/**
 * Given an array of DOM elements, returns a key/value object of the element's name and value
 * @param {Array} elements An array of DOM elements
 */
export function serialize(elements) {
    const data = {};

    if(elements && elements.length){
        for(let i = 0, len = elements.length; i < len; i++){
            let element = elements[i];
            if (isValidElement(element) && isValidValue(element)) {
                // Array notation in field names.  Serialize the element's value as an array
                if (element.name.endsWith('[]')) {
                    data[element.name] = (data[element.name] || []).concat(element.value);
                } else {
                    data[element.name] = element.value;
                }
            }
        }
    }

    return data;
}

/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
const isValidElement = element => {
    return element.name && element.value;
};
  
/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox or disabled element).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
const isValidValue = element => {
    return !element.disabled && (!['checkbox', 'radio'].includes(element.type) || element.checked);
};

