var express = require('express');
const pool = require("../../mobiledata_database")
var router = express.Router();

/* GET mobile data from database. */
router.get('/',async function(req, res, next) {
    try{
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM OBSERVATION');
        client.release();
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/delete/:id',async function(req, res, next) {
    try{
        const client = await pool.connect();
        await client.query('PREPARE query (numeric) AS DELETE FROM OBSERVATION WHERE observationid = $1;');
        result = await client.query('EXECUTE query ('+req.params.id+');');
        await client.query('DEALLOCATE query');
        client.release();
        res.status(200).send("Succesfully deleted "+result.rowCount+" rows")
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/add/',async function(req, res, next) {
    try{
        const client = await pool.connect();
        await client.query('PREPARE query (numeric,numeric,numeric,numeric) AS INSERT INTO OBSERVATION VALUES ($1,$2,$3,$4,CURRENT_TIMESTAMP);');
        result = await client.query('EXECUTE query ('+req.get("id")+','+req.get("sensorid")+','+req.get("latitude")+','+req.get("longitude")+');');
        await client.query('DEALLOCATE query');
        client.release();
        res.status(200).send("Succesfully inserted "+result.rowCount+" rows")
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
