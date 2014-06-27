var mojitoapp = angular.module('mojitoapp',[]);


mojitoapp.controller('venuecntrl',function($scope,$http){

$http.defaults.headers.post["Content-Type"]
  = "application/x-www-form-urlencoded; charset=UTF-8;";



    $http.get('/admin/venues/list').success(function(data){
        console.log(data)
        $scope.venues=data;
    });

});