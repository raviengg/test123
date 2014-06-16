define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
            getOffer:function(type){
                var prepend;
                if(type ==='info'){
                    prepend='#offerInfo';
                }else{
                    prepend='#offer';
                }
                var venueV = $(prepend+'VenueV').val();
                var nOffer = {
                    'header': $(prepend+'Header').val(),
                    'photoString': $(prepend+'Photo').val(),
                    'type': $(prepend+'Type').val(),
                    'isFeatured': $(prepend+'IsFeatured').val(),
                    'timeInfo':$(prepend+'Time').val(),
                    'startDate': $(prepend+'StartDate').val(),
                    'endDate': $(prepend+'EndDate').val(),
                    'image':$(prepend+'Image').val(),
                    'venue': {
                                '_id':venueV,
                                'name':$(prepend+'VenueV option[value="'+venueV+'"]').text()
                                }
                    }
                if(type ==='info'){
                    nOffer._id =$(prepend+'Header').data('id') ;
                }
                console.log(nOffer);

				
                if(nOffer.header ==='' || nOffer.photoString ==='' || nOffer.type ==='0'
                    || nOffer.isFeatured ===''
                    || nOffer.startDate ==='' || nOffer.endDate ==='' || nOffer.timeInfo ==='0'||  nOffer.venue._id ==='0' ){
                    return 'empty';
                }
				else{
					var sDate = new Date(nOffer.startDate);
					var eDate = new Date(nOffer.endDate);
					var cDate = new Date();
					if(sDate > eDate){
						return 'dateError';
					}
					else if(sDate < cDate){
						return 'dateError2';
					}
				}
                return nOffer;
            },
            editOffer:function(event){

                event.preventDefault();

                var nOffer = event.data.self.getOffer('info');
                if(typeof(nOffer)=='string'){
                    return alert('Please fill in all details');
                }

                var self = this;
                // Use AJAX to post the object to our adduser service
                $.ajax({
                    type: 'PUT',
                    data: nOffer,
                    url: '/offers/editoffer/111',
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
		    addOffer:function(event) {
                event.preventDefault();

                var nOffer = event.data.self.getOffer('');
                if(typeof(nOffer)=='string'){
                    if(nOffer == 'empty')
						return alert('Please fill in all details');
					else if(nOffer == 'dateError')
						return alert('End Date cannot be less than Start Date');
					else if(nOffer == 'dateError2')
						return alert('Start Date cannot be less than Current Date');
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
                this.initialised = true;
                $('#offerList table tbody').on('click', 'td a.linkdeleteoffer', {'url':'/offers/deleteoffer/','type':'offer'},common.deleteEntity);
                $('#btnAddOffer').on('click', {'self':this},this.addOffer);
                $('#edit').on('click', {'self':this},this.editOffer);
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
        $('#offerInfoHeader').val(thisObject.header);
        $('#offerInfoHeader').data('id',thisObject._id);
        $('#offerInfoPhoto').val(thisObject.photoString);
        $('#offerInfoType').val(thisObject.type);
        $('#offerInfoIsFeatured').val(thisObject.isFeatured);
        $('#offerInfoTime').val(thisObject.timeInfo);
        $('#offerInfoStartDate').val(thisObject.startDate);
        $('#offerInfoEndDate').val(thisObject.endDate);
        $('#offerInfoVenueV').val(thisObject.venue._id);

    }

    }
});
