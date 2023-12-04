const {Pool} = require('pg');

//Make sure you have postgres server running on localhost port number 5432. If you have set different usernames and passwords, change them here.

const pool = new Pool({
    user: 'postgres',
    password: 'admin1234',
    host: 'localhost',
    port: "5432",
    database: 'trafficcamera'
});

pool.on('error',(err,client) =>{
    console.error('Unexpected error on idle client', err)
    process.exit(-1);
})

module.exports = pool;