module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Used to populate list of guardians to assign a strike to */

    function getGuardians(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS gid, name FROM guardian", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guardians = results;
            complete();
        });
    }

    /* get guardians with their strikes */

function getGuardiansWithStrikes(res, mysql, context, complete){
    sql = "SELECT guardian.name AS Guardian, strike.name AS Strike FROM guardian_on_strike INNER JOIN guardian on guardian.id = guardian_on_strike.guardian_id INNER JOIN strike on strike.id = guardian_on_strike.strike_id ORDER BY Guardian, Strike"
     mysql.pool.query(sql, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end()
        }
        context.guardian_on_strike = results
        complete();
    });
}


    /* Used to get list of strikes to assign a guardian to */

    function getStrikes(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS sid, name FROM strike", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.strike = results;
            complete();
        });
    }

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS pid, name FROM planet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planet  = results;
            complete();
        });
    }

    function getNPCs(res, mysql, context, complete){
        mysql.pool.query("SELECT npc.id as nid, npc.name, planet.name AS current_planet, class, race FROM npc INNER JOIN planet ON home_world = planet.name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.npcs = results;
            complete();
        });
    }

    function getNPC(res, mysql, context, id, complete){
        var sql = "SELECT id as nid, name, class, race FROM npc WHERE nid = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.npc = results[0];
            complete();
        });
    }

    /*Displays all npcs. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletenpc.js"];
        var mysql = req.app.get('mysql');
        getNPCs(res, mysql, context, complete);
        getGuardians(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        getStrikes(res, mysql, context, complete);
        getGuardiansWithStrikes(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 5){
                res.render('npc', context);
            }

        }
    });

    /* Display one npc for the specific purpose of updating npc */

    router.get('/:nid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updatenpc.js"];
        var mysql = req.app.get('mysql');
        getNPC(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-npc', context);
            }

        }
    });

    /* Adds an npc, redirects to the npc page after adding */

    /*router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO npc (name, class, race, home_world) VALUES (?,?,(select name from planet where id = ?),?)";
        var inserts = [req.body.name, req.body.class, req.body.race, req.body.home_world, req.body.planet_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/npc');
            }
        });
    });*/

    /* The URI that update data is sent to in order to update a npc */

    router.put('/:nid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE npc SET name=?, class=?, race=?, home_world=(select name from planet where id = ?), WHERE nid=?";
        var inserts = [req.body.name, req.body.class, req.body.race, req.body.home_world, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Associate strike with a guardian and
   * then redirect to the npc page after adding
   */
  router.post('/', function(req, res){
      //console.log("We get the multi-select certificate dropdown as ", req.body.certs)
      var mysql = req.app.get('mysql');
      // let's get out the certificates from the array that was submitted by the form
      var strikes = req.body.strikes
      var guardian = req.body.gid
      for (let strike of strikes) {
        //console.log("Processing certificate id " + cert)
        var sql = "INSERT INTO guardian_on_strike (guardian_id, strike_id) VALUES (?,?)";
        var inserts = [guardian, strike];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              //TODO: send error messages to frontend as the following doesn't work
              /*
              res.write(JSON.stringify(error));
              res.end();
              */
              console.log(error)
          }
        });
      } //for loop ends here
      res.redirect('/npc');
  });

    /* Route to delete a npc, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:nid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM npc WHERE nid = ?";
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
