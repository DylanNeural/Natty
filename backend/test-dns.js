const db = require('./config/db');
const dns = require('dns').promises;

console.log('system servers before setServers', require('dns').getServers());
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
console.log('system servers after setServers', require('dns').getServers());

dns.resolveSrv('_mongodb._tcp.natty.1vsjt0f.mongodb.net')
  .then(records => {
    console.log('SRV records', records);
  })
  .catch(err => {
    console.error('SRV error', err);
  });
