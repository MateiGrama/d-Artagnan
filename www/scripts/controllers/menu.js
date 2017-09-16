myApp.controller('Menu', function ($scope, $rootScope, $location) {

  var introText = ["What do you want practice?",
                   "Ready for action?",
                   "En garde!",
                  ];

  $scope.init = function () {
    clearInterval($rootScope.interval);
    $scope.intro = introText[Math.floor(Math.random() * 3)];

    $rootScope.lastPage='/menu'
    console.log("init menu");
  };
  // A se schimba in parazi, atacuri:
  var calibarted = localStorage.getItem("calibrated");

  $scope.toP3 = function () {
    if (calibarted == 0 || !calibarted) {
      console.log("toCalibrate");
      $location.path("/calibrate");
    }
    else {
      console.log("toP3 correct");
      $location.path('/tierce');
    }
  }
  $scope.toP4 = function () {
    if (calibarted == 0 || !calibarted) {
      console.log("toCalibrate");
      $location.path("/calibrate");
    }
    else {
      console.log("toP4 correct");
      $location.path('/quarte');
    }
  }
  $scope.toP5 = function () {
    if (calibarted == 0 || !calibarted) {
      $location.path("/calibrate");
    }
    else {
      $location.path('/quinte');
    }
  }
  $scope.toFAttack = function () {
    if (calibarted == 0 || !calibarted) {
      $location.path("/calibrate");
    }
    else {
      $location.path('/fAttack');
    }
  }
  $scope.toCAttack = function () {
    if (calibarted == 0 || !calibarted) {
      $location.path("/calibrate");
    }
    else {
      $location.path('/cAttack');
    }
  }
  $scope.toHAttack = function () {
    if (calibarted == 0 || !calibarted) {
      $location.path("/calibrate");
    }
    else {
      $location.path('/hAttack');
    }
  }

  document.addEventListener("deviceready", function () {


    //$scope.back = function () {
    //  $rootScope.changingUrl = false;
    //  console.log('uite');
    //  if ($rootScope.registerPage == true) {
    //    $location.path('/register');
    //  }
    //  else {
    //    $location.path('/application');
    //  }
    //}

  }, false);
});