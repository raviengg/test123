angular.module('Mojitoapp.services', [])
  .factory('mojitoAPIservice', function($http) {

    var mojitoAPI = {};
    //mojitoAPI.loc = locationProvider;
    mojitoAPI.getWelcomePage = function(city){
        return $http({
            url: '/admin/welcome-page/'
        });
    }
    mojitoAPI.getOffers = function(city) {
      return $http({
        url: '/admin/offer/list/'+city,
        city:city
      });
    }
    mojitoAPI.getEvents = function(city) {
      return $http({
        url: '/admin/event/list/'+city
      });
    }
    mojitoAPI.getVenues = function(city) {
      return $http({
        url: '/admin/venue/list/'+city
      });
    }

    return mojitoAPI;
  });

var Mojitoapp = angular.module('Mojitoapp', [
  'ngRoute',
  'Mojitoapp.controllers',
  'Mojitoapp.services'
]).
config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {

     $locationProvider.html5Mode(true);
  $routeProvider.
	when("/gurgaon", {templateUrl: "partials/wpage", controller: "wPController"}).
    when("/gurgaon/offers", {templateUrl: "partials/offers", controller: "offerController"}).
    when("/gurgaon/events", {templateUrl: "partials/events", controller: "eventController"}).
    when("/gurgaon/venues", {templateUrl: "partials/venues", controller: "venueController"});

}]);
