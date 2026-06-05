import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';

const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const mongoCnnLine = envContent.split('\n').find(line => {
  const trimmed = line.trim();
  return trimmed.startsWith('MONGO_CNN') && !trimmed.startsWith('#');
});

if (!mongoCnnLine) {
  console.error('MONGO_CNN not found in .env');
  process.exit(1);
}
// Correctly get everything after the first '='
const index = mongoCnnLine.indexOf('=');
const mongoUri = mongoCnnLine.substring(index + 1).replace(/[\r\n;]/g, '').trim();

const menusPath = path.resolve(__dirname, '../configuration/data/menus.json');
const fileContent = fs.readFileSync(menusPath, 'utf8');
const menusData = JSON.parse(fileContent);

const cleanMenus = menusData.map((item: any) => {
  const { _id, __v, createdAt, updatedAt, ...rest } = item;
  return {
    ...rest,
    createdAt: createdAt?.$date ? new Date(createdAt.$date) : new Date(),
    updatedAt: updatedAt?.$date ? new Date(updatedAt.$date) : new Date(),
  };
});

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'oic' });
  console.log('Connected successfully.');
  
  const Menu = mongoose.model('Menu', new mongoose.Schema({}, { strict: false }));
  
  console.log('Deleting existing menus...');
  await Menu.deleteMany({});
  
  console.log('Inserting seeded menus...');
  const res = await Menu.insertMany(cleanMenus);
  console.log(`Seeded ${res.length} menus successfully.`);
  
  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
