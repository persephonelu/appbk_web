
angular
  .module('wechat_app',
  ['appbk_services',
    'ngCookies',
    'ngResource',
    'angular-jqcloud',
])
  //user_app控制页
  .controller('wechat_controller', function($scope,$location, app, word)
  {



    var app_id = $location.absUrl().split("=")[1];
    var web_url = $location.absUrl();//当前url

    var limit = 5;//每一页结果个数

    $scope.app_send_word_show = false;
    $scope.get_app_best_rank_show = false;

    $scope.page2_cloud_words = [
      {text: "", weight: 13},

    ];

    $scope.page3_cloud_words = [
      {text: "", weight: 13},
    ];


    $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];

    $scope.update = function() {
      $scope.words.splice(-5);
    };


    //查找app
    $scope.search_app = function()
    {
      var name = $scope.name;
      get_all_app_search_results(name,1);

      //获得关键词热度
      word.get_word_hot_rank().get({"n":name},function(data)
      {
        $scope.word_rank = data.rank;
      });
    }

    function get_all_app_search_results(name,page)
    {
      $scope.app_search_show_wait = true;
      $scope.word_search_results  = {};

      var start = 30 * (page - 1);
      $scope.start = start;

      //获得搜索结果，全部的搜索结果

      app.get_all_app_search_results().get({"n":name,"start": start, "limit": limit}, function(data)
      {
        //results结果处理，部分app可能没有下载
        for (var index in data.results)
        {
          if ( data.results[index].name == null) //如果json对应的字段为null
          {
            data.results[index].name = "appstore链接(详细信息后台下载中)"
          }
          data.results[index].download_url = "https://itunes.apple.com/cn/app/id" + data.results[index].app_id;
        }

        $scope.app_search_results = data.results;

        if (start == 0) { //如果是首次调用
          //翻页构造
          $scope.total_items = data.num; //总数据数
          $scope.items_per_page = limit; //每页的记录数
          $scope.current_page = 1;//设置当前页
        }


        if ( data.results.length == 0 ) //如果没有搜索结果,用app名搜索
        {
          //get_app_search_results(name);
          app_search(name);
        }
        $scope.app_search_show_wait = false;
      });

    }

    //默认 app信息
    get_app_info();

    function get_app_info()
    {
      app.get_app_info().get({"app_id":app_id},function(data)
      {
        $scope.app_info = data;

        document.title = "Appstore 2015 :" + data.name;

        var imgUrl = data.icon;  // 分享后展示的一张图片
        var lineLink = web_url; // 点击分享后跳转的页面地址
        var descContent = data.name + "-AppStore 2015" ;  // 分享后的描述信息
        var shareTitle = data.name + "-AppStore 2015";  // 分享后的标题
        //var appid = '';  // 应用id,如果有可以填，没有就留空

        //获得微信配置,并开始执行
        app.get_wexin_config().get({"web_url":encodeURIComponent(web_url)},function(data)
        {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage',
              'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          wx.ready(function () {
            // 在这里调用 API

            wx.onMenuShareTimeline({
              title: shareTitle, // 分享标题
              link: lineLink, // 分享链接
              imgUrl: imgUrl, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });

            wx.onMenuShareAppMessage({
              title: shareTitle, // 分享标题
              desc: descContent, // 分享描述
              link: lineLink, // 分享链接
              imgUrl: imgUrl, // 分享图标
             // type: '', // 分享类型,music、video或link，不填默认为link
              //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });

          });
        });

      });


      //App年度最好排名 第一页
      app.get_app_best_rank().get({"app_id":app_id},function(data){

        $scope.fetch_date = data.fetch_date;
        $scope.type = data.type;
        $scope.ori_classes = data.ori_classes;
        $scope.rank_type = data.rank_type;
        $scope.rank = data.rank;


        $scope.get_app_best_rank_show = true;

      });

      //获得App的热门搜索词 第二页
      app.wechat_get_app_top_word().query({"app_id":app_id},function(data){
        $scope.app_top_words = data;

        //console.log("wechat_get_app_top_word"+app_id+data);

        //重新拼接 word cloud 数组
        for (var i=0;i<data.length;i++)
        {
          var item = {};
          item["text"] = data[i]["query"];
          item["weight"] = data[i]["pos"];
          $scope.page2_cloud_words[i] = item;
          //page2_cloud_words.push(item);
        }
      });


      //获得App的热门用户标签 第三页
      app.wechat_get_app_top_tag().query({"app_id":app_id},function(data)
      {
        //console.log("get_app_top_tag"+data);
        //$scope.top_tags = data;
        for (var i=0;i<data.length;i++)
        {
          var item = {};
          item["text"] = data[i]["topic"];
          item["weight"] = data[i]["num"];
          $scope.page3_cloud_words[i] = item;
          //page2_cloud_words.push(item);
        }
      });
      //获得App新年寄语 第四页
      app.get_app_send_word().get({"app_id":app_id},function(data)
      {
        //console.log("get_app_send_word ");
        $scope.ori_classes = data.ori_classes;
        $scope.exceed_app_percent = data.exceed_app_percent;
        $scope.send_word = data.send_word;
        $scope.app_send_word_show = true;

        if ( data.length == 0 ) //如果没有搜索结果
        {
          $scope.message = "没有相关结果,可尝试直接搜索你的app id";
        }
      });

    }
  })
