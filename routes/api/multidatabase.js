var express = require('express');
const pool = require("../../multi_database")
var router = express.Router();

/* GET data from multiple databases. */
router.get('/',async function(req, res, next) {
    try{
        console.log(req.query.operator)
        console.log(req.query.speed)
        if(parseFloat(req.query.speed) != NaN){
            switch (req.query.operator){
                case "lessthan":
                    operator = "<"
                    speed = req.query.speed
                    break
                case "morethan":
                    operator = ">"
                    speed = req.query.speed
                    break
                case "equals":
                    operator = "="
                    speed = req.query.speed
                    break
                default:
                    console.error("invalid operator")
                    throw new Error("invalid operator")
            }
                const client = await pool.connect();
                const dblink = await client.query("CREATE EXTENSION IF NOT EXISTS dblink;");
                const query = "SELECT *,'In-road measurement' as sensorType FROM public.dblink('host=localhost user=postgres password=admin1234 dbname=inroad','SELECT observationid, sensorid, latitude, longitude, timestamp, vehicleclass, vehiclelength, vehiclespeed, lane, null as vehiclesinview FROM OBSERVATION') AS DATA(observationid INTEGER, sensorid INTEGER, latitude FLOAT8, longitude FLOAT8, timestamp TIMESTAMPTZ, vehicleclass CHARACTER VARYING, vehiclelength FLOAT8, vehiclespeed FLOAT8, lane INTEGER, vehiclesinview INTEGER) WHERE vehiclespeed"+operator+speed+" UNION SELECT *,'Traffic camera' as sensorType FROM public.dblink('host=localhost user=postgres password=admin1234 dbname=trafficcamera','SELECT observationid, sensorid, latitude, longitude, timestamp, Null as vehicleclass, Null as vehiclelength, Null as vehiclespeed, Null as lane, vehiclesinview FROM OBSERVATION') AS DATA(observationid INTEGER, sensorid INTEGER, latitude FLOAT8, longitude FLOAT8, timestamp TIMESTAMPTZ,vehicleclass CHARACTER VARYING, vehiclelength FLOAT8, vehiclespeed FLOAT8, lane INTEGER, vehiclesinview INTEGER) WHERE vehiclespeed"+operator+speed+" UNION SELECT *,'Connected car' as sensorType FROM public.dblink('host=localhost user=postgres password=admin1234 dbname=connectedcar','SELECT observationid, sensorid, latitude, longitude, timestamp, vehicleclass, Null as vehiclelength, vehiclespeed, Null as lane, Null as vehiclesinview FROM OBSERVATION') AS DATA(observationid INTEGER, sensorid INTEGER, latitude FLOAT8, longitude FLOAT8, timestamp TIMESTAMPTZ,vehicleclass CHARACTER VARYING, vehiclelength FLOAT8, vehiclespeed FLOAT8, lane INTEGER, vehiclesinview INTEGER) WHERE vehiclespeed"+operator+speed+" UNION SELECT *,'Mobile data' as sensorType FROM public.dblink('host=localhost user=postgres password=admin1234 dbname=mobiledata','SELECT observationid, sensorid, latitude, longitude, timestamp, Null as vehicleclass, Null as vehiclelength, Null as vehiclespeed, Null as lane, Null as vehiclesinview FROM OBSERVATION') AS DATA(observationid INTEGER, sensorid INTEGER, latitude FLOAT8, longitude FLOAT8, timestamp TIMESTAMPTZ,vehicleclass CHARACTER VARYING, vehiclelength FLOAT8, vehiclespeed FLOAT8, lane INTEGER, vehiclesinview INTEGER) WHERE vehiclespeed"+operator+speed;

                const result = await client.query(query);

                    client.release();
                res.json(result.rows);
         }
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
