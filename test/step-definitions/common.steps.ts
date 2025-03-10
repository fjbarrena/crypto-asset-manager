import { Given, Then, When, defineParameterType } from '@cucumber/cucumber';
import { TestContext } from './test.context';
import { AxiosInstance } from 'axios';
import { expect } from 'earl';

defineParameterType({
  name: 'boolean',
  regexp: /true|false/,
  transformer: (s) => (s === 'true' ? true : false),
});

Given('An unauthorized user', function () {
  TestContext.jwtInUse = '';
});

Then(
  'Wait for {int} milliseconds',
  { timeout: 60 * 1000 },
  async function (milliseconds) {
    await new Promise((r) => setTimeout(r, milliseconds));
  },
);

Then('Check that response is', function (docString) {
  const expectedResult = JSON.parse(docString);
  expect(TestContext.resultDataInUse).toEqual(expectedResult);
});

Then('Check that returned status is {int}', function (code) {
  expect(TestContext.resultStatusCodeInUse).toEqual(code);
});

Then('Save the response in the key {string}', function (key) {
  const value = TestContext.resultDataInUse;
  TestContext.storedValues.set(key, value);
});

Then(
  'Save the response property {string} in the key {string}',
  function (propertyName, key) {
    const value = TestContext.resultDataInUse;
    TestContext.storedValues.set(key, value[propertyName]);
  },
);

Then('Uses the key {string} as payload', function (key) {
  TestContext.payload = TestContext.storedValues.get(key);
});

When('Uses the payload', function (docString) {
  const replaced = TestContext.replaceStoredValues(docString);
  TestContext.payload = JSON.parse(replaced);
});

When(
  'calls with {string} {string}',
  async function (httpVerb: string, endpoint: string) {
    const client: AxiosInstance = TestContext.getHttpClient();
    const finalEndpoint = TestContext.replaceValues(endpoint);

    switch (httpVerb.toUpperCase()) {
      case 'POST':
        await client.post(finalEndpoint, TestContext.payload);
        break;
      default:
        console.error(`HTTP verb "${httpVerb}" invalid or not available`);
        break;
    }
  },
);

Then('Set the JWT Authorization header', function () {
  const jwt = TestContext.resultDataInUse;
  TestContext.jwtInUse = jwt.accessToken;
});

Then(
  'Check that response property {string} is {int}',
  function (property, expectedValue) {
    const receivedValue = TestContext.resultDataInUse[property];
    expect(receivedValue).toEqual(expectedValue);
  },
);

Then(
  'Check that response property {string} is {string}',
  function (property, expectedValue) {
    const receivedValue = TestContext.resultDataInUse[property];
    expect(receivedValue).toEqual(expectedValue);
  },
);

Then('Check that response property {string} is true', function (property) {
  const receivedValue = TestContext.resultDataInUse[property];
  expect(receivedValue).toBeTruthy();
});

Then('Check that response property {string} is false', function (property) {
  const receivedValue = TestContext.resultDataInUse[property];
  expect(receivedValue).toBeFalsy();
});

Then(
  'Check that response property {string} is boolean {boolean}',
  function (property, expectedValue) {
    console.log(TestContext.resultDataInUse);
    const receivedValue = TestContext.resultDataInUse[property];
    expect(receivedValue).toEqual(expectedValue);
  },
);

Then(
  'Check that response array at {string} contains at least one item with the property {string} with the value {string}',
  function (arrayProperty, containsProperty, expectedValue) {
    const array: any[] = TestContext.resultDataInUse[arrayProperty];

    const result = array.find((x) => x[containsProperty] === expectedValue);
    expect(result).not.toBeNullish();
  },
);
