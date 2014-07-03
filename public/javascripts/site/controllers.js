var c = angular.module('Mojitoapp.controllers', []);

c.controller('wPController', function($scope,mojitoAPIservice){
    mojitoAPIservice.getWelcomePage().success(function(data){
            $scope.venues = data.venue;
            $scope.offers = data.offer;
            $scope.events = data.event;
            var loc = location.pathname;
            loc = loc.replace("\/","");
            console.log(loc)
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
    });
});

c.controller('venuesController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getVenues( getCPage('venues')).success(function(data){
            $scope.venues = data;
    });
});

c.controller('venueController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getVenueDetail( getCPage('venues')).success(function(data){
            $scope.v = data.v;
            $scope.o = data.o;
            $scope.e = data.e;
    });
});


function getCPage(s){
    var loc = location.pathname;
    loc = loc.replace(s,"");
    var find = '\/';
    var re = new RegExp(find, 'g');
    loc = loc.replace(re,"");
    console.log(loc)
    return loc;
}