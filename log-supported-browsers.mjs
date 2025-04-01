import browserslist from 'browserslist';

const targets = await import('./config/targets.js');

const browsers = browserslist(targets.browsers);
console.log('Supported Browsers:', browsers);
