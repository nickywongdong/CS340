function deleteWeapon(id){
    $.ajax({
        url: '/weapons/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
