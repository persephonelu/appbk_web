'use strict';

/**
 * @ngdoc function
 * @name appbkApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the appbkApp
 */
angular.module('appbkApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
