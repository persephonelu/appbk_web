/**
 * Created by wang on 2015/6/8.
 */
angular.module('user_app')

  //用户关键词管理控制器
    .controller('user_app_keyword_manage_controller', function($scope, $routeParams, $localStorage,$timeout, user_app_keyword, user_app, app,Excel,uiGridConstants) {
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
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
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
        //cellTemplate:"<div class='ui-grid-cell-contents table_middle'><h5>{{MODEL_COL_FIELD}}</h5></div>"
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
          for (var i=0;i<data.length;i++)
          {
            if (data[i].pos==null)
            {
              data[i].pos=-1;
            }
          }
          $scope.final_word_grid.data = data;

          if (0 == data.length )
          {
            $scope.keyword_manage_user = {};
            $scope.keyword_manage_user.message = "暂无关键词,请添加关键词";
            $scope.final_word_grid_show = false;

          }
          else
          {
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
          for (var i=0;i<data.length;i++)
          {
            seed_word_list.push(data[i].word);
          }
          $scope.select_keywords = seed_word_list.join(",");
        });
      }

      //删除关键词数据,最终关键词页面
      $scope.del = function(word)
      {
        //删除页面
        del_word(word);
      }

      //添加关键词数据，最终关键词页面
      $scope.add = function(word)
      {
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
          for (var i=0;i<data.length;i++)
          {
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
        {field: 'word', displayName: '关键词',type:'string',width:'12%',enableSorting: true,cellTemplate:"<div class='ui-grid-cell-contents'><span  class='table_middle c2'><a target='_blank' href='index.html#/app_search/{{MODEL_COL_FIELD}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD}}</a></span></div>"},
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
        {field: 'name', displayName: "第1名APP", type:'string', width:'25%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><a target='_blank' href='index.html#/app_content/{{row.entity.app_id}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</a></div>"},
      ];

      //加载grid api，同时设置check选择函数
      $scope.expand_word_grid.onRegisterApi = function(expand_word_grid){
        //set gridApi on scope
        $scope.expand_word_grid = expand_word_grid;
        expand_word_grid.selection.on.rowSelectionChanged($scope,function(row){
          var word = row.entity.word;
          if (row.isSelected)
          {
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
      //var app_id = $localStorage.app_id;
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


      //var rowtpl='<div ng-class="{\'green\':true, \'blue\':row.entity.count==1 }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';



      //最终关键词
      //$scope.final_word_grid.onRegisterApi = function(final_word_grid_api){
      //  //set gridApi on scope
      //  $scope.final_grid_api = final_word_grid_api;
      //}
      //

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
          $location.path('user_app_keyword_manage');

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

        word = $scope.user_keywords_rank_and_pos[$index].word;
        user_app_keyword.get_app_keyword_trend().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id,"n":word}, function(data)
        {

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
          $scope.message = "尚未给该app添加关键词，请首先在关键词优化一栏添加";
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
        app.get_all_app_search_results().get({"email":$localStorage.email,"token":$localStorage.token,"n":word}, function(data)
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
