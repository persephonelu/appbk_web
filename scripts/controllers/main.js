'use strict';

/**
 * @ngdoc function
 * @name appbkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appbkApp
 */
angular.module('appbkApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
