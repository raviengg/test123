var mojitoapp = angular.module('mojitoapp',[]);


mojitoapp.controller('venuecntrl',function($scope,$http){

$http.defaults.headers.post["Content-Type"]
  = "application/x-www-form-urlencoded; charset=UTF-8;";
    $http.get('http://safe-wave-7903.herokuapp.com/venues/list').success(function(data){
        $scope.venues=data;
    });

});