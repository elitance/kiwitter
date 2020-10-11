import mysql = require('mysql');
import fs = require('fs');

const profile: any = JSON.parse(fs.readFileSync('./profile.json', 'utf-8'));
const connection: mysql.Connection = mysql.createConnection({
   host: 'localhost',
   user: profile.mysql.user,
   password: profile.mysql.password,
   database: 'kiwitter'
});

connection.connect();

export = connection;