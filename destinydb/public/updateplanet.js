function updateWeapons(id){
    $.ajax({
        url: '/planet/' + id,
        type: 'PUT',
        data: $('#update-weapons').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function deleteGuardian(id){
    $.ajax({
        url: '/planet/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
