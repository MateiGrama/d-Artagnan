myApp.controller('PrimaProba', function ($scope, $rootScope) {

  console.log(" proba1 merge ");

  $scope.init = function () {
    console.log("init proba1");
  };

  document.addEventListener("deviceready", function () {

    $rootScope.fproba = function () {
      console.log("proba buton");
    }

  }, false);
});