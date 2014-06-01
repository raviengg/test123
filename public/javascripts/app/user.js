define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
    // Add User
    addUser:function (event) {
        event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( resp ) {

            // Check for successful (blank) response
            if (res.typeof === 'object') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');
                event.data.self.userListData= resp;
                // Update the table
                event.data.self.populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
    },
        initalised:false,
        userListData:[],
        init:function(){
            var self = this;
            $.getJSON( '/users/userlist', function( data ) {
                self.userListData = data;
                self.populateTable();
            });

        },
    // Fill table with data
    populateTable:function() {

 // Empty content string
    var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(this.userListData, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
        if(!this.initalised){
            $('#btnAddUser').on('click', {'self':this},this.addUser);
            $('#userList table tbody').on('click', 'td a.linkdeleteuser', {'url':'/users/deleteuser/','type':'userlist'},common.deleteEntity);
          $('#userList table tbody').on('click', 'td a.linkshowuser',{'self':this}, this.showUserInfo);
            this.initialised = true;

        }

    },
    // Show User Info
     showUserInfo:function(event) {

        // Prevent Link from Firing
        event.preventDefault();

        // Retrieve username from link rel attribute
        var thisUserName = $(this).attr('rel');

        // Get Index of object based on id value
        var arrayPosition = event.data.self.userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

        // Get our User Object
        var thisUserObject = event.data.self.userListData[arrayPosition];

        //Populate Info Box
        $('#userInfoName').text(thisUserObject.fullname);
        $('#userInfoAge').text(thisUserObject.age);
        $('#userInfoGender').text(thisUserObject.gender);
        $('#userInfoLocation').text(thisUserObject.location);

    }

}
});
