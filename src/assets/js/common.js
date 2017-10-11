import fetchJsonp from 'fetch-jsonp';

export const jsonp = (url) => fetchJsonp(`https://api.douban.com/v2/movie${url}`).then(r => r.json()).catch(ex => console.error(ex));
