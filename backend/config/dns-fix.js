// backend/config/dns-fix.js
const dns = require('dns');
const { Resolver } = require('dns').promises;

// Force la résolution DNS au niveau du système
dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('📡 Configuration DNS:', dns.getServers());

module.exports = { dns };
