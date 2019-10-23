import * as Ajax from './Ajax';
import MockXMLHttpRequest from 'mock-xmlhttprequest';

let server;

beforeAll(() => {
    server = MockXMLHttpRequest.newServer().install();
    server.get('/get/test/valid',           {status: 200, headers: { 'Content-Type': 'text/html' }, body: '<p>howdy</p>'});
    server.get('/get/test/valid/json',      {status: 200, headers: { 'Content-Type': 'application/json' }, body: '{"message": "Success"}'});    
    server.get('/get/test/invalid',         (xhr) => xhr.setNetworkError());
    server.post('/post/test/valid',         {status: 200, headers: { 'Content-Type': 'text/html' }, body: '<p>mello</p>'});
    server.post('/post/test/valid/json',    {status: 200, headers: { 'Content-Type': 'application/json' }, body: '{"another": "rousing success"}'});
    server.post('/post/test/invalid',         (xhr) => xhr.setNetworkError());           
});

afterAll(() => {
    server.remove();
});

/**
 * Tests the Ajax functions
 */
describe('Ajax GET requests', () => {

    it('should return the HTML content of a valid URL', async () => {
        await expect(Ajax.get('/get/test/valid')).resolves.toBe('<p>howdy</p>');
    });

    it('should return the JSON content of a valid URL', async () => {
        await expect(Ajax.get('/get/test/valid/json', 'json')).resolves.toEqual({"message": "Success"});
    });    

    it('should fail with a network error', async () => {
        await expect(Ajax.get('/get/test/invalid')).rejects.toBe('Failed to GET /get/test/invalid');
    });

});

describe('Ajax POST requests', () => {

    it('should return the HTML content of a valid URL', async () => {
        await expect(Ajax.post('/post/test/valid', {key: 'value'})).resolves.toBe('<p>mello</p>');
    });

    it('should return the JSON content of a valid URL', async () => {
        await expect(Ajax.post('/post/test/valid/json', {another: 'key value'}, 'json')).resolves.toEqual({"another": "rousing success"});
    });

    it('should fail with a network error', async () => {
        await expect(Ajax.post('/post/test/invalid', {another: 'key value'})).rejects.toBe('Failed to POST /post/test/invalid');
    });    

});

describe('objectToParams', () => {

    it('should convert an object to parameters', async () => {
        expect(Ajax.objectToParams({key: 'value'})).toBe('key=value');
    });

    it('should URL encode the key and value of the parameters', async () => {
        expect(Ajax.objectToParams({'key with spécial& characters': 'key value 123 456 789 éè'}, 'json')).toBe('key%20with%20sp%C3%A9cial%26%20characters=key%20value%20123%20456%20789%20%C3%A9%C3%A8');
    });

    it('should return an empty string if no data is specified', async () => {
        expect(Ajax.objectToParams()).toBe('');
    });    

});

describe('serialize', () => {

    beforeAll(() => {

        document.body.innerHTML = `
            <!DOCTYPE html><html><body>
                <input type="hidden" name="foo" value="bar"> 
                <input type="text" name="bam" value="baz"> 
                <input type="text" name="bim" value="salabim" disabled>
                <select name="number">
                    <option></option>
                    <option value="1">One</option>
                    <option value="2" selected>Two</option>
                    <option value="3">Three</option>
                </select>
                <input type="checkbox" name="on" value="on" checked>
                <input type="checkbox" name="off" value="off">
                <input type="radio" name="type" value="lab">
                <input type="radio" name="type" value="collie">
                <input type="radio" name="type" value="doodle" checked>
                <input type="radio" name="type" value="shepard">
                <input type="text" name="fruits[]" value="bananana">
                <input type="text" name="fruits[]" value="apples">
                <input type="text" name="fruits[]" value="grapes">
            </body></html>
        `;
    });    

    it('should serialize a list of form elements into key/value object', async () => {
        expect(Ajax.serialize(document.querySelectorAll('input[type="text"], input[type="hidden"]'))).toEqual({'foo': 'bar', 'bam': 'baz', 'fruits[]': ['bananana', 'apples', 'grapes']});
    });

    it('should an empty object if there are no elements', async () => {
        expect(Ajax.serialize(document.querySelectorAll('#does-not-exist'))).toEqual({});
    });  
    
    it('should only return the selected value of a select', async () => {
        expect(Ajax.serialize(document.querySelectorAll('select'))).toEqual({number: '2'});
    }); 

    it('should only return the selected value of radio button group', async () => {
        expect(Ajax.serialize(document.querySelectorAll('input[type="radio"]'))).toEqual({type: 'doodle'});
    });     
    
    it('should return value for a checked checkbox', async () => {
        expect(Ajax.serialize(document.querySelectorAll('input[type="checkbox"]'))).toEqual({on: 'on'});
    }); 

    it('should not return the value for a disabled element', async () => {
        expect(Ajax.serialize(document.querySelectorAll('input[disabled]'))).toEqual({});
    });     

});
