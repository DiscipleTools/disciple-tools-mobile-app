import i18n from '.';
import { matchers } from 'jest-json-schema';
expect.extend(matchers);
const schema = require('./poeditor.schema');

test('ar schema validation', () => {
  const json = require('./ar');
  expect(json).toMatchSchema(schema);
});

test('bn schema validation', () => {
  const json = require('./bn');
  expect(json).toMatchSchema(schema);
});

test('en schema validation', () => {
  const json = require('./en');
  expect(json).toMatchSchema(schema);
});

test('es schema validation', () => {
  const json = require('./es');
  expect(json).toMatchSchema(schema);
});

test('fa schema validation', () => {
  const json = require('./fa');
  expect(json).toMatchSchema(schema);
});

test('fr schema validation', () => {
  const json = require('./fr');
  expect(json).toMatchSchema(schema);
});

test('id schema validation', () => {
  const json = require('./id');
  expect(json).toMatchSchema(schema);
});

test('nl schema validation', () => {
  const json = require('./nl');
  expect(json).toMatchSchema(schema);
});

test('pt schema validation', () => {
  const json = require('./pt');
  expect(json).toMatchSchema(schema);
});

test('ru schema validation', () => {
  const json = require('./ru');
  expect(json).toMatchSchema(schema);
});

test('sw schema validation', () => {
  const json = require('./sw');
  expect(json).toMatchSchema(schema);
});

test('tr schema validation', () => {
  const json = require('./tr');
  expect(json).toMatchSchema(schema);
});

test('zhCn schema validation', () => {
  const json = require('./zhCn');
  expect(json).toMatchSchema(schema);
});

test('zhTw schema validation', () => {
  const json = require('./zhTw');
  expect(json).toMatchSchema(schema);
});
