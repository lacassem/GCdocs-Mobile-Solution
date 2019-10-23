
const SNACKBAR_MESSAGE_KEY = 'snackbar';
const SNACKBAR_INDEFINTE_KEY = 'snackbarIndef';

/**
 * Search through a given DOM for selectors that contain status messages.
 * @param {DOM} doc The root DOM document object to search for selectors.
 * @param {Array[String]} selectors Selectors to look for that contain a message.  If more than one selector matches, all messages will be returned.
 * @return {Array[String]} All text found in the selectors.  Messages order matches selectors order.
 */
export function getStatusMessages(doc, selectors){
    const messages = [];
    for(let i = 0, len = selectors.length; i < len; i++){
        Array.from(doc.querySelectorAll(selectors[i])).forEach((el) => messages.push(el.textContent));
    }
    return messages;
}

/**
 * Stores a snackbar message in sessionStorage.
 * @param {String} message The message to store.
 */
export function setSnackbarMessage(message){
    sessionStorage.setItem(SNACKBAR_MESSAGE_KEY, message);
}

/**
 * Gets a snackbar message from sessionStorage.
 * @return {String} The message stored in sessionStorage.
 */
export function getSnackbarMessage(){
    return sessionStorage.getItem(SNACKBAR_MESSAGE_KEY);
}

/**
 * Clears a snackbar message from sessionStorage
 */
export function clearSnackbarMessage(){
    sessionStorage.removeItem(SNACKBAR_MESSAGE_KEY);
}

/**
 * Gets the snackbar indefinite property from sessionStorage.  This property can be used to have a snackbar
 * open the does not close automatically.
 * @return {Boolean} Should this snackbar be displayed indefinitely?
 */
export function isSnackbarIndefinite(){
    const isIndefinite = sessionStorage.getItem(SNACKBAR_INDEFINTE_KEY);
    return isIndefinite !== null && isIndefinite !== "false";
}

/**
 * Sets the snackbar indefinite property from sessionStorage.  This property can be used to have a snackbar
 * @param {Boolean} isIndefinite Should this snackbar be displayed indefinitely?
 */
export function setSnackbarIndefinite(isIndefinite){
    sessionStorage.setItem(SNACKBAR_INDEFINTE_KEY, isIndefinite);
}
