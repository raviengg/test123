var c = angular.module('Mojitoapp.controllers', []);

c.controller('wPController', function($scope,mojitoAPIservice){
    mojitoAPIservice.getWelcomePage().success(function(data){
            $scope.venues = data.venue;
            $scope.offers = data.offer;
            $scope.events = data.event;
            var loc = location.pathname;
            loc = loc.replace("\/","");
            //console.log(loc)
            $scope.city = loc;
    });
});

c.controller('offersController',function($scope, $routeParams,mojitoAPIservice){
        mojitoAPIservice.getOffers(getCPage('offers')).success(function(data){
            $scope.offers = data;
    });
});

c.controller('eventsController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getEvents(getCPage('events')).success(function(data){
            $scope.events = data;
    });
});

c.controller('eventController',function($scope,mojitoAPIservice){
    mojitoAPIservice.getEvent(getCPage('events')).success(function(data){
            $scope.e = data;
            console.log($scope)
    });
});

c.controller('venuesController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getVenues( getCPage('venues')).success(function(data){
            $scope.venues = data;
    });
});

c.controller('venueController',function($scope,mojitoAPIservice){
    mojitoAPIservice.getVenueDetail( getCPage('venues')).success(function(data){
            $scope.v = data.v;
            $scope.o = data.o;
            $scope.e = data.e;



              $('#map-canvas').each(function () {

                var latlng = new google.maps.LatLng(data.v.loc.coordinates[1], data.v.loc.coordinates[1]);
                var mapOptions = {
                  zoom: 14,
                  center: latlng,
                  disableDefaultUI: true
                };
                var map = new google.maps.Map(this, mapOptions);
                var marker = new google.maps.Marker({
                  position: latlng,
                  map: map,
                  title: data.v.name
                });
              });

    });
});


function getCPage(s){
    var loc = location.pathname;
    loc = loc.replace(s,"");
    var find = '\/';
    var re = new RegExp(find, 'g');
    loc = loc.replace(re,"");
    //console.log(loc)
    return loc;
}