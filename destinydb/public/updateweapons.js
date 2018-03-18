function updateWeapons(id){
    $.ajax({
        url: '/guardians' + '/weapons/' + id,
        type: 'PUT',
        data: $('#update-weapons').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function deleteWeapon(id, wid){
    console.log("deleting weapon...");
    $.ajax({
        url: '/guardian/' + id + '/weapons/' + wid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
