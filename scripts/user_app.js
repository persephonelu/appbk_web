
/**
 * @ngdoc overview
 * @name appbkApp
 * @description
 * # appbkApp
 *
 * Main module of the application.
 */

var app_info ;
var selected_app_id;

angular
  .module('user_app', [
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
    'mgcrea.ngStrap',//date select
    'ui.grid.pagination',
  ])


  .config(function ($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'views/app_content_trend.html', //兼容，把原来的content导入到这里
        controller: 'app_content_trend_controller'
      })
      .when('/app_content_compete/:app_id', { //app竞品管理页
        templateUrl:'views/app_content_compete.html',
        controller:'app_content_compete_controller'
      })
      .when('/user_app_info/:app_id', {
        templateUrl:'views/user_app_info.html',
        controller:'user_app_info_controller'
      })
      .when('/user_app_compete/:app_id', {
        templateUrl:'views/user_app_compete.html',
        controller:'user_app_compete_controller'
      })
      .when('/user_app_compete_keyword/:app_id', {
        templateUrl:'views/user_app_compete_keyword.html',
        controller:'user_app_compete_keyword_controller'
      })
      .when('/user_app_keyword_manage/:app_id', {
        templateUrl:'views/user_app_keyword_manage.html',
        controller:'user_app_keyword_manage_controller'
      })
      .when('/user_app_keyword_expand/:app_id', { //关键词拓展步骤1，输入种子词
        templateUrl:'views/user_app_keyword_expand.html',
        controller:'user_app_keyword_expand_controller'
      })
      .when('/user_app_keyword_expand2/:app_id', { //关键词拓展步骤2，拓词
        templateUrl:'views/user_app_keyword_expand2.html',
        controller:'user_app_keyword_expand2_controller'
      })
      .when('/user_app_keyword_expand3/:app_id', { //关键词拓展步骤3，整理
        templateUrl:'views/user_app_keyword_expand3.html',
        controller:'user_app_keyword_expand3_controller'
      })
      .when('/user_app_keyword_analyze/:app_id', {//关键词搜索排名
        templateUrl:'views/user_app_keyword_analyze.html',
        controller:'user_app_keyword_analyze_controller'
      })
      .when('/user_app_watch/:app_id', {
        templateUrl:'views/user_app_watch.html',
        controller:'user_app_watch_controller'
      })
        .when('/vip_keyword_pick/:app_id', { //app竞品管理页
          templateUrl:'views/vip_keyword_pick.html',
          controller:'vip_keyword_pick_controller'
        })


      .when('/user_weibo', {
        templateUrl:'views/user_weibo.html',
        controller:'user_weibo_controller'
      })
      .when('/user_weibo_profile', {
        templateUrl:'views/user_weibo_profile.html',
        controller:'user_weibo_profile_controller'
      })

      //排名趋势
        .when('/app_content/:app_id', {
          templateUrl: 'views/app_content_trend.html', //兼容，把原来的content导入到这里
          controller: 'app_content_trend_controller'
        })
        .when('/app_content_keyword/:app_id', {
          templateUrl: 'views/app_content_keyword.html',
          controller: 'app_content_keyword_controller'
        })

        //app评论
        .when('/app_content_comment/:app_id', {
          templateUrl: 'views/app_content_comment.html',
          controller: 'app_content_comment_controller'
        })

        //app评论详情
        .when('/app_content_comment_detail/:app_id', {
          templateUrl: 'views/app_content_comment_detail.html',
          controller: 'app_content_comment_detail_controller'
        })


        .otherwise({
        redirectTo: '/'
      });
  });
