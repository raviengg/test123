// Userlist data array for filling in info box
var userListData = [],venueListData=[],eventListData = [],offerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
  
     populateModels(); 
      setTimeout(getPage,2000)
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    
    // Delete Venue link click
    $('#venueList table tbody').on('click', 'td a.linkdeletevenue', deleteVenue);
    
    //venue 
    $('#btnAddVenue').on('click', addVenue);    

});
function populateModels(){
    $.getJSON( '/users/userlist', function( data ) {
        userListData = data;
    });
	$.getJSON( '/venues/venuelist', function( data ) {
        venueListData = data;
    });    
    $.getJSON( '/offers/offerlist', function( data ) {
        offerListData = data;
    });
}

// populates the page based on the url 
function getPage(){
console.log(window.location.pathname);
   var cUrl = window.location.pathname
   if(cUrl == '/admin-user'){
        populateUserTable() ;
   }else if(cUrl == '/admin-offer'){
		populateOfferTable() ;
   }else if(cUrl == '/admin-event'){
   		populateEventTable();
   }else if(cUrl == '/admin-venue'){
   		populateVenueTable();
   }
}

// Functions =============================================================

// Fill table with data
function populateUserTable() {
     
    // Empty content string
    var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(userListData, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    //});
};

// Fill table with data
function populateOfferTable() {
     
    // Empty content string
    var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(userListData, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    //});
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
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
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateUserTable();

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
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Add User
function addVenue(event) {
    event.preventDefault();
       // If it is, compile all user info into one object
        var nVenue = {
            'name': $('#venueName').val(),
            'image':$('#venueImage').val(),
            'address': $('#venueAddress').val(),
            'phone': $('#venueName').val(),
            'sDescription': $('#venueShortDesc').val(),
            'bDescription': $('#venueLongDesc').val(),
            'timings': $('#venueTimings').val(),
            'city':$('#venueSelCity').val(),
            'type':$('#venueSelType').val()
        }
    
        console.log(nVenue);
        if(nVenue.name ==='' || nVenue.address ==='' || nVenue.phone ==='' 
        || nVenue.sDescription ===''
         || nVenue.timings ==='' || nVenue.city ==='0' || nVenue.type ==='0' ){
             alert('Please fill in all details');
             return;
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: nVenue,
            url: '/venues/addvenue',
            dataType: 'JSON'
        }).done(function( response ) {

            alert('success');

            // Check for successful (blank) response
            if (typeof response ) {
                // Clear the form inputs
                $("[id^=venue]").val('');
                

                // Update the table
                populateVenueTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });        
    } 
    
// Fill table with data
function populateVenueTable() {
     
    // Empty content string
    var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(venueListData, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowvenue" rel="' + this.name + '" title="Show Details">' 
            + this.name + '</td>';
            tableContent += '<td>' + this.city + '</td>';
            tableContent += '<td><a href="#" class="linkdeletevenue" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#venueList table tbody').html(tableContent);
    //});
};

// Delete User
function deleteVenue(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this venue?');

    // Check and make sure the venue confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/venues/deletevenue/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateVenueTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
