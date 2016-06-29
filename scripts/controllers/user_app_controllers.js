/**
 * @ngdoc function
 * @name appbkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appbkApp
 */
angular.module('user_app')

  //user_app控制页
    .controller('user_app_controller', function($scope,$window, $routeParams, $localStorage,$location, app, user_app, user,auth,$sce,user_app_keyword) {

//google analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-74973814-1', 'auto');
    $window.ga('send', 'pageview', { page: $location.url() });

      $scope.left_nav_show = false;
      if(typeof($localStorage.email) == "undefined") //如果没有登录
      {
        $scope.user_login_show = false;
        $scope.user_not_login_show = true;
        $scope.register_or_login = "现在注册";
        $scope.register_or_login_url = "register.html";
      }
      else//如果已经登录，获得登录信息
      {
        $scope.user_login_show = true;
        $scope.user_not_login_show = false;
        $scope.user_info = user.get_user_info().get({"email": $localStorage.email, "token": $localStorage.token});
        $scope.register_or_login = "现在使用";
        $scope.register_or_login_url = "user_main.html";

        //获得用户app列表
        user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token}, function(data)
        {
          //如果尚未添加app
          if (data.length==0)
          {
            $scope.message = "尚未添加app，请点击右上角'app管理'，添加app";
            return;
          }
          $scope.app = {}; //选择的app
          $scope.apps = data; //app列表
          $scope.app.selected = data[0]; //显示的选项

          //已经登录，并且是我的app
          for (var i=0; i< data.length ; i++)
          {
            if ( data[i].app_id == app_id)
            {
              $scope.left_nav_show = true;
            }
          }
        });

      }


      var paramlist = $location.absUrl().split("/");
      var app_id = paramlist[paramlist.length-1];

      $scope.add_user_app = function(){
        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          window.location = "/#/index_login";
          return;
        }
        user_app.add_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
        {

          user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token}, function(data)
          {
            $scope.apps = data; //app列表

            for (var i=0; i< data.length ; i++)
            {
              if ( data[i].app_id == app_id)
              {
                $scope.left_nav_show = true;
                break;
              }
            }
            window.location = 'user_main.html#/app_content/' + app_id;
          });
        });
      }

      $scope.app_info = app.get_app_info().get({"app_id":app_id});
      //获得app基本信息
      $scope.data = {};
      $scope.app_id = app_id;
      //app search 搜索
      $scope.app_search = function()
      {
        var name = $scope.n;
        window.location = "/#/app_search/" + name + "/cn";
      }


      //选择一个app
      $scope.select_app = function(app_id) {
        //获得app基本信息
        app.get_app_info().get({"app_id":app_id}, function(data)
        {
          $scope.app_info = data;
          $scope.app_id = app_id;

          //获得用户app列表,如果能选择菜单，肯定是有登录并有添加的app的，add by maris
          user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token}, function(data)
          {
            for (var i=0; i< data.length ; i++)
            {
              if ( data[i].app_id == app_id)
              {
                $scope.left_nav_show = true;
                break;
              }
            }

            //菜单的选中状态重置
            $scope.left_nav = [0,1,0,0,0,0,0,0,0,0]; //默认展示第二个菜单

            window.location = 'user_main.html#/app_content/' + app_id;
          });
        });
      }

      //退出
      $scope.logout = function() {
        auth.logout();
      }

      $scope.show_login_message = function()
      {
        //alert("请先登录，并将此App添加到 我的应用");
      }

    //左侧菜单。对应相应页面
    $scope.menuSelectPage = function(n){
      $('#main-nav').contents().removeClass('active');
      $('#commentSetting').contents().removeClass('active');
      $('#systemSetting').contents().removeClass('active');

      if ( n==1){
        $('#main-nav #menu_user_app_info').addClass('active');
      }else if(n == 2){
        $('#main-nav #menu_app_content_trend').addClass('active');
      }else if (n == 3){
        $('#main-nav #menu_app_content_keyword').addClass('active');
      }else if (n == 4){

        $('#main-nav #menu_app_content_compete').addClass('active');
      }else if (n == 5){
        //评论 还有问题。展开问题
        $('#menu_app_content_comment').addClass('active');
      }else if (n == 6){
        //评论 还有问题。展开问题
        $('#main-nav #menu_app_content_comment_detail').addClass('active');
      }else if ( n == 7){
        //关键词管理
        $('#menu_user_app_keyword_manage').addClass('active');
      }else if ( n == 8){
        //关键词拓展
        $('#menu_user_app_keyword_expand').addClass('active');

      }else if ( n == 9){
        //关键词竞品
        $('#menu_user_app_compete').addClass('active');

      }else if ( n == 10){
        //关键词监控
        $('#menu_user_app_watch').addClass('active');

      }else if ( n == 11){
        //搜索排名分析
        $('#menu_user_app_keyword_analyze').addClass('active');

      }else if (n == 12){
        $('#menu_vip_keyword').addClass('active');
      }



      if (n ==5 || n==6){
        $scope.coment_menu_expanded = true;
        $('#menu_comment_nav').addClass('active');
        $('#commentSetting').addClass('in');

      }else {
        $scope.coment_menu_expanded = false;
        $('#commentSetting').removeClass('in');

      }

      if (n >= 7 && n < 12){
        $scope.keyword_menu_expanded = true;
        $('#systemSetting').addClass('in');
        $('#menu_app_keyword_nav').addClass('active');

      }else {
        $('#systemSetting').removeClass('in');

        $scope.keyword_menu_expanded = false;
      }

    }

    //移动端导航
    $scope.collapse_nav = function(){
      //如果是移动端
      $scope.$watch('window.innerWidth', function() {
        if (window.innerWidth <= 768) {

          $('.navbar-collapse-mobil').collapse('toggle');

          $('.navbar-collapse-mobil').removeClass('c-shown');
        }
      })
    }


    })

  //user_app_info控制页
    .controller('user_app_info_controller', function($scope,$routeParams, $localStorage,$sce, app, user_app,user_app_keyword)
    {
      $scope.menuSelectPage(1);

      var app_id = $routeParams.app_id;
      document.title = "APP基本信息_AppBK.com";
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});
      $localStorage.visit_url = "app_content/"+app_id;
      $scope.app_brief_loading_show = true;
      app.get_app_info().get({"app_id":app_id},function(data) {
        $scope.app_info = data;
        $scope.imageCount = $scope.app_info.app_pics.length
        updateImageStatus();

        document.title = $scope.app_info.name + "_APP基本信息_AppBK.com";
        $scope.app_brief = $sce.trustAsHtml(data.brief);

        $scope.app_brief_loading_show = false;
        $scope.app_brief_show_all = true;
        $scope.show_all_app_brief = function() {
          $scope.app_brief_show_all = false;
          $('#app_brief').css("max-height","initial").end();
          $('#app_brief').css("margin-bottom","0px").end();

        }

        //app关键词曝光趋势图
        $scope.expose_trend_loading_show = true;
        user_app_keyword.get_app_expose_trend().get({"app_id":app_id},function(data)
        {
          $scope.expose_trend_loading_show = false;
          $('#expose_trend').highcharts(data);
        });

      });

      $scope.user_also_buy_apps_loading_show = true;
      app.get_app_user_also_buy_apps().query({"app_id":app_id}, function(data)
      {
        $scope.user_also_buy_apps_loading_show = false;
        $scope.user_also_buy_apps = data;
        if ( data.length == 0 ) //如果没有搜索结果
        {
          $scope.buy_app_user = {};
          $scope.buy_app_user.message = "暂无相关app";
        }
        $scope.user_also_buy_app_show_wait = false;
      });

      $scope.currentIndex = 0;


      $scope.screenshot_previous = function(){

        if ($scope.currentIndex <= 0){
          return;
        }

        $scope.currentIndex--;

        updateImageStatus();
      }

      $scope.screenshot_next = function(){

        if ($scope.currentIndex >= $scope.imageCount -3){
          return;
        }

        $scope.currentIndex++;

        updateImageStatus();

      }

      function updateImageStatus(){
        console.log("111$scope.currentIndex=" + $scope.currentIndex);
        console.log("222$scope.imageCount=" + $scope.imageCount);
        $('#sliding-next').removeClass('sliding-disabled');
        $('#sliding-previous').removeClass('sliding-disabled');

        if ($scope.currentIndex <= 0){
          $('#sliding-previous').addClass('sliding-disabled');
          console.log("sliding-previous add class1111");

        }

        if ($scope.currentIndex >= $scope.imageCount -3){
          console.log("$scope.currentIndex > $scope.imageCount -3");
          $('#sliding-next').addClass('sliding-disabled');
          console.log("sliding-next add class3333");
        }

      }



    })
  //竞品管理控制器
    .controller('user_app_compete_controller', function($scope,$routeParams, $localStorage, user_app,app)
    {
      $scope.menuSelectPage(9);
      document.title = "竞品关键词_AppBK.com";
      $localStorage.visit_url = "user_app_compete";
      //获得当前app_id
      var app_id = $routeParams.app_id;

      //获得app基础信息
      //$scope.app_info = app.get_app_info().get({"app_id":app_id});
      app.get_app_info().get({"app_id":app_id},function(data) {
        $scope.app_info = data;

        document.title = $scope.app_info.name + "_竞品关键词_AppBK.com";
      });
      //加载提示
      $scope.user_app_show_wait = true;

      //tab菜单管理
      $scope.search_app_tab = true;
      $scope.sys_recommend_app_tab = false;
      $scope.user_also_buy_app_tab = false;
      $scope.app_refer_app_tab = false;



      //获得用户竞品
      get_user_app_competes();

      //删除用户竞品
      $scope.del_compete_app = function(compete_app_id)
      {
        //真实删除数据
        user_app.del_user_app_compete().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"compete_app_id":compete_app_id},function(data)
        {
          //刷新页面
          get_user_app_competes();
        });
      }

      //根据app_id添加app,根据搜索结果
      $scope.add_compete_app_by_search = function(compete_app_id)
      {
        //真实后台添加数据
        user_app.add_user_app_compete().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"compete_app_id":compete_app_id},function(data)
        {
          //刷新页面
          get_user_app_competes();
        });
      }

      //根据app_id添加app,根据系统推荐
      $scope.add_compete_app_by_sys_recommend = function(compete_app_id)
      {
        //真实后台添加数据
        user_app.add_user_app_compete().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"compete_app_id":compete_app_id},function(data)
        {
          //刷新页面
          get_user_app_competes();
        });
      }

      //根据app_id添加app,根据用户同时购买了
      $scope.add_compete_app_by_user_also_buy = function(compete_app_id)
      {
        //真实后台添加数据
        user_app.add_user_app_compete().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"compete_app_id":compete_app_id},function(data)
        {
          //刷新页面
          get_user_app_competes();
        });
      }

      //tab 点击
      //搜索app tab
      $scope.search_app_tab_click = function()
      {
        //tab菜单管理
        $scope.search_app_tab = true;
        $scope.sys_recommend_app_tab = false;
        $scope.user_also_buy_app_tab = false;
        $scope.app_refer_app_tab = false;
      }

      //系统推荐
      $scope.sys_recommend_app_tab_click = function()
      {
        //tab菜单管理
        $scope.search_app_tab = false;
        $scope.sys_recommend_app_tab = true;
        $scope.user_also_buy_app_tab = false;
        $scope.app_refer_app_tab = false;
        $scope.sys_recommend_app_show_wait = true;

        //app.get_app_relate_apps().get({"app_id":app_id},function(data)
        user_app.get_user_app_recommend_competes().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
        {
          $scope.sys_recommend_apps = data;
          if ( data.length == 0 ) //如果没有搜索结果
          {
            $scope.app_recommend_user = {};
            $scope.app_recommend_user.message = "暂无相关app";
          }
          $scope.sys_recommend_app_show_wait = false;
        });
      }

      //用户同时购买了
      $scope.user_also_buy_app_tab_click = function()
      {
        //tab菜单管理
        $scope.search_app_tab = false;
        $scope.sys_recommend_app_tab = false;
        $scope.user_also_buy_app_tab = true;
        $scope.app_refer_app_tab = false;
        $scope.user_also_buy_app_show_wait = true;

        app.get_app_user_also_buy_apps().query({"app_id":app_id}, function(data)
        {
          $scope.user_also_buy_apps = data;
          if ( data.length == 0 ) //如果没有搜索结果
          {
            $scope.buy_app_user = {};
            $scope.buy_app_user.message = "暂无相关app";
          }
          $scope.user_also_buy_app_show_wait = false;
        });
      }

      //app来源App
      $scope.app_refer_app_tab_click = function()
      {
        //tab菜单管理
        $scope.search_app_tab = false;
        $scope.sys_recommend_app_tab = false;
        $scope.user_also_buy_app_tab = false;
        $scope.app_refer_app_tab = true;
        $scope.app_refer_app_show_wait = true;

        app.get_app_refer_apps().query({"app_id":app_id}, function(data)
        {
          $scope.app_refer_apps = data;
          if ( data.length == 0 ) //如果没有搜索结果
          {
            $scope.app_refer_user = {};
            $scope.app_refer_user.message = "暂无相关app";
          }
          $scope.app_refer_app_show_wait = false;
        });
      }


      //搜索app
      $scope.search_app = function()
      {
        $scope.app_search_show_wait = true;
        $scope.app_search_results = {};
        query = $scope.query;
        //获得搜索结果数据
        app.get_app_search_results().get({"n":query}, function(data)
        {
          $scope.app_search_results = data.results;
          if ( data.results.length == 0 ) //如果没有搜索结果
          {
            $scope.app_search_user = {};
            $scope.app_search_user.message = "暂无相关app";
          }
          $scope.app_search_show_wait = false;
        });
      }

      //获得用户竞品app列表
      function get_user_app_competes()
      {
        user_app.get_user_app_competes().query({
          "email": $localStorage.email,
          "token": $localStorage.token,
          "app_id": app_id
        }, function (data) {
          $scope.apps = data;
          $scope.user_app_show_wait = false;
          if (data.length == 0) //如果没有搜索结果
          {
            $scope.message = "尚未添加竞品";
          }
        });
      }

    })


  //竞品管理关键词控制器
    .controller('user_app_compete_keyword_controller', function($scope,$routeParams, $localStorage, user_app,app,user_app_keyword)
    {
      $localStorage.visit_url = "user_app_compete";
      //获得当前app_id
      var app_id = $routeParams.app_id;
      //获得app基础信息
      $scope.app_info = app.get_app_info().get({"app_id":app_id});

      //最终关键词
      $scope.word_grid = {
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        minRowsToShow:20,//展示的数据行数
        enableGridMenu: false,//menu
        exporterOlderExcelCompatibility: true,//保证输出的文件不乱码
        exporterCsvFilename: 'appbk.csv',
      };

      //导出表格
      $scope.word_grid.onRegisterApi = function(word_grid_api) {
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
      }

      $scope.export_excel = function()
      {
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
      }

      $scope.word_grid.columnDefs =  [
        {field: 'word', displayName: '关键词',type:'string',width:'15%',enableSorting: true,cellTemplate:"<div  class='ui-grid-cell-contents table_middle c2'><a target='_blank' href='/#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD}}</a></div>"},
        {field: 'aso_index', displayName: "推荐度",type:'number', width:'15%',headerCellTemplate:"../views/headerCellTemplate/recommend_header_template.html", cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
        {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',headerCellTemplate:"../views/headerCellTemplate/search_header_template.html", cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
        {field: 'aso_compete', displayName: "竞争程度", type:'number', width:'15%',headerCellTemplate:"../views/headerCellTemplate/compete_header_template.html", cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
        {field: 'num', displayName: "搜索结果数",width:'10%', type:'number'},
        {field: 'match_num', displayName: "覆盖竞品数",width:'10%', type:'number'},
        {field: 'name', displayName: "第1名APP", type:'string', width:'20%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='/#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:15}}</a></div>"},
      ];


      $scope.word_grid_loading_show = true;
      //获得app竞品关键词
      user_app_keyword.get_compete_apps_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {


        $scope.word_grid_loading_show = false;
        $scope.word_grid.data = data;

        if (0 == data.length )
        {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "暂无关键词,请先添加竞品";
        }
        else
        {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "";

        }
      });


    })

    //用户微博控制器,微博标签
    .controller('user_weibo_controller', function($scope,$routeParams,$localStorage, app_weibo,app)
    {
      document.title = "兴趣标签_AppBK.com";

      $localStorage.visit_url = "user_weibo";
      var app_id = $routeParams.app_id;
      //获得app基础信息
      //$scope.app_info = app.get_app_info().get({"app_id":app_id});
      app.get_app_info().get({"app_id":app_id},function(data) {
        $scope.app_info = data;
        document.title = $scope.app_info.name + "_兴趣标签_AppBK.com";
      });
      $scope.tags_show_wait = true;
      //获得app的用户标签
      app_weibo.get_app_user_tags().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $scope.tags = data;
        $scope.tags_show_wait = false;
        if ( data.length == 0 ) //如果没有搜索结果
        {
          $scope.message = "尚未添加竞品";
        }
      });
    })

    //用户微博个人档控制器
    .controller('user_weibo_profile_controller', function($scope,$routeParams, $localStorage,app_weibo,app)
    {
      document.title = "基本属性_AppBK.com";
      $localStorage.visit_url = "user_weibo_profile";
      var app_id = $routeParams.app_id;
      //获得app基础信息
      //$scope.app_info = app.get_app_info().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id});
      app.get_app_info().get({"app_id":app_id},function(data) {
        $scope.app_info = data;
        document.title = $scope.app_info.name + "_基本属性_AppBK.com";
      });
      //获得性别分布
      app_weibo.get_app_user_gender().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $('#user_gender').highcharts(data);
      });

      //获得地域分布
      app_weibo.get_app_user_area().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $('#user_area').highcharts(data);
      });

      //获得用户上网时间分布
      app_weibo.get_app_user_time().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $('#user_time').highcharts(data);
      });
    })

    //关键词覆盖页
    .controller('app_content_keyword_controller', function($scope,$timeout,$localStorage ,$routeParams,app,user_app_keyword,uiGridConstants)
    {
      $scope.menuSelectPage(3);

      //bootstrap tips
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});
      $('body').on('click', '.btn-group button', function (e) {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
      });

      //
      $scope.parameter_start = moment().format('YYYY-MM-DD');
      $scope.parameter_end = moment().subtract(1,"day").format('YYYY-MM-DD');

      //接收参数
      var app_id = $routeParams.app_id;
      document.title = "关键词_Appbk.com";
      var limit = 100; //每页的记录个数
      $scope.search_keyword = "";

      //不需要重新请求的情况
      if(typeof ($scope.app_info.name ) != 'undefined'){
        document.title = $scope.app_info.name+"_关键词_Appbk.com";
      }else {
        app.get_app_info().get({"app_id":app_id},function(data){
          $scope.app_info = data;
          console.log($scope.app_info.name + "sdefined");
          document.title = $scope.app_info.name+"_关键词_Appbk.com";
        });
      }


      //获得关键词覆盖结果
      get_app_possible_keywords();

      //添加关注关键词
      $scope.add_user_watch_keyword = function(n){
        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          window.location = "/#/index_login";
        }else {
          user_app_keyword.add_user_watch_keyword().get({"n":n,"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
            get_app_possible_keywords(1);
          });
        }
      }

      //删除关注的词
      $scope.del_user_watch_keyword = function(n){

        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          window.location = "/#/index_login";
        }else {
          user_app_keyword.del_user_watch_keyword().get({"n":n,"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
            get_app_possible_keywords(1);
          });
        }
      }

      //翻页事件,使用ui-grid默认的翻页组件
      $scope.page_changed = function(num) {
        $scope.current_page = num;
        $scope.word_grid_api.pagination.seek($scope.current_page);
      }

      //展示历史排名趋势
      $scope.show_history_chart = function(compete_query){
        $('#myModal').modal('show');
        $scope.current_compete_query = compete_query;

        //HighChart 数据
        user_app_keyword.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":compete_query,"start":$scope.trend_parameter_start,"end":$scope.trend_parameter_end}, function(data) {
          //展示到图标上
          $('#key_world_trend').highcharts(data);
        });

      }

      //获得app的搜索关键词覆盖函数
      function get_app_possible_keywords()
      {

        if ($scope.app_info.download_level == -1){
          return;
        }

        var start = 0;
        var max_num = 10000;//获得记录的条数,一般不超过1万，但如果太多会卡
        $scope.start = start;


        $scope.keyword_loading_show = true;

        user_app_keyword.get_app_word_two_date_compare().get(
          {"app_id": app_id, "start": start, "limit": max_num, "email": $localStorage.email, "token": $localStorage.token, "simple": 1,"cur_date":$scope.parameter_start, "pre_date":$scope.parameter_end},
          function (data) {
          var newData = [];
            for(var i=0;i<data.results.length;i++) {

            var iData = [];

            iData.query = data.results[i][0];
            iData.pos = data.results[i][1];
            iData.increase = data.results[i][2];
            iData.rank = data.results[i][3];
            iData.num = data.results[i][4];

            iData.is_login = $scope.user_login_show;

            if (data.results[i][5] != 'undefined') {
              iData.watch = data.results[i][5];
            }
            newData.push(iData);
          }

          data.results = newData;

          $scope.app_content_keyword_wait = false;
          $scope.keyword_loading_show = false;
          //插入新数据
          $scope.num = data.num;
          $scope.top_num = data.top10_num; //top 10的关键词个数
          $scope.top3_num = data.top3_num; //top 3的关键词个数
          $scope.num_increase = data.word_num_increase;

          $scope.word_grid.data = data.results;

          if (0 == data.results.length) {
            $scope.keywords_user = {};
            $scope.keywords_user.message = "暂无关键词";
          }
          else
          {
            $scope.keywords_user = {};
            $scope.keywords_user.message = "";
          }

          //翻页配置
          if (start == 0) { //如果是首次调用
            //翻页构造
            $scope.total_items = data.results.length; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
          }

        });
      }

      //使用ui gird
      //表格基础配置
      $scope.word_grid = {
        //paginationPageSizes: [25, 50, 75],
        paginationPageSize: limit,
        enablePaginationControls: false,//不展示默认的翻页html标签
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        enableGridMenu: false,//menu
        exporterOlderExcelCompatibility: true,
        //enableHorizontalScrollbar:"never",
        exporterCsvFilename: 'appbk.csv',
        //minRowsToShow:100,//展示的行数，暂时不起作用，主要是由页面设置的表格高度决定。
      };

      var user_login = true;
      if(typeof($localStorage.email) == "undefined") //如果没有登录
      {
        var user_login = false;
      }

      $scope.$watch('window.innerWidth', function() {
        var columm_config;
        if (window.innerWidth >= 768) {
          columm_config =  [

            {field: 'query',displayName: '关键词',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (user_login && row.entity.watch!=0 ) {
                  return 'my-app-added-keyword-bg-blue';
                }
              },
              type:'string',width:'20%',
              cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='/#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"
            },
            {field: 'pos', displayName: "当前排名",width:'20%',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }, type:'number',
              cellTemplate:"<div class='ui-grid-cell-contents'>" +
              "<span>{{row.entity.pos}}</span>" +
              "<span ng-show='row.entity.increase<0'><font color='#0cd0ad'><i class='fa fa-caret-down fa-fw'></i>{{row.entity.increase}}</font></span>" +
              "<span ng-show='row.entity.increase>0'><font color='#ff3333'><i class='fa fa-caret-up fa-fw'></i>{{row.entity.increase}}</font></span>" +
              "<span ng-show='row.entity.increase==0'><font color='#cccccc'><i class='fa fa-caret-right fa-fw'></i>{{row.entity.increase}}</font></span></div>"
            },
            {field: 'increase', displayName: "昨日同比",width:'20%', type:'number',visible:false,
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }
            },
            {field: 'rank', displayName: '搜索热度', type:'number', width:'20%',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              },
            },
            {field: 'num', displayName: "搜索结果数",width:'20%', type:'number',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }},
            {field: 'query', displayName: '操作',type:'string',selected:false,enableSorting: false,
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              },width:'20%',
              cellTemplate:"<div class='ui-grid-cell-contents'>" +
              "<a ng-click='grid.appScope.show_history_chart(MODEL_COL_FIELD)' data-container='body' style='cursor: pointer' data-toggle='popover' data-content='查看历史排名趋势'>" +
              "<i class='fa fa-line-chart fa-fw'></i></a>" +
              "<span ng-show='row.entity.is_login '>" +
              "<a  ng-show='row.entity.watch!=0' href='' ng-click='grid.appScope.del_user_watch_keyword(MODEL_COL_FIELD)' data-container='body' data-toggle='popover' data-content='取消关注'>" +
              "<i class='fa fa-times fa-fw'></i></a>" +
              "<a  ng-show='row.entity.watch==0 ' href=''ng-click='grid.appScope.add_user_watch_keyword(MODEL_COL_FIELD)'data-container='body' data-toggle='popover' data-content='添加关注'>" +
              "<i class='fa fa-plus fa-fw' style='cursor:pointer;'></i></a></span></div>"
            },
          ];
        }else {
          columm_config =  [

            {field: 'query',displayName: '关键词',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (user_login && row.entity.watch!=0 ) {
                  return 'my-app-added-keyword-bg-blue';
                }
              },
              type:'string',width:'30%',
              cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='/#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"
            },
            {field: 'pos', displayName: "排名",width:'20%',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }, type:'number',
              cellTemplate:"<div class='ui-grid-cell-contents'>" +
              "<span>{{row.entity.pos}}</span>" +
              "<span ng-show='row.entity.increase<0'><font color='#0cd0ad'><i class='fa fa-caret-down fa-fw'></i>{{row.entity.increase}}</font></span>" +
              "<span ng-show='row.entity.increase>0'><font color='#ff3333'><i class='fa fa-caret-up fa-fw'></i>{{row.entity.increase}}</font></span>" +
              "<span ng-show='row.entity.increase==0'><font color='#cccccc'><i class='fa fa-caret-right fa-fw'></i>{{row.entity.increase}}</font></span></div>"
            },
            {field: 'increase', displayName: "昨日同比",width:'20%', type:'number',visible:false,
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }
            },
            {field: 'rank', displayName: '热度', type:'number', width:'25%',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              },
            },
            {field: 'num', displayName: "搜索结果",width:'25%', type:'number',
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (user_login && row.entity.watch!=0) {
                  return 'my-app-added-keyword-bg-blue';
                }
              }},

          ];
        }
        $scope.word_grid.columnDefs = columm_config;

      })

      //注册api
      $scope.word_grid.onRegisterApi = function(word_grid_api){
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.word_filter, 200 );
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 200);

        $timeout(function(){refreshWordCount();},500);

      }

      function refreshWordCount(){
        $scope.total_items = $scope.word_grid_api.grid.options.totalItems;
      }

      //导出表格
      $scope.export_excel = function()
      {
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
      }

      /***************搜索和过滤********************/

        //过滤方法1，核心词过滤
      $scope.filter_sign = 2;

      $scope.filterGrid = function(sign){
        //1 全部：不设置任何限制。--------------------0
        //2 常用词：rank>100。 （默认）--------------2
        //3 核心：rank>5000  and pos<100-----------1

        $scope.filter_sign = sign;

        $scope.word_grid_api.grid.registerRowsProcessor( $scope.word_filter, 200 );
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 300);
        $scope.word_grid_api.grid.refresh();

        $timeout(function(){refreshWordCount();},500);
      }

      $scope.singleFilter = function( renderableRows )
      {
        renderableRows.forEach( function( row )
        {
          if ( $scope.filter_sign == 1 ) //核心词
          {
            if ( row.entity["rank"]<5000 || row.entity["pos"]>100 ) {
              row.visible = false;
            }
          }
          else if($scope.filter_sign == 2) //常用词
          {
            if ( row.entity["rank"]<100 ) {
              row.visible = false;
            }
          }
          else //如果不需要过滤
          {
            row.visible = true;
          }
        });
        $timeout(function(){refreshWordCount();},500);

        return renderableRows;
      }

      //过滤方法2,关键词过滤
      //核心词过滤函数
      $scope.search_word = function()
      {
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.word_filter, 300 );
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 200);

        $scope.word_grid_api.grid.refresh();

        $timeout(function(){refreshWordCount();},500);

      }

      $scope.word_filter = function( renderableRows )
      {
        var word = $scope.search_keyword;
        renderableRows.forEach( function( row ) {
          if (word.length<1) //如果字符串为空，展示
          {
            row.visible = true;
          }
          else
          {
            if ( row.entity["query"].indexOf(word)>=0 ) //如果包含，则显示
            {
              row.visible = true;
            }
            else //如果不包含，则不显示
            {
              row.visible = false;
            }
          }
        });
        return renderableRows;
      }

      //日期选择
      var cur_options = {};
      $scope.pre_options = {};

      cur_options.maxDate = moment().format("YYYY-MM-DD");
      cur_options.minDate = moment().subtract(1,"month");

      cur_options.locale = {
        format: 'YYYY-MM-DD',//YYYY年MM月DD日
        separator: ' - ',
        applyLabel: '完成',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
      };

      cur_options.singleDatePicker = true;
      $('#config-cur-demo').daterangepicker(cur_options, function(start, end, label){
        $scope.parameter_start = start.format('YYYY-MM-DD');

        //如果当前当前 小于等于 对比日期 则请求现在的情况 并改变end 的日期
        if($scope.parameter_start < $scope.parameter_end){
          $scope.parameter_end = $scope.parameter_start;

          $scope.pre_options.maxDate = start;
          $scope.pre_options.startDate = start;

          console.log("pre_options.maxDate" + $scope.pre_options.maxDate);
          setpreDatePickerOption($scope.pre_options);
        }

        get_app_possible_keywords();
      });

      $scope.pre_options.maxDate = moment().subtract(1,"day");
      $scope.pre_options.minDate = moment().subtract(1,"month");

      $scope.pre_options.locale = {
        format: 'YYYY-MM-DD',//YYYY年MM月DD日
        separator: ' - ',
        applyLabel: '完成',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
      };

      $scope.pre_options.singleDatePicker = true;
      $scope.pre_options.startDate = moment().subtract(1,"day");

      setpreDatePickerOption($scope.pre_options);
      function setpreDatePickerOption(options){
        $scope.pre_date_text  = options.maxDate.format('YYYY-MM-DD');

        $('#config-pre-demo').daterangepicker(options, function(start, end, label){
          $scope.parameter_end = start.format('YYYY-MM-DD');
          get_app_possible_keywords();

        });
      }
      //end of 日期选择


      //日期选择
      var options = {};

      options.showDropdowns = true;
      options.maxDate = moment().format("YYYY-MM-DD");
      options.minDate = moment().subtract(30,"day").format("YYYY-MM-DD");

      options.ranges = {
        '近7日': [moment().subtract(7, 'days'), moment()],
        '近30日': [moment().subtract(29, 'days'), moment()],
      };

      options.startDate = moment().subtract(7, 'days');
      options.endDate = moment();

      options.locale = {
        format: 'YYYY-MM-DD',//YYYY年MM月DD日
        separator: ' ~ ',
        applyLabel: '完成',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
      };

      options.linkedCalendars = true;

      $scope.trend_parameter_end = moment().format('YYYY-MM-DD');
      $scope.trend_parameter_start = moment().subtract(7,"day").format('YYYY-MM-DD');
      $('#config-demo').daterangepicker(options, function(start, end, label){
        $scope.parameter_limit = 10;
        $scope.trend_parameter_start = start.format('YYYY-MM-DD');
        $scope.trend_parameter_end = end.format('YYYY-MM-DD');

        $scope.show_history_chart($scope.current_compete_query);
      });
    })

    //排名趋势控制器
    .controller('app_content_trend_controller', function($scope, $sce, $filter, $routeParams,$localStorage, app,user_app_keyword)
    {
      $scope.menuSelectPage(2);

      //接收参数
      var app_id = $routeParams.app_id;
      document.title = "排名趋势_Appbk.com";

      //类别
      $scope.rank_type_name = "全部榜单";
      $scope.rank_type = '';

      app.get_app_info().get({"app_id":app_id},function(data){
        $scope.app_info = data;
        var name = $scope.app_info.name;
        document.title = name + "_排名趋势_Appbk.com";
      });
      app.get_app_best_rank().query({"app_id":app_id},function(data){
        $scope.best_rank = data;

        if (typeof(data[0].ori_classes) == "undefined"){
          $scope.best_rank[0] =
              {"ori_classes":"总榜","rank_type":"","rank":"-","update_time":""};
        }
        else if (typeof(data[0].rank_type) == "undefined"){
          $scope.best_rank_rank_type_0_hide = true;
        }
        if (typeof(data[1].ori_classes) == "undefined"){
          $scope.best_rank[1] =
          {"ori_classes":"分类榜","rank_type":"","rank":"-","update_time":""};
        }

        $scope.best_rank_show = true;
      })

      //默认获得最近1天的数据

      $scope.parameter_limit = 1;
      $scope.parameter_start = "";
      $scope.parameter_end = "";

      get_app_rank_trend($scope.parameter_limit,$scope.parameter_start,$scope.parameter_end);


      //日期选择
      var options = {};

      options.showDropdowns = true;
      options.maxDate = moment().format("YYYY-MM-DD");

      options.ranges = {
        '今天': [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '近7日': [moment().subtract(6, 'days'), moment()],
        '近30日': [moment().subtract(29, 'days'), moment()],
        '近三个月': [moment().subtract(3,"month"),moment()],
        '近一年': [moment().subtract(1,"years")]//修改时间
      };

      options.locale = {
        format: 'YYYY-MM-DD',//YYYY年MM月DD日
        separator: ' ~ ',
        applyLabel: '完成',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
      };

      options.linkedCalendars = false;

      $('#config-demo').daterangepicker(options, function(start, end, label){
        $scope.parameter_limit = 10;
        $scope.parameter_start = start.format('YYYY-MM-DD');
        $scope.parameter_end = end.format('YYYY-MM-DD');

        get_app_rank_trend("10", start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

      });


      //获得app的排名趋势变化数据
      //limit，最近多少天
      function get_app_rank_trend(limit, start, end) {
        $scope.loading_show = true;
        if (limit!=-2) //按照天
        {
          app.get_app_rank_trend().get({"app_id": app_id, "limit": limit, "start":start, "end":end,"rank_type": $scope.rank_type}, function (data) {
            $scope.loading_show = false;
            $('#app_content_trend').highcharts(data);
            $('#app_content_trend').append('<div class="highcharts-logo"></div>');
          });
        }
        else //按照小时
        {
          app.get_app_rank_hourly_trend().get({"app_id": app_id,"rank_type": $scope.rank_type}, function (data) {
            $('#app_content_trend').highcharts(data);
            $('#app_content_trend').append('<div class="highcharts-logo"></div>');
            $scope.loading_show = false;
          });
        }
      }

      function get_app_best_rank() {

      }

      $scope.update_app_rank_type = function(rank_type){
        if (rank_type == $scope.rank_type){

          return;
        }else {

          $scope.rank_type = rank_type;
          if (rank_type == '') {
            $scope.rank_type_name = "全部榜单";
          }else if (rank_type == 'topfreeapplications') {
            $scope.rank_type_name = "免费榜单";
          }else if (rank_type == 'toppaidapplications'){
            $scope.rank_type_name = "付费榜单";
          }else if (rank_type == 'topgrossingapplications'){
            $scope.rank_type_name = "畅销榜单";
          }

          get_app_rank_trend($scope.parameter_limit,$scope.parameter_start,$scope.parameter_end);
        }
      }
    })

  //竞品控制器
  .controller('app_content_compete_controller', function($scope,$localStorage,$routeParams,app,user_app_keyword)
  {
    $scope.menuSelectPage(4);

    //接收参数
    var app_id = $routeParams.app_id;
    document.title = "竞品APP_Appbk.com";
    app.get_app_info().get({"app_id":app_id},function(data) {
      $scope.app_info = data;
      document.title = $scope.app_info.name + "_竞品APP_Appbk.com";
    });
    //获得一个app的相关app
    app.get_app_relate_apps().get({"app_id":app_id},function(data)
    {
      $scope.sys_recommend_apps = data.results;
      if ( data.results.length == 0 ) //如果没有搜索结果
      {
        $scope.app_recommend_user = {};
        $scope.app_recommend_user.message = "暂无相关app";
      }
    });

  })

  //app评论控制器
    .controller('app_content_comment_controller', function($scope, $localStorage,$routeParams,app,app_comment,uiGridConstants)
    {

      $scope.menuSelectPage(5);

      //接收参数
      //var app_id = $routeParams.app_id;
      var app_id = $routeParams.app_id;
      document.title = "APP评论_Appbk.com";
      app.get_app_info().get({"app_id":app_id},function(data){
        $scope.app_info = data;
        document.title = $scope.app_info.name+"_APP评论_Appbk.com";
      });

      //评论趋势图
      get_app_comment_trend(30);
      get_app_comment_stat();
      //获得app的评论趋势变化数据
      //limit，最近多少天
      function get_app_comment_trend(limit) {
        $scope.trend_loading_show = true;
        app_comment.get_app_comment_trend().get({"app_id": app_id, "limit": limit, "start_date":$scope.parameter_start, "end_date":$scope.parameter_end }, function (data) {
          $scope.trend_loading_show = false;
          $('#comment_trend').highcharts(data);
          $('#comment_trend').append('<div class="highcharts-logo"></div>');

        });

      }

      function get_app_comment_stat(){
        $scope.comment_state_loading_show = true;

        app_comment.get_app_comment_stat().get({"app_id":app_id}, function(data){

          $scope.comment_state_loading_show = false;
          $scope.comment_stat = data;
          $scope.current_score_width = data.cur_version.avg.score * 20 ;
          $scope.all_score_width = data.all_version.avg.score * 20 ;


        });
      }

      //日期选择
      var options = {};

      options.showDropdowns = true;
      options.maxDate = moment().format("YYYY-MM-DD");

      options.ranges = {
        '今天': [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        '近7日': [moment().subtract(6, 'days'), moment()],
        '近30日': [moment().subtract(29, 'days'), moment()],
        '近三个月': [moment().subtract(3,"month"),moment()],
        '近一年': [moment().subtract(1,"years")]//修改时间
      };

      options.locale = {
        format: 'YYYY-MM-DD',//YYYY年MM月DD日
        separator: ' - ',
        applyLabel: '完成',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
        customRangeLabel: '自定义',
        daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
      };

      options.linkedCalendars = false;

      $('#config-demo').daterangepicker(options, function(start, end, label){
        $scope.parameter_limit = 10;
        $scope.parameter_start = start.format('YYYY-MM-DD');
        $scope.parameter_end = end.format('YYYY-MM-DD');
        get_app_comment_trend();
      });

    })
    //app评论详情
    .controller('app_content_comment_detail_controller',function($scope, $localStorage,$routeParams,app,app_comment,uiGridConstants){
    $scope.menuSelectPage(6);


      var app_id = $routeParams.app_id;
      document.title = "APP评论_Appbk.com";
      app.get_app_info().get({"app_id":app_id},function(data){
        $scope.app_info = data;
        document.title = $scope.app_info.name+"_APP评论_Appbk.com";
      });

      //所有评论
      var limit = 100; //每页的记录个数
      get_app_possible_keywords(1);//第一页

      //加载更多数据
      $scope.load_more = function(current_page)
      {
        $scope.current_page = current_page + 1;
        get_app_possible_keywords(current_page+1);
        if ($scope.current_page >= $scope.max_page_num) {
          $scope.turn_page = false;
        } else {
          $scope.turn_page = true;
        }
      }

      //获得app的搜索词覆盖
      function get_app_possible_keywords(page) {
        var start = limit * (page - 1);
        $scope.start = start;
        $scope.word_grid_loading_show = true;

        app_comment.get_app_comments().get({"app_id": app_id, "start": start, "limit": limit}, function (data) {
          $scope.word_grid_loading_show = false;
          //插入新数据
          for (var i=0;i<data.results.length;i++) {
            $scope.word_grid.data.push(data.results[i]);
          }

          if (0 == data.results.length) {
            $scope.keywords_user = {};
            $scope.keywords_user.message = "暂无评论";
          }
          if (start == 0) { //如果是首次调用
            //翻页构造
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
            $scope.max_page_num = parseInt(data.num/limit) + 1;
            if ($scope.max_page_num >1)
            {
              $scope.turn_page = true;
            }
            else
            {
              $scope.turn_page = false;
            }
          }

        });
      }

      //使用ui gird
      //表格基础配置
      $scope.word_grid = {
        enableFiltering: true,
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        enableGridMenu: false,//menu
        exporterOlderExcelCompatibility: true,
        exporterCsvFilename: 'appbk.csv',
      };


      //导出表格
      $scope.word_grid.onRegisterApi = function(word_grid_api) {
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
      }
      $scope.export_excel = function()
      {
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
      }

    $scope.$watch('window.innerWidth', function() {
      var columm_config ;
      if (window.innerWidth >= 768) {
        columm_config =  [
          {field: 'name', displayName: '用户名',type:'number',width:'15%',enableFiltering: false},
          {field: 'title', displayName: '评论标题',type:'string',width:'15%',enableFiltering: false},
          {field: 'body', displayName: '评论内容', type:'string', width:'30%',enableFiltering: false},
          {field: 'rating', displayName: "星级",width:'10%', type:'number'
            ,filter:{
            type: uiGridConstants.filter.SELECT,
            selectOptions: [{ value: '5', label: '5星'}, {value: '4', label: '4星' }, { value: '3', label: '3星'}, { value: '2', label: '2星' }, { value: '1', label: '1星' } ]
          }
            ,headerCellClass: $scope.highlightFilteredHeader},
          {field: 'body.length', displayName: "内容长度",width:'10%', type:'number',enableFiltering: false},
          {field: 'date', displayName: "发布时间",width:'20%', type:'string',enableFiltering: false}
        ];
      } else {
        columm_config =  [
          {field: 'name', displayName: '用户',type:'number',width:'20%',enableFiltering: false},
          {field: 'title', displayName: '标题',type:'string',width:'25%',enableFiltering: false},
          {field: 'body', displayName: '内容', type:'string', width:'40%',enableFiltering: false},
          {field: 'rating', displayName: "星级",width:'15%', type:'number'
            ,filter:{
            type: uiGridConstants.filter.SELECT,
            selectOptions: [ { value: '5', label: '5星'}, {value: '4', label: '4星' }, { value: '3', label: '3星'}, { value: '2', label: '2星' }, { value: '1', label: '1星' } ]
          }
            ,headerCellClass: $scope.highlightFilteredHeader},

        ];
      }

      $scope.word_grid.columnDefs = columm_config;

    })

      $scope.header_title = "name";

      //注册api
      //加载grid api 2，同时设置check选择函数
      $scope.word_grid.onRegisterApi = function(word_grid_api){
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;

      }

    })

  //用户关键词管理控制器
  .controller('user_app_keyword_manage_controller', function($scope, $routeParams, $localStorage,$timeout, user_app_keyword, user_app, app,Excel,uiGridConstants) {

      $scope.menuSelectPage(7);

    document.title = "关键词管理";

    var app_id = $routeParams.app_id;

    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //最终关键词
    $scope.final_word_grid = {
      enableFiltering: true,//允许过滤
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20,//展示的数据行数
      enableGridMenu: false,//menu
      exporterOlderExcelCompatibility: true,
      exporterCsvFilename: 'appbk.csv',
      exporterSuppressColumns:[ 'word' ],
    };

    $scope.final_word_grid.onRegisterApi = function(word_grid_api) {
      //set gridApi on scope
      $scope.word_grid_api = word_grid_api;
    }

    $scope.export_excel = function()
    {
      $scope.final_grid_api.exporter.csvExport("all","all"); //导出全部
    }


    $scope.final_word_grid.columnDefs =  [
      {field: 'word', displayName: '',type:'string', width:'8%', cellTemplate: '<a href="" ng-click="grid.appScope.del(MODEL_COL_FIELD)" class="btn btn-primary ">删除</a> ',enableSorting: false, enableFiltering: false},
      {field: 'word', displayName: '关键词',type:'string',width:'10%',enableSorting: true,enableFiltering: false},
      {field: 'aso_index', displayName: "推荐度",type:'number',
        headerCellTemplate:"../views/headerCellTemplate/recommend_header_template.html",
        width:'15%', cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",enableFiltering: false},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/search_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",filter:{condition:uiGridConstants.filter.GREATER_THAN,placeholder: '大于'},headerCellClass: $scope.highlightFilteredHeader},
      {field: 'aso_compete', displayName: "竞争程度", type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/compete_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",enableFiltering: false},
      {field: 'num', displayName: "搜索结果数",width:'12%', type:'number',enableFiltering: false},
      {field: 'pos', displayName: "当前APP排名",width:'15%', type:'number',enableFiltering: false},
      {field: 'word.length', displayName: "长度", type:'string', width:'10%',enableSorting: false, enableFiltering: false},
    ];

    //最终关键词
    $scope.final_word_grid.onRegisterApi = function(final_word_grid_api){
      //set gridApi on scope
      $scope.final_grid_api = final_word_grid_api;
    }

    //获取用户填写的keywords列表
    get_user_app_keywords();
    //text area 填充
    get_user_app_keywords_join();


    //获得用户关键词，绑定在$scope.final_word_grid
    function get_user_app_keywords()
    {
      user_app_keyword.get_user_app_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        for (var i=0;i<data.length;i++) {
          if (data[i].pos==null) {
            data[i].pos=-1;
          }
        }
        $scope.final_word_grid.data = data;

        if (0 == data.length ) {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "暂无关键词,请添加关键词";
          $scope.final_word_grid_show = false;

        } else {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "";
          $scope.final_word_grid_show = true;

        }
        get_user_app_keywords_join();
      });
    }

    //获得用户关键词列表，join在一起的形式,绑定在$scope.select_keywords
    function get_user_app_keywords_join()
    {
      //获得用户关键词列表
      user_app_keyword.get_user_app_keywords_no_feature().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        var seed_word_list = new Array();
        for (var i=0;i<data.length;i++) {
          seed_word_list.push(data[i].word);
        }
        $scope.select_keywords = seed_word_list.join(",");
      });
    }

    //删除关键词数据,最终关键词页面
    $scope.del = function(word) {
      //删除页面
      del_word(word);
    }

    //添加关键词数据，最终关键词页面
    $scope.add = function(word) {
      add_word(word);

    }

    //删除关键词
    function del_word(word)
    {
      //真实删除数据库
      user_app_keyword.del_user_app_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //刷新最终关键词表格
        get_user_app_keywords();
      });
    }
    //添加关键词
    function add_word(word)
    {
      //添加数据后，word可能是逗号隔开的多个词
      if (word.length<1)
      {
        alert("关键词长度不能过短");
        return -1;
      }
      //更新数据库，后台可处理多个字符串的情况
      user_app_keyword.add_user_app_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        get_user_app_keywords();
      });
    }
  })

  //用户关键词拓展控制器，步骤1，填写种子词
  .controller('user_app_keyword_expand_controller', function($scope,$routeParams, $localStorage,$timeout, user_app_keyword, user_app, app,Excel,uiGridConstants)
  {
    $scope.menuSelectPage(8);
    document.title = "关键词拓展_AppBK.com";
    $localStorage.visit_url = "user_app_keyword_expand";
    //var app_id = $localStorage.app_id;
    var app_id = $routeParams.app_id;
    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //获得用户种子词，并绑定到 $scope.seed_keywords
    get_user_app_seed_keywords();
    $scope.seed_keywords_alert = {type:"success",msg:""};

    //更新用户的种子关键词
    $scope.update_user_seed_keywords = function(word_list)
    {
      user_app_keyword.update_user_app_seed_keywords().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word_list},function(data)
      {
        //更新种子词展示
        $timeout(function(){get_user_app_seed_keywords();},600);
      });
    }

    //获得用户种子词，不包含具体指标，join后， 绑定在$scope.seed_keywords
    function get_user_app_seed_keywords()
    {
      $scope.seed_keywords_alert = {type:"danger",msg:"关键词更新中..."};
      user_app_keyword.get_user_app_seed_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        var seed_word_list = new Array();
        for (var i=0;i<data.length;i++) {
          seed_word_list.push(data[i].word);
        }
        $scope.seed_keywords = seed_word_list.join(",");
        $scope.seed_keywords_alert = {type:"success",msg:"关键词已经更新，共"+ data.length + "个："+ seed_word_list.join(" | ") + ", 进入步骤2,进行关键词拓展和选择"};
      });
    }

  })

  //用户关键词拓展控制器，步骤2，进行拓展
  .controller('user_app_keyword_expand2_controller', function($scope, $routeParams, $localStorage,$timeout, user_app_keyword, user_app, app,Excel,uiGridConstants)
  {
    $localStorage.visit_url = "user_app_keyword_expand";
    //var app_id = $localStorage.app_id;
    var app_id = $routeParams.app_id;

    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //只用一个表格
    $scope.expand_word_grid =  {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 40,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20,//展示的数据行数
    };

    $scope.expand_word_grid.columnDefs =  [
      {field: 'word', displayName: '关键词',type:'string',width:'12%',enableSorting: true,cellTemplate:"<div class='ui-grid-cell-contents'><span  class='table_middle c2'><a target='_blank' href='/#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD}}</a></span></div>"},
      {field: 'aso_index', displayName: "推荐度",type:'number', width:'15%',
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",
        headerCellTemplate:"../views/headerCellTemplate/recommend_header_template.html"},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/search_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'aso_compete', displayName: "竞争程度", type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/compete_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'num', displayName: "搜索结果数",width:'13%', type:'number'},
      {field: 'name', displayName: "第1名APP", type:'string', width:'25%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='/#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</a></div>"},
    ];

    //加载grid api，同时设置check选择函数
    $scope.expand_word_grid.onRegisterApi = function(expand_word_grid){
      //set gridApi on scope
      $scope.expand_word_grid = expand_word_grid;
      expand_word_grid.selection.on.rowSelectionChanged($scope,function(row){
        var word = row.entity.word;
        if (row.isSelected) {
          add_word(word);
          //延迟执行，否则和增删词是并行的，可能显示有问题
          $scope.alert = { type: 'success', msg: word + ', 加入拓展词列表' };
        }
        else
        {
          del_word(word);
          $scope.alert = { type: 'danger', msg: word + ', 从拓展词列表中删除' };
        }
      });
    }

    //显示种子词推荐
    get_seed_keywords();

    //点击种子词
    $scope.select_seed_keywords_tab = function()
    {
      get_seed_keywords();
    }

    //类似app使用的词，tab点击，加载数据2
    $scope.select_simliar_app_keywords_tab = function()
    {
      get_simliar_app_keywords();
    }

    //相关词，tab点击，加载数据3
    $scope.select_relate_keywords_tab = function()
    {
      get_relate_keywords();
    }

    //词根扩展，tab点击，加载数据4
    $scope.select_root_expand_keywords_tab = function()
    {
      get_root_expand_keywords();
    }


    //获得种子词推荐
    function get_seed_keywords()
    {
      $scope.expand_word_grid.data = [];

      user_app_keyword.get_user_app_seed_keywords_feature().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
        $scope.expand_word_grid.data = data;
        $scope.expand_word_grid.selection.clearSelectedRows();

        //延迟执行，否则数据可能还没有加载完成
        $timeout(function()
        {
          for (var i=0;i<data.length;i++) {
            if (data[i].select == 1)
            {
              $scope.expand_word_grid.grid.rows[i].setSelected(true);
            }
          }
        },1000);
      });
    }

    //获得相关app的词的推荐
    function get_simliar_app_keywords()
    {
      $scope.expand_word_grid.data = [];
      $scope.alert = { type: 'danger', msg: '关键词计算中......,耗时10秒以内' };
      user_app_keyword.get_user_app_recommend_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
        $scope.expand_word_grid.data = data;
        $scope.expand_word_grid.selection.clearSelectedRows();
        $timeout(function()
        {
          for (var i=0;i<data.length;i++) {
            if (data[i].select == 1)
            {
              $scope.expand_word_grid.grid.rows[i].setSelected(true);
            }
          }
          $scope.alert = { type: 'success', msg: '关键词计算完成' };
        },1000);
      });
    }

    //获得语义扩展词
    function get_relate_keywords()
    {
      $scope.expand_word_grid.data = [];
      $scope.alert = { type: 'danger', msg: '关键词计算中......' };
      user_app_keyword.get_word_relate_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
        $scope.expand_word_grid.data = data;
        $scope.expand_word_grid.selection.clearSelectedRows();
        $timeout(function()
        {
          for (var i=0;i<data.length;i++) {
            if (data[i].select == 1)
            {
              $scope.expand_word_grid.grid.rows[i].setSelected(true);
            }
          }
          $scope.alert = { type: 'success', msg: '关键词计算完成' };
        },1000);
      });
    }

    //词根拓展词
    function get_root_expand_keywords()
    {
      $scope.expand_word_grid.data = [];
      $scope.alert = { type: 'danger', msg: '关键词计算中......' };
      user_app_keyword.get_word_expand_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data) {
        $scope.expand_word_grid.data = data;
        $scope.expand_word_grid.selection.clearSelectedRows();
        $timeout(function()
        {
          for (var i=0;i<data.length;i++) {
            if (data[i].select == 1)
            {
              $scope.expand_word_grid.grid.rows[i].setSelected(true);
            }
          }
          $scope.alert = { type: 'success', msg: '关键词计算完成' };
        },1000);
      });
    }

    //选择关键词check bpx
    function click_word_check_box(word,checked)
    {
      if (checked)
      {
        add_word(word);
      }
      else
      {
        del_word(word);
      }
    }


    //删除关键词
    function del_word(word)
    {
      //真实删除数据库
      user_app_keyword.del_user_app_expand_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //刷新最终关键词表格
      });
    }
    //添加关键词
    function add_word(word)
    {
      //添加数据后，word可能是逗号隔开的多个词
      if (word.length<1)
      {
        alert("关键词长度不能太短");
        return -1;
      }
      //更新数据库，后台可处理多个字符串的情况
      user_app_keyword.add_user_app_expand_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {

      });
    }

  })

  //用户关键词拓展控制器，步骤3，整理输出
  .controller('user_app_keyword_expand3_controller', function($scope, $routeParams,$location, $localStorage,$timeout, user_app_keyword, user_app, app,Excel,uiGridConstants)
  {
    $localStorage.visit_url = "user_app_keyword_expand";
    var app_id = $routeParams.app_id;
    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});


    //最终关键词
    $scope.final_word_grid = {
      enableFiltering: true,//允许过滤
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20,//展示的数据行数
      enableGridMenu: false,//menu
      exporterOlderExcelCompatibility: true,//保证输出的文件不乱码
      exporterCsvFilename: 'appbk.csv',
      exporterSuppressColumns:[ 'word' ],
    };

    $scope.final_word_grid.columnDefs =  [
      {field: 'word', displayName: '',type:'string', width:'10%', cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click="grid.appScope.del(MODEL_COL_FIELD)">删除</a> </div>',enableSorting: false, enableFiltering: false},
      {field: 'word', displayName: '关键词',type:'string',width:'20%',enableSorting: true,enableFiltering: false},
      {field: 'aso_index', displayName: "推荐度",type:'number',
        headerCellTemplate:"../views/headerCellTemplate/recommend_header_template.html",
        width:'15%',
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",enableFiltering: false},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/search_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",filter:{condition:uiGridConstants.filter.GREATER_THAN,placeholder: '大于'},headerCellClass: $scope.highlightFilteredHeader},
      {field: 'aso_compete', displayName: "竞争程度", type:'number', width:'15%',
        headerCellTemplate:"../views/headerCellTemplate/compete_header_template.html",
        cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>",enableFiltering: false},
      {field: 'num', displayName: "搜索结果数",width:'15%', type:'number',enableFiltering: false},
      {field: 'word.length', displayName: "长度", type:'string', width:'10%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><h5>{{MODEL_COL_FIELD}}</h5></div>", enableFiltering: false},
    ];

    //导出表格
    $scope.final_word_grid.onRegisterApi = function(word_grid_api) {
      //set gridApi on scope
      $scope.word_grid_api = word_grid_api;
    }

    $scope.export_excel = function()
    {
      $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
    }



    //获取用户填写的keywords列表
    get_user_app_expand_keywords();

    //将选择的关键词，合并到当前版本的关键词
    $scope.merge_expand_keywords = function()
    {
      user_app_keyword.merge_user_app_expand_keywords().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        //跳转到关键词管理页面
        window.location = '#/user_app_keyword_manage/' + app_id;//跳转到登录页
      });
    }


    //获得用户关键词，绑定在$scope.final_word_grid
    function get_user_app_expand_keywords()
    {
      user_app_keyword.get_user_app_expand_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        $scope.final_word_grid.data = data;

        if (0 == data.length )
        {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "暂无关键词,请添加关键词";
        }
        else
        {
          $scope.keyword_manage_user = {};
          $scope.keyword_manage_user.message = "";
        }
      });
    }



    //删除关键词数据,最终关键词页面
    $scope.del = function(word)
    {
      //删除页面
      del_word(word);
      //刷新grid
      $timeout(function(){get_user_app_expand_keywords();},300);

    }

    //删除拓展词
    function del_word(word)
    {
      //真实删除数据库
      user_app_keyword.del_user_app_expand_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //刷新最终关键词表格
      });
    }


  })

//用户app关键词监控控制器
  .controller('user_app_watch_controller',function($scope, $routeParams, $localStorage,user_app_keyword,app)
  {
    $scope.menuSelectPage(10);
    document.title = "关键词监控_AppBK.com";
    //bootstrap tips
    $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});

    $localStorage.visit_url = "user_app_watch";
    //var app_id = $localStorage.app_id;
    var app_id = $routeParams.app_id;
    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //获得用户app关键词整体曝光度趋势图
    watch_all_keywords();

    //获得用户关键词的最新的热度和搜索排序位置信息
    user_app_keyword.get_app_keywords_rank_and_pos().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
    {
      $scope.user_keywords_rank_and_pos = data;
    });

    //获得一个关键词的曝光度趋势变化数据
    $scope.get_keyword_trend = function($index)
    {
      $scope.loading_show = true;

      $('body,html').animate({scrollTop:200},500);

      word = $scope.user_keywords_rank_and_pos[$index].word;
      user_app_keyword.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        $scope.loading_show = false;

        //展示到图标上
        $('#trend').highcharts(data);
      });
    }

    $scope.watch_all_keywords = function ()
    {
      watch_all_keywords();
    }
    //获得用户app关键词整体曝光度趋势图
    function watch_all_keywords()
    {
      $scope.loading_show = true;
      $('body,html').animate({scrollTop:200},500);

      user_app_keyword.get_app_keywords_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $scope.loading_show = false ;

        //展示到图表
        $('#trend').highcharts(data);

      });
    }
  })

//用户app关键词分析
  .controller('user_app_keyword_analyze_controller',function($scope,$routeParams, $localStorage,user_app_keyword, app)
  {

    $scope.menuSelectPage(11);
    document.title = "搜索排名分析_AppBK.com";
    $localStorage.visit_url = "user_app_keyword_analyze";
    var app_id = $routeParams.app_id;

    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    $scope.data = {};
    //获得用户关键词
    user_app_keyword.get_app_keywords_rank_and_pos().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
    {
      $scope.word = {}; //选择的关键词
      $scope.keywords = data; //app列表


      //展示第一个词的信息
      if ($scope.keywords.length > 0) {
        $scope.word.selected = data[0]; //默认的显示选项
        $scope.selected_word = data[0].word;

        get_all_app_search_results(data[0].word);
        $scope.word_selected_show = true;
      }
      else
      {
        $scope.word_selected_show = false;
        $scope.message = "尚未给该app添加关键词，请首先在关键词管理一栏添加";
      }
    });

    //获得该app的预测信息
    $scope.app_predict = app.get_app_predict().get({"app_id":app_id});

    $scope.select_word = function(word)
    {
      $scope.selected_word = word;
      get_all_app_search_results(word);
    }

    //获得一个词的全部搜索结果
    function get_all_app_search_results(word)
    {
      $scope.loading_show = true;
      //如果词为空，表示选择了当前展示的选项，不做任何处理
      if (word=="")
      {
        return 0;
      }
      //获得搜索结果，全部的搜索结果
      app.get_all_app_search_results().get({"n":word,"start": 0, "limit": 10}, function(data)
      {
        $scope.loading_show = false;
        //results结果处理
        for (index in data.results)
        {
          if ( data.results[index].name == null) //如果json对应的字段为null
          {
            data.results[index].name = "appstore链接(详细信息后台下载中)"
          }
          data.results[index].download_url = "https://itunes.apple.com/cn/app/id" + data.results[index].app_id;
        }
        $scope.app_results = data.results;
      });
      //获得app在该关键词下的pos信息
      $scope.app_pos = app.get_app_search_pos().get({"app_id":app_id,"n":word});
    }

  })

//vip 人工选词
    .controller('vip_keyword_pick_controller',function($scope,$routeParams){
      document.title = "Vip人工选词_AppBK.com";

      $scope.menuSelectPage(12);

      if(typeof($localStorage.email) == "undefined") //如果没有登录
      {

      }else{

      }



        document.title = "人工选词_AppBK.com";


    })