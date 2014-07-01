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

c.controller('offerController',function($scope, $routeParams,mojitoAPIservice){
        mojitoAPIservice.getOffers(getCPage('offers')).success(function(data){
            $scope.offers = data;
    });
});

c.controller('eventController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getEvents(getCPage('events')).success(function(data){
            $scope.events = data;
    });
});

c.controller('venueController',function($scope, $routeParams,mojitoAPIservice){
    mojitoAPIservice.getVenues( getCPage('venues')).success(function(data){
            $scope.venues = data;
    });
});



function getCPage(s){
    var loc = location.pathname;
    loc = loc.replace(s,"");
    loc = loc.replace("\/","");
    return loc;
}