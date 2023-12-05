var express = require('express');
const pool = require("../../connectedcar_database")
var router = express.Router();

/* GET connected car data from database. */
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
router.get('/:ids',async function(req, res, next) {
    try{
        const client = await pool.connect();
        await client.query('PREPARE query AS SELECT * FROM OBSERVATION WHERE observationid in ('+req.params.ids+');');
        result = await client.query('EXECUTE query;');
        await client.query('DEALLOCATE query');
        client.release();
        res.status(200).send(result.rows);
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
        await client.query('PREPARE query (numeric,numeric,numeric,numeric,text,numeric) AS INSERT INTO OBSERVATION VALUES ($1,$2,$3,$4,CURRENT_TIMESTAMP,$5,$6);');
        result = await client.query('EXECUTE query ('+req.get("id")+','+req.get("sensorid")+','+req.get("latitude")+','+req.get("longitude")+',\''+req.get("vehicleclass")+'\','+req.get("vehiclespeed")+');');
        await client.query('DEALLOCATE query');
        client.release();
        res.status(200).send("Succesfully inserted "+result.rowCount+" rows")
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;
