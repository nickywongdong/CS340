
module.exports = function(){

    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM planet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets = results;
            complete();
        });
    }


    function getGuardians(res, mysql, context, complete){
        mysql.pool.query("SELECT guardian.id, guardian.name, planet.name AS current_planet, level, class, race FROM guardian INNER JOIN planet ON current_planet = planet.name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guardians = results;
            complete();
        });
    }

    function getGuardian(res, mysql, context, id, complete){
        var sql = "SELECT id, name, class, race, level FROM guardian WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guardian = results[0];
            complete();
        });
    }

    function getGuardianWeapons(res, mysql, id, context, complete){
      var sql = "SELECT weapon.name AS Name, weapon.tier AS Tier, weapon.type AS Type \
      FROM guardians_weapons \
      INNER JOIN guardian on guardian.id = guardians_weapons.guardian_id \
      INNER JOIN weapon on weapon.id = guardians_weapons.weapon_id \
      WHERE guardian.id = ? \
      ORDER BY Tier";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.guardian_weapons = results;
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

    /*Displays all guardians. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguardian.js"];
        var mysql = req.app.get('mysql');
        getGuardians(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('guardian', context);
            }

        }
    });


    /* Display one guardian's weapons for the specific purpose of updating guardian weapons */

    router.get('/weapons/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateweapons.js"];
        var mysql = req.app.get('mysql');
        getGuardian(res, mysql, context, req.params.id, complete);
        getWeapons(res, mysql, context, complete);
        getGuardianWeapons(res, mysql, req.params.id, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-weapons', context);
            }

        }
    });




    /* Display one guardian for the specific purpose of updating guardian */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateguardian.js"];
        var mysql = req.app.get('mysql');
        getGuardian(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-guardian', context);
            }

        }
    });

    /* Adds a guardian, redirects to the guardian page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO guardian (name, class, race, current_planet, level) VALUES (?,?,?,(select name from planet where id = ?),?)";
        var inserts = [req.body.name, req.body.class, req.body.race, req.body.current_planet, req.body.level, req.body.planet_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/guardian');
            }
        });
    });

    /* Associate a weapon with a guardian and
   * then redirect to the guardian's weapons page after adding
   */
  router.post('/weapons/:id', function(req, res){
      var mysql = req.app.get('mysql');
      var weapons = req.body.wid
      var guardian = req.params.id
      var sql = "INSERT INTO guardians_weapons (guardian_id, weapon_id) VALUES (?,?)";
      var inserts = [guardian, weapons];
      sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
          console.log(error)
        }
      });

      res.redirect('/guardian/weapons/' + guardian);
  });

    /* The URI that update data is sent to in order to update a guardian */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE guardian SET name=?, class=?, race=?, current_planet=(select name from planet where id = ?), level=? WHERE id=?";
        var inserts = [req.body.name, req.body.class, req.body.race, req.body.current_planet, req.body.level, req.params.id];
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


    /* Route to delete a guardian, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM guardian WHERE id = ?";
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
