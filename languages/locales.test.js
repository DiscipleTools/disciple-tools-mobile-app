import i18n from '.';
let locale = 'es_ES';

import sharedTools from '../shared';

describe('languages/' + locale, () => {
  beforeAll(() => i18n.setLocale(locale));

  test('test missing translation', () => {
    expect(i18n.t('global.zz')).toEqual('[missing "' + locale + '.global.zz" translation]');
  });

  test('test global.success.save translation', () => {
    expect(i18n.t('global.success.save')).toEqual('Datos guardados correctamente!');
  });

  test('test date typeof number 10 digits', () => {
    const ms_number_10 = 1630900800;
    expect(sharedTools.formatDateToView(ms_number_10, locale)).toEqual('06 de septiembre de 2021');
  });

  test('test date typeof number 13 digits', () => {
    const ms_number_13 = 1632452824000;
    expect(sharedTools.formatDateToView(ms_number_13, locale)).toEqual('24 de septiembre de 2021');
  });

  test('test date typeof string 10 chars', () => {
    const ms_string_10 = '1630454400';
    expect(sharedTools.formatDateToView(ms_string_10, locale)).toEqual('01 de septiembre de 2021');
  });

  test('test date typeof string ISO', () => {
    const iso_string = '2021-09-26T00:07:07.443Z';
    expect(sharedTools.formatDateToView(iso_string, locale)).toEqual('26 de septiembre de 2021');
  });

  test('test date typeof string UTC', () => {
    const utc_string = 'Sat, 25 Sep 2021 20:30:00 GMT';
    expect(sharedTools.formatDateToView(utc_string, locale)).toEqual('25 de septiembre de 2021');
  });
});
