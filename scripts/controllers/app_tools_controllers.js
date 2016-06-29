/**
 * Created by wang on 2015/8/25.
 */
angular.module('rank')
  //主控制器
  .controller('app_tools_main_controller', function($scope,$localStorage, user, auth)
  {
    if(typeof($localStorage.email) == "undefined") //如果没有登录
    {
      $scope.user_login_show = false;
      $scope.user_not_login_show = true;
    }
    else//如果已经登录，获得登录信息
    {
      $scope.user_login_show = true;
      $scope.user_not_login_show = false;
      $scope.user_info = user.get_user_info().get({"email":$localStorage.email,"token":$localStorage.token});
    }

    //退出
    $scope.logout = function()
    {
      auth.logout();
    }
  })

  //aso检测控制器
  .controller('app_tools_aso_controller', function($scope,app_tools)
  {
    document.title = "ASO检测_AppBK.com";
      //表格基础配置
      $scope.word_grid = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 100,
        rowHeight: 35,
        enableRowHeaderSelection: true,
        showGridFooter:false,
        minRowsToShow:20//展示的数据行数
      };

    var columm_config =  [
      {field: 'word', displayName: '关键词',type:'string',width:'15%',enableSorting: false},
      {field: 'aso_index', displayName: "推荐度",type:'number',width:'15%',headerTooltip: "推荐度 ：主要反映关键词可能带来曝光度，越高越好", width:150, cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='success' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'15%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'aso_compete', displayName: "竞争程度", type:'number', width:'15%',headerTooltip: "竞争程度：主要反映使用该关键词的app实力", cellTemplate:"<div class='ui-grid-cell-contents'><h5><progressbar class='progress-striped table_middle' type='danger' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'num', displayName: "结果数",width:'8%', type:'number'},
      {field: 'name', displayName: "第1名APP", type:'string', width:'32%',enableSorting: false,cellTemplate:"<div class='ui-grid-cell-contents'><h5 title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:10}}</h5></div>"},
    ];
    $scope.word_grid.columnDefs = columm_config;

    $scope.word_grid_show = false;

    $scope.aso_check = function(n, words)
    {
      //加载数据，初始化
      app_tools.get_aso_check().query({"n":n,"words":words},function(data) {
        $scope.word_grid_show = true;

        $scope.word_grid.data = data;
      });
    }
  })

  //热词控制器
  .controller('app_tools_search_controller', function($scope, app_tools)
  {
      document.title = "热搜词_AppBK.com";
      app_tools.get_appstore_hotwords().query(function(data)
      {
        $scope.words = data;
      });
  })

  //关键词分词控制器
  .controller('app_tools_seg_controller', function($scope,app_tools)
  {
    document.title = "分词_AppBK.com";
    $scope.get_word_segments = function(word)
    {
      app_tools.get_word_segments().get({"n":word},function(data)
      {
        $scope.word_segments = "分词结果：" + data.segments;
      });
    }
  })

  //app测试控制器
  .controller('app_tools_test_controller', function($scope,$localStorage, user, auth,testin)
  {

    document.title = "Testin App测试";
    //登录testin
    $scope.get_testin_url = function()
    {
      //检测是否登录
      if(typeof($localStorage.email) == "undefined") //如果没有登录
      {
        alert("请先点击右上角链接登录，然后才能直接使用testin服务");
      }
      else
      {
        testin.get_testin_url().get({"token":$localStorage.token},function(data)
        {
          var testin_url = data.url;
          //跳转url
          window.location = testin_url;
          //window.open(testin_url);
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

    $scope.aso_get_combine_words = function(words)
    {
      get_combine_words(words);
      get_max_combine_words(words)
    }

    //获得基础组词结果
    function get_combine_words(words)
    {
      /*
      $http({method:'POST',data:{"word":words}, url : 'http://restp1.appbk.com:8080/combine_nolimit',headers:{
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }}).success(function(data)
      */
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
        for (var i=0;i<data.length;i++)
        {
          combine_words[i] = data[i]["combine_result"];
        }
        $scope.max_combine_words = combine_words.join(",");
      });
    }
  })


  //关键词拓展
    .controller('keyword_extend_controller',function($scope,app_tools , $localStorage)
    {

      document.title = "APP关键词扩展AppBK.com";

      if(typeof($localStorage.email) == "undefined") //如果没有登录
      {
        $scope.user_login_show = false;
      }else{
        $scope.user_login_show = true;

      }

        $scope.word_expand = {};

      $scope.keyword_extend_table_show = false;

      $scope.get_word_expand = function(n)
      {
        $scope.loading_show = true;
        app_tools.get_word_expand().query({"n":n},function(data)
        {
          $scope.loading_show = false;
          $scope.keyword_extend_table_show = true;

          $scope.word_expand = data;
        });
      }

    })

