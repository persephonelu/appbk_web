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
    'angular-jqcloud',
    'ngSanitize', //html改写模板，这个不能少,ui.select
    'mgcrea.ngStrap',//date select
  ])
  .config(function ($routeProvider,$locationProvider) {
    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});

    $routeProvider
      .when('/', {
        templateUrl: 'views/index_main.html',
        controller: 'index_main_controller'
      })
      .when('/index_login', {
        templateUrl: 'views/index_login.html',
        controller: 'index_login_controller'
      })
      .when('/index_register', {
        templateUrl: 'views/index_register.html',
        controller: 'index_register_controller'
      })
      .when('/password_find', {
        templateUrl: 'views/password_find.html',
        controller: 'password_find_controller'
      })
      .when('/password_sendemail_success', {
        templateUrl: 'views/password_sendemail_success.html',
        controller: 'password_sendemail_success_controller'
      })
      .when('/update_pwd/:token', {
        templateUrl: 'views/update_password.html',
        controller: 'update_password_controller'
      })
      .when('/index_about', {
        templateUrl: 'views/index_about.html'
      })
      .when('/index_user_agreement', {
        templateUrl: 'views/index_user_agreement.html',
        //controller: 'index_user_agreement_controller'
      })
      .when('/index_contact', {
        templateUrl: 'views/index_contact.html'
      })
      .when('/tag_rank', {
        templateUrl: 'views/tag_rank.html',
        controller: 'tag_rank_controller'
      })
      .when('/word_rank', {
        templateUrl: 'views/word_rank.html',
        controller: 'word_rank_controller',
        //resolve: word_rank_controller.resolve,

      })

      .when('/word_cover_rank', {
        templateUrl: 'views/word_cover_rank.html',
        controller: 'word_cover_rank_controller',
      })
      .when('/app_rank', {
        templateUrl: 'views/app_rank.html',
        controller: 'app_rank_controller',
      })

      .when('/app_rank/:rank/:type', {
        templateUrl: 'views/app_rank.html',
        controller: 'app_rank_controller',
      })

      .when('/app_rank_up', {
        templateUrl: 'views/app_rank_up.html',
        controller: 'app_rank_up_controller',
      })
      .when('/app_rank_up/:rank/:type', {
        templateUrl: 'views/app_rank_up.html',
        controller: 'app_rank_up_controller',
      })

      .when('/app_rank_down', {
        templateUrl: 'views/app_rank_down.html',
        controller: 'app_rank_down_controller',
      })

      .when('/app_rank_down/:rank/:type', {
        templateUrl: 'views/app_rank_down.html',
        controller: 'app_rank_down_controller',
      })

      .when('/app_rank_offline', {
        templateUrl: 'views/app_rank_offline.html',
        controller: 'app_rank_offline_controller',
      })

      .when('/app_rank_offline/:date', {
        templateUrl: 'views/app_rank_offline.html',
        controller: 'app_rank_offline_controller',
      })


      .when('/app_rank_release', {
        templateUrl: 'views/app_rank_release.html',
        controller: 'app_rank_release_controller',
      })

      .when('/app_rank_release/:rank/:date', {
        templateUrl: 'views/app_rank_release.html',
        controller: 'app_rank_release_controller',
      })

      .when('/app_search/:name/:country', {
        templateUrl: 'views/app_search.html',
        controller: 'app_search_controller'
      })

      .when('/app_search/:name', {
        templateUrl: 'views/app_search.html',
        controller: 'app_search_controller'
      })
      .when('/word_search/:name', {
        templateUrl: 'views/word_search.html',
        controller: 'word_search_controller'
      })
      .when('/word_rank_trend/:name', {//关键词热度趋势
        templateUrl: 'views/word_rank_trend.html',
        controller: 'word_rank_trend_controller'
      })
      .when('/word_rank_trend', {//关键词热度趋势，无输入
        templateUrl: 'views/word_rank_trend.html',
        controller: 'word_rank_trend_controller'
      })
      .when('/app_content_keyword_compare/:app_id/:compete_app_id', { //app关键词对比
        templateUrl: 'views/app_content_keyword_compare.html',
        controller: 'app_content_keyword_compare_controller'
      })


      //tools
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
      .when('/app_tools_combine', { //组词
        templateUrl:'views/app_tools_combine.html',
        controller:'app_tools_combine_controller'
      })
      .when('/app_tools_combine/:n', { //组词,带参数
        templateUrl:'views/app_tools_combine.html',
        controller:'app_tools_combine_controller'
      })
      .when('/keyword_extand/:keyword', {
        templateUrl: 'views/keyword_extend.html',
        controller: 'keyword_extend_controller'
      })

      .when('/keyword_extand', {
        templateUrl: 'views/keyword_extend.html',
        controller: 'keyword_extend_controller'
      })

      .when('/app_tools_word_cover',{
        templateUrl: 'views/app_tools_word_cover.html',
        controller: 'app_tools_word_cover_controller',
      })
      .when('/app_tools_word_cover/:word',{
        templateUrl: 'views/app_tools_word_cover.html',
        controller: 'app_tools_word_cover_controller',
      })

      .when('/user_apps', {
        templateUrl:'views/user_app_manage.html',
        controller:'user_app_manage_controller'
      })
      //国际化页面

      .when('/word_rank_inter', {
        templateUrl: 'views/word_rank_inter.html',
        controller: 'word_rank_inter_controller'
      })
      .when('/word_search_inter/:name/:country', {
        templateUrl: 'views/word_search_inter.html',
        controller: 'word_search_inter_controller'
      })


      .when('/app_tools_rank_update', { //榜单更新预测
        templateUrl:'views/app_tools_rank_update.html',
        controller:'app_tools_rank_update_controller'
      })
      .when('/app_tools_search_update', { //榜单更新预测
        templateUrl:'views/app_tools_search_update.html',
        controller:'app_tools_search_update_controller'
      })

      .when('/app_tools_search_update/:date', { //榜单更新预测
        templateUrl:'views/app_tools_search_update.html',
        controller:'app_tools_search_update_controller'
      })

      .when('/app_tools_check', { //榜单更新预测
        templateUrl:'views/app_tools_guance.html',
        controller:'app_tools_guance_controller'
      })
      .when('/app_tools_check/:appid/:name', { //榜单更新预测
        templateUrl:'views/app_tools_guance.html',
        controller:'app_tools_guance_controller'
      })

      .when('/app_tools_rank_equal',{
        templateUrl: 'views/app_tools_rank_equal.html',
        controller: 'app_tools_rank_equal_controller'
      })

      .when('/app_tools_rank_equal/:type/:rank',{
        templateUrl: 'views/app_tools_rank_equal.html',
        controller: 'app_tools_rank_equal_controller'
      })

      //个人设置
    //<a href="#account_setting">账号设置</a>
    //  <a href="#setting_vip">VIP特权</a>
    //  <a href="#setting_integral">积分兑换</a>
    //  <a href="#setting_order">订购记录</a>

      .when('/setting_account',{
        templateUrl: 'views/setting_account.html',
        controller: 'setting_account_controller'
      })
      .when('/setting_vip',{
        templateUrl: 'views/setting_vip.html',
        controller: 'setting_vip_controller'
      })
      .when('/setting_integral',{
        templateUrl: 'views/setting_integral.html',
        controller: 'setting_integral_controller'
      })
      .when('/setting_order',{
        templateUrl: 'views/setting_order.html',
        controller: 'setting_order_controller'
      })
        .when('/setting_wechat',{
          templateUrl: 'views/setting_wechat.html',
          controller: 'setting_wechat_controller'
        })
      .when('/setting_passwd',{
        templateUrl: 'views/setting_passwd.html',
        controller: 'setting_passwd_controller'
      })
      .when('/payment_finish',{
        templateUrl: 'views/payment_finish.html',
        controller: 'payment_finish_controller'
      })
      .otherwise({
        redirectTo: '/'
      });


    //function word_rank_controller($scope) {
    //  //本身不用管，该怎么弄怎么弄
    //}
    //
    //word_rank_controller.resolve = {
    //delay: function($q) {
    //    var delay = $q.defer(),
    //      load = function(){
    //        console.log("load = function");
    //        $.getScript('scripts/controllers/user_app_controllers.js?v=2016041401',function(){
    //          delay.resolve();
    //        });
    //      };
    //    load();
    //    return delay.promise;
    //  }
    //}
  });



