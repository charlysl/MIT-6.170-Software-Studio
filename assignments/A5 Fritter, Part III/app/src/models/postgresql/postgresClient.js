/**
*
* This module is responsible for managing the postgresql client
*
*/

const { Client } = require('pg');

const client = new Client({
  user:        'postgres',
  host:       'localhost',
  // database:   'postgres',
  database:   'fritter_test',
  password:   'password',
  port:       5432
});

client.connect();

module.exports = client;
