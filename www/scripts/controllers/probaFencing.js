myApp.controller('ProbaFencing', function ($scope, $rootScope, $location) {

  $scope.init = function () {
    console.log("init probaFencing");
  };
  var Ax = 0, Ay = 0, Az = 0,    //avrage acceleration
      Ax0 = 0, Ay0 = 0, Az0 = 0;   // acceleration from last loop

  var Vx0 = 0, Vy0 = 0, Vz0 = 0,
      Vx1 = 0, Vy1 = 0, Vz1 = 0,
      Vx = 0, Vy = 0, Vz = 0;

  var X0 = 0, Y0 = 0, Z0 = 0,
      X1 = 0, Y1 = 0, Z1 = 0;



  //acceleration data array
  var inputArray = [], inputContor = 1;
  for (var i = 1 ; i <= 1000; i = i + 1) {
    inputArray[i] = [];
  }
  //time variables:
  var dT = 0, t0, t1 = 0;

  var rotation;
  var G = parseFloat(localStorage.getItem("calibrated"));
  document.addEventListener('deviceready', onDeviceReady.bind(this), false);

  function onDeviceReady() {

    window.addEventListener("deviceorientation", function EventFunction(event) {
      $rootScope.rotation = event;
      rotation = event;
      //var message = ("   Alpha = " + event.alpha
      //        + "<br />   Beta = " + event.beta
      //        + "<br />   Gamma = " + event.gamma
      //       );
      //document.getElementById("rotation").innerHTML = message;
    }, true);

    $rootScope.interval = setInterval(function () {
      navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    }, 0.1);

    //nerelevant::
    document.addEventListener('pause', onPause.bind(this), false);
    document.addEventListener('resume', onResume.bind(this), false);
  };
  //onSucces si onError pentr acceleratie:
  function onSuccess(acceleration) {
    var mesage = ('Acceleration X: ' + acceleration.x + "<br />" +
          'Acceleration Y: ' + acceleration.y + "<br />" +
          'Acceleration Z: ' + acceleration.z + " <br /> " +
          'Timestamp: ' + acceleration.timestamp + "<br />");
    //acceleration mesage block;
    document.getElementById("xlr8").innerHTML = mesage;
    //speed(acceleration);
    if (rotation && acceleration)
      acctualXlr8(acceleration, rotation);
  }
  function onError() {
    alert('XLR8 Error!');
  }

  //codvechi
  //function speed(acceleration) {
  //  var Vx = Vx0 + acceleration.x * (0.001);
  //  var Vy = Vy0 + acceleration.y * (0.001);
  //  var Vz = Vz0 + acceleration.z * (0.001);
  //  var message = 'speedX = ' + Vx + "<br /> speedY = " + Vy + "<br /> speedZ = " + Vz;
  //  document.getElementById("speed").innerHTML = message;
  //  distance(Vx, Vy, Vz);
  //}
  //function distance(Vx, Vy, Vz) {
  //  var Dx = Dx0 + Vx * (0.0001);
  //  var Dy = Dy0 + Vy * (0.0001);
  //  var Dz = Dz0 + Vz * (0.0001);
  //  var message = 'distX = ' + Dx + "<br /> distY = " + Dy + "<br /> distZ = " + Dz;
  //  document.getElementById("distance").innerHTML = message;
  //}

  function acctualXlr8(acceleration, rotation) {
    //functia asta are doua sub functii: RotationMatrix + AccXlr8
    var i, j, k;
    var R1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; //R1 este matricea=Rx*Ry iar R este Rx*Ry*Rz
    var a = [acceleration.x, acceleration.y, acceleration.z];
    var xlr8 = [0, 0, 0];
    //SMENUL LUI MATEI (SWAP- BETA-G(r)AMMA):
    var alpha = rotation.alpha * Math.PI / 180;
    var beta  = rotation.gamma * Math.PI / 180;
    var gamma = rotation.beta * Math.PI / 180;

    when(
      function (done) {
        //matrici de rotatie pe cate un unghi
        var Rx = [[1, 0, 0],
                  [0, Math.cos(gamma), (-1) * Math.sin(gamma)],
                  [0, Math.sin(gamma), Math.cos(gamma)]
        ];
        var Ry = [[Math.cos(beta), 0, Math.sin(beta)],
                  [0, 1, 0],
                  [(-1) * Math.sin(beta), 0, Math.cos(beta)]
        ];
        var Rz = [[Math.cos(alpha), (-1) * Math.sin(alpha), 0],
                  [Math.sin(alpha), Math.cos(alpha), 0],
                  [0, 0, 1]
        ];

        for (i = 0; i < 3 ; i = i + 1) {
          for (j = 0; j < 3 ; j = j + 1) {
            for (k = 0; k < 3 ; k = k + 1) {
              R1[i][j] = R1[i][j] + Rz[i][k] * Rx[k][j];
            }
          }
        }

        for (i = 0; i < 3 ; i = i + 1) {
          for (j = 0; j < 3 ; j = j + 1) {
            for (k = 0; k < 3 ; k = k + 1) {
              R[i][j] = R[i][j] + R1[i][k] * Ry[k][j];
            }
          }
        }
        //console.log("Rx:", Rx, '\n' + "Ry:", Ry, '\n' + "Rz", Rz, '\n' + "R1:", R1, '\n' + "R", R);
        done();
      }).then(function () {

        for (i = 0; i < 3; i = i + 1) {
          for (j = 0 ; j < 3; j = j + 1) {
            xlr8[i] = xlr8[i] + R[i][j] * a[j];
          }
        }
        //gravity
        //pentru emulator:
        xlr8[2] = xlr8[2] + G;
        //pentru tel:
        //xlr8[2] = xlr8[2] - G;

        //round
        //for( i = 0; i < 3; i = i + 1 ){
        //  xlr8[i] = Math.round(xlr8[i] * 1000) / 1000;
        //}
        //into inputArray
        if (inputContor > 100) {
          var d = new Date();
          t1 = d.getMinutes() * 60000 + d.getSeconds() * 1000 + d.getMilliseconds();

          if (!t0)
            t0 = t1;
          avrageToVelocity(inputArray, (t1 - t0) / 1000);

          t0 = t1;
          inputContor = 1;
        }

        inputArray[inputContor][1] = xlr8[0];
        inputArray[inputContor][2] = xlr8[1];
        inputArray[inputContor][3] = xlr8[2];
        inputContor = inputContor + 1;

        var d = new Date();
        console.log("i:" + (inputContor - 1) + "||Time: " + d.getMinutes() + " : " + d.getSeconds() + " : " + d.getMilliseconds());
        console.log("InputAx:" + inputArray[inputContor - 1][1]
                  + "InputAy:" + inputArray[inputContor - 1][2]
                  + "InputAz:" + inputArray[inputContor - 1][3]);

        var mesage = ('AcctualXLR8 X: ' + xlr8[0] + "<br />" +
                      'AcctualXLR8 Y: ' + xlr8[1] + "<br />" +
                      'AcctualXLR8 Z: ' + xlr8[2] + " <br /> ");
        //acceleration mesage block;
        document.getElementById("acctualXlr8").innerHTML = mesage;
      });

  }
  var when = function () {
    var args = arguments;  // the functions to execute first
    return {
      then: function (done) {
        var counter = 0;
        for (var i = 0; i < args.length; i++) {
          // call each function with a function to call on done
          args[i](function () {
            counter++;
            if (counter === args.length) {  // all functions have notified they're done
              done();
            }
          });
        }
      }
    };
  };

  function avrageToVelocity(inputArray, dT) {//vectorul de input pt medie si delta T in secunde

    //LOC IN CARE CANVA POATE TRIMITI DATELE ASTEA UNUI SERVICIU :D
    /////////////////////////////////////////////////////////////////////////
    //Versiunea 1 de calcul a acceleratie medii pe t0-t1 (regula Trapezului)
    //var sumAx = 0, sumAy = 0, sumAz = 0;
    //for (var i = 2; i <= 99; i++) {  //suma acceleratii instantanee 2-99  
    //  sumAx = sumAx + inputArray[i][1];
    //  sumAy = sumAy + inputArray[i][2];
    //  sumAz = sumAz + inputArray[i][3];
    //}
    //
    //Ax = dT / 100 * (inputArray[1][1] + inputArray[100][1] + 2 * sumAx);
    //Ay = dT / 100 * (inputArray[1][2] + inputArray[100][2] + 2 * sumAy);
    //Az = dT / 100 * (inputArray[1][3] + inputArray[100][3] + 2 * sumAz);
    /////////////////////////////////////////////////////////////////////////
    //Media valorilor din input array
    var avgAx = 0, avgAy = 0, avgAz = 0;
    for (var i = 1; i <= 100; i++) {  //suma celor 100 de esantioane 
        avgAx = avgAx + inputArray[i][1];
        avgAy = avgAy + inputArray[i][2];
        avgAz = avgAz + inputArray[i][3];
    }
    avgAx = avgAx / 100;
    avgAy = avgAy / 100;
    avgAz = avgAz / 100;
    //calculul abaterii standard
    var Sx = 0, Sy = 0, Sz = 0;
    for (var i = 1; i <= 100; i++) {
      Sx = Sx + (inputArray[i][1] - avgAx) * (inputArray[i][1] - avgAx);
      Sy = Sy + (inputArray[i][2] - avgAy) * (inputArray[i][2] - avgAy);
      Sz = Sz + (inputArray[i][3] - avgAz) * (inputArray[i][3] - avgAz);
    }
    Sx = Math.sqrt(Sx / 99);
    Sy = Math.sqrt(Sy / 99);
    Sz = Math.sqrt(Sz / 99);
    //Calculul aceleratiilor pe dT luand in calcul doar valorile in intervalul [avg-S;avg+s]
    var sumX = 0, sumY = 0, sumZ = 0;
    var nrX = 0, nrY = 0, nrZ = 0;
    var avgMinusS = { x:(avgAx-Sx), y:(avgAy-Sy), z:(avgAz-Sz) };
    var avgPlusS = { x: (avgAx + Sx), y: (avgAy + Sy), z: (avgAz + Sz) };
    for (var i = 1; i <= 100; i++) {
      if (inputArray[i][1] >= avgMinusS.x) {
        if (inputArray[i][1] <= avgPlusS.x) {
          if (inputArray[i][3] >= avgMinusS.z) {
            if (inputArray[i][3] <= avgPlusS.z) {
              if (inputArray[i][2] >= avgMinusS.y) {
                if (inputArray[i][2] <= avgPlusS.y) {
                  sumX = sumX + inputArray[i][1];
                  sumY = sumY + inputArray[i][2];
                  sumZ = sumZ + inputArray[i][3];
                  nrX++;
                  //nrY++;
                  //nrZ++;
                }
              }
            }
          }
        }
      }
    }
    if (!nrX) {
      Ax = Ax0;
      Ay = Ay0;
      Az = Az0;
    }
    else {
      Ax = (Math.round((sumX / nrX) * 100)) / 100;
      Ay = (Math.round((sumY / nrX) * 100)) / 100;
      Az = (Math.round((sumZ / nrX) * 100)) / 100;
    }
    console.log("dT = " + dT);
    console.log("nrClopot = " + nrX);
    console.log("AVRAGE Ax = " + Ax + " Ay = " + Ay + " Az = " + Az);
    
    //if (Math.abs(Ax - Ax0) > 0.25 || 
    //    Math.abs(Ay - Ay0) > 0.25 ||
    //    Math.abs(Az - Az0) > 0.25)
//      if (Ax  > 0.25 || Ay > 0.25 || Az> 0.25) {

      //Vx1 = Vx0 + Ax * dT;
      //Vy1 = Vx0 + Ay * dT;
      //Vz1 = Vz0 + Az * dT;

        Vx1 =  Ax * dT;
        Vy1 =  Ay * dT;
        Vz1 =  Az * dT;


      console.log(" Vx0 = " + Vx0 + " Vy0 = " + Vy0 + " Vz0 = " + Vz0);
      console.log(" Vx1 = " + Vx1 + " Vy1 = " + Vy1 + " Vz1 = " + Vz1);
      
      //Vx = (Vx1 + Vx0) / 2;
      // Vy = (Vy1 + Vy0) / 2;
      // Vz = (Vz1 + Vz0) / 2;
      Vx = Vx1;
      Vy = Vy1;
      Vz = Vz1;
      
      console.log(" Vx = " + Vx + " Vy = " + Vy + " Vz = " + Vz);
      var message = 'nr val in clopot = '+ nrX + '<br />'+
                    'speedX = ' + Vx + "<br /> speedY = " + Vy + "<br /> speedZ = " + Vz;
      document.getElementById("speed").innerHTML = message;
      Vx0 = Vx1, Vy0 = Vy1, Vz0 = Vz1;
      if (Vx > 0.06||Vx < 0.06 ){
        X1 = X0 + Vx * dT;
      }
      else {
        X1 = X0;
      }
      if (Vy > 0.06 || Vy < 0.06) {
        Y1 = Y0 + Vy * dT;
      }
      else {
        Y1 = Y0;
      }
      if (Vz > 0.06 || Vz < 0.06) {
        Z1 = Z0 + Vz * dT;
      }
      else {
        Z1 = Z0;
      }
      console.log(" X0 = " + X0 + " Y0 = " + Y0 + " Z0 = " + Z0);
      console.log(" X1 = " + X1 + " Y1 = " + Y1 + " Z1 = " + Z1);
      var message = 'deplasareX = ' + (X0 - X1) + "<br /> deplasareY = " + (Y0 - Y1) + "<br /> deplasareZ = " + (Z0 - Z1)
                    + "<br /><br /> positionX = " + X1 + "<br /> positionY = " + Y1 + "<br /> positionZ = " + Z1;
      document.getElementById("distance").innerHTML = message;

      X0 = X1, Y0 = Y1, Z0 = Z1;
      
      Ax0 = Ax, Ay0 = Ay, Az0 = Az;
    }
    //else {

    //}



//  }

  //nerelevant:
  function onPause() {
    // TODO: This application has been suspended. Save application state here.
  };
  function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
  };
});