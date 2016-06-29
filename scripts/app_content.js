/**
 * Created by maris on 2015/10/24.
 */
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
var base_url = "http://rest.appbk.com/"; //正式系统
//var base_url = "http://git.appbk.com/"; //测试系统

angular
  .module('rank', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'appbk_services',
    'appbk_directives',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.exporter',
    'ui.select',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/app_content_main.html',
        controller: 'app_content_main_controller'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

