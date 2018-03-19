function filterGuardian(){
  var select = document.getElementById("guardian-selector");
  var id = select.options[select.selectedIndex].value;
  console.log(id);
    $.ajax({
        url: '/guardian' + '/filter/' + id,
        type: 'GET',
        success: function(result){
            window.location.href = "/guardian/filter/" + id;
            //window.location.reload(true);
            //$("#myform").replaceWith(data.form);
        }
    })
};
