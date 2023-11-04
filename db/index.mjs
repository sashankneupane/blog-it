import mongoose from 'mongoose';

const dbURL = process.env.DSN;

mongoose.connect(dbURL);

const db = mongoose.connection;

db.on('error', console.log.bind(console, 'Connection error: Check your database connection'));
db.once('open', () => console.log('Connected to the database.'));