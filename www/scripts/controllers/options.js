myApp.controller('Options', function ($scope, $rootScope, $location) {

  $scope.init = function () {
    console.log("init Options");
  };
  $scope.changeName = function (newName) {
    $rootScope.FirstName = newName;
    $rootScope.back();
  }


  document.addEventListener("deviceready", function () {

  }, false);
});