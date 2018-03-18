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
