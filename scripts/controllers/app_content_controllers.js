/**
 * Created by maris on 2015/10/21.
 * app内容控制器
 */


angular.module('rank')

  .controller('grid_header_with_tip_controller', function($scope,$routeParams){
    $scope.title = $routeParams.title;
    $scope.tips = $routeParams.tips;

  })
  .controller('grid_header_with_tip_controller',function($scope){
  })

  //app的关键词对比服务
  //关键词控制器
  .controller('app_content_keyword_compare_controller', function($scope,$localStorage,$routeParams,app,user_app_keyword,word,uiGridConstants) {

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

      //$scope.compete_app_info = app.get_app_info().get({"app_id": compete_app_id});

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
      {field: 'query', displayName: '关键词',type:'string',width:'20%',cellTemplate:"<div class='ui-grid-cell-contents '><a target='_blank' href='#/app_search/{{MODEL_COL_FIELD}}' title='{{MODEL_COL_FIELD}}'>{{MODEL_COL_FIELD|limitTo:8}}</a></div>"},
      {field: 'rank', displayName: '搜索热度', type:'number', width:'20%',headerTooltip: "搜索热度：主要反映用户每天搜索该词的频率", cellTemplate:"<div class='ui-grid-cell-contents table-middle-style'><h5><progressbar class='progress-striped table_middle' type='warning'  max='10000' value='MODEL_COL_FIELD'>{{MODEL_COL_FIELD}}</progressbar></h5></div>"},
      {field: 'my_app_pos', displayName: "左边APP排名",width:'25%', type:'number'},
      {field: 'pos', displayName: "竞品APP排名",width:'25%', type:'number'},
    ];
    $scope.word_grid.columnDefs = columm_config;

      $scope.word_grid.onRegisterApi = function(word_grid_api) {
        //set gridApi on scope
        $scope.word_grid_api = word_grid_api;
      }
      $scope.export_excel = function()
      {
        $scope.word_grid_api.exporter.csvExport("all","all"); //导出全部
      }



      word.get_app_words_compare().query({"app_id": app_id, "compete_app_id": compete_app_id}, function (data) {
      //插入新数据
      $scope.word_grid.data = data;

    });

  })

