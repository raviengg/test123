define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
		    addOffer:function(event) {
                event.preventDefault();
                var venueV = $('#offerVenueV').val();

                var nOffer = {
                    'header': $('#offerHeaderString').val(),
                    'photoString': $('#offerPhotoString').val(),
                    'type': $('#offerType').val(),
                    'isFeatured': $('#offerIsFeatured').val(),
                    'timeInfo':$('#offerTimeInfo').val(),
                    'startDate': $('#offerStartDate').val(),
                    'endDate': $('#offerEndDate').val(),
                    'image':$('#offerImage').val(),
                    'venue': {
                                '_id':venueV,
                                'name':$('#offerVenueV option[value="'+venueV+'"]').text()
                                }
                    }
                console.log(nOffer);

                if(nOffer.header ==='' || nOffer.photoString ==='' || nOffer.type ==='0'
                    || nOffer.isFeatured ===''
                    || nOffer.startDate ==='' || nOffer.endDate ==='' || nOffer.timeInfo ==='0'||  nOffer.venue._id ==='0' ){
                    alert('Please fill in all details');
                    return;
                }
                var self = this;
                // Use AJAX to post the object to our adduser service
                $.ajax({
                    type: 'POST',
                    data: nOffer,
                    url: '/offers/addoffer',
                    dataType: 'JSON'
                }).done(function( response ) {
                    alert('success');
                    // Check for successful (blank) response
                    if (typeof response  ==="object") {
                        // Clear the form inputs
                        $("[id^=offer]").val('');
                        // Update the table
                        event.data.self.offerListData = response;
                        event.data.self.populateTable();
                    }
                    else {
                        // If something goes wrong, alert the error message that our service returned
                        alert('Error: ' + response.msg);
                    }
                });
        },
        init:function(){

            var self = this;
            $.getJSON( '/offers/offerlist', function( data ) {
                self.offerListData = data;
                self.populateTable();
            });

        },
        initialised:false,
        offerListData:[],
        populateTable:function () {

            // Empty content string
            var tableContent = '';

            // For each item in our JSON, add a table row and cells to the content string
            $.each(this.offerListData, function(){
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowoffer" rel="' + this._id + '" title="Show Details">' + this.header+ '</td>';
                tableContent += '<td>' + this.venue.name + '</td>';
                tableContent += '<td><a href="#" class="linkdeleteoffer" rel="' + this._id + '">delete</a></td>';
                tableContent += '</tr>';
            });



            // Inject the whole content string into our existing HTML table
            $('#offerList table tbody').html(tableContent);
             // Delete Venue link click

            if(!this.initialised){
                $( ".date" ).datepicker();
                this.intialised = true;
                $('#offerList table tbody').on('click', 'td a.linkdeleteoffer', {'url':'/offers/deleteoffer/','type':'offer'},common.deleteEntity);
                $('#btnAddOffer').on('click', {'self':this},this.addOffer);
                $('#offerList table tbody').on('click', 'td a.linkshowoffer',{'self':this}, this.showInfo);
            }
        },
    // Show User Info
     showInfo:function(event) {

        // Prevent Link from Firing
        event.preventDefault();

        // Retrieve offername from link rel attribute
        var thisOfferName = $(this).attr('rel');

        // Get Index of object based on id value
        var arrayPosition = event.data.self.offerListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisOfferName);

        // Get our User Object
        var thisObject = event.data.self.offerListData[arrayPosition];

        //Populate Info Box
        $('offerInfoHeader').val(thisObject.header);
        $('offerInfoPhotoString').val(thisObject.photoString);
        $('offerInfoType').val(thisObject.type);
        $('offerInfoIsFeatured').val(thisObject.isFeatured);
        $('offerTimeInfo').val(thisObject.timeInfo);
        $('offerInfoVenueV').val(thisObject.venue._id);
    }

    }
});
