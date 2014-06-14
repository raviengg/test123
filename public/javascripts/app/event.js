define(["../../javascripts/app/common"],
    function(common) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return{
            getEvent:function(type){
                var prepend;
                if(type ==='info'){
                    prepend='#eventInfo';
                }else{
                    prepend='#event';
                }
                var venue = $(prepend+'Venue').val();
                var nEvent = {
                    'title': $(prepend+'Title').val(),
                    'photo1': $(prepend+'Photo1').val(),
                    'photo2': $(prepend+'Photo2').val(),
                    'date': $(prepend+'Date').val(),
                    'desc': $(prepend+'Desc').val(),
                    'time':$(prepend+'Time').val(),
                    'venue': {
                                '_id':venue,
                                'name':$(prepend+'Venue option[value="'+venue+'"]').text()
                                }
                    }
                if(type ==='info'){
                    nEvent._id =$(prepend+'Title').data('id') ;
                }
                console.log(nEvent);

                if(nEvent.title ==='' || nEvent.photo1 ==='' || nEvent.photo2 ==='0'
                    || nEvent.date ===''
                    || nEvent.desc ==='' || nEvent.time ==='' ||  nEvent.venue._id ==='0' ){
                    return 'empty';
                }
                return nEvent;
            },
            editEvent:function(event){

                event.preventDefault();

                var nEvent = event.data.self.getEvent('info');
                if(typeof(nEvent)=='string'){
                    return alert('Please fill in all details');
                }

                var self = this;
                // Use AJAX to post the object to our adduser service
                $.ajax({
                    type: 'PUT',
                    data: nEvent,
                    url: '/events/edit/111',
                    dataType: 'JSON'
                }).done(function( response ) {
                    alert('success');
                    // Check for successful (blank) response
                    if (typeof response  ==="object") {
                        // Clear the form inputs
                        $("[id^=event]").val('');
                        // Update the table
                        event.data.self.eventListData = response;
                        event.data.self.populateTable();
                    }
                    else {
                        // If something goes wrong, alert the error message that our service returned
                        alert('Error: ' + response.msg);
                    }
                });

            },
		    addEvent:function(event) {
                event.preventDefault();

                var nEvent = event.data.self.getEvent('');
                if(typeof(nEvent)=='string'){
                    return alert('Please fill in all details');
                }

                var self = this;
                // Use AJAX to post the object to our adduser service
                $.ajax({
                    type: 'POST',
                    data: nEvent,
                    url: '/events/add',
                    dataType: 'JSON'
                }).done(function( response ) {
                    alert('success');
                    // Check for successful (blank) response
                    if (typeof response  ==="object") {
                        // Clear the form inputs
                        $("[id^=event]").val('');
                        // Update the table
                        event.data.self.eventListData = response;
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
            $.getJSON( '/events/eventlist', function( data ) {
                self.eventListData = data;
                self.populateTable();
            });

        },
        initialised:false,
        eventListData:[],
        populateTable:function () {

            // Empty content string
            var tableContent = '';

            // For each item in our JSON, add a table row and cells to the content string
            $.each(this.eventListData, function(){
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowevent" rel="' + this._id + '" title="Show Details">' + this.title+ '</td>';
                tableContent += '<td>' + this.venue.name + '</td>';
                tableContent += '<td><a href="#" class="linkdeleteevent" rel="' + this._id + '">delete</a></td>';
                tableContent += '</tr>';
            });



            // Inject the whole content string into our existing HTML table
            $('#eventList table tbody').html(tableContent);
             // Delete Venue link click

            if(!this.initialised){
                $( ".date" ).datepicker();
                this.initialised = true;
                $('#eventList table tbody').on('click', 'td a.linkdeleteevent', {'url':'/events/delete/','type':'event'},common.deleteEntity);
                $('#btnAddEvent').on('click', {'self':this},this.addEvent);
                $('#edit').on('click', {'self':this},this.editEvent);
                $('#eventList table tbody').on('click', 'td a.linkshowevent',{'self':this}, this.showInfo);
            }
        },
    // Show User Info
     showInfo:function(event) {

        // Prevent Link from Firing
        event.preventDefault();
        // Retrieve eventname from link rel attribute
        var thisEventName = $(this).attr('rel');
        // Get Index of object based on id value
        var arrayPosition = event.data.self.eventListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisEventName);
        // Get our User Object
        var thisObject = event.data.self.eventListData[arrayPosition];

        //Populate Info Box
        $('#eventInfoTitle').val(thisObject.title);
        $('#eventInfoTitle').data('id',thisObject._id);
        $('#eventInfoPhoto1').val(thisObject.photo1);
        $('#eventInfoPhoto2').val(thisObject.photo2);
        $('#eventInfoDate').val(thisObject.date);
        $('#eventInfoDesc').val(thisObject.desc);
        $('#eventInfoVenue').val(thisObject.venue._id);
        $('#eventInfoTime').val(thisObject.time);

    }

    }
});
