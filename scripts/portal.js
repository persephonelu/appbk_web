/**
 * Created by maris on 2015/12/12.
 */
angular
  .module('portal', [
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
        templateUrl:'views/portal/base_data.html',
        controller:'base_data_controller'
      })
      .when('/job_data', {
        templateUrl:'views/portal/job_data.html',
        controller:'job_data_controller'
      })
      .when('/search_data', {
        templateUrl:'views/portal/search_data.html',
        controller:'search_data_controller'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
