import * as Menu from './Menu';
import * as Ajax from './Ajax';

/**
 * Tests the ActiveVew menu functions
 */
describe('languageSwap: should GET user settings, serialize and send a POST request', () => {

    const originalFns = {};

    // Mock the global document object and create spies
    beforeAll(() =>{
        document.body.innerHTML = `
            <!DOCTYPE html><html><body>
                <div class="valueStatic"><input type="text" name="foo" value="bar"></div>
                <div class="valueStatic"><input type="text" name="bam" value="baz"></div>
                <input type="hidden" name="bim" value="bing">
                <select name="metadataLang">
                    <option></option>
                    <option value="en_CA">English</option>
                    <option value="fr_CA">Français</option>
                </select>
            </body></html>
        `;

        originalFns['Ajax.get'] = Ajax.get;
        originalFns['Ajax.post'] = Ajax.post;
        originalFns['document.location.reload'] = document.location.reload;

        Ajax.get = jest.fn();
        Ajax.post = jest.fn();
        document.location.reload = jest.fn();

        Ajax.get.mockResolvedValue(document);
        Ajax.post.mockResolvedValue(document);
    });

    // Restore the original functions
    afterAll(() => {
        Ajax.get = originalFns['Ajax.get'];
        Ajax.post = originalFns['Ajax.post'];
        document.location.reload = originalFns['document.location.reload'];
    });

    it('should send a GET and POST request with expected data to an expected target', async () => {
        await Menu.languageSwap('_fr', 'http://localhost:8080');

        expect(Ajax.get).toHaveBeenCalledWith('http://localhost:8080?func=personal.settings');
        expect(Ajax.post).toHaveBeenCalledWith('http://localhost:8080', {"bam": "baz", "bim": "bing", "foo": "bar", "func": "ll.savesettings", "localeType": "_fr", "metadataLang": "fr_CA"});
        expect(document.location.reload).toHaveBeenCalled();
    });   
});

describe('getMetadataLang: should set the metadata language based the locale', () => {

    const originalFns = {};

    // Mock the global document object and create spies
    beforeAll(() =>{
        document.body.innerHTML = `
            <!DOCTYPE html><html><body>
                <select name="metadataLang">
                    <option></option>
                    <option value="en_CA">English</option>
                    <option value="fr_CA">Français</option>
                    <option value="ru">русский</option>
                </select>
            </body></html>
        `;
    });

    it('should get the metadata lang from the passed locale', async () => {
        expect(Menu.getMetadataLang(document.querySelector('[name="metadataLang"]'), '_fr')).toBe('fr_CA');
        expect(Menu.getMetadataLang(document.querySelector('[name="metadataLang"]'), '_en_CA')).toBe('en_CA');
    });

    it('should default to english if the locale is not recognized', async () => {
        expect(Menu.getMetadataLang(document.querySelector('[name="metadataLang"]'), 'ru')).toBe('en_CA');
    });
    
    it('should default to english if there is not a metadata lang DOM element', async () => {
        expect(Menu.getMetadataLang(null, '_fr')).toBe('en_CA');
    });  
});

describe('Open and close a floating action menu', () => {
    
    let actions;
    let fab;
    let parent;
    let links;

    // Mock the global document object and create spies
    beforeAll(() =>{
        document.body.innerHTML = `
            <div class="floating-menu">
                <button></button>
                <div class="actions">
                    <ul>
                        <li><a href="#">Thing 1</a></li>
                        <li><a href="#">Thing 2</a></li>
                    </ul>
                </div>
                <div class="scrim"></div>
            </div>
        `;
               
        actions = document.querySelector('.floating-menu .actions');
        fab = document.querySelector('.floating-menu button');
        parent = document.querySelector('.floating-menu');
        links = document.querySelectorAll('.floating-menu .actions a');
        
        fab.focus = jest.fn();
        links.forEach((e) => e.focus = jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });    

    it('should open the floating action menu', async () => {
        Menu.openFloatingActionMenu(fab, parent, actions);
        expect(fab.getAttribute('aria-expanded')).toBe('true');
        expect(parent.classList.contains('open')).toBe(true);
        expect(links[0].focus).toHaveBeenCalled();
        expect(links[1].focus).not.toHaveBeenCalled();
    });

    it('should close the floating action menu', async () => {
        Menu.closeFloatingActionMenu(fab, parent);
        expect(fab.focus).toHaveBeenCalled();
        expect(fab.getAttribute('aria-expanded')).toBe('false');
        expect(parent.classList.contains('open')).toBe(false);
    });    

});
