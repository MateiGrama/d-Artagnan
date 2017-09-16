myApp.controller('Homescreen', function ($scope, $rootScope, $location) {

  $scope.init = function () {
    console.log("init homescreen");

    if (!$rootScope.FirstName) {
      $rootScope.FirstName = "swordsman";
    }
    $rootScope.lastPage = '/homescreen';
    $rootScope.options = function () {  //functie to Options
      $location.path('/options');
    };
    $rootScope.back = function () {     //functie back from otions
      $location.path($rootScope.lastPage);
    };
    $rootScope.backToHome = function () {  //functie back from menu
      $location.path('/hemescreen');
    };
    $rootScope.toCalibrate = function () {
      $location.path('/calibrate');
    }
  };

  document.addEventListener("deviceready", function () {

    $scope.toMenu = function () {
      $location.path('/menu');
    }

  }, false);
});