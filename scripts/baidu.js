/**
 * Created by wang on 2015/8/21.
 */

/**
 * @ngdoc overview
 * @name appbkApp
 * @description
 * # appbkApp
 *
 * Main module of the application.
 */
//全局变量
//var base_url = "http://rest.appbk.com/";

angular
  .module('baidu', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngStorage',
    'ui.bootstrap',
    'ngSanitize', //html改写模板，这个不能少
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
      .when('/:token', {
        templateUrl:'views/baidu_sem.html',
        controller:'baidu_sem_controller'
      })
      .when('/baidu_sem/:token', {
        templateUrl:'views/baidu_sem.html',
        controller:'baidu_sem_controller'
      })
      .when('/baidu_roi', {
        templateUrl:'views/baidu_roi.html',
        controller:'baidu_roi_controller'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

