/**
 * Created by maris on 2015/12/22.
 */
angular.module('aso')

  //aso主控制器
  .controller('aso_controller', function($scope,$window, $localStorage,$location, app, user,auth)
  {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-74973814-1', 'auto');
    $window.ga('send', 'pageview', { page: $location.url() });

    //检测是否登录，如果未登录，首先登录
    if(typeof($localStorage.email) == "undefined") //如果没有登录
    {
      $scope.user_login_show = false;
      $scope.user_not_login_show = true;
      //跳转到login页面
      window.location = 'aso.html#/login';//跳转到登录页
      return false;
    }
    else //如果已经登录
    {
      $scope.user_login_show = true;
      $scope.user_not_login_show = false;
    }


    //获得app基本信息
    $scope.login = function(){
      console.log("$scope.login step1");
      user.get_user_info().get({"email":$localStorage.email,"token":$localStorage.token}, function(data){
        $scope.user_info = data;
        if ($scope.user_info.level > 7){
          console.log("/forbidden");
          $location.path("/forbidden");
        }
      });
    }
    $scope.login();

    //退出
    $scope.logout = function()
    {
      //清除cookie
      delete $localStorage.token;
      delete $localStorage.email;
      delete $localStorage.app_id;
      delete $localStorage.expire;
      $localStorage.$save();
      window.location = 'aso.html#/login';//跳转到登录页

      $scope.user_info = null;
      $scope.user_login_show = false;
      $scope.user_not_login_show = true;
    }

    $scope.checkUserLevel = function(){
      console.log("$scope.checkUserLevel");
      if (typeof ($scope.user_info) == 'undefined') {
        //$scope.login();
        //window.location = 'aso.html#/login';//跳转到登录页
        //$location.path("/login");


        if(typeof($localStorage.email) == "undefined") //如果没有登录
        {
          $scope.user_login_show = false;
          $scope.user_not_login_show = true;
          //跳转到login页面
          window.location = 'aso.html#/login';//跳转到登录页
          return false;
        }
      }else {
        if ($scope.user_info.level > 7){
          $location.path("/forbidden");
        }
      }
    }

  })

  //用户登录控制器
  .controller("login_controller", function($scope, $localStorage,$location, user)
  {
    $scope.user_login_show = true;
    $scope.user_not_login_show = true;
    //登录
    $scope.login = function()
    {
      email = $scope.email;
      password = $scope.password;

      user.check_user_login_input().get({"email":email,"password":password}, function(data)
      {
        if (data.status>=0) //如果正确
        {
          //删除原有cookie
          if (typeof($localStorage.app_id)!="undefined")
          {
            delete  $localStorage.app_id;
          }
          //保持cookie
          $localStorage.token = data.token;
          $localStorage.email = email;
          $localStorage.expire = data.expire; //本地存储过期时间，过期后必须重新登录
          $localStorage.$save();

          //跳转到用户app页面
          window.location = 'aso.html';
          //setTimeout("window.location = 'user_main.html'",1000);//延时1秒,否则写localstorate有问题
        }
        else
        {
          //展示错误页面,密码错误，或者服务到期等。
          $scope.message = data.message;
        }
      });
    }
  })

  //app控制器
  .controller('app_controller', function($scope,$localStorage,user_app, app)
  {
    $scope.checkUserLevel();
    console.log("app_controller");

    //tab菜单管理
    $scope.old_app_tab = true;
    $scope.new_app_tab = false;

    //获得用户app列表
    get_user_apps();

    //删除用户app
    $scope.del_user_app = function(app_id)
    {
      //真实删除数据
      user_app.del_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        //刷新页面
        get_user_apps();

        //go to app_info,刷新页面，不能$locaiton.href
        window.location = 'aso.html';
      });
    }

    //点击一个app，进入信息页面
    $scope.go_app_info = function(app)
    {


      //写cookie
      $localStorage.app_id = app.app_id;
      $localStorage.$save();

      //右上角选择
      //$scope.app.selected = app; //显示的选项

      //go to app_info,刷新页面，不能$locaiton.href
      window.location = '#word/'+$localStorage.app_id;

    }

    //搜索app
    $scope.search_app = function()
    {
      query = $scope.query;
      //获得搜索结果数据
      //app.get_app_search_results().get({"email":$localStorage.email,"token":$localStorage.token,"n":query},function(data)
      app.get_all_app_search_results().get({"n":query,"start": 0, "limit": 10}, function(data)
      {
        $scope.app_search_results = data.results;
        if ( data.results.length == 0 ) //如果没有搜索结果
        {
          $scope.message = "没有相关结果,可尝试直接搜索你的app id";
        }
      });
      $scope.api_search_show = true;
    }


    $scope.get_api_app_search_results = function()
    {
      name = $scope.query;
      $scope.app_search_results = {};
      $scope.api_search_wait = true;
      app.get_api_app_search_results().get({"n":name}, function(data)
      {
        $scope.app_search_results = data.results;
        if ( data.results.length == 0 ) //如果没有搜索结果
        {
          $scope.message = "没有相关结果";
        }
        $scope.api_search_show = false;
        $scope.api_search_wait = false;
      });
    }

    //根据app_id添加app
    $scope.add_user_app = function(app_id)
    {
      //真实后台添加数据
      user_app.add_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        //刷新页面
        get_user_apps();
        //go to app_info,刷新页面，不能$locaiton.href
        window.location = 'aso.html';

      });
    }

    //tab点击
    //已提交app市场的tab
    $scope.old_app_tab_click = function()
    {
      $scope.old_app_tab = true;
      $scope.new_app_tab = false;
    }

    //未提交app市场的tab
    $scope.new_app_tab_click = function()
    {
      $scope.old_app_tab = false;
      $scope.new_app_tab = true;
      //加载app类别代码
      $scope.categories  = app.get_categories().query();

    }

    //添加未提交到市场上的app
    $scope.add_new_app = function ()
    {
      name = $scope.new_app_name;
      description = $scope.new_app_description;
      category = $scope.new_app_category;
      icon = "http://appbk.oss-cn-hangzhou.aliyuncs.com/images/57.png";

      //真实后台添加数据
      user_app.add_user_new_app().get({"email":$localStorage.email,"token":$localStorage.token,"n":name,"d":description,"c":category},function(data)
      {
        //刷新页面
        get_user_apps();
        //go to app_info,刷新页面，不能$locaiton.href
        window.location = 'aso.html';
      });
    }

    //获得app列表,刷新页面
    function get_user_apps()
    {
      user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token},function(data)
      {


        $scope.apps = data;
          //$scope.user_app_show_wait = false;
        $localStorage.app_id = data[0].app_id;
        $localStorage.$save();
      });
    }
  })

  //关键词控制器
  .controller('word_controller', function($scope,$timeout,$routeParams,$localStorage,app,user_app_keyword,uiGridConstants,user_aso)
  {
    console.log("word_controller");

    $scope.checkUserLevel();
    var app_id = $routeParams.app_id;
    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //bootstrap tips
    $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});

    var limit = 100; //每页的记录个数
    get_app_possible_keywords();

    //翻页事件,使用ui-grid默认的翻页组件 
    $scope.page_changed = function() 
    {
      $scope.word_grid_api.pagination.seek($scope.current_page); 
    }
    //获得app的搜索关键词覆盖函数
    function get_app_possible_keywords()
    {
      var start = 0;
      var max_num = 10000;//获得记录的条数,一般不超过1万，但如果太多会卡
      $scope.start = start;
      $scope.loading_show = true;
      user_app_keyword.get_app_word_two_date_compare().get(
        {"app_id": app_id, "start": start, "limit": max_num, "email": $localStorage.email, "token": $localStorage.token, "simple": 1},
        function (data) {

          var newData = [];

          for(var i=0;i<data.results.length;i++) {

            var iData = [];

            iData.query = data.results[i][0];
            iData.pos = data.results[i][1];
            iData.increase = data.results[i][2];
            iData.rank = data.results[i][3];
            iData.num = data.results[i][4];

            iData.is_login = false;

            iData.seleted = false;
            newData.push(iData);
          }

          data.results = newData;

          $scope.app_content_keyword_wait = false;
          $scope.loading_show = false;
          //插入新数据
          $scope.num = data.num;
          $scope.top_num = data.top10_num; //top 10的关键词个数
          $scope.top3_num = data.top3_num; //top 3的关键词个数

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
      enableRowSelection: true,
      paginationPageSize: limit,
      enablePaginationControls: false,//不展示默认的翻页html标签
      enableSelectAll: false,
      selectionRowHeaderWidth: 50,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      enableGridMenu: false,//menu
      exporterOlderExcelCompatibility: true,
      //enableHorizontalScrollbar:"never",
      exporterCsvFilename: 'appbk.csv',




    };

    var columm_config =  [

      {field: 'query',displayName: '关键词', type:'string',width:'20%',cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='index.html#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
      {field: 'pos', displayName: "当前排名",width:'20%',type:'number',cellTemplate:"../../views/template/pos_change.html"},
      //{field: 'increase', displayName: "昨日同比",width:'20%', type:'number',visible:false},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'20%'},
      {field: 'num', displayName: "搜索结果数",width:'20%', type:'number'},
      {field: 'query', displayName: '操作',type:'string',selected:false,enableSorting: false, width:'15%',cellTemplate:"../views/template/word_cover_icon.html"},

      //{field: 'query',displayName: '关键词', type:'string',width:'20%',cellTemplate:"../views/template/aso_word_select.html"},

    ];
    $scope.word_grid.columnDefs = columm_config;


    //过滤方法2,关键词过滤
    //核心词过滤函数
    $scope.search_word = function()
    {
      $scope.word_grid_api.grid.registerRowsProcessor( $scope.word_filter, 300 );
      $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 200);

      $scope.word_grid_api.grid.refresh();
    }

    $scope.word_filter = function( renderableRows )
    {
      var word = $scope.search_keyword;
      renderableRows.forEach( function( row )
      {
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

    //展示历史排名趋势
    $scope.show_history_chart = function(compete_query){
      $('#myModal').modal('show');
      //HighChart 数据
      user_app_keyword.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":compete_query}, function(data) {
        //展示到图标上

        $('#key_world_trend').highcharts(data);
      });

    }


    $scope.export_excel = function()
    {
      $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
    }


    //注册api
    //加载grid api 2，同时设置check选择函数
    $scope.word_grid.onRegisterApi = function(word_grid_api){
      //set gridApi on scope
      $scope.word_grid_api = word_grid_api;
      $scope.word_grid_api.grid.registerRowsProcessor( $scope.singleFilter, 200 );

      word_grid_api.selection.on.rowSelectionChanged($scope,function(row){
        var word = row.entity.query;
        if (row.isSelected)
        {
          //添加词
          add_word(word);

        }
        else
        {
          //删除词
          del_word(word);

        }
      });


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

    //删除关键词
    function del_word(word)
    {
      //真实删除数据库
      user_aso.del_aso_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
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
      user_aso.add_aso_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {

      });
    }
  })

  //aso方案控制器
  .controller('solution_controller', function($scope ,$routeParams ,$localStorage,app,user_aso)
  {
    console.log("solution_controller");
    $scope.checkUserLevel();
    //$("#refresh_button").popover('toggle');
    //
    $("#tips1").popover({trigger:'click| hover',placement:'top',html:true});

    //获得当前app_id
    //var app_id = $localStorage.app_id;
    var app_id = $routeParams.app_id;

    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    $scope.show_pre_job = true;

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
    };

    var columm_config =  [
      {field: 'word', displayName: '删除关键词',type:'string', width:100, cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click="grid.appScope.del_word(MODEL_COL_FIELD)">删除</a> </div>',enableSorting: false, enableFiltering: false},
      {field: 'word', displayName: '关键词',type:'string',cellTemplate:"<span  class='table_middle'><a target='_blank' href='index.html#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></span>"},
      {field: 'rank', displayName: '搜索热度', type:'number', headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><a href='index.html#/word_rank_trend/{{row.entity.word}}' target='_blank'><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></a></h5></div>"},
      {field: 'pos', displayName: "APP排名", type:'number'},
      {field: 'top_amount', displayName: "冲排名量", type:'number'},
      {field: 'hold_amount', displayName: "维持排名量", type:'number'},
      {field: 'fetch_time', displayName: "更新时间",width:180, type:'dated'},

    ];
    $scope.word_grid.columnDefs = columm_config;

    get_aso_solution();

    //添加词
    $scope.add_word = function (word)
    {
      add_word(word);
    }

    //删除词
    $scope.del_word = function (word)
    {
      del_word(word);
    }

    $scope.update_search_result = function()
    {
      user_aso.update_search_result().get({"n":$scope.word_list},function(data){
        $("#refresh_button").popover('show');
        if (data["status"]=="200"){
          setTimeout(function(){//定时器
              $("#refresh_button").popover('hide');
            },
            3000);//设置三千毫秒即3秒
        }
      });
    }
    //报价方案
    $scope.period = 2;
    $scope.cpsa_cost = 3;

    //改变数字，重新计算
    $scope.change_value = function()
    {
      $scope.all_cost = Number($scope.period) * $scope.cpsa_cost * ( Number($scope.top_amount) + Number($scope.hold_amount));
      $scope.total_amount = Number($scope.top_amount) + Number($scope.hold_amount);
    }

    //获得方案
    function get_aso_solution()
    {
      //获得方案
      user_aso.get_aso_solution().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        $scope.word_grid.data = data;
        //获得冲榜量和维榜量总和
        var top_amount = 0;//冲榜量
        var hold_amount = 0;//维榜量
        var high_pos_word = 0; //pos大于50的词的个数
        word_list = [];
        for (var i=0;i<data.length;i++)
        {

          if( data[i].rank == -1 || data[i].rank == null){
              data[i].rank = 0;
          }

          word_list.push(data[i].word);
          top_amount = top_amount　+ data[i].top_amount;
          hold_amount = hold_amount + data[i].hold_amount;

          if (Number(data[i].pos)>50 && Number(data[i].pos)<100)
          {
            high_pos_word++;
          }
        }

        $scope.word_list = word_list.join(","); //
        if (high_pos_word==0)
        {
          $scope.show_pre_job = false;
        }
        else
        {
          $scope.show_pre_job = true;
        }
        $scope.high_pos_word = high_pos_word;
        $scope.top_amount = top_amount;
        $scope.hold_amount = hold_amount;
        $scope.total_amount = Number($scope.top_amount) + Number($scope.hold_amount);
        $scope.all_cost = Number($scope.period) * $scope.cpsa_cost * ( Number($scope.top_amount) + Number($scope.hold_amount));

      });
    }

    //删除关键词
    function del_word(word)
    {
      //真实删除数据库
      user_aso.del_aso_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //刷新方案
        get_aso_solution();
      });
    }

    //添加关键词
    function add_word(word)
    {
      //添加数据后，word可能是逗号隔开的多个词
      //if (word.length<1)
      //{
      //  alert("关键词长度不能太短");
      //  return -1;
      //}

      console.log(word);
      //更新数据库，后台可处理多个字符串的情况
      user_aso.add_aso_keyword().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //刷新方案
        get_aso_solution();
      });
    }
  })


  //aso监控控制器
  .controller('watch_controller', function($scope ,$routeParams ,$localStorage,app,user_aso)
  {
    $scope.checkUserLevel();
    //获得当前app_id
    //var app_id = $localStorage.app_id;
    var app_id = $routeParams.app_id;

    //获得app基础信息
    $scope.app_info = app.get_app_info().get({"app_id":app_id});

    //获得用户app关键词整体曝光度趋势图
    //watch_all_keywords();

    //获得用户关键词的最新的热度和搜索排序位置信息
    user_aso.get_app_keywords_rank_and_pos().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
    {
      $scope.user_keywords_rank_and_pos = data;
      get_keyword_trend(0);
    });

    function get_keyword_trend(index){
      console.log("get_keyword_trend = " + index);
      word = $scope.user_keywords_rank_and_pos[index].word;
      user_aso.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
      {
        //展示到图标上
        $('#trend').highcharts(data);
      });
    }

    //获得一个关键词的曝光度趋势变化数据
    $scope.get_keyword_trend = function($index)
    {
      get_keyword_trend($index);
    }

    $scope.watch_all_keywords = function ()
    {
      watch_all_keywords();
    }
    //获得用户app关键词整体曝光度趋势图
    function watch_all_keywords()
    {
      user_aso.get_app_keywords_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id}, function(data)
      {
        //展示到图表
        $('#trend').highcharts(data);
      });
    }

  })

  //aso监控控制器
  .controller('word_cloud_controller', function($scope)
  {
    $scope.checkUserLevel();
    $scope.word_cloud = [
      {text: "Lorem", weight: 1}
    ];

    $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];

  })

  .controller('forbidden_controller', function($scope){
    console.log('forbidden_controller');
  })

