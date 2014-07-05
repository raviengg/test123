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
        url: '/admin/offer/list/'+city
      });
    }
    mojitoAPI.getEvents = function(city) {
      return $http({
        url: '/admin/event/list/'+city
      });
    }

    mojitoAPI.getEvent = function(id) {
      return $http({
        url: '/admin/event/'+id
      });
    }
    mojitoAPI.getVenues = function(city) {
      return $http({
        url: '/admin/venue/list/'+city
      });
    }
    mojitoAPI.getVenueDetail = function(id) {
      return $http({
        url: '/admin/venue/detail/'+id
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
    when("/gurgaon/offers", {templateUrl: "partials/offers", controller: "offersController"}).
    when("/gurgaon/events", {templateUrl: "partials/events", controller: "eventsController"}).
    when("/gurgaon/venues", {templateUrl: "partials/venues", controller: "venuesController"}).
    when("/venues/:id", {templateUrl: "partials/venue", controller: "venueController"}).
    when("/events/:id", {templateUrl: "partials/event", controller: "eventController"}).
    otherwise({redirectTo: '/gurgaon'});
}]);
