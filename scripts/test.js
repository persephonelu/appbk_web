'use strict';

/**
 * @ngdoc overview
 * @name appbkApp
 * @description
 * # appbkApp
 *
 * Main module of the application.
 */
//全局变量


angular
  .module('test', [
    'ngRoute',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/test1.html',
        controller: 'test1_controller'
      })
      .when('/test1', {
        templateUrl: 'views/test1.html',
        controller: 'test1_controller'
      })
      .when('/test2', {
        templateUrl: 'views/test2.html',
        controller: 'test2_controller'
      })


  });



