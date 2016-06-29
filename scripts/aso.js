/**
 * Created by maris on 2015/12/22.
 */
angular
  .module('aso', [
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
    'ui.grid.pagination',
    'ui.select',
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl:'views/aso/app.html',
        controller:'app_controller'
      })
      .when('/word/:app_id', {
        templateUrl:'views/aso/word.html',
        controller:'word_controller'
      })
      .when('/solution/:app_id', {
        templateUrl:'views/aso/solution.html',
        controller:'solution_controller'
      })
      .when('/watch/:app_id', {
        templateUrl:'views/aso/watch.html',
        controller:'watch_controller'
      })
      .when('/login', {
        templateUrl:'views/aso/login.html',
        controller:'login_controller'
      })
      .when('/word_cloud', {
        templateUrl:'views/aso/word_cloud.html',
        controller:'word_cloud_controller'
      })
      .when('/forbidden', {
        templateUrl:'views/aso/forbidden.html',
        controller:'forbidden_controller'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
