function deleteNPC(id){
    $.ajax({
        url: '/npc/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function removeStrikeGuardian(gid, sid){
  console.log("removing strike guardian function");
      $.ajax({
        url: '/npc/' + gid + '/strike/' + sid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
