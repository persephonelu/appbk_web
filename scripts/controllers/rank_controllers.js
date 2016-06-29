/**
 * @ngdoc function
 * @name appbkApp.controller:RankCtrl
 * @description
 * # RankCtrl
 * Controller of the appbkApp
 */
angular.module('rank')

  //主控制器
    .controller('index_controller', function($scope,$localStorage, $location,$window,app,user_app , user, auth)
    {
      document.title = "AppBK运营助手_ASO优化工具_应用商店App Store数据优化_iOS排名优化与查询工具";
      $scope.user_login_show = false;
      $scope.user_not_login_show = false;
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

        user.get_user_info().get({"email":$localStorage.email,"token":$localStorage.token},function(data) {
          $scope.user_info = data;
        });
        $scope.register_or_login = "现在使用";
        $scope.register_or_login_url = "user_main.html";

        user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token}, function(data)
        {
          //如果尚未添加app
          if (data.length==0) {
            $scope.message = "尚未添加app，请点击右上角'app管理'，添加app";
            return;
          }
          $scope.app = {}; //选择的app
          $scope.apps = data; //app列表
          $scope.app.selected = data[0]; //显示的选项

        });
      }

      //退出
      $scope.logout = function() {
        auth.logout();
      }

      //app search 搜索
      $scope.app_search = function() {
        var name = $scope.n;
        $location.path("app_search/" + name + "/cn");
      }

      //选择一个app
      $scope.select_app = function(app_id) {
        //获得app基本信息
        app.get_app_info().get({"app_id":app_id}, function(data) {
          $scope.app_info = data;
          window.location = 'user_main.html#/app_content/' + app_id;
        });

      }

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

  //我的app
    .controller('user_app_manage_controller', function($scope,$localStorage,$window,$location,$anchorScroll, user_app, app) {

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
        });
      }

      //点击一个app，进入信息页面
      $scope.go_app_info = function(app)
      {
        //定位到顶部
        $location.hash('top');
        $anchorScroll();

        //写cookie
        $localStorage.$save();

        //右上角选择
        $scope.app.selected = app; //显示的选项

        //go to app_info,刷新页面，不能$locaiton.href
        window.location = 'user_main.html#/';
        location = 'user_main.html#/app_content/' + app.app_id;
      }

      //搜索app
      $scope.search_app = function()
      {
        query = $scope.query;
        //获得搜索结果数据
        app.get_all_app_search_results().get({"n":query,"start": 0, "limit": 10}, function(data) {
          for(var i =0; i<data.results.length ; i++) {
            for(var j =0; j<$scope.apps.length; j++) {

              if(data.results[i].app_id == $scope.apps[j].app_id) {
                data.results[i].is_my_app = true;

              }
            }
          }


          $scope.app_search_results = data.results;
          if ( data.results.length == 0 ) {//如果没有搜索结果
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
          if ( data.results.length == 0 ) {//如果没有搜索结果
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
        });
      }

      //tab点击
      //已提交app市场的tab
      $scope.old_app_tab_click = function() {
        $scope.old_app_tab = true;
        $scope.new_app_tab = false;
      }

      //未提交app市场的tab
      $scope.new_app_tab_click = function() {
        $scope.old_app_tab = false;
        $scope.new_app_tab = true;
        //加载app类别代码
        $scope.categories  = app.get_categories().query();

      }

      //添加未提交到市场上的app
      $scope.add_new_app = function () {
        name = $scope.new_app_name;
        description = $scope.new_app_description;
        category = $scope.new_app_category;
        icon = "http://appbk.oss-cn-hangzhou.aliyuncs.com/images/57.png";

        //真实后台添加数据
        user_app.add_user_new_app().get({"email":$localStorage.email,"token":$localStorage.token,"n":name,"d":description,"c":category},function(data) {
          //刷新页面
          get_user_apps();
          window.location = 'user_main.html';
        });
      }

      //获得app列表,刷新页面
      function get_user_apps()
      {
        $scope.user_app_show_wait = true;
        user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token},function(data) {
          $scope.apps = data;
          $scope.user_app_show_wait = false;
          $localStorage.$save();
        });
      }
    })

  //index main控制器
    .controller('index_main_controller', function($scope,$http, $location,app, app_tools)
    {
      document.title = "AppBK运营助手_ASO优化工具_应用商店App Store数据优化_iOS排名优化与查询工具";
      $scope.name = "";
      //app search 搜索
      $scope.app_search = function()
      {
        var name = $scope.name;
        if ($scope.name == typeof("undefined")){
          return;
        }
        $location.path("app_search/" + name + "/cn");
      }

      app_tools.get_appstore_hotwords_new().query(function(data) {
        $scope.hotwords = data;
      });

    })

  //tag_rank的控制器 用户标签排行榜
    .controller('tag_rank_controller', function($scope, $window,$location,app, app_weibo) {
      document.title = "App Store热门用户标签_AppBK.com";
      //获得一级类别信息
      $scope.categories = app.get_categories().query();

      //获得游戏二级类别信息
      $scope.game_categories = app.get_game_categories().query();

      //只要30个，不翻页,预先选择一个类别
      $scope.category_selected = "天气";
      get_tag_rank($scope.category_selected);

      //点击时，获得某个类别下的app排行
      $scope.get_category_tag_rank = function(category) {
        get_tag_rank(category);
      }

      function get_tag_rank(category)
      {
        $scope.category_selected = category;
        $scope.tag_rank = {};//先清空数据
        $scope.loading_show = true;
        app_weibo.get_tag_rank().query({"c":category},function(data)
        {
          $scope.tag_rank = data;
          $scope.loading_show = false;
        });
      }
    })

    //word_rank的控制器 关键词排行榜
    .controller('word_rank_controller', function($scope, $location, $window,word, app)
    {
      document.title = "App Store关键词热度排行榜_AppBK.com"
      //bootstrap tips
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});

      var limit = 30; //每页的记录个数
      //获得一级类别信息
      $scope.categories = app.get_categories().query();

      //获得游戏二级类别信息
      $scope.game_categories = app.get_game_categories().query();

      //只要30个，不翻页
      $scope.category_selected = "总榜";
      get_word_rank($scope.category_selected,1);

      //点击下拉菜单时，获得某个类别下的app关键词榜单
      $scope.get_category_word_rank = function(category) {
        get_word_rank(category,1);
      }

      //关键词表格
      //使用ui gird
      //表格基础配置
      $scope.word_grid = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        enableGridMenu: false,//menu
        exporterOlderExcelCompatibility: true,
        exporterCsvFilename: 'appbk.csv',
      };

      var columm_config;
      $scope.$watch('window.innerWidth', function() {
        if (window.innerWidth >= 768){
          columm_config  =  [
            {field: 'num', displayName: '  #',type:'number',width:'7%', cellTemplate: '<div class="ui-grid-cell-contents ">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
            {field: 'word', displayName: '搜索词',type:'string',width:'15%',cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
            {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><a href='#/word_rank_trend/{{row.entity.word}}'><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></a></h5></div>"},
            {field: 'num', displayName: "搜索结果数",width:'13%', type:'number',cellTemplate: '<div class="ui-grid-cell-contents">{{MODEL_COL_FIELD}}</div>'},
            {field: 'name', displayName: "第1名APP", type:'string', width:'50%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='user_main.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'><span class='c2'>{{MODEL_COL_FIELD}}</span></a></div>"},
          ];
        }else {
          columm_config  =  [
            {field: 'num', displayName: '  #',type:'number',width:'17%', cellTemplate: '<div class="ui-grid-cell-contents ">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
            {field: 'word', displayName: '搜索词',type:'string',width:'25%',cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
            {field: 'rank', displayName: '搜索热度', type:'number', width:'25%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><a href='#/word_rank_trend/{{row.entity.word}}'><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></a></h5></div>"},
            {field: 'num', displayName: "搜索结果数",width:'33%', type:'number',cellTemplate: '<div class="ui-grid-cell-contents">{{MODEL_COL_FIELD}}</div>'},
            //{field: 'name', displayName: "第1名APP", type:'string', width:'50%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='user_main.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'><span class='c2'>{{MODEL_COL_FIELD}}</span></a></div>"},
          ];
        }

        $scope.word_grid.columnDefs = columm_config;

      });

      //导出表格
      $scope.word_grid.onRegisterApi = function(word_grid_api) {
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
      }
      $scope.export_excel = function() {
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
      }

      //加载更多数据
      $scope.load_more = function(current_page) {
        category = $scope.category_selected;
        $scope.current_page = current_page + 1;
        get_word_rank(category,current_page+1);
        if ($scope.current_page >= $scope.max_page_num) {
          $scope.turn_page = false;
        } else {
          $scope.turn_page = true;
        }
      }


      //选择一个类别，获得热门关键词
      function get_word_rank(category,page)
      {
        $scope.category_selected = category;
        var start = limit * (page - 1);
        $scope.start = start;
        $scope.loading_show = true;
        word.get_word_rank().get({"c": category, "start": start, "limit": limit}, function (data)  {

          if (start == 0) { //如果是首次调用
            $scope.word_grid.data = [] ;//清空数据
            //翻页构造
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
            $scope.max_page_num = parseInt(data.num/limit) + 1;
            if ($scope.max_page_num >1) {
              $scope.turn_page = true;
            } else {
              $scope.turn_page = false;
            }
          }

          //插入新数据
          for (var i=0;i<data.results.length;i++) {
            $scope.word_grid.data.push(data.results[i]);
          }

          $scope.loading_show = false;

        });
      }
      //word search 搜索
      $scope.search_word = function() {
        name = $scope.name;
        $location.path("word_search_inter/" + name + "/cn");
      }
    })
  .controller('word_cover_rank_controller', function($scope, $location, $window,word, app)
  {
    document.title = "App Store关键词覆盖排行榜_AppBK.com"

    $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});

    var limit = 50; //每页的记录个数
    //获得一级类别信息
    $scope.categories = app.get_categories().query();

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();

    //只要30个，不翻页
    $scope.category_selected = "总榜";
    get_word_rank($scope.category_selected,1);

    //点击下拉菜单时，获得某个类别下的app关键词榜单
    $scope.get_category_word_rank = function(category) {
      get_word_rank(category,1);
    }

    //加载更多数据
    $scope.load_more = function(current_page)
    {
      category = $scope.category_selected;
      $scope.current_page = current_page + 1;
      get_word_rank(category,current_page+1);
      if ($scope.current_page >= $scope.max_page_num) {
        $scope.turn_page = false;
      } else {
        $scope.turn_page = true;
      }
    }
    $scope.word_cover_data = [];

    //选择一个类别，获得热门关键词
    function get_word_rank(category,page) {
      $scope.category_selected = category;
      var start = limit * (page - 1);
      $scope.start = start;
      $scope.loading_show = true;

      word.get_word_cover_rank().get({"c": category, "start": start, "limit": limit}, function (data)  {

        console.log("start" + start);
        if (start == 0) { //如果是首次调用
          $scope.word_cover_data = [] ;//清空数据

          //翻页构造
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = limit; //每页的记录数
          $scope.start = 0;//html的记录index显示
          $scope.current_page = 1;//设置当前页
          $scope.max_page_num = parseInt(data.num/limit) + 1;
          if ($scope.max_page_num >1) {
            $scope.turn_page = true;
          } else {
            $scope.turn_page = false;
          }
        }

        ////插入新数据
        for (var i=0;i<data.results.length;i++) {
          $scope.word_cover_data.push(data.results[i]);
        }

        $scope.loading_show = false;

      });
    }

    //word search 搜索
    $scope.search_word = function() {
      name = $scope.name;
      $location.path("app_tools_word_cover/" + name );
    }
  })

  //word_rank的控制器 关键词排行榜 国际
    .controller('word_rank_inter_controller', function($scope, $location, word, app)
    {
      document.title = "关键词排行榜_AppBK.com"
      //bootstrap tips
      $("[data-toggle='popover']").popover({trigger:'click| hover',placement:'top',html:true});

      var limit = 30; //每页的记录个数
      //获得一级类别信息
      $scope.categories = app.get_categories().query();

      //获得游戏二级类别信息
      $scope.game_categories = app.get_game_categories().query();

      $scope.countrys = ["泰国"];
      //只要30个，不翻页
      $scope.category_selected = "天气";
      $scope.country_selected = $scope.countrys[0];

      get_word_rank($scope.category_selected,$scope.country_selected,1);

      //点击下拉菜单时，获得某个类别下的app关键词榜单
      $scope.get_category_word_rank = function(category) {
        get_word_rank(category,$scope.country_selected,1);
      }

      $scope.select_country = function(country) {
        get_word_rank($scope.category_selected,country,1);

      }

      //关键词表格
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
        exporterCsvFilename: 'appbk.csv',
      };

      var columm_config =  [
        {field: 'num', displayName: '序号',type:'number',width:80, cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
        {field: 'word', displayName: '搜索词',type:'string',width:150,cellTemplate:"<span  class='table_middle'><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></span>"},
        {field: 'rank', displayName: '搜索热度', type:'number', width:150,headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5>"},
        {field: 'num', displayName: "搜索结果数",width:130, type:'number'},
        {field: 'name', displayName: "第1名APP", type:'string', width:200,enableSorting: false,cellTemplate:"<a target='_blank' href='index.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</a>"},
      ];
      $scope.word_grid.columnDefs = columm_config;

      //加载更多数据
      $scope.load_more = function(current_page) {
        category = $scope.category_selected;
        $scope.current_page = current_page + 1;
        get_word_rank(category, $scope.country_selected,current_page+1);
        if ($scope.current_page >= $scope.max_page_num) {
          $scope.turn_page = false;
        } else {
          $scope.turn_page = true;
        }
      }


      //选择一个类别，获得热门关键词
      function get_word_rank(category,country,page)
      {
        $scope.category_selected = category;
        $scope.country_selected = country;

        var start = limit * (page - 1);
        $scope.start = start;

        word.get_word_rank_inter().get({"c": category, "start": start, "limit": limit}, function (data)  {

          if (start == 0) { //如果是首次调用
            $scope.word_grid.data = [] ;//清空数据
            //翻页构造
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
            $scope.max_page_num = parseInt(data.num/limit) + 1;
            if ($scope.max_page_num >1) {
              $scope.turn_page = true;
            } else {
              $scope.turn_page = false;
            }
          }

          //插入新数据
          for (var i=0;i<data.results.length;i++) {
            $scope.word_grid.data.push(data.results[i]);
          }

        });
      }

      //word search 搜索
      $scope.word_search = function() {
        name = $scope.name;
        $location.path("word_search_inter/" + name);
      }
    })


  //app_rank的控制器 APP排行榜
    .controller('app_rank_controller', function($scope, $http, $location,$routeParams,app) {
      document.title = "App Store中国总榜免费榜 Top1500_AppBK.com";

      $scope.rank_type_name = "免费榜单";
      $scope.rank_type = 'topfreeapplications';

      var limit = 100;
      //获得一级类别信息
      $scope.categories = app.get_categories().query();

      //获得游戏二级类别信息
      $scope.game_categories = app.get_game_categories().query();

      //获得每个类型的app top 排行榜，只要30个，不翻页
      $scope.category_selected = "总榜";

      if (typeof($routeParams.rank) != "undefined"){
        $scope.category_selected = $routeParams.rank;
      }
      if (typeof($routeParams.type) != "undefined") {
        $scope.rank_type = $routeParams.type;
        if ($routeParams.type == 'topfreeapplications') {
          $scope.rank_type_name = "免费榜单";
        } else if ($routeParams.type == 'toppaidapplications') {
          $scope.rank_type_name = "付费榜单";
        } else if ($routeParams.type == 'topgrossingapplications') {
          $scope.rank_type_name = "畅销榜单";
        }
      }

      document.title = "App Store 中国" + $scope.category_selected + $scope.rank_type_name + "Top1500_AppBK.com";

      get_app_rank( $scope.category_selected,$scope.rank_type,1);

      //获得某个类别下的app排行
      $scope.get_category_app_rank = function(category) {
        $location.path("app_rank/" + category + "/" + $scope.rank_type);
      }
      $scope.update_app_rank_type = function(rank_type){
        if (rank_type == $scope.rank_type){
          return;
        }else {
          $scope.rank_type = rank_type;
          if (rank_type == 'topfreeapplications') {
            $scope.rank_type_name = "免费榜单";
          }else if (rank_type == 'toppaidapplications'){
            $scope.rank_type_name = "付费榜单";
          }else if (rank_type == 'topgrossingapplications'){
            $scope.rank_type_name = "畅销榜单";
          }
          $location.path("app_rank/" + $scope.category_selected + "/" + $scope.rank_type);
        }
      }


      //翻页事件
      $scope.page_changed = function()
      {
        category = $scope.category_selected;
        get_app_rank(category,$scope.rank_type,$scope.current_page);
      }
      //获得app 排行信息
      //page，页码
      function get_app_rank(category,rank_type,page)
      {
        var start = limit * (page - 1);
        $scope.start = start;

        $scope.category_selected = category;
        $scope.app_rank_show_wait = true;
        //获得每个榜单的内容
        $scope.app_rank = {};

        //考虑到异步，需要分开来写
        app.get_app_rank().get({"c":category, "rank_type":rank_type, "start":start, "limit":limit},function(data)
        {
          $scope.app_rank = data.results;
          $scope.app_rank_show_wait = false;
          if (page==1) {
          //如果是首次调用，进行初始化操作
            //翻页构造，一般用在页面的第一页初始化部分
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = limit; //每页的记录数
            $scope.start = 0;//html的记录index显示
            $scope.current_page = 1;//设置当前页
          }
        });
      }

      //app search 搜索
      $scope.app_search = function() {
        var name = $scope.name;
        $location.path("app_search/" + name + "/cn");
      }
    })

  //app_rank的控制器 APP排行榜
  .controller('app_rank_up_controller', function($scope, $http, $location,$routeParams,app) {
    document.title = "24小时内排名上升最快应用_AppBK.com";
    $scope.rank_type_name = "免费榜单";
    $scope.rank_type = 'topfreeapplications';

    var limit = 100;
    //获得一级类别信息
    $scope.categories = app.get_categories().query();

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();

    //获得每个类型的app top 排行榜，只要30个，不翻页
    $scope.category_selected = "总榜";

    if (typeof($routeParams.rank) != "undefined"){
      $scope.category_selected = $routeParams.rank;
    }
    if (typeof($routeParams.type) != "undefined") {
      $scope.rank_type = $routeParams.type;
      if ($routeParams.type == 'topfreeapplications') {
        $scope.rank_type_name = "免费榜单";
      } else if ($routeParams.type == 'toppaidapplications') {
        $scope.rank_type_name = "付费榜单";
      } else if ($routeParams.type == 'topgrossingapplications') {
        $scope.rank_type_name = "畅销榜单";
      }
    }


    get_app_rank_up( $scope.category_selected,$scope.rank_type,1);

    //获得某个类别下的app排行
    $scope.get_category_app_rank = function(category) {
      $location.path("app_rank_up/" + category + "/" + $scope.rank_type);
    }
    $scope.update_app_rank_type = function(rank_type){
      if (rank_type == $scope.rank_type){
        return;
      }else {
        $scope.rank_type = rank_type;
        if (rank_type == 'topfreeapplications') {
          $scope.rank_type_name = "免费榜单";
        }else if (rank_type == 'toppaidapplications'){
          $scope.rank_type_name = "付费榜单";
        }else if (rank_type == 'topgrossingapplications'){
          $scope.rank_type_name = "畅销榜单";
        }
        $location.path("app_rank_up/" + $scope.category_selected + "/" + $scope.rank_type);
      }
    }


    //翻页事件
    $scope.page_changed = function() {
      category = $scope.category_selected;
      get_app_rank_up(category,$scope.rank_type,$scope.current_page);
    }
    //获得app 排行信息
    //page，页码
    function get_app_rank_up(category,rank_type,page) {
      var start = limit * (page - 1);
      $scope.start = start;

      $scope.category_selected = category;
      $scope.app_rank_show_wait = true;
      //获得每个榜单的内容
      $scope.app_rank = {};

      //考虑到异步，需要分开来写
      app.get_app_rank_up().get({"c":category, "rank_type":rank_type, "start":start, "limit":limit},function(data) {
        $scope.app_rank = data.results;
        $scope.app_rank_show_wait = false;

        if (page==1) {
          //翻页构造，一般用在页面的第一页初始化部分
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = limit; //每页的记录数
          $scope.start = 0;//html的记录index显示
          $scope.current_page = 1;//设置当前页
        }
      });

    }

    //app search 搜索
    $scope.app_search = function() {
      var name = $scope.name;
      $location.path("app_search/" + name + "/cn");
    }
  })

  //app_rank的控制器 APP排行榜
  .controller('app_rank_down_controller', function($scope, $http, $location,$routeParams,app) {
    document.title = "24小时内排名下降最快应用_AppBK.com";

    $scope.rank_type_name = "免费榜单";
    $scope.rank_type = 'topfreeapplications';

    var limit = 100;
    //获得一级类别信息
    $scope.categories = app.get_categories().query();

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();

    //获得每个类型的app top 排行榜，只要30个，不翻页
    $scope.category_selected = "总榜";

    if (typeof($routeParams.rank) != "undefined"){
      $scope.category_selected = $routeParams.rank;
    }
    if (typeof($routeParams.type) != "undefined") {
      $scope.rank_type = $routeParams.type;
      if ($routeParams.type == 'topfreeapplications') {
        $scope.rank_type_name = "免费榜单";
      } else if ($routeParams.type == 'toppaidapplications') {
        $scope.rank_type_name = "付费榜单";
      } else if ($routeParams.type == 'topgrossingapplications') {
        $scope.rank_type_name = "畅销榜单";
      }
    }



    get_app_rank_down( $scope.category_selected,$scope.rank_type,1);

    //获得某个类别下的app排行
    $scope.get_category_app_rank = function(category) {
      $location.path("app_rank_down/" + category + "/" + $scope.rank_type);
    }
    $scope.update_app_rank_type = function(rank_type){
      if (rank_type == $scope.rank_type){
        return;
      }else {
        $scope.rank_type = rank_type;
        if (rank_type == 'topfreeapplications') {
          $scope.rank_type_name = "免费榜单";
        }else if (rank_type == 'toppaidapplications'){
          $scope.rank_type_name = "付费榜单";
        }else if (rank_type == 'topgrossingapplications'){
          $scope.rank_type_name = "畅销榜单";
        }
        $location.path("app_rank_down/" + $scope.category_selected + "/" + $scope.rank_type);
      }
    }

    //翻页事件
    $scope.page_changed = function() {
      category = $scope.category_selected;
      get_app_rank_down(category,$scope.rank_type,$scope.current_page);
    }
    //获得app 排行信息
    //page，页码
    function get_app_rank_down(category,rank_type,page) {
      var start = limit * (page - 1);
      $scope.start = start;

      $scope.category_selected = category;
      $scope.app_rank_show_wait = true;
      //获得每个榜单的内容
      $scope.app_rank = {};

      //考虑到异步，需要分开来写
      app.get_app_rank_down().get({"c":category, "rank_type":rank_type, "start":start, "limit":limit},function(data) {
        $scope.app_rank = data.results;
        $scope.app_rank_show_wait = false;

        if (page==1) {
          //翻页构造，一般用在页面的第一页初始化部分
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = limit; //每页的记录数
          $scope.start = 0;//html的记录index显示
          $scope.current_page = 1;//设置当前页
        }
      });

    }

    //app search 搜索
    $scope.app_search = function()
    {
      var name = $scope.name;
      $location.path("app_search/" + name + "/cn");
    }
  })
  //app_rank的控制器 下架监控
  .controller('app_rank_offline_controller', function($scope, $http, $location,$routeParams,app)
  {
    document.title = "App Store中国下架应用监控_AppBK.com";
    $scope.limit = 100;

    //获得一级类别信息
    $scope.categories = app.get_categories().query();

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();


    //获得每个类型的app top 排行榜，只要30个，不翻页
    $scope.category_selected = "总榜";
    $scope.date_selected = moment().format("YYYY-MM-DD");

    if (typeof($routeParams.date) != "undefined") {
      $scope.date_selected = $routeParams.date;
    }

    get_app_rank( $scope.date_selected,1);


    //翻页事件
    $scope.page_changed = function(num) {
      $scope.current_page = num;
      get_app_rank($scope.date_selected,$scope.current_page);
    }
    //获得app 排行信息
    //page，页码
    function get_app_rank(date,page)
    {
      var start = $scope.limit * (page - 1);
      $scope.start = start;
      $scope.date_selected = date;
      $scope.app_rank_show_wait = true;
      //获得每个榜单的内容
      $scope.app_rank = {};
      $location.path("app_rank_offline/"+ $scope.date_selected);

      //考虑到异步，需要分开来写
      app.get_offline_app().get({"date":$scope.date_selected, "start":start, "limit":$scope.limit},function(data) {
        $scope.app_rank = data.results;
        $scope.app_rank_show_wait = false;

        if (page==1) {
          //翻页构造，一般用在页面的第一页初始化部分
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = $scope.limit; //每页的记录数
          $scope.start = 0;//html的记录index显示
          $scope.current_page = 1;//设置当前页
        }
      });

    }

    //日期选择
    var cur_options = {};
    cur_options.maxDate = moment();
    cur_options.startDate = $scope.date_selected;

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
      $scope.date_selected = start.format('YYYY-MM-DD');
      get_app_rank($scope.date_selected,1);
    });
  })

  //app_rank的控制器 上线监控
  .controller('app_rank_release_controller', function($scope, $http, $location,$routeParams,app)
  {
    document.title = "App Store中国上线应用监控_AppBK.com";

    $scope.rank_type_name = "免费榜单";
    $scope.rank_type = 'topfreeapplications';

    var limit = 100;
    //获得一级类别信息
    $scope.categories = app.get_categories().query();

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();

    //获得每个类型的app top 排行榜，只要30个，不翻页
    $scope.category_selected = "总榜";
    $scope.date_selected = moment().format("YYYY-MM-DD");

    if (typeof($routeParams.rank) != "undefined"){
      $scope.category_selected = $routeParams.rank;
    }
    if (typeof($routeParams.date) != "undefined"){
      $scope.date_selected = $routeParams.date;
    }
    document.title = "App Store 中国" + $scope.category_selected  + "上线应用监控_AppBK.com";

    get_app_rank( $scope.category_selected,$scope.date_selected,1);

    //获得某个类别下的app排行
    $scope.get_category_app_rank = function(category) {
      $location.path("app_rank_release/" + category + "/" + $scope.date_selected);
    }



    //翻页事件
    $scope.page_changed = function() {
      category = $scope.category_selected;
      get_app_rank(category,$scope.date_selected,$scope.current_page);
    }
    //获得app 排行信息
    //page，页码
    function get_app_rank(category,rank_type,page) {
      var start = limit * (page - 1);
      $scope.start = start;
      $location.path("app_rank_release/" + category + "/" + $scope.date_selected);

      $scope.category_selected = category;
      $scope.app_rank_show_wait = true;
      //获得每个榜单的内容
      $scope.app_rank = {};

      //考虑到异步，需要分开来写
      app.get_relase_app().get({"c":category, "date":$scope.date_selected, "start":start, "limit":limit},function(data)
      {
        $scope.app_rank = data.results;
        $scope.app_rank_show_wait = false;

        if (page==1) {
          //翻页构造，一般用在页面的第一页初始化部分
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = limit; //每页的记录数
          $scope.start = 0;//html的记录index显示
          $scope.current_page = 1;//设置当前页
        }
      });

    }

    //日期选择
    var cur_options = {};
    cur_options.maxDate = moment().format("YYYY-MM-DD");
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
    cur_options.startDate = $scope.date_selected;
    cur_options.singleDatePicker = true;
    $('#config-cur-demo').daterangepicker(cur_options, function(start, end, label){
      $scope.date_selected = start.format('YYYY-MM-DD');
      get_app_rank($scope.category_selected,$scope.date_selected,1);
    });
  })

  //app search控制器
    .controller('app_search_controller', function($scope, $localStorage,$location ,$routeParams,user_app, app, word) {
      //接收参数，获得搜索结果
      var name = $routeParams.name;
      var route_country = $routeParams.country;
      $scope.name = name;
      document.title =name+"_App Store搜索结果_AppBK.com";

      $scope.limit = 30;//每一页结果个数

      $scope.countrys = [{name:"中国",code:"cn"},{name:"美国",code:"us"},{name:"日本",code:"jp"}];
      for (var i = 0; i<$scope.countrys.length; i++){
        if ( $scope.countrys[i].code == route_country){
          $scope.country_selected = $scope.countrys[i];
        }

      }
      if (typeof($scope.country_selected) == "undefined")   {
        $scope.country_selected = $scope.countrys[0];
      }
      get_all_app_search_results(name,$scope.country_selected ,1);

      $scope.select_country = function(country) {
        $scope.app_select_country_show_wait = true;
        $scope.country_selected = country;
        get_all_app_search_results(name,country,1);
        get_word_hot_rank_and_suggestion(name,$scope.country_selected);

      }

      get_word_hot_rank_and_suggestion(name,$scope.country_selected);


      //翻页事件
      $scope.page_changed = function() {
        var name = $scope.name;
        get_all_app_search_results(name,$scope.country_selected,$scope.current_page);
      }


      function get_word_hot_rank_and_suggestion(name,country){
        //获得关键词热度
        var name_lower = name.toLowerCase();

        word.get_word_hot_rank().get({"n":name_lower,"cc":country.code},function(data) {
          $scope.word_rank = data.rank;
        });

        //获得搜索词suggestion
        word.get_word_suggetion().query({"n":name,"cc":country.code},function(data) {
          $scope.word_suggestion = data;
        });

      }
      //获得关键词的全部搜索结果,和苹果搜索结果一致的搜索结果
      function get_all_app_search_results(name,country,page)
      {
        $scope.app_search_show_wait = true;
        $scope.word_search_results  = {};

        var start = $scope.limit * (page - 1);
        $scope.start = start;

        $location.path("app_search/" + name + "/" + country.code);

        //获得搜索结果，全部的搜索结果
        app.get_all_app_search_results().get({"n":name,"start": start, "limit": $scope.limit,"cc":country.code}, function(data)
        {
          if(typeof($localStorage.email) != "undefined" && typeof(data.results) != 'undefined') //如果已经登录
          {
            user_app.get_user_apps().query({"email":$localStorage.email,"token":$localStorage.token}, function(appdata)
            {
              if (data.results.length!=0) {//如果有我的app

                $scope.myapps = appdata; //app列表

                //将我的app做标记
                for (var i=0;i<data.results.length;i++) {
                  for (var j=0; j<appdata.length; j++ ){

                    if (data.results[i].app_id == appdata[j].app_id){
                      data.results[i].my_app = true;
                    }
                  }
                }
              }
            });
          }

          $scope.app_search_results = data.results;
          $scope.update_time = data.update_time;


          //如果name输入的是app_id,并且有搜索结果，则直接跳转到app内容页
          var pattern_app_id = /^\d{6,13}$/;//app id的pattern,6到13位数字

          if ( pattern_app_id.test(name) && data.results.length != 0 )
          {
            window.location = 'user_main.html#/app_content/' + data.results[0].app_id;
          }

          if (start == 0) { //如果是首次调用
            //翻页构造
            $scope.total_items = data.num; //总数据数
            $scope.items_per_page = $scope.limit; //每页的记录数
            $scope.current_page = 1;//设置当前页
          }

          $scope.app_search_show_wait = false;
          $scope.app_select_country_show_wait = false;

        });

      }

      //根据app_id添加app
      $scope.add_user_app = function(app_id)
      {
        if(typeof($localStorage.email) == "undefined") {
          window.location = 'index.html#/index_login';
          return;
        }

        //真实后台添加数据
        user_app.add_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
        {
          for (var i=0;i<$scope.app_search_results.length;i++) {
              if ($scope.app_search_results[i].app_id == app_id){
                $scope.app_search_results[i].my_app = true;
              }
          }

        });
      }
    })

//word search控制器
    .controller('word_search_controller', function($scope, $routeParams, word)
    {
      //接收参数，获得搜索结果
      var name = $routeParams.name;
      $scope.name = name;
      get_word_search_results(name);

      document.title = name+"_关键词搜索_AppBK.com";


      //点击，获得搜索app结果
      $scope.search_word = function() {
        var name = $scope.name;
        get_word_search_results(name);
      }



      //获得关键词的title搜索结果
      function get_word_search_results(name)
      {
        $scope.app_search_show_wait = true;
        $scope.word_search_results  = {};
        word.get_word_search_results().query({"n":name},function(data)
        {
          $scope.word_search_results = data;
          //如果没有搜索结果
          if ( data.length == 0 ) {
            $scope.message = "没有相关结果";
          }
          $scope.app_search_show_wait = false;
        });
      }
    })


//word search international控制器
    .controller('word_search_inter_controller', function($scope, $routeParams, word, $location)
    {

      //接收参数，获得搜索结果
      var name = $routeParams.name;
      $scope.name = name;
      $scope.countrys = [{name:"中国",code:"cn"},{name:"美国",code:"us"},{name:"泰国",code:"th"},{name:"日本",code:"jp"},{name:"韩国",code:"kr"},{name:"台湾",code:"tw"}];

      for (var i = 0; i<$scope.countrys.length; i++){
        if ( $scope.countrys[i].code == $routeParams.country){
          $scope.country_selected = $scope.countrys[i];
        }
      }

      if (typeof($scope.country_selected) == "undefined") {
        $scope.country_selected = $scope.countrys[0];
      }
      get_word_search_results(name,$scope.country_selected);

      document.title = name+"_关键词搜索_AppBK.com";

      //点击，获得搜索app结果
      $scope.search_word = function() {
        var name = $scope.name;
        var country = $scope.country_selected;
        get_word_search_results(name,country);
      }


      $scope.select_country = function(country) {
        $scope.country_selected = country;

        get_word_search_results($scope.name,country);
      }

      //获得关键词的title搜索结果
      function get_word_search_results(name,country)
      {
        $scope.app_search_show_wait = true;
        $scope.word_search_results  = {};
        word.get_word_inter_search_results().query({"n":name,"cc":country.code},function(data) {
          $location.path("word_search_inter/" + name + "/" + country.code);
          $scope.word_search_results = data;
          if ( data.length == 0 ) //如果没有搜索结果
           {
            $scope.message = "没有相关结果";
          }
          $scope.app_search_show_wait = false;
        });
      }
    })


//关键词趋势控制器
  .controller('word_rank_trend_controller', function($scope, $sce, $filter, $routeParams, $localStorage, $location, app,user_app_keyword, word)
  {
    //接收参数，获得关键词
    $scope.name = $routeParams.name;

    document.title = "关键词「" + $scope.name + "」热度趋势_AppBK.com";

    var options = {};

    options.showDropdowns = true;
    options.maxDate = moment().format("YYYY-MM-DD");
    options.ranges = {
      '近30天': [moment().subtract(30, 'days'), moment()],
      '近三个月': [moment().subtract(3,"month"),moment()],
      '近半年': [moment().subtract(6,"month")]//修改时间
    };

    options.locale = {
      format: 'YYYY-MM-DD',//YYYY年MM月DD日
      separator: ' ~ ' ,
      applyLabel: '完成',
      cancelLabel: '取消',
      fromLabel: '开始',
      toLabel: '结束',
      customRangeLabel: '自定义',
      daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      firstDay: 1
    };
    options.startDate = moment().subtract(30, 'days');
    options.endDate = moment();
    options.linkedCalendars = false;

    $scope.start_date = options.startDate.format("YYYY-MM-DD");
    $scope.end_date = options.endDate.format("YYYY-MM-DD");

    $('#config-demo').daterangepicker(options, function(start, end, label){
      $scope.start_date = start.format('YYYY-MM-DD');
      $scope.end_date = end.format('YYYY-MM-DD');
      get_word_rank_trend($scope.name,"",$scope.start_date, $scope.end_date);

    });
    get_word_rank_trend($scope.name,"",$scope.start_date, $scope.end_date);


    $scope.search = function (name) {
      $scope.name = name;

      $location.path("word_rank_trend/" + $scope.name);

      //如果都填写了才有效
      get_word_rank_trend($scope.name,"", $scope.start_date, $scope.end_date);

    }

    function get_word_rank_trend(name,limit,start,end) {
      word.get_word_rank_trend().get({"n": name,"limit":limit,"start":start,"end":end}, function (data) {
        $('#trend').highcharts(data);
        $('#trend').append('<div class="highcharts-logo"></div>');
      })
    }

  })


  //app的关键词对比服务
  //关键词控制器
  .controller('app_content_keyword_compare_controller', function($scope,$localStorage,$location,$routeParams,app,user_app_keyword,word,uiGridConstants) {

    var compete_app_id = $routeParams.compete_app_id;

    //接收参数
    var app_id = $routeParams.app_id;
    document.title = "关键词对比_AppBK.com";

    $scope.loading_show = true;
    app.get_app_info().get({"app_id":app_id},function(data){
      $scope.app_info = data;
      document.title = $scope.app_info.name+"_关键词对比_AppBK.com";
      $localStorage.app_content_app_info = data;
    });

    app.get_app_info().get({"app_id": compete_app_id}, function(date){
      $scope.compete_app_info = date;
      $scope.loading_show = false;
    })


    $scope.word_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      enableGridMenu: false,//menu
      exporterOlderExcelCompatibility: true,
      enableHorizontalScrollbar:"never",
      exporterCsvFilename: 'appbk.csv',
    };

    var columm_config =  [
      {field: 'num', displayName: '序号',type:'number',width:'10%', cellTemplate: '<div class="ui-grid-cell-contents table-middle-style">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
      {field: 'query', displayName: '关键词',type:'string',width:'20%',cellTemplate:"<div class='ui-grid-cell-contents '><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'20%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents table-middle-style'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'my_app_pos', displayName: "左边APP排名",width:'25%', type:'number'},
      {field: 'pos', displayName: "竞品APP排名",width:'25%', type:'number'},
    ];
    $scope.word_grid.columnDefs = columm_config;

    $scope.word_grid.onRegisterApi = function(word_grid_api) {
      //set gridApi on scope
      $scope.word_grid_api = word_grid_api;
    }
    $scope.export_excel = function() {
      $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
    }

    word.get_app_words_compare().query({"app_id": app_id, "compete_app_id": compete_app_id}, function (data) {
      //插入新数据
      $scope.word_grid.data = data;

    });

  })


  //用户登录控制器
  .controller("index_login_controller", function($scope ,$window, $localStorage,$location, user)
  {
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //登录
    $scope.login = function()
    {
      if (typeof($scope.email) == "undefined"){
        $scope.alert = { type: 'danger', msg:  '邮箱不能为空' };
        return;
      }else if (!filter.test($scope.email)){
        $scope.alert = { type: 'danger', msg:  '邮箱格式错误' };
        return;
      }else if(typeof($scope.password) == "undefined"){
        $scope.alert = { type: 'danger', msg:  '密码不能为空' };
        return;
      }

      email = $scope.email;
      password = $scope.password;

      user.check_user_login_input().get({"email":email,"password":password}, function(data)
      {
        if (data.status>=0) {
          //保持cookie
          $localStorage.token = data.token;
          $localStorage.email = email;
          $localStorage.expire = data.expire; //本地存储过期时间，过期后必须重新登录
          $localStorage.$save();

          $window.history.back();
          location.reload();
          //$window.history.popState();
          //window.location = 'index.html'; //revise by maris
        }
        else
        {
          //展示错误页面,密码错误，或者服务到期等。
          $scope.alert = { type: 'danger', msg:  data.message };

        }
      });
    }
  })

//用户注册控制器
  .controller('index_register_controller',function($scope, $localStorage,user)
  {

    var requesting = false;
    $scope.submit_enable = false;

    $scope.get_check_stat = function() {

      var checked =  $('#checkbox').get(0).checked;
      $scope.submit_enable = !checked;

    }

    $scope.register_user = function()
    {
      email = $scope.email;
      password = $scope.password;
      password_check = $scope.password_check;
      //判断两个输入是否一致
      if ( password != password_check)
      {
        $scope.message = "两次输入的密码不一致，请检查后重新输入";
        return -1;
      }
      else
      {
        $scope.message = "";
      }

      if ($scope.submit_enable) {
        $scope.message = "请同意并阅读《APPBK网站服务协议》";

        return -1;
      }


      //从服务器端获取注册信息是否正确的信息
      user.check_user_register_input().get({"email":email,"password":password}, function(data)
      {
        if (data.status>=0) {
          $scope.message = "";

          //防止用户连续点击 重复发送请求
          if (requesting) {
            return;
          }
          requesting = true;

          //注册
          user.reg_user().get({"email":email,"password":password}, function(data)
          {
            requesting = false;

            //保持cookie
            $localStorage.token = data.token;
            $localStorage.email = email;
            $localStorage.$save();
            //跳转到用户app页面
            window.location = 'index.html';
          });
        }
        else
        {
          //展示错误页面
          $scope.message = data.message;
        }
      });
    }
  })

//password_find_controller
  .controller('password_find_controller',function($scope, $location,user)
  {
    $scope.find_password = function(){

      if (typeof($scope.email) == 'undefined' || $scope.email.length <=0){
        $scope.alert = { type: 'danger', msg:  '邮箱不能为空' };
        return;
      }

      user.find_pwd().get({"email":$scope.email}, function(data)
      {
        if (data.status == 0){
          $location.path("password_sendemail_success");

        }else if (data.status == -1){
          $scope.alert = { type: 'danger', msg:  '邮件账号不存在' };

        }else {
          $scope.alert = { type: 'danger', msg:  '发送失败，请重新提交' };

        }
      })
    }
  })

  .controller('update_password_controller', function($scope,$routeParams,$location,$timeout,user){
    var token = $routeParams.token;

    $scope.updatePassword = function(){

      if ( typeof($scope.password) == 'undefined' || $scope.password.length <= 0){
        $scope.alert = { type: 'danger', msg:  '密码不能为空' };

      } else if ( typeof($scope.password_check) == 'undefined' || $scope.password_check.length <= 0){
        $scope.alert = { type: 'danger', msg:  '确认密码不能为空' };

      } else if ($scope.password_check != $scope.password){
        $scope.alert = { type: 'danger', msg:  '密码不一致' };

      }else {
        var pwd = md5($scope.password);
        user.update_pwd().get({"code":token,"pwd":pwd}, function(data){
          if (data.status == 0){
            $scope.alert = { type: 'success', msg:  '修改成功,请重新登录' };
            $timeout(function(){
              $location.path("index_login");
            },2000);

          }else if(data.status == 1){
            $scope.alert = { type: 'danger', msg:  '找回码不正确或过期' };

          } else {
            $scope.alert = { type: 'danger', msg:  '修改失败，请重新提交' };

          }
        })
      }
    }
  })

  .controller('password_sendemail_success_controller', function($scope){

  })

  //aso检测控制器
  .controller('app_tools_aso_controller', function($scope,app_tools) {
    document.title = "ASO检测_AppBK.com";
    //表格基础配置
    $scope.word_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter: false,
      minRowsToShow: 20//展示的数据行数
    };
    $scope.$watch('window.innerWidth', function() {
      var columm_config ;
      if (window.innerWidth >= 768) {
        columm_config = [
          {field: 'word', displayName: '关键词', type: 'string', width: '15%', enableSorting: false},
          {
            field: 'aso_index', displayName: "推荐度", type: 'number', width: '15%', headerTooltip: "推荐度 ：主要反映关键词可能带来曝光度，越高越好",
            width: 150,
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'rank', displayName: '搜索热度', type: 'number', width: '15%',
            headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率",
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'aso_compete', displayName: "竞争程度", type: 'number', width: '15%',
            headerTooltip: "竞争程度：主要反映使用该关键词的app实力",
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'num', displayName: "结果数", width: '8%', type: 'number'},
          {field: 'name', displayName: "第1名APP", type: 'string', width: '32%', enableSorting: false,
            cellTemplate: "<div class='ui-grid-cell-contents'><h5 title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</h5></div>"
          },
        ];
      } else {
        columm_config = [
          {field: 'word', displayName: '', type: 'string', width: '15%', enableSorting: false},
          {
            field: 'aso_index', displayName: "推荐度", type: 'number', width: '25%', headerTooltip: "推荐度 ：主要反映关键词可能带来曝光度，越高越好",
            //width: 150,
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'rank', displayName: '搜索热度', type: 'number', width: '25%',
            headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率",
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'aso_compete', displayName: "竞争度", type: 'number', width: '20%',
            headerTooltip: "竞争程度：主要反映使用该关键词的app实力",
            cellTemplate: "<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"
          },
          {field: 'num', displayName: "结果", width: '15%', type: 'number'},
        ];
      }
      $scope.word_grid.columnDefs = columm_config;
    })


    $scope.word_grid_show = false;
    $scope.word_suggestion_show = false

      $scope.aso_check = function(n, words) {
      //加载数据，初始化
      app_tools.get_aso_check().get({"n":n,"words":words},function(data) {
        $scope.word_grid_show = true;

        $scope.word_grid.data = data.results;
        $scope.app_suggestion = data.suggestion;

        if (data.suggestion.length > 0){
          $scope.word_suggestion_show = true;
        }
      });
    }

    $scope.namelength = 0
    $scope.checkNameLength = function(name){
      var Zhlength=0;// 全角
      var Enlength=0;// 半角

      for(var i=0;i<name.length;i++){
        if(name.substring(i, i + 1).match(/[^\x00-\xff]/ig) != null)
          Zhlength+=1;
        else
          Enlength+=1;
      }
      // 返回当前字符串字节长度
      $scope.namelength = (Zhlength*3) + Enlength;
    }
  })

  //热词控制器
  .controller('app_tools_search_controller', function($scope, app_tools)
  {
    document.title = "App Store实时热搜词_AppBK.com";
    app_tools.get_appstore_hotwords().query(function(data) {
      $scope.words = data;
    });
  })

  //关键词分词控制器
  .controller('app_tools_seg_controller', function($scope,app_tools) {
    document.title = "分词_AppBK.com";
    $scope.get_word_segments = function(word) {
      app_tools.get_word_segments().get({"n":word},function(data) {
        $scope.word_segments = "分词结果：" + data.segments;
      });
    }
  })

  //app测试控制器
  .controller('app_tools_test_controller', function($scope,$localStorage, user, auth,testin)
  {
    document.title = "Testin App测试_AppBK.com";
    //登录testin
    $scope.get_testin_url = function() {
      //检测是否登录
      if(typeof($localStorage.email) == "undefined") {
        alert("请先点击右上角链接登录，然后才能直接使用testin服务");
      } else {
        testin.get_testin_url().get({"token":$localStorage.token},function(data)
        {
          var testin_url = data.url;
          //跳转url
          window.location = testin_url;
        });
      }
    }


  })

  //关键词组词
  .controller('app_tools_combine_controller', function($scope,$http,$routeParams, app_tools,app)
  {
    document.title = "关键词组词_AppBK.com";

    //接收参数，获得搜索结果
    var n = $routeParams.n;
    if (typeof(n)!= "undefined") //如果有参数
    {
      $scope.words = n;
    }
    //表格基础配置
    $scope.word_grid = {
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
    };

    var columm_config =  [
      {field: 'word_group', displayName: '可合并的关键词',type:'string',width:'50%',enableSorting: false},
      {field: 'word_combine', displayName: '组合后的关键词',type:'string',width:'50%',enableSorting: false},
    ];
    $scope.word_grid.columnDefs = columm_config;

    $scope.aso_get_combine_words = function(words) {
      get_combine_words(words);
      get_max_combine_words(words)
    }

    //获得基础组词结果
    function get_combine_words(words) {
      app_tools.get_combine_words().query({"n":words},function(data)
      {

        combine_word_list = [];
        combine_words = [];
        for (var i=0;i<data.length;i++)
        {
          var item = {};
          item["word_group"] = data[i]["combine_words"].join(",");
          item["word_combine"] = data[i]["combine_result"];
          combine_word_list[i] = item;
          combine_words[i] = item["word_combine"];
        }
        $scope.word_grid.data = combine_word_list;
        $scope.combine_words = combine_words.join(",");
      });
    }

    //获得最大限度的组词结果
    function get_max_combine_words(words)
    {
      app_tools.get_combine_words_nolimit().query({"n":words},function(data)
      {
        combine_words = [];
        for (var i=0;i<data.length;i++) {
          combine_words[i] = data[i]["combine_result"];
        }
        $scope.max_combine_words = combine_words.join(",");
      });
    }
  })

  .controller('app_tools_guance_controller', function($scope,$location,$localStorage,$routeParams,app,app_tools){

    document.title = " App一键检测_AppBK.com";

    $scope.loadingStyle = "";

    var app_id = $routeParams.appid;
    if (typeof(app_id)!= "undefined") //如果有参数
    {
      $scope.appname = $routeParams.name;
      $scope.app_id = $routeParams.appid;
      guance_select_app($scope.app_id,$scope.appname);
    }

    setProgressNum(0);
    $scope.loading_suggest_apps = true;
    var query;
    $scope.update = function() {

      if ($scope.appname.length > 1) {
        var appname = $scope.appname;
        appname = appname.replace(/\'/g, "");
        $scope.loading_suggest_apps = true;
        $scope.loadingStyle = "app-tools-check-input-loading-style";

        app.get_all_app_search_results().get({"n":appname, "start": 0, "limit": 10}, function(data) {
          $scope.loading_suggest_apps = false;
          $scope.app_search_results = data.results;
          $("#app-tools-check-input").focus();
          $scope.loadingStyle = "";

        });
      }
    }

    $scope.guance_app_search = function(){
      var name = $scope.appname;

      app.get_all_app_search_results().get({"n":name, "start": 0, "limit": 1}, function(data) {
        guance_select_app(data.results[0].app_id,data.results[0].name);
      });
    }

    function guance_select_app(app_id,appname) {
      $scope.get_app_guance_data_loading_show = true;
      $scope.appname = appname;

      $location.path("app_tools_check/" + app_id + "/" + appname);

      app_tools.get_app_check().get({"app_id":app_id}, function(data){
        $scope.get_app_guance_data_loading_show = false;

        $scope.app_guance_data = data;

        $scope.word_num_color_tag = Number(data.aso.word_num) >= Number(data.aso.avg_word_num);
        $scope.word_core_num_color_tag = Number(data.aso.word_core_num) >= Number(data.aso.avg_word_core_num);
        $scope.word_top10_num_color_tag = Number(data.aso.word_top10_num) >= Number(data.aso.avg_word_top10_num);
        $scope.word_top3_num_color_tag = Number(data.aso.word_top3_num) >= Number(data.aso.avg_word_top3_num);
        $scope.title_length_color_tag = Number(data.aso.title_length) >= Number(data.aso.avg_title_length);
        $scope.expose_score_color_tag = Number(data.aso.expose_score) >= Number(data.aso.avg_expose_score);

        $scope.recommend_num_color_tag = Number(data.recommend.recommend_num) >= Number(data.recommend.avg_recommend_num);
        $scope.recommend_score_color_tag = Number(data.recommend.recommend_score) >= Number(data.recommend.avg_recommend_score);

        $scope.size_color_tag = Number(data.base_info.size) <= Number(data.base_info.avg_size);
        $scope.update_freq_color_tag = Number(data.base_info.update_freq) <= Number(data.base_info.avg_update_freq);
        setProgressNum(data.final_score );

      })

    }

    $scope.guance_select_app = function(app_id,appname){
      guance_select_app(app_id,appname);
    }

   function setProgressNum(progress){
     $('#circle').circleProgress({
       value: progress * 0.01,
       startAngle: -Math.PI / 4 * 2,
       size:100,
       thickness: 13,
       reverse:true,
       lineCap:"round",
       emptyFill:"#F0F8FF",
       fill:{
         gradient: ["#3023AE", "#C86DD7"],
         gradientAngle: Math.PI
       }
     }).on('circle-animation-progress', function(event, progress, stepValue) {
       $(this).find('strong').text(String(stepValue.toFixed(1) * 100));
     });
   }
  })


  //关键词拓展
  .controller('keyword_extend_controller',function($scope,app_tools , $routeParams, $location, $localStorage)
  {
    document.title = "APP关键词扩展AppBK.com";

    if(typeof($localStorage.email) == "undefined") {
      $scope.user_login_show = false;
    } else {
      $scope.user_login_show = true;

    }

    $scope.keyword = $routeParams.keyword;

    if (typeof($scope.keyword) != "undefined"){
      get_word_expand($scope.keyword);
    }

    $scope.word_expand = {};

    $scope.keyword_extend_table_show = false;

    $scope.get_word_expand = function(n) {
      get_word_expand(n);
    }

    function get_word_expand(word){

      $location.path("keyword_extand/" + word);

      $scope.loading_show = true;
      app_tools.get_word_expand().query({"n":word},function(data)
      {
        $scope.loading_show = false;
        $scope.keyword_extend_table_show = true;

        $scope.word_expand = data;
      });
    }

  })


  //app榜单更新预测控制器

  .controller('app_tools_rank_equal_controller', function($scope,app,$routeParams,$location, app_tools){
    document.title = "榜单排名对应_AppBK.com";

    //获得一级类别信息
    app.get_categories().query({},function(data){

      for (var i =0; i<data.length ; i++){
        if (data[i].ori_classes == "总榜"){
          data.splice(0,1);
          $scope.categories =data;
          return;
        }
      }
      $scope.categories = data;

    })

    $scope.get_category_app_rank = function(category)
    {
      $scope.category_selected = category;
      getRankEqual();
    }

    //获得游戏二级类别信息
    $scope.game_categories = app.get_game_categories().query();

    //获得每个类型的app top 排行榜，只要30个，不翻页
    $scope.category_selected = "游戏";

    if (typeof($routeParams.type) != "undefined"){
      $scope.category_selected = $routeParams.type;
    }
    $scope.rank = Number($routeParams.rank);

    getRankEqual();

    function getRankEqual(){
      if ($scope.rank >= 1){
        $scope.loading_show = true;
        $location.path("app_tools_rank_equal/" + $scope.category_selected + "/" + $scope.rank);

        app.get_equal_all_category().get({"c":$scope.category_selected,"rank":$scope.rank},function(data){
          $scope.loading_show = false;
          $scope.equal_category = data;
        })
      }
    }

    $scope.getRankEqual = function(){
      getRankEqual();
    }

  })


//app榜单更新预测控制器
  .controller('app_tools_rank_update_controller', function($scope,$localStorage, user, auth,app_tools)
  {
    document.title = "App Store榜单更新预测_AppBK.com";

    get_app_rank_update(""); //默认为空，选择当天

    function get_app_rank_update(day) {
      $scope.loading_show = true;
      app_tools.get_app_rank_update().get({"day": day}, function (data) {
        $scope.loading_show = false;
        $('#trend').highcharts(data);
        $('#trend').append('<div class="highcharts-logo"></div>');
      })
    }



    //日期选择
    var cur_options = {};
    cur_options.maxDate = moment();
    cur_options.startDate = $scope.date_selected;
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
      $scope.date_selected = start.format('YYYY-MM-DD');
      get_app_rank_update($scope.date_selected);
    });

  })


  //app榜单搜索更新预测控制器
  .controller('app_tools_search_update_controller', function($scope,$localStorage,$routeParams,$location, $sce, user, auth,app_tools) {

    document.title = "App Store搜索更新预测_AppBK.com";


    $scope.date_selected = $routeParams.date;

    if (typeof($scope.date_selected) != "undefined"){

      get_app_search_update($scope.date_selected);
    }else {
      get_app_search_update(""); //默认为空，选择当天
    }


    function get_app_search_update(day) {
      if (typeof($scope.date_selected) != 'undefined'){
        $location.path("app_tools_search_update/" + $scope.date_selected);
      }
      $scope.loading_show = true;
      app_tools.get_app_search_update().get({"day": day}, function (data) {
        $scope.loading_show = false;
        $('#trend').highcharts(data);
        $('#trend').append('<div class="highcharts-logo"></div>');
      })
    }

    //日期选择
    var cur_options = {};
    cur_options.maxDate = moment();
    cur_options.startDate = $scope.date_selected;
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
      $scope.date_selected = start.format('YYYY-MM-DD');

      get_app_search_update($scope.date_selected);
    });
  })

  .controller('app_tools_word_cover_controller',function($scope,word , $routeParams, $location, $localStorage)
  {
    document.title = "搜索词覆盖_AppBK.com";
    var limit = 30; //每页的记录个数
    $scope.keyword = $routeParams.word;

    $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];

    if (typeof($scope.keyword) != "undefined"){
      get_word_cover($scope.keyword,1);
      $scope.search_result_show = false;
    }else {
      get_word_rank();
      $scope.search_result_show = true;
    }
    $scope.get_word_expand = function(n) {
      get_word_cover(n,1);
    }

    $scope.page2_cloud_words = [
      {text: "", weight: 13},

    ];




    //
    function get_word_rank(){
      $scope.word_cover_loading_show = true;
      $scope.search_result_show = true;

      word.get_word_cover_rank().get({"c": '总榜', "start": 0, "limit": 100}, function (data) {

        for (var i=0;i<data.results.length;i++) {
          //$scope.word_cover_grid.data.push(data.results[i]);
          for (var i=0;i<data.results.length;i++)
          {
            var item = {};
            item["text"] = data.results[i]["word"];
            item["weight"] = data.results[i]["cover_num"];
            item['link'] = '#/app_tools_word_cover/' + data.results[i]["word"];
            $scope.page2_cloud_words[i] = item;
          }
          $("#word_cover_cloud").jQCloud($scope.page2_cloud_words);

        }
        $scope.word_cover_loading_show = false;
      })
    }
    //搜索 获得热门关键词
    function get_word_cover(n,page)
    {
      if (typeof(n)== 'undefined' || n.length <=0){
        return;
      }
      $scope.search_result_show = false;

      $scope.current_word = n;
      $location.path("app_tools_word_cover/" + n);
      var start = limit * (page - 1);

      $scope.start = start;
      $scope.loading_show = true;

      word.get_word_cover().get({"n": n ,"start": start, "limit": limit}, function (data)  {
        if (start == 0) { //如果是首次调用
          $scope.word_grid.data = [] ;//清空数据
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
        //插入新数据
        for (var i=0;i<data.results.length;i++) {
          $scope.word_grid.data.push(data.results[i]);
        }
        $scope.loading_show = false;
      });
    }

    //搜索结果 关键词表格
    //使用ui gird
    //表格基础配置
    $scope.word_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      enableGridMenu: false,//menu
      exporterOlderExcelCompatibility: true,
      exporterCsvFilename: 'appbk.csv',
    };

    var columm_config;
    $scope.$watch('window.innerWidth', function() {
      if (window.innerWidth >= 768){
        columm_config  =  [
          {field: 'num', displayName: '  #',type:'number',enableSorting: false,width:'10%', cellTemplate: '<div class="ui-grid-cell-contents ">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
          {field: 'query', displayName: '搜索词',type:'string',enableSorting: false,width:'20%',cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
          {field: 'rank', displayName: '搜索热度', type:'number', width:'20%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><a href='#/word_rank_trend/{{row.entity.query}}'><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></a></h5></div>"},
          {field: 'name', displayName: "第1名APP", type:'string', width:'50%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='user_main.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'><span class='c2'>{{MODEL_COL_FIELD}}</span></a></div>"},
        ];
      }else {
        columm_config  =  [
          {field: 'num', displayName: '  #',type:'number',width:'25%', cellTemplate: '<div class="ui-grid-cell-contents ">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
          {field: 'query', displayName: '搜索词',type:'string',width:'35%',cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}/cn' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
          {field: 'rank', displayName: '搜索热度', type:'number', width:'40%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><a href='#/word_rank_trend/{{row.entity.query}}'><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></a></h5></div>"},
        ];
      }

      $scope.word_grid.columnDefs = columm_config;

    });

    //导出表格
    $scope.word_grid.onRegisterApi = function(word_grid_api) {
      //set gridApi on scope
      $scope.word_grid_api = word_grid_api;
    }

    //加载更多数据
    $scope.load_more = function(current_page)
    {
      $scope.current_page = current_page + 1;
      get_word_cover($scope.current_word,current_page+1);
      if ($scope.current_page >= $scope.max_page_num) {
        $scope.turn_page = false;
      }
      else {
        $scope.turn_page = true;
      }
    }
  })

//***************************************
//账号设置
//***************************************
  .controller('setting_account_controller', function($scope,$localStorage,user)
  {
    user.get_user_info().get({"email":$localStorage.email,"token":$localStorage.token},function(data){
      $scope.user_info_my = data;
      $scope.nickname = $scope.user_info_my.nickname;
      $scope.email = $scope.user_info_my.email;
      $scope.company = $scope.user_info_my.company;
      $scope.phone_num = $scope.user_info_my.phone_num;
      $scope.appname = $scope.user_info_my.app_name;
      $scope.qq_num = $scope.user_info_my.qq;
    });
    function get_user_info_finished(){

    }


    $scope.update_user_info = function(){
      var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (typeof($scope.email) == "undefined" || $scope.email.length <=0 ){

          $scope.alert = { type: 'danger', msg:  '邮箱不能为空' };

        }else if (!filter.test($scope.email)){
          $scope.alert = { type: 'danger', msg:  '邮箱格式错误' };

        }else if(typeof($scope.company) == "undefined" || $scope.company.length <=0 ){

          $scope.alert = { type: 'danger', msg:  '公司名称不能为空' };

        }else if (typeof($scope.appname) == "undefined" || $scope.appname.length <=0 ) {
          $scope.alert = {type: 'danger', msg: '应用名称不能为空'};
        }else if(typeof($scope.phone_num) == "undefined" || $scope.phone_num.length <=0 ){
          $scope.alert = {type: 'danger', msg: '手机不能为空'};
        }else if(typeof($scope.qq_num) == "undefined" || $scope.qq_num.length <=0 ){
          $scope.alert = {type: 'danger', msg: 'qq不能为空'};
        }else {
          user.update_user_info().get({"email":$localStorage.email,"token":$localStorage.token,"company":$scope.company,"app":$scope.appname,"phone":$scope.phone_num,"qq":$scope.qq_num}, function(data){
            if (data.status == 200) {
              $scope.alert = {type: 'success', msg: '修改成功'};
            }else {
              $scope.alert = {type: 'danger', msg: '修改失败，请重新提交'};

            }
          })
        }

    }


  })

  .controller('setting_vip_controller', function($scope,pay,$localStorage,$sce, user)
  {

    $scope.get_vip_info_loading = true;

    get_vip_info();

    function get_vip_info(){
      user.get_vip_info().get({"email":$localStorage.email,"token":$localStorage.token},function(data){
        $scope.user_vip_info = data;
        $scope.get_vip_info_loading = false;

      });

    }


    pay.get_product_price().get(function(data){
      $scope.product_price = data;
      $scope.price_selected = data[1];
      var date = moment().subtract(-data[1].num, 'month').format("YYYY-MM-DD");

      $scope.price_selected.end_date = date;
    })

    $scope.select_price = function(price){
      $scope.price_selected = price;
      var date = moment().subtract(-price.num, 'month').format("YYYY-MM-DD");
      $scope.price_selected.end_date = date;

    }

    $scope.commit_payment = function() {
      //提交订单
      pay.create_charge().get({"email":$localStorage.email,"token":$localStorage.token,"product":"7",num:$scope.price_selected.num},function(data){

        BC.click({
          "title": data.order.title,
          "amount": data.order.amount,
          "out_trade_no": data.order.out_trade_no, //唯一订单号
          "sign" : data.order.sign,
          "return_url":"http://appbk.com/payment_finish.html",
          //\%23
          "optional": {"test": "willreturn"}
        });


      })
    }

    $scope.commitVipCode = function() {

      if (typeof($localStorage.email) == "undefined") //如果没有登录
      {
        var type = 'danger';

        $scope.alert = { type: type, msg:  '请登陆' };
        return;
      }

        user.use_ticket().get({"email":$localStorage.email, "token":$localStorage.token, "code":$scope.vip_code},function(data){

        var type = 'danger';
        if (data.status == 0){
          var type = 'success';
          get_vip_info();

        }
        $scope.alert = { type: type, msg:  data.msg };

      })
    }
  })

  .controller('setting_integral_controller', function($scope)
  {


  })
    .controller('setting_wechat_controller', function($scope)
    {


    })
  .controller('setting_order_controller', function($scope,$localStorage,pay)
  {

    $scope.setting_order_show_wait = true;
    pay.get_charge_info().query({"email":$localStorage.email,"token":$localStorage.token},function(data){
      $scope.setting_order_show_wait = false;

      $scope.charge_info = data;

    })

  })

  .controller('setting_passwd_controller', function($scope)
    {
      $scope.update_user_paddword = function(){
        if (typeof($scope.oldPwd) == "undefined"){
          $scope.alert = { type: 'danger', msg:  '旧密码不能为空' };

        }else if(typeof($scope.password) == "undefined"){
          $scope.alert = { type: 'danger', msg:  '新密码不能为空' };

        }else if (typeof($scope.repassword) == "undefined"){
          $scope.alert = { type: 'danger', msg:  '确认密码不能为空' };

        }else if ($scope.repassword != $scope.password ){
          $scope.alert = { type: 'danger', msg:  '您输入的确认密码不匹配' };
        }else {
          $scope.alert = { type: 'success', msg:  '密码修改成功' };

        }
      }

    })

  .controller('payment_finish_controller', function($scope){

  })

