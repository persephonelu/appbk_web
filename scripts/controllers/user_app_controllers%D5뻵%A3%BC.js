/**
 * @ngdoc function
 * @name appbkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appbkApp
 */
angular.module('user_app')

  //user_app控制页
    .controller('user_app_controller', function($scope, $routeParams, $localStorage,$location, app, user_app, user,auth,$sce,user_app_keyword) {

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

      //console.log($scope.apps);
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


      $scope.app_info = app.get_app_info().get({"app_id":app_id});
      //获得app基本信息
      $scope.data = {};
      $scope.app_id = app_id;
      //app search 搜索
      $scope.app_search = function()
      {
        var name = $scope.n;
        window.location = "index.html#/app_search/" + name;
      }

      //选择一个app
      $scope.select_app = function(app_id)
      {
        //获得app基本信息
        app.get_app_info().get({"app_id":app_id}, function(data)
        {
          $scope.app_info = data;
          $scope.app_id = app_id;

          //获得用户app列表,如果能选择菜单，肯定是有登录并有添加的app的，add by maris
          get_user_apps();
        });
      }


      //根据app_id添加app
      $scope.add_user_app = function()
      {
        //真实后台添加数据
        user_app.add_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
        {
          //刷新页面
          get_user_apps();

        });
      }


      function get_user_apps(){

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
          window.location = 'user_main.html#/user_app_info/' + app_id;
        });
      }

      //退出
      $scope.logout = function()
      {
        auth.logout();
      }
    })

  //user_app_info控制页
    .controller('user_app_info_controller', function($scope,$routeParams, $localStorage,$sce, app, user_app,user_app_keyword)
    {
      //app_id = $localStorage.app_id;
      var app_id = $routeParams.app_id;
      document.title = "APP基本信息_AppBK.com";
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});
      $localStorage.visit_url = "user_app_info/"+app_id;
      $scope.app_brief_loading_show = true;
      app.get_app_info().get({"app_id":app_id},function(data)
      {
        $scope.app_info = data;

        $scope.app_brief = $sce.trustAsHtml(data.brief);

        $scope.app_brief_loading_show = false;
        $scope.app_brief_show_all = true;
        $scope.show_all_app_brief = function() {
          $scope.app_brief_show_all = false;
          $('#app_brief').css("max-height","initial").end();
          $('#app_brief').css("margin-bottom","0px").end();

        }


        $scope.trend_loading_show = true;
        //app排行榜趋势图
        app.get_app_rank_trend().get({"app_id":app_id,"limit":10},function(data)
        {
          $scope.trend_loading_show = false;

          $('#trend').highcharts(data);
        });

        //app关键词曝光趋势图
        $scope.expose_trend_loading_show = true;
        user_app_keyword.get_app_expose_trend().get({"app_id":app_id},function(data)
        {
          $scope.expose_trend_loading_show = false;
          $('#expose_trend').highcharts(data);
        });
      });
    })

//竞品管理控制器
    .controller('user_app_compete_controller', function($scope,$routeParams, $localStorage, user_app,app)
    {
      document.title = "竞品关键词_AppBK.com";
      $localStorage.visit_url = "user_app_compete";
      //获得当前app_id
      var app_id = $routeParams.app_id;

      //获得app基础信息
      $scope.app_info = app.get_app_info().get({"app_id":app_id});

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
        enableGridMenu: true,//menu
        exporterOlderExcelCompatibility: true,//保证输出的文件不乱码
        exporterCsvFilename: 'appbk.csv',
      };

      $scope.word_grid.columnDefs =  [
        {field: 'word', displayName: '关键词',type:'string',width:150,enableSorting: true,cellTemplate:"<span  class='table_middle c2'><a target='_blank' href='index.html#/app_search/{{MODEL_COL_FIELD}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD}}</a></span>"},
        {field: 'aso_index', displayName: "推荐度(?)",type:'number',headerTooltip: "推荐度 ：主要反映关键词可能带来曝光度，越高越好", width:150, cellTemplate:"<h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5>"},
        {field: 'rank', displayName: '搜索热度(?)', type:'number', width:150,headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5>"},
        {field: 'aso_compete', displayName: "竞争程度(?)", type:'number', width:150,headerTooltip: "竞争程度：主要反映使用该关键词的app实力", cellTemplate:"<h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5>"},
        {field: 'num', displayName: "搜索结果数",width:110, type:'number'},
        {field: 'match_num', displayName: "覆盖竞品数",width:110, type:'number'},
        {field: 'name', displayName: "第1名APP", type:'string', width:200,enableSorting: false,cellTemplate:"<a target='_blank' href='index.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</a>"},
      ];


      //获得app竞品关键词
      user_app_keyword.get_compete_apps_keywords().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
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
      $scope.app_info = app.get_app_info().get({"app_id":app_id});

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
      $scope.app_info = app.get_app_info().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id});

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

    .controller('app_content_keyword_controller', function($scope,$localStorage ,$routeParams,app,user_app_keyword,uiGridConstants)
    {
      //bootstrap tips
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});
      //接收参数
      var app_id = $routeParams.app_id;
      document.title = "关键词_Appbk.com";
      //不需要重新请求的情况
      if($localStorage.app_content_app_id == app_id && $localStorage.app_content_app_info != null){
        $scope.app_info = $localStorage.app_content_app_info;
        document.title = $scope.app_info.name+"_关键词_Appbk.com";
      }else {
        $localStorage.app_content_app_id = app_id;
        app.get_app_info().get({"app_id":app_id},function(data){
          $scope.app_info = data;
          document.title = $scope.app_info.name+"_关键词_Appbk.com";
          $localStorage.app_content_app_info = data;
        });
      }


      //添加关注关键词
      $scope.add_user_watch_keyword = function(n){
        console.log(n);

        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          window.location = "index.html#/index_login";
          console.log("window.location = #index_login");
        }else {
          console.log("else");


          user_app_keyword.add_user_watch_keyword().get({"n":n,"email":$localStorage.email,"app_id":app_id},function(data) {
            get_app_possible_keywords(1);
          });

        }
      }

      //删除关注的词
      $scope.del_user_watch_keyword = function(n){

        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          window.location = "index.html#/index_login";
          console.log("window.location = #index_login");
        }else {
          //console.log("else");

          user_app_keyword.del_user_watch_keyword().get({"n":n,"email":$localStorage.email,"app_id":app_id},function(data) {
            get_app_possible_keywords(1);
          });
        }
      }

      var limit = 1000; //每页的记录个数
      get_app_possible_keywords(1);//第一页
      //加载更多数据
      $scope.load_more = function(current_page)
      {
        $scope.current_page = current_page + 1;
        get_app_possible_keywords(current_page+1);
        if ($scope.current_page >= $scope.max_page_num) {
          $scope.turn_page = false;
        }
        else {
          $scope.turn_page = true;
        }
      }



      //获得app的搜索词覆盖
      function get_app_possible_keywords(page)
      {
        var start = limit * (page - 1);
        $scope.start = start;
        $scope.loading_show = true;
        user_app_keyword.get_app_word_two_date_compare().get({"app_id": app_id, "start": start, "limit": limit, "email": $localStorage.email, "token": $localStorage.token}, function (data) {
          $scope.app_content_keyword_wait = false;
          $scope.loading_show = false;
          //插入新数据
          var top_num = data.top10_num; //top 10的关键词个数
          var top3_num = data.top3_num; //top 3的关键词个数

          if(start == 0){
            $scope.word_grid.data = [];
          }

          for (var i=0;i<data.results.length;i++) {
            $scope.word_grid.data.push(data.results[i]);
          }
          $scope.top_num = top_num;
          $scope.top3_num = top3_num;

          if (0 == data.results.length) {
            $scope.keywords_user = {};
            $scope.keywords_user.message = "暂无关键词";
          }
          if (start == 0) { //如果是首次调用
            //翻页构造
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
            $scope.max_page_num = parseInt(data.num/limit) + 1;
            if ($scope.max_page_num >1) {
              $scope.turn_page = true;
            }
            else {
              $scope.turn_page = false;
            }
          }

        });
      }

      $scope.show_history_chart = function(compete_query){
        $('#myModal').modal('show');
        //HighChart 数据
        user_app_keyword.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":compete_query}, function(data) {
          //展示到图标上
          $('#key_world_trend').highcharts(data);
        });

      }

      //使用ui gird
      //表格基础配置
      $scope.word_grid = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        enableGridMenu: true,//menu
        exporterOlderExcelCompatibility: true,
        enableHorizontalScrollbar:"never",
        exporterCsvFilename: 'appbk.csv',
        minRowsToShow:100,//展示的行数，暂时不起作用，主要是由页面设置的表格高度决定。

      };

      var columm_config =  [
        {field: 'query', displayName: '关键词',type:'string',width:150,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='index.html#/app_search/{{MODEL_COL_FIELD}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
        {field: 'pos', displayName: "当前排名",width:120, type:'number',cellTemplate:"../views/template/pos_change.html"},
        {field: 'rank', displayName: '搜索热度', type:'number', width:120,
          headerCellTemplate:"../views/template/search_header_template.html"},
        {field: 'num', displayName: "搜索结果数",width:120, type:'number'},
        {field: 'query', displayName: '操作',type:'string',enableSorting: false,width:130,cellTemplate:"../views/template/word_cover_icon.html"},

      ];
      $scope.word_grid.columnDefs = columm_config;


      //注册api
      //加载grid api 2，同时设置check选择函数
      $scope.word_grid.onRegisterApi = function(word_grid_api){
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
        $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 200 );

      }

      $scope.filter_sign = 0;
      $scope.filter_button = "只显示核心词";

      $scope.filter_table = function()
      {
        if ($scope.filter_sign == 0) {
          $scope.filter_sign = 1;
          $scope.filter_button = "显示全部词";
        }
        else
        {
          $scope.filter_sign = 0;
          $scope.filter_button = "只显示核心词";
        }
        $scope.word_grid_api.grid.refresh();
        $scope.word_grid_api.grid.ScrollToTop();
        $scope.word_grid_api.grid.prevScrollTop();
      }

      $scope.singleFilter = function( renderableRows )
      {
        renderableRows.forEach( function( row )
        {
          if ( $scope.filter_sign == 1 ) //如果需要过滤
          {
            if ( row.entity["rank"]<4000 || row.entity["pos"]>100 ) {
              row.visible = false;
            }
          }
          else //如果不需要过滤
          {
            row.visible = true;
          }
        });
        return renderableRows;
      }

    })

  //排名趋势控制器
    .controller('app_content_trend_controller', function($scope,$routeParams,$localStorage, app,user_app_keyword)
    {

      //接收参数
      var app_id = $routeParams.app_id;
      console.log("app_content_trend_controller" + app_id);
      document.title = "排名趋势_Appbk.com";
      app.get_app_info().get({"app_id":app_id},function(data){
        $scope.app_info = data;
        document.title = $scope.app_info.name+"_排名趋势_Appbk.com";
      });

      //周期数据
      $scope.period = {};
      var period_list = [{"name":"最近24小时","value":-1},{"name":"最近一周","value":7},{"name":"最近一月","value":30},{"name":"最近三个月","value":90}];
      $scope.period_list = period_list;
      $scope.period.selected = period_list[1]; //默认的显示选项

      $scope.select_peroid = function(limit) {
        get_app_rank_trend(limit);
      }

      //默认获得最近7天的数据
      get_app_rank_trend(7);

      //获得app的排名趋势变化数据
      //limit，最近多少天
      function get_app_rank_trend(limit) {
        $scope.loading_show = true;
        if (limit!=-1) //按照天
        {
          app.get_app_rank_trend().get({"app_id": app_id, "limit": limit}, function (data) {
            $scope.loading_show = false;
            $('#trend').highcharts(data);
            $('#trend').append('<div class="highcharts-logo"></div>');
          });
        }
        else //按照小时
        {
          app.get_app_rank_hourly_trend().get({"app_id": app_id}, function (data) {
            $('#trend').highcharts(data);
            $('#trend').append('<div class="highcharts-logo"></div>');
            $scope.loading_show = false;
          });
        }
      }
    })
  //app评论控制器
    .controller('app_content_comment_controller', function($scope, $localStorage,$routeParams,app,app_comment,uiGridConstants)
    {
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

      //所有评论
      var limit = 100; //每页的记录个数
      get_app_possible_keywords(1);//第一页


      //加载更多数据
      $scope.load_more = function(current_page)
      {
        $scope.current_page = current_page + 1;
        get_app_possible_keywords(current_page+1);
        if ($scope.current_page >= $scope.max_page_num)
        {
          $scope.turn_page = false;
        }
        else
        {
          $scope.turn_page = true;
        }
      }

      //获得app的搜索词覆盖
      function get_app_possible_keywords(page)
      {
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
            $scope.keywords_user.message = "暂无关键词";
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
        enableGridMenu: true,//menu
        exporterOlderExcelCompatibility: true,
        exporterCsvFilename: 'appbk.csv',
      };

      var columm_config =  [
        {field: 'name', displayName: '用户名',type:'number',width:150,enableFiltering: false},
        {field: 'title', displayName: '评论标题',type:'string',width:150,enableFiltering: false},
        {field: 'body', displayName: '评论内容', type:'string', width:300,enableFiltering: false},
        {field: 'rating', displayName: "星级",width:80, type:'number'
          ,filter:{
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '5', label: '5星'}, {value: '4', label: '4星' }, { value: '3', label: '3星'}, { value: '2', label: '2星' }, { value: '1', label: '1星' } ]
        }
          ,headerCellClass: $scope.highlightFilteredHeader},
        {field: 'body.length', displayName: "内容长度",width:120, type:'number',enableFiltering: false},
        {field: 'date', displayName: "发布时间",width:200, type:'string',enableFiltering: false}
      ];
      $scope.word_grid.columnDefs = columm_config;

      $scope.header_title = "name";

      //注册api
      //加载grid api 2，同时设置check选择函数
      $scope.word_grid.onRegisterApi = function(word_grid_api){
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;

      }

      //获得app的评论趋势变化数据
      //limit，最近多少天
      function get_app_comment_trend(limit) {
        $scope.trend_loading_show = true;
        app_comment.get_app_comment_trend().get({"app_id": app_id, "limit": limit}, function (data) {
          $scope.trend_loading_show = false;
          $('#trend').highcharts(data);
          $('#trend').append('<div class="highcharts-logo"></div>');

        });
      }


    })
