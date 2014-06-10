define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
    // Add Venue
    addVenue:function (event) {
        event.preventDefault();
       // If it is, compile all user info into one object
        var coord =[];
        var latC = ($('#venueLatitude').val()==='')?"-1":($('#venueLatitude').val());
        var longC =   ($('#venueLongitude').val()==='')?"-1":($('#venueLongitude').val());
        coord.push(longC);
        coord.push(latC);
        var nVenue = {
            'name': $('#venueName').val(),
            'image':$('#venueImage').val(),
            'loc':{
                    'coordinates':coord
                },
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
         || nVenue.timings ==='' ||  nVenue.latitude === ''|| nVenue.longitude === '' || nVenue.city ==='0' || nVenue.type ==='0' ){
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
            if (typeof response ==="object") {
                // Clear the form inputs
                $("[id^=venue]").val('');
                 event.data.self.venueListData = response;
                  console.log("adding")
                // Update the table
                event.data.self.populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    },
        initialised:false,
        venueListData:[],
        init:function(){
            var self = this;
            $.getJSON( '/venues/venuelist', function( data ) {
                self.venueListData = data;
                self.populateTable();
            });

        },
    // Fill table with data
    populateTable:function() {

        // Empty content string
        var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(this.venueListData, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowvenue" rel="' + this.name + '" title="Show Details">'
            + this.name + '</td>';
            tableContent += '<td>' + this.city + '</td>';
            tableContent += '<td><a href="#" class="linkdeletevenue" data-url="/venues/deletevenue/" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#venueList table tbody').html(tableContent);
        if(!this.initialised){
            $('#btnAddVenue').on('click', {'self':this},this.addVenue);
            $('#venueList table tbody').on('click', 'td a.linkdeletevenue', {'url':'/venues/deletevenue/','type':'venue'},common.deleteEntity);
            $('#venueList table tbody').on('click', 'td a.linkshowvenue',{'self':this}, this.showInfo);
            this.initialised = true;
        }

    },
    // Show User Info
     showInfo:function(event) {

        // Prevent Link from Firing
        event.preventDefault();

        // Retrieve venuename from link rel attribute
        var thisVenueName = $(this).attr('rel');

        // Get Index of object based on id value
        var arrayPosition = event.data.self.venueListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisVenueName);

        // Get our User Object
        var thisObject = event.data.self.venueListData[arrayPosition];

        //Populate Info Box
        $('#venueInfoName').val(thisObject.name);
        $('#venueInfoAddress').val(thisObject.address);
        $('#venueInfoPhone').val(thisObject.phone);
        $('#venueInfoLocation').val(thisObject.city);
        $('#venueInfoTimings').val(thisObject.timings);
        $('#venueInfoLatitude').val(thisObject.latitude);
        $('#venueInfoLongitude').val(thisObject.longitude);
    }

}
});
