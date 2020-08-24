import { feature, scenario, when, When } from '@hypercubed/cypress-gherkin';

When('the string {string} is attached as {string}', (a: string, b: string) => {

});

When('the following string is attached as {string}:', (a: string) => {

});

When('the string {string} is logged', (a: string) => {

});

When('text with ANSI escapes is logged', () => {

});

When('an array with {int} bytes is attached as {string}', (a: number, b: string) => {

});

When('a JPEG image is attached', () => {

});

feature('Attachments', () => {
  scenario('Strings can be attached with a media type', () => {
    when('the string "hello" is attached as "application/octet-stream"');
  });
  
  scenario('Log JSON', () => {
    when('the following string is attached as "application/json":', `{"message": "The <b>big</b> question", "foo": "bar"}`);
  });
  
  scenario('Log text', () => {
    when('the string "hello" is logged');
  });
  
  scenario('Log ANSI coloured text', () => {
    when('text with ANSI escapes is logged');
  });
  
  scenario('Byte arrays are base64-encoded regardless of media type', () => {
    when('an array with 10 bytes is attached as "text/plain"');
  });
  
  scenario('Streams are always base64-encoded', () => {
    when('a JPEG image is attached');
  });
});
