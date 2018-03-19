
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getGuardian(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS gid, name FROM guardian", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guardian = results;
            complete();
        });
    }

    /* get weapons function */
    function getWeapons(res, mysql, context, complete){
        sql = "SELECT id AS wid, name, tier, type FROM weapon";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.weapons = results
            complete();
        });
    }

    /* Display one guardian's weapons for viewing */

    router.get('/:wid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateweapons.js"];
        var mysql = req.app.get('mysql');
        getGuardian(res, mysql, context, req.params.id, complete);
        getWeapons(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-weapons', context);
            }

        }
    });



    /* Route to delete a weapon from a guardian's inventory */

    router.delete('/weapon/:wid/guardian/:gid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM guardian WHERE wid = ? AND gid = ?";
        var inserts = [req.params.wid, req.params.gid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


    return router;
}();
