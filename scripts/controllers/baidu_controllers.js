/**
 * Created by wang on 2015/8/21.
 */
angular.module('baidu')

  //百度广告主页面控制器
  .controller('baidu_controller', function($scope,$localStorage, $location,$routeParams,baidu_ad)
  {
    var login_token = $location.path().replace("/","");

    baidu_ad.get_user().get({"token": login_token}, function (data) {
      //写入cookie
      $localStorage.token = login_token;
      $localStorage.email = data.email;
      $localStorage.$save();
      $scope.user_info = data;
    });

  })

  //百度广告sem控制器
  .controller('baidu_sem_controller', function($scope,$localStorage, $routeParams,app,baidu_ad)
  {

    //获得用户当前app信息，一个用户目前只有为一个app
    baidu_ad.get_user_app().get({"email":$localStorage.email,"token":$localStorage.token},function(data)
    {
      if (data.length < 1 )
      {
        $scope.message = "暂未添加用户app";
      }
      else
      {
        $scope.app_info = data;
        $localStorage.app_id = data.app_id;//存储用户app_id
      }
    });

    //点击添加用app
    $scope.add_user_app = function(app_id)
    {
      $localStorage.app_id = app_id;
      baidu_ad.add_user_app().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":app_id},function(data)
      {
        //刷新页面
        $scope.app_info = baidu_ad.get_user_app().get({"email":$localStorage.email,"token":$localStorage.token});
      });
    }

    //搜索app
    $scope.search_app = function(query)
    {
      //获得搜索结果数据
      app.get_app_search_results().get({"email":$localStorage.email,"token":$localStorage.token,"n":query},function(data)
      {
        $scope.app_search_results = data.results;
        if ( data.results.length == 0 ) //如果没有搜索结果
        {
          $scope.message = "没有相关结果,可尝试直接搜索你的app id";
        }
      });
    }

    //点击种子词tab
    $scope.select_seed_keywords_tab = function()
    {
      //展示种子词
      get_user_seed_words();
    }

    $scope.update_user_seed_keywords = function(seed_keywords)
    {
      add_user_word(seed_keywords);
    }

    //添加用户种子词
    function add_user_word(n)
    {
      baidu_ad.add_user_word().get({"email":$localStorage.email,"token":$localStorage.token,"app_id":$localStorage.app_id,"type":0,"n":n},function(data)
      {
        get_user_seed_words();//刷新页面
      });
    }

    //获得用户种子词，绑定到$user
    function get_user_seed_words()
    {
      baidu_ad.get_user_words().query({"email":$localStorage.email,"token":$localStorage.token,"app_id":$localStorage.app_id,"type":0},function(data)
      {
          var seed_word_list = new Array();
          for (var i=0;i<data.length;i++)
          {
            seed_word_list.push(data[i].word);
          }
         $scope.seed_keywords = seed_word_list.join(",");
      });

    }
  })

  //百度广告效果跟踪控制器
  .controller('baidu_roi_controller', function($scope,$localStorage, user, auth)
  {

  })

  //百度登录控制器,如果初次使用，绑定appbk账号。否则，自动登录
  .controller('baidu_login_controller', function($scope,$localStorage, $routeParams,baidu_ad)
  {

  })


