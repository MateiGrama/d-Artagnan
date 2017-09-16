myApp.controller('Calibrate', function ($scope, $rootScope, $location) {

  //$scope.calibratingPhase = 1 if Before_calibrating , 2 if calibrating, 3 done calibrating

  $scope.init = function () {
    console.log("calibrate init")
    clearInterval($rootScope.interval);
    $scope.calibratingPhase = 1;
  };

  document.addEventListener("deviceready", function () {
    $scope.calibrate = function () {
      var i = 0;
      var g = 0;

      function done() {
        console.log("Done.");
        localStorage.setItem("calibrated", $rootScope.G);
        $scope.calibratingPhase = 3;
        $scope.$apply();
        return;
      }

      function getCalibration(g, i, callback) {
        navigator.accelerometer.getCurrentAcceleration(
          function onSuccess(acceleration) {
            console.log(i + "  " + g);
            i = i + 1;
            g = g + Math.sqrt(acceleration.x * acceleration.x
                            + acceleration.y * acceleration.y
                            + acceleration.z * acceleration.z);
            callback({ g: g, i: i });
          }, function onError() {
            alert('XLR8 Error!');
            return;
          });
      }

      function calibrateLoop() {
        getCalibration(g, i, function (vars) {
          i = vars.i;
          g = vars.g;
          if (i < 500) {
            calibrateLoop();
          }
          else {
            $rootScope.G = g / i;
            console.log($rootScope.G);
            return done();
          }
        });
      }

      $scope.calibratingPhase = 2;
      calibrateLoop();
    }
  }, false);
});