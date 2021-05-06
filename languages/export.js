const https = require('https');
const fs = require('fs');
// required params
const api_token = process.env.POEDITOR_API_KEY;
const id = '303023';
const options = {
  hostname: 'api.poeditor.com',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};
const listLanguages = async () => {
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
const getExportLink = async (lang) => {
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
  const code_p = mapCode(code);
  https.get(url, (res) => {
    const path = `${__dirname}/${code_p}.json`;
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      const desc = code !== code_p ? `${code} (${code_p})` : code;
      console.log(`download complete for "${desc}"`);
    });
  });
};
const mapCode = (code) => {
  if (code === 'pt-br') return 'pt';
  if (code === 'zh-Hans') return 'zhCn';
  if (code === 'zh-Hant') return 'zhTw';
  return code;
};
const runner = async () => {
  try {
    const langRes = await listLanguages();
    const languages = JSON.parse(langRes).result.languages;
    for (var ii = 0; ii < languages.length; ii++) {
      // map to mobile app code file format
      const code = languages[ii].code;
      const ignoreList = [
        'ar-ma',
        'gu',
        'ha',
        'it',
        'kn',
        'mr',
        'ms',
        'ne',
        'pa',
        'ps',
        'so',
        'ta',
        'te',
        'ur',
      ];
      if (ignoreList.includes(code)) continue;
      console.log(`processing "${code}"...`);
      const exportRes = await getExportLink(code);
      const url = JSON.parse(exportRes).result.url;
      await downloadExport(code, url);
    }
  } catch (err) {
    console.error(err);
  }
};
runner();
