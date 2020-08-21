import i18n from '.';

describe('languages/en and fallback', () => {
  beforeAll(() => i18n.setLocale('??', false)); // set ?? unknown Locale to test fallback to English (en-US)

  test('test missing translation', () => {
    expect(i18n.t('global.zz')).toEqual('[missing "??.global.zz" translation]');
  });

  test('test global.success.save translation', () => {
    expect(i18n.t('global.success.save')).toEqual('Data saved successfully!');
  });
});
