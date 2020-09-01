const { Client } = require('pg');

const client = new Client({
  user:        'postgres',
  host:       'localhost',
  database:   'postgres',
  password:   'password',
  port:       5432
});

client.connect();

const user_id = '57f34014-1ab2-49a2-8bc0-20dfcf1e8444';
const freet_id = '83c85107-fe9f-4aee-b245-e98664262bfe';

//client.query("INSERT INTO users (name, password) VALUES('a', 'b')", (err,res)=>{
// client.query("SELECT * FROM users", (err,res)=>{
// client.query("INSERT INTO freets (author_id, message) VALUES($1, 'A message')", [user_id], (err,res)=>{
client.query("SELECT * FROM freets", (err,res)=>{
  console.log(err);
  if (res) {
    console.log(res.rows);
  }
  client.end();
});
