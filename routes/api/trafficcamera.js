var express = require('express');
const pool = require("../../trafficcamera_database")
var router = express.Router();

/* GET traffic camera data from database. */
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

module.exports = router;
