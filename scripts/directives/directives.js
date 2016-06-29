'use strict';

/**
 * @ngdoc directive
 * @name appbkApp.directive:directives
 * @description
 * # directives
 */
angular.module('appbk_directives',[])

//没有搜索结果的directive
  .directive('userMessage', function() {
    return {
      restrict: 'E',
      template: "<div>{{message}}</div>",
      replace: true,
    };
  })


  //一个页面包含多个directive的情况
.directive('multiMessage', function()
  {
    var directive = {};
    directive.restrict = 'E';
    directive.template = "{{user.message}}";
    directive.scope =
    {
      user : "=user"
    }
    return directive;
  })

  //使用app api搜索
  .directive('apiSearch', function() {
    return {
      restrict: 'E',
      template: "<div ng-show='api_search_show'>没有搜索结果?使用 <a style='text-decoration:underline;' ng-click='get_api_app_search_results()' href=''>苹果市场api搜索</a>, 或者输入app id搜索 </div>",
      replace: true,
    };
  })


