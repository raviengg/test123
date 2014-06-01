define(["../../javascripts/app/user","../../javascripts/app/offer","../../javascripts/app/venue"],function (user,offer,venue) {
    function initialize(){
        console.log(window.location.pathname);
        var cUrl = window.location.pathname
            if(cUrl == '/admin-user'){
                user.init();
            }else if(cUrl == '/admin-offer'){
                offer.init() ;
            }else if(cUrl == '/admin-event'){
                populateEventTable();
            }else if(cUrl == '/admin-venue'){
                venue.init();
            }
    }
    initialize();

 });
