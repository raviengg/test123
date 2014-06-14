define(["../../javascripts/app/user","../../javascripts/app/offer","../../javascripts/app/venue","../../javascripts/app/event"],function (user,offer,venue,event) {
    function initialize(){
        console.log(window.location.pathname);
        var cUrl = window.location.pathname
            if(cUrl == '/admin-user'){
                user.init();
            }else if(cUrl == '/admin-offer'){
                offer.init() ;
            }else if(cUrl == '/admin-event'){
                event.init();
            }else if(cUrl == '/admin-venue'){
                venue.init();
            }
    }
    initialize();

 });
