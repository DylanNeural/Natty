require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;
const { URL, URLSearchParams } = require('url');

const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI:', uri);

async function resolveSrvHosts(hostname) {
  const resolver = new dns.Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
  return resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
}

async function buildDirectMongoUri(uriString) {
  if (!uriString.startsWith('mongodb+srv://')) return uriString;
  const u = new URL(uriString);
  const dbName = u.pathname === '/' ? '' : u.pathname.slice(1);
  const username = u.username ? encodeURIComponent(u.username) : '';
  const password = u.password ? encodeURIComponent(u.password) : '';
  const host = u.hostname;
  const query = new URLSearchParams(u.searchParams);
  const srv = await resolveSrvHosts(host);
  const hosts = srv.map((r) => `${r.name}:${r.port}`).join(',');
  if (!query.has('tls') && !query.has('ssl')) query.set('tls', 'true');
  if (!query.has('retryWrites')) query.set('retryWrites', 'true');
  if (!query.has('w')) query.set('w', 'majority');
  if (!query.has('authSource')) query.set('authSource', 'admin');
  const authority = username ? `${username}:${password}@` : '';
  const dbPath = dbName ? `/${dbName}` : '';
  return `mongodb://${authority}${hosts}${dbPath}?${query.toString()}`;
}

(async () => {
  try {
    const direct = await buildDirectMongoUri(uri);
    console.log('Direct URI:', direct);
    console.log('Testing original URI...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 10000 });
    console.log('Connected with original URI!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Original URI error:', err.message);
  }
  try {
    const direct = await buildDirectMongoUri(uri);
    console.log('Testing direct URI...');
    await mongoose.connect(direct, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 10000 });
    console.log('Connected with direct URI!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Direct URI error:', err.message);
  }
})();