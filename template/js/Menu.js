import * as Ajax from './Ajax';

/**
 * Collection of functions the are used for managing the menus on the 
 * ActiveView pages.
 */

/**
 * Click event handler for menu language swap links
 * @param {String} locale Targe locale of the language swap.
 * @param {String} urlPrefix The URL prefix for the GET/POST requests
 */
export async function languageSwap(locale, urlPrefix){

    // Get the settings page data
    const response = await Ajax.get(`${urlPrefix}?func=personal.settings`);
    const settingsData = Ajax.serialize(response.querySelectorAll('.valueStatic input, .valueStatic select, input[type="hidden"]'));
    const metadataLangElem = response.querySelector('select[name="metadataLang"]');
    
    // Update params in the settings data
    settingsData.func = 'll.savesettings';
    settingsData.localeType = locale;
    settingsData.metadataLang = getMetadataLang(metadataLangElem, locale);

    // Post the updated settings data and reload the page
    await Ajax.post(urlPrefix, settingsData)
    document.location.reload();
}

/**
 * Gets the new metadata language based on the locale.
 * @param {DOM element} elem The DOM element <select> element with the metadata language.
 * @param {String} locale The target locale of the language swap.
 */
export function getMetadataLang(elem, locale){
    const lang = locale === '_fr' ? 'fr' : 'en';
    let metadataLang = 'en_CA';

    if(elem && elem.options){
        for(let i = 0, len = elem.options.length; i < len; i++){
            let value = elem.options[i].value;
            if(value && value.startsWith(lang)){
                metadataLang = value;
                break;
            }
        }
    }
    return metadataLang;
}

/**
 * Opens a floating action menu when the corresponding floating action button (FAB) is triggered.
 * @param {DOM object} fab The floating action button that triggers the menu.
 * @param {DOM object} parent Parent DOM element that contains the FAB and action menu.
 * @param {DOM object} actions Floating action menu DOM element.
 */
export function openFloatingActionMenu(fab, parent, actions){
    fab.setAttribute('aria-expanded', 'true');
    parent.classList.add('open');
    actions.querySelectorAll('a')[0].focus();
}

/**
 * Closes a floating action menu.
 * @param {DOM object} fab The floating action button that triggers the menu.
 * @param {DOM object} parent Parent DOM element that contains the FAB and action menu.
 */
export function closeFloatingActionMenu(fab, parent){
    fab.focus();
    fab.setAttribute('aria-expanded', 'false');
    parent.classList.remove('open');
}
