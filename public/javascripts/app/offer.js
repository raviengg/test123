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
                        self.offerListData = response;
                        self.populateTable();
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
        initalised:false,
        offerListData:[],
        populateTable:function () {

            // Empty content string
            var tableContent = '';

            // For each item in our JSON, add a table row and cells to the content string
            $.each(this.offerListData, function(){
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowvenue" rel="' + this.header + '" title="Show Details">' + this.header+ '</td>';
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
                $('#btnAddOffer').on('click', this.addOffer);
            }
        }

    }
});
