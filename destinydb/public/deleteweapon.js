function deleteWeapon(id, wid){
    $.ajax({
        url: '/guardian/id/' + id + '/weapons/' + wid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
