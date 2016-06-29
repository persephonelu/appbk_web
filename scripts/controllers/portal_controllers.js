/**
 * Created by maris on 2015/12/12.
 */
angular.module('portal')
  //基础数据控制器
  .controller('base_data_controller', function($scope,$localStorage,app_portal)
  {
    //表格基础配置
    $scope.data_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20//展示的数据行数
    };

    var columm_config =  [
      {field: 'name', displayName: '数据表',type:'string',enableSorting: false},
      {field: 'num', displayName: "结果量", type:'number'},
    ];
    $scope.data_grid.columnDefs = columm_config;

    //加载数据，初始化
    app_portal.get_summary().query({},function(data) {
      $scope.data_grid.data = data;
    });


    //数据增长表
    //表格基础配置
    $scope.data_increase_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20//展示的数据行数
    };

    var columm_config =  [
      {field: 'name', displayName: '数据表',type:'string',enableSorting: false},
      {field: 'day_increase', displayName: "昨日同比", type:'number',cellTemplate:"<span ng-class='selected'>{{MODEL_COL_FIELD*100|limitTo:4}}%</span>"},
      {field: 'week_increase', displayName: "上周同比", type:'number'},
    ];
    $scope.data_increase_grid.columnDefs = columm_config;

    //加载数据，初始化
    app_portal.get_increase().query({},function(data) {
      $scope.data_increase_grid.data = data;
    });


  })

  //job数据控制器
  .controller('job_data_controller', function($scope,$localStorage,app_portal)
  {
    //表格基础配置
    $scope.data_grid = {
      enableRowSelection: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 100,
      rowHeight: 35,
      enableRowHeaderSelection: true,
      showGridFooter:false,
      minRowsToShow:20//展示的数据行数
    };

    var columm_config =  [
      {field: 'start', displayName: "开始时间", type:'string'},
      {field: 'end', displayName: "结束时间", type:'string'},
      {field: 'num', displayName: "入库数据量", type:'number'},
    ];
    $scope.data_grid.columnDefs = columm_config;

    //加载数据，初始化
    app_portal.get_search_job_info().query({},function(data) {
      $scope.data_grid.data = data;
    });

  })


  //搜索数据控制器
  .controller('search_data_controller', function($scope,$localStorage,app_portal)
  {

  })


