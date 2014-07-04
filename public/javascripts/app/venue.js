define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
    // Add Venue
    getVenueObject:function(ele){
        var coord =[];
        var prependId ;

        if(ele ==="info"){
            prependId = '#venueInfo';
			var newVersion = parseInt($(prependId + 'Version').val()) + 1;
			$(prependId + 'Version').val(newVersion);
        }else{
            prependId = '#venue';
        }

        var latC = ($(prependId + 'Latitude').val()==='')?"-1":($(prependId + 'Latitude').val());
        var longC =   ($(prependId + 'Longitude').val()==='')?"-1":($(prependId + 'Longitude').val());
        coord.push(longC);
        coord.push(latC);
        var nVenue = {
            'name': $(prependId + 'Name').val(),
            'image':$(prependId + 'Image').val(),
            'loc':{
                    'coordinates':coord
                },
            'address': $(prependId + 'Address').val(),
            'phone': $(prependId + 'Phone').val(),
            'sDescription': $(prependId + 'ShortDesc').val(),
            'bDescription': $(prependId + 'LongDesc').val(),
            'timings': $(prependId + 'Timings').val(),
            'city':$(prependId + 'SelCity').val(),
            'type':$(prependId + 'SelType').val(),
			'extra1':$(prependId + 'ExtraInfo1').val(),
			'extra2':$(prependId + 'ExtraInfo2').val(),
			'extra3':$(prependId + 'ExtraInfo3').val(),
			'extra4':$(prependId + 'ExtraInfo4').val(),
			'extra5':$(prependId + 'ExtraInfo5').val(),
			'active':$(prependId + 'SelActive').val(),
			'version':$(prependId + 'Version').val()
                    }

            if(ele ==="info"){
                nVenue._id=$(prependId + 'Name').data('id');
            }


        console.log(nVenue);
        if(nVenue.name ==='' || nVenue.address ==='' || nVenue.phone ===''
        || nVenue.sDescription ===''
         || nVenue.timings ==='' ||  nVenue.latitude === ''|| nVenue.longitude === '' || nVenue.city ==='0' || nVenue.type ==='0' ){

             return "empty";
        }
        return nVenue;
    },
    editVenue:function(event){
       event.preventDefault();
       // If it is, compile all user info into one object
        var nVenue = event.data.self.getVenueObject('info');
        if(typeof(nVenue)=='string'){
            return alert('Please fill in all details');
        }
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: nVenue,
            url: '/admin/venue/edit/1231',
            dataType: 'JSON'
        }).done(function( response ) {

            alert('success');

            // Check for successful (blank) response
            if (typeof response ==="object") {
                // Clear the form inputs
                $("[id^=venue]").val('');
				$("[id*=Sel]").val('0');
				//$("[id*=SelActive]").val('Y');
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
    addVenue:function (event) {
        event.preventDefault();
        var nVenue = event.data.self.getVenueObject('');
        if(typeof(nVenue)=='string'){
                    return alert('Please fill in all details');
        }
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: nVenue,
            url: '/admin/venue/add',
            dataType: 'JSON'
        }).done(function( response ) {

            alert('success');

            // Check for successful (blank) response
            if (typeof response ==="object") {
                // Clear the form inputs
                $("[id^=venue]").val('');
				$("[id*=Sel]").val('0');
				$("[id*=SelActive]").val('Y');
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
            $.getJSON( '/admin/venue', function( data ) {
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
            tableContent += '<td><a href="#" class="linkshowvenue" rel="' + this._id + '" title="Show Details">'
            + this.name + '</td>';
            tableContent += '<td>' + this.city + '</td>';
            tableContent += '<td>' + this.active + '</td>';
            tableContent += '<td><a href="#" class="linkdeletevenue" data-url="/admin/venue/deletevenue/" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#venueList table tbody').html(tableContent);
        if(!this.initialised){
            $('#btnAddVenue').on('click', {'self':this},this.addVenue);
            $('#edit').on('click', {'self':this},this.editVenue);
            $('#venueList table tbody').on('click', 'td a.linkdeletevenue', {'url':'/admin/venue/delete/','type':'venue'},common.deleteEntity);
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
        var arrayPosition = event.data.self.venueListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisVenueName);

        // Get our User Object
        var thisObject = event.data.self.venueListData[arrayPosition];

        //Populate Info Box
        $('#venueInfoName').val(thisObject.name);
        $('#venueInfoName').data('id',thisObject._id);
        $('#venueInfoAddress').val(thisObject.address);
        $('#venueInfoPhone').val(thisObject.phone);
        $('#venueInfoLocation').val(thisObject.city);
        $('#venueInfoTimings').val(thisObject.timings);
        $('#venueInfoLatitude').val(thisObject.loc.coordinates[1]);
        $('#venueInfoLongitude').val(thisObject.loc.coordinates[0]);
        $('#venueInfoImage').val(thisObject.image);
        $('#venueInfoShortDesc').val(thisObject.sDescription);
        $('#venueInfoLongDesc').val(thisObject.bDescription);
        $('#venueInfoSelCity').val(thisObject.city);
        $('#venueInfoSelType').val(thisObject.type);
		$('#venueInfoExtra1').val(thisObject.extra1);
        $('#venueInfoExtra2').val(thisObject.extra2);
		$('#venueInfoExtra3').val(thisObject.extra3);
        $('#venueInfoExtra4').val(thisObject.extra4);
		$('#venueInfoExtra5').val(thisObject.extra5);
		$('#venueInfoSelActive').val(thisObject.active);
		$('#venueInfoVersion').val(thisObject.version);

    }

}
});
