var myApp = angular.module('myApp',
	        ['ngRoute', 'appControllers', 'ngCordova']);

console.log("deci console.log din app.js merge..")

var appControllers = angular.module('appControllers', []);

var calibrated = localStorage.getItem("calibrated");

myApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
      when('/homescreen', {
        templateUrl: 'views/homescreen.html',
        controller: 'Homescreen'
      }).
      when('/menu', {
        templateUrl: 'views/menu.html',
        controller: 'Menu'
      }).
      when('/options', {
        templateUrl: 'views/options.html',
        controller: 'Options'
      }).
      when('/calibrate', {
        templateUrl: 'views/calibrate.html',
        controller: 'Calibrate'
      }).
      when('/probaFencing', {
        templateUrl: 'views/probaFencing.html',
        controller: 'ProbaFencing'
      }).
      when('/probaFencing1', {
        templateUrl: 'views/probaFencing1.html',
        controller: 'ProbaFencing1'
      }).
      when('/tierce', {
        templateUrl: 'views/tierce.html',
        controller: 'Tierce'
      }).
      when('/quarte', {
        templateUrl: 'views/quarte.html',
        controller: 'Quarte'
      }).
      when('/quinte', {
        templateUrl: 'views/quinte.html',
        controller: 'Quinte'
      }).
      when('/fAttack', {
        templateUrl: 'views/fAttack.html',
        controller: 'FAttack'
      }).
      when('/cAttack', {
        templateUrl: 'views/cAttack.html',
        controller: 'CAttack'
      }).
      when('/hAttack', {
        templateUrl: 'views/hAttack.html',
        controller: 'HAttack'
      }).
      otherwise({
         //redirectTo: registered ? '/application' : '/register'
        redirectTo: '/homescreen'
      });
}]);