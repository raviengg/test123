define([],
    function() {
        return{
            // Common delete function
            deleteEntity:function(event){
                event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this?');

    // Check and make sure the venue confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: event.data.url + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            var entityType = event.data.type;
            if(entityType ==="userlist"){
               window.location.href = '/admin-user';
            }else if(entityType ==="offer"){
              window.location.href = '/admin-offer';
            }else if(entityType ==="venue"){
                window.location.href = '/admin-venue';
            }
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }

            }
        }
    });