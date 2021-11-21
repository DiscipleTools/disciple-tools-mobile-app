/*
This helper script interfaces with POEditor API in the following ways:

1. List available languages for D.T Theme project AND D.T Mobile App project
2. (For each list above) Filter out any language with a completion percentage of less than specified threshold (ie., 80%)
3. Filter out any language from D.T Mobile App project that does not also exist in D.T Theme project 
4. For any remaining supported language, build and GET an "export link"
5. Download the supported language files in JSON key/value format via the "export links"
6. Output a 'languages/index.js' file which will be imported at runtime by 'hooks/useI18N.js' to support translation

NOTE: Locale codes are mapped per the D.T definitions in order to match (ie., 'fa' -> 'fa_IR')
*/

const https = require('https');
const fs = require('fs');

// constants
const TRANSLATION_THRESHOLD = 80.0;
const POEDITOR_THEME_ID = '251019';
const POEDITOR_MOBILE_ID = '303023';

if (!process.env.POEDITOR_API_KEY) {
  console.log("Missing required 'POEDITOR_API_KEY'");
  process.exit(1);
}

// required params
const api_token = process.env.POEDITOR_API_KEY;
const options = {
  hostname: 'api.poeditor.com',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

// ref: https://github.com/DiscipleTools/disciple-tools-theme/blob/master/dt-assets/translation/download-poeditor-updates.php
const mapCode = (code) => {
  if (code === 'am') return 'am_ET';
  if (code === 'ar-ma') return 'ar_MA';
  if (code === 'bg') return 'bg_BG';
  if (code === 'bn') return 'bn_BD';
  if (code === 'bs') return 'bs_BA';
  if (code === 'es') return 'es_ES';
  if (code === 'es-419') return 'es_419';
  if (code === 'es-ar') return 'es_AR';
  if (code === 'es-co') return 'es_CO';
  if (code === 'es-mx') return 'es_MX';
  if (code === 'fa') return 'fa_IR';
  if (code === 'fr') return 'fr_FR';
  if (code === 'hi') return 'hi_IN';
  if (code === 'mk') return 'mk_MK';
  if (code === 'my') return 'my_MM';
  if (code === 'ne') return 'ne_NP';
  if (code === 'zh-Hans') return 'zh_CN';
  if (code === 'zh-Hant') return 'zh_TW';
  if (code === 'nl') return 'nl_NL';
  if (code === 'en') return 'en_US';
  if (code === 'de') return 'de_DE';
  if (code === 'id') return 'id_ID';
  if (code === 'ko') return 'ko_KR';
  if (code === 'pt-br') return 'pt_BR';
  if (code === 'ru') return 'ru_RU';
  if (code === 'sr') return 'sr_BA';
  if (code === 'sl') return 'sl_SI';
  if (code === 'tr') return 'tr_TR';
  if (code === 'ro') return 'ro_RO';
  if (code === 'pa') return 'pa_IN';
  if (code === 'it') return 'it_IT';
  return code;
};

const listLanguages = async (id) => {
  return new Promise((resolve, reject) => {
    const data = `api_token=${api_token}&id=${id}`;
    options['path'] = '/v2/languages/list';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
    let response = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        response += chunk;
        resolve(response);
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.write(data);
    req.end();
  });
};

const getExportLink = async (lang, id) => {
  return new Promise((resolve, reject) => {
    const type = 'key_value_json';
    const data = `api_token=${api_token}&id=${id}&language=${lang}&type=${type}`;
    options['path'] = '/v2/projects/export';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
    let response = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        response += chunk;
        resolve(response);
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.write(data);
    req.end();
  });
};

const downloadExport = async (code, url) => {
  const mappedCode = mapCode(code);
  https.get(url, (res) => {
    const path = `${__dirname}/${mappedCode}.json`;
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      const desc = code !== mappedCode ? `${code} (${mappedCode})` : code;
      console.log(`download complete for "${desc}"`);
    });
  });
};

const getLangCodes = async (id) => {
  const res = await listLanguages(id);
  const langs = JSON.parse(res).result.languages;
  const codes = langs
    .map((lang) => {
      if (lang.percentage >= TRANSLATION_THRESHOLD) return lang.code;
    })
    .filter((x) => !!x);
  return codes;
};

const runner = async () => {
  try {
    const themeCodes = await getLangCodes(POEDITOR_THEME_ID);
    const mobileCodes = await getLangCodes(POEDITOR_MOBILE_ID);
    const supportedCodes = mobileCodes
      .map((code) => {
        if (themeCodes.includes(code)) return code;
      })
      .filter((x) => !!x);
    console.log(`supportedCodes: ${JSON.stringify(supportedCodes)}`);
    const exportVar = {};
    var stream = fs.createWriteStream(__dirname + '/index.js', { flags: 'w' });
    //supportedCodes.forEach(code => {
    for (let ii = 0; ii < supportedCodes.length; ii++) {
      const code = supportedCodes[ii];
      const mappedCode = mapCode(code);
      const desc = code !== mappedCode ? `${code} (${mappedCode})` : code;
      console.log(`processing "${desc}"`);
      const data = `const ${mappedCode} = require('./${mappedCode}.json');\n`;
      stream.write(data);
      exportVar[mappedCode] = code;
      const res = await getExportLink(code, POEDITOR_MOBILE_ID);
      const url = JSON.parse(res).result.url;
      await downloadExport(code, url);
    }
    stream.write('module.exports = {\n');
    supportedCodes.forEach((code) => {
      const mappedCode = mapCode(code);
      stream.write(`\t"${mappedCode}": ${mappedCode},\n`);
    });
    stream.write('};\n');
    stream.end();
  } catch (err) {
    console.error(err);
  }
};
runner();
