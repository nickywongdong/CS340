function deleteWeapon(id, wid){
    console.log("deleting weapon...");
    $.ajax({
        url: '/guardian/id/' + id + '/weapons/' + wid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
