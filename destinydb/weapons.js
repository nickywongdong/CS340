
module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /* get weapons function */
    function getWeapons(res, mysql, context, complete){
        sql = "SELECT id, name, tier, type FROM weapon";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.weapons = results
            complete();
        });
    }

    /*Displays all weapons. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesingleweapon.js"];
        var mysql = req.app.get('mysql');
        getWeapons(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('weapons', context);
            }

        }
    });


        /* Adds a weapon, redirects to the weapons page after adding */

        router.post('/', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO weapon (name, type, tier) VALUES (?,?,?)";
            var inserts = [req.body.name, req.body.type, req.body.tier];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/weapons');
                }
            });
        });




    /* Route to delete a weapon */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM weapon WHERE id = ?";
        var inserts = [req.params.id];
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
