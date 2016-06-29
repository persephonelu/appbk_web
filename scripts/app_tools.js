/**
 * Created by wang on 2015/8/25.
 * app工具
 */
angular
  .module('app_tools', [
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
      .when('/', {
        templateUrl:'views/app_tools_aso.html',
        controller:'app_tools_aso_controller'
      })
      .when('/app_tools_aso', {
        templateUrl:'views/app_tools_aso.html',
        controller:'app_tools_aso_controller'
      })
      .when('/app_tools_search', {
        templateUrl:'views/app_tools_search.html',
        controller:'app_tools_search_controller'
      })
      .when('/app_tools_seg', {
        templateUrl:'views/app_tools_seg.html',
        controller:'app_tools_seg_controller'
      })
      .when('/app_tools_test', {
        templateUrl:'views/app_tools_test.html',
        controller:'app_tools_test_controller'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
