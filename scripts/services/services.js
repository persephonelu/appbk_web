/**
 * @ngdoc service
 * @name appbkApp.services
 * @description
 * # services
 * Service in the appbkApp.
 */
var test = false; //true,测试系统；false，正式系统，注意上线时调整
if (test)
{
  var base_url = "http://git.appbk.com/"; //测试系统
  //var base_url = "http://appbk.aliapp.com/";
}
else
{
  var base_url = "http://rest.appbk.com/"; //正式系统
  //var base_url = "http://appbk.aliapp.com/";
}

angular.module('appbk_services',[])

//app相关的服务
    .factory('app', function($resource) {
      return {

        //＊＊＊＊＊＊＊＊＊＊＊＊＊wechat 相关＊＊＊＊＊＊＊＊＊＊＊＊＊
        get_app_best_rank:function(){ //App年度最好排名
          return $resource(base_url + 'app_promote/get_app_best_rank?app_id=:app_id');//get
        },

        wechat_get_app_top_word:function(){ //获得App的热门搜索词
          return $resource(base_url + 'app_promote/get_app_top_word?app_id=:app_id');//query
        },

        wechat_get_app_top_tag:function(){ //获得App新年寄语
          return $resource(base_url + 'app_promote/get_app_top_tag?app_id=:app_id');//query
        },

        get_app_send_word:function(){ //获得App新年寄语
          return $resource(base_url + 'app_promote/get_app_send_word?app_id=:app_id');//get
        },

        get_wexin_config:function(){ //获得微信配置
          return $resource(base_url + 'app_promote/get_wexin_config?web_url=:web_url');//get
        },

        //＊＊＊＊＊＊＊＊＊＊＊＊＊end wechat 相关＊＊＊＊＊＊＊＊＊＊＊＊＊


        get_app_info:function(){ //获得app基本信息
          return $resource(base_url + 'app/get_app_info?app_id=:app_id');//get
        },

        get_categories:function(){ //获得app的一级类别
          return $resource(base_url + 'app/get_categories');//query
        },

        get_game_categories:function(){ //获得游戏二级类别
          return $resource(base_url + 'app/get_game_categories');//query
        },

        get_app_search_results:function(){ //获得app搜索结果
          return $resource(base_url + 'app/get_app_search_results?n=:n');//get
        },

        get_app_rank:function(){ //获得app排行榜
          return $resource(base_url + 'app/get_app_rank?rank_type=:rank_type&c=:c&start=:start&limit=:limit'); //get
        },


        get_app_rank_up:function(){ //获得app排行榜
          return $resource(base_url + 'app/get_app_rank_up?rank_type=:rank_type&c=:c&start=:start&limit=:limit'); //get
        },

        get_app_rank_down:function(){ //获得app排行榜
          return $resource(base_url + 'app/get_app_rank_down?rank_type=:rank_type&c=:c&start=:start&limit=:limit'); //get
        },

        get_offline_app:function(){
          return $resource(base_url + 'app/get_offline_app?start=:start&limit=:limit&date=:date'); //get
        },

        get_relase_app:function(){
          return $resource(base_url + 'app/get_relase_app?c=:c&date=:date&start=:start&limit=:limit'); //get
        },

        get_app_rank_trend:function(){ //获得app排名变化趋势
          return $resource(base_url + 'app/get_app_rank_trend?app_id=:app_id&limit=:limit&start=:start&end=:end&rank_type=:rank_type'); //get
        },

        get_app_rank_hourly_trend:function(){ //获得app 24小时内排名变化趋势
          return $resource(base_url + 'app/get_app_rank_hourly_trend?app_id=:app_id'); //get
        },

        get_app_relate_apps:function(){ //获得系统推荐的相关app
          return $resource(base_url + 'app/get_app_relate_apps?app_id=:app_id'); //get
        },

        get_app_user_also_buy_apps:function(){ //获得一个app用户同时购买的app
          return $resource(base_url + 'app/get_app_user_also_buy_apps?app_id=:app_id'); //query
        },

        get_app_refer_apps:function(){ //获得一个app的来源App
          return $resource(base_url + 'app/get_app_refer_apps?app_id=:app_id'); //query
        },

        get_api_app_search_results:function(){ //获得app搜索结果,直接通过api抓取
          return $resource(base_url + 'app/get_api_app_search_results?n=:n');//get
        },

        get_all_app_search_results:function(){ //获得通过web抓取的全量搜索结果
          return $resource(base_url + 'app/get_all_app_search_results?n=:n&start=:start&limit=:limit&cc=:cc');//get
        },

        app_search:function(){ //实时在线搜索结果
          return $resource('http://47.88.28.30:8080/app_search?n=:n');//get
        },

        get_app_predict:function(){ //获得一个app的预测信息
          return $resource(base_url + 'app/get_app_predict?app_id=:app_id');//get
        },

        get_app_search_pos:function(){ //获得一个app的预测信息
          return $resource(base_url + 'app/get_app_search_pos?app_id=:app_id&n=:n');//get
        },

        get_app_best_rank:function() {
          return $resource(base_url + 'app/get_app_best_rank?app_id=:app_id');
        },


        get_equal_all_category:function(){//获得苹果最新的热搜词 (首页 搜索框下面)
          return $resource(base_url + 'app/get_equal_all_category?c=:c&rank=:rank');
        },


        //get_app_user_also_buy_apps:function() {
        //  return $resource(base_url + 'app/get_app_user_also_buy_apps?app_id=:app_id');
        //}
      };
    })

//关键词基础信息服务
    .factory('word', function($resource) {
      return {
        get_word_rank:function(){ //获得某个类别下的关键词排行榜
          return $resource(base_url + 'word/get_word_rank?c=:c&start=:start&limit=:limit');//get，可翻页
        },
        get_word_rank_inter:function(){
          //country 属性暂时没用到 现在只有泰国一个国家的数据
          return $resource(base_url + 'app_inter/get_word_rank?c=:c&start=:start&limit=:limit');//get，可翻页
        },

        get_word_search_results:function(){ //获得搜索关键词的结果，目前暂时调用suggestion接口
          return $resource(base_url + 'word/get_word_search_results?n=:n');//query
        },

        get_word_inter_search_results:function(){ //获得搜索关键词的结果，目前暂时调用suggestion接口, 增加国家参数
          return $resource(base_url + 'word/get_word_search_results?n=:n&cc=:cc');//query
        },


        get_word_hot_rank:function(){ //获得某个类别下的关键词排行榜
          return $resource(base_url + 'word/get_word_hot_rank?n=:n&cc=:cc');//get
        },

        get_word_rank_trend:function(){ //获得某个关键词的热度趋势
          return $resource(base_url + 'word/get_word_rank_trend?n=:n&limit=:limit&start=:start&end=:end');//get
        },

        get_app_words_compare:function(){ //获得某个关键词的热度趋势
          return $resource(base_url + 'word/get_app_words_compare?app_id=:app_id&compete_app_id=:compete_app_id');//query
        },

        get_word_suggetion:function(){ //获得某个关键词的suggestion
          return $resource(base_url + 'word/get_word_suggetion?n=:n&cc=:cc');//query
        },
        get_word_cover_rank:function(){
          return $resource(base_url + 'word/get_word_cover_rank?c=:c');

        },
        get_word_cover:function(){
          return $resource(base_url + 'word/get_word_cover?n=:n');

        },
      };
    })

  //app评论相关服务
    .factory('app_comment', function($resource) {
      return {
        get_app_comments:function(){ //获得某个类别下的关键词排行榜
          return $resource(base_url + 'app_comment/get_app_comments?app_id=:app_id&start=:start&limit=:limit');//get，可翻页
        },
        get_app_comment_trend:function(){ //获得某个类别下的关键词排行榜
          return $resource(base_url + 'app_comment/get_app_comment_trend?app_id=:app_id&limit=:limit&start_date=:start_date&end_date=:end_date');//get，highchart图
        },
        get_app_comment_stat:function(){ //获得某个类别下的关键词排行榜
          return $resource(base_url + 'app_comment/get_app_comment_stat?app_id=:app_id');//get
        },
      };
    })

//app微博相关的
    .factory('app_weibo', function($resource) {
      return {
        get_tag_rank:function(){ //获得每个类别下的微博用户标签排行榜，暂时不支持翻页，最多30个结果
          return $resource(base_url + 'app_weibo/get_tag_rank?c=:c');//query
        },

        get_app_user_tags:function(){ //获得某个app的用户标签
          return $resource(base_url + 'app_weibo/get_app_user_tags?app_id=:app_id&email=:email&token=:token');//query
        },

        get_app_user_gender:function(){ //获得某个app的用户性别分布
          return $resource(base_url + 'app_weibo/get_app_user_gender?app_id=:app_id&email=:email&token=:token');//query
        },

        get_app_user_area:function(){ //获得某个app的用户地域分布
          return $resource(base_url + 'app_weibo/get_app_user_area?app_id=:app_id&email=:email&token=:token');//query
        },

        get_app_user_time:function(){ //获得某个app的用户上网时段分布
          return $resource(base_url + 'app_weibo/get_app_user_time?app_id=:app_id&email=:email&token=:token');//query
        },

      };
    })

//用户登陆和基本信息相关的
    .factory('user', function($resource) {
      return {
        check_user_register_input:function(){ //检测用户输入的email是否已经存在
          return $resource(base_url + 'user/check_user_register_input?email=:email');//get
        },

        reg_user:function(){ //用户注册
          return $resource(base_url + 'user/reg_user?email=:email&password=:password');//get
        },

        check_user_login_input:function(){ //用户登陆检测，如果正确，服务返回一个token，错误，会返回错误信息
          return $resource(base_url + 'user/check_user_login_input?email=:email&password=:password');//get
        },

        get_user_info:function(){ //获得用户基本信息，需要token
          return $resource(base_url + 'user/get_user_info?email=:email&token=:token');//get
        },

        update_user_info:function(){
          return $resource(base_url + 'user/update_user_info?email=:email&token=:token&company=:company&app=:app&phone=:phone&qq=:qq');//get
        },

        find_pwd:function(){
          return $resource(base_url + 'user/find_pwd?email=:email');//get
        },
        update_pwd:function(){
          return $resource(base_url + 'user/update_pwd?code=:code&pwd=:pwd');//get
        },
        get_vip_info:function(){
          return $resource(base_url + 'user/get_vip_info?email=:email&token=:token');

        },

        use_ticket:function(){
          return $resource(base_url + 'user/use_ticket?email=:email&token=:token&code=:code');
        }
      };
    })

//用户app管理相关的, 包括竞品管理
    .factory('user_app', function($resource) {
      return {
        get_user_apps:function(){ //获得用的app列表，需要token
          return $resource(base_url + 'user_app/get_user_apps?email=:email&token=:token');//get
        },

        add_user_app:function(){ //通过appid添加用户app，需要token
          return $resource(base_url + 'user_app/add_user_app?email=:email&app_id=:app_id&token=:token');//get
        },

        del_user_app:function(){ //通过app_id删除用户app，需要token
          return $resource(base_url + 'user_app/del_user_app?email=:email&app_id=:app_id&token=:token');//get
        },

        add_user_new_app:function(){ //加未提交市场的app，需要token
          return $resource(base_url + 'user_app/add_user_new_app?email=:email&n=:n&c=:c&d=:d&token=:token');//get
        },

        get_user_app_competes:function(){ //获得app的竞品app列表，需要token
          return $resource(base_url + 'user_app/get_user_app_competes?email=:email&app_id=:app_id&token=:token');//query
        },

        add_user_app_compete:function(){ //添加用户app的竞品，需要token
          return $resource(base_url + 'user_app/add_user_app_compete?email=:email&app_id=:app_id&compete_app_id=:compete_app_id&token=:token');//get
        },

        del_user_app_compete:function(){ //删除用户app的竞品，需要token
          return $resource(base_url + 'user_app/del_user_app_compete?email=:email&app_id=:app_id&compete_app_id=:compete_app_id&token=:token');//get
        },

        get_user_app_recommend_competes:function(){ //获得用户推荐的竞品，需要token
          return $resource(base_url + 'user_app/get_user_app_recommend_competes?email=:email&app_id=:app_id&token=:token');//query
        },


      };
    })

//用户app关键词管理
    .factory('user_app_keyword', function($resource,$localStorage) {
      return {
        /*********************************用户关键词管理部分*********************************/
        get_user_app_keywords:function(){ //获得用户某个app，用户填写的关键词列表，需要token
          return $resource(base_url + 'user_app_keyword/get_user_app_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        get_user_app_keywords_no_feature:function(){ //获得用户某个app，用户填写的关键词列表，不包括具体的特征, 速度较快， 需要token
          return $resource(base_url + 'user_app_keyword/get_user_app_keywords_no_feature?email=:email&app_id=:app_id&token=:token');//query
        },

        add_user_app_keyword:function(){ //增加用户某个app的关键词，需要token
          return $resource(base_url + 'user_app_keyword/add_user_app_keyword?email=:email&app_id=:app_id&n=:n&token=:token');//get
        },

        del_user_app_keyword:function(){ //删除用户某个app的关键词词，需要token
          return $resource(base_url + 'user_app_keyword/del_user_app_keyword?email=:email&app_id=:app_id&n=:n&token=:token');//get
        },

        /*********************************用户关键词拓展部分*********************************/

        get_user_app_seed_keywords:function(){ //获得用户的种子词, 需要token
          return $resource(base_url + 'user_app_keyword/get_user_app_seed_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        get_user_app_seed_keywords_feature:function(){ //获得用户的种子关键词,包含对应特征的 需要token
          return $resource(base_url + 'user_app_keyword/get_user_app_seed_keywords_feature?email=:email&app_id=:app_id&token=:token');//query
        },

        update_user_app_seed_keywords:function(){ //更新用户的种子关键词列表, 需要token
          return $resource(base_url + 'user_app_keyword/update_user_app_seed_keywords?email=:email&app_id=:app_id&n=:n&token=:token');//get
        },

        get_user_app_expand_keywords:function(){ //获得用户某个app用户拓展关键词，需要token
          return $resource(base_url + 'user_app_keyword/get_user_app_expand_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        del_user_app_expand_keyword:function(){ //删除用户某个app拓展关键词，需要token
          return $resource(base_url + 'user_app_keyword/del_user_app_expand_keyword?email=:email&app_id=:app_id&n=:n&token=:token');//get
        },

        add_user_app_expand_keyword:function(){ //增加用户某个app的拓展关键词，需要token
          return $resource(base_url + 'user_app_keyword/add_user_app_expand_keyword?email=:email&app_id=:app_id&n=:n&token=:token');//get
        },

        merge_user_app_expand_keywords:function(){ //将拓展词合并到现在有关键词版本
          return $resource(base_url + 'user_app_keyword/merge_user_app_expand_keywords?email=:email&app_id=:app_id&token=:token');//get
        },

        //一些关键词拓展方法
        get_user_app_recommend_keywords:function(){ //拓展方法1，相关app使用的关键词
          return $resource(base_url + 'user_app_keyword/get_user_app_recommend_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        get_word_relate_keywords:function(){ //拓展方法2，语义扩展
          return $resource(base_url + 'user_app_keyword/get_word_relate_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        get_word_expand_keywords:function(){ //拓展方法3，词根拓展
          return $resource(base_url + 'user_app_keyword/get_word_expand_keywords?email=:email&app_id=:app_id&token=:token');//query
        },

        get_compete_apps_keywords:function(){ //拓展方法4，根据用户填写的竞品app拓展
          return $resource(base_url + 'user_app_keyword/get_compete_apps_keywords?email=:email&app_id=:app_id&token=:token');//query
        },


        /*********************************关键词监控部分********************************/

        get_app_keywords_rank_and_pos:function(){ //获得用app用户填写所有关键词每个的热度和搜索结果位置最新数据，需要token
          return $resource(base_url + 'user_app_keyword/get_app_keywords_rank_and_pos?email=:email&app_id=:app_id&token=:token');//query
        },


        get_app_keyword_trend:function(){ //获得一个app在一个关键词下的曝光度趋势图，需要token
          return $resource(base_url + 'user_app_keyword/get_app_keyword_trend?n=:n&app_id=:app_id&token=:token&start=:start&end=:end');//get
        },

        get_app_keywords_trend:function(){ //获得一个app用户填写所有关键词总曝光度的趋势图，需要token
          return $resource(base_url + 'user_app_keyword/get_app_keywords_trend?email=:email&app_id=:app_id&token=:token');//get
        },

        /*********************************工具，后续把用户的和公共的分开********************************/
        get_app_possible_keywords:function(){ //获得app的可能的关键词，需要token
          return $resource(base_url + 'user_app_keyword/get_app_possible_keywords?email=:email&app_id=:app_id&token=:token&start=:start&limit=:limit');//get
        },

        get_app_word_two_date_compare:function(){//app的最新关键词覆盖，和之前关键词覆盖的比较情况 当前排名是否上升
          if(typeof($localStorage.email) == "undefined") //如果没有登录
          {
            return $resource(base_url + 'word/get_app_word_two_date_compare?email=:email&app_id=:app_id&token=:token&start=:start&limit=:limit&simple=:simple&cur_date=:cur_date&pre_date=:pre_date');//get
          }else{
            return $resource(base_url + 'user_app_keyword/get_app_possible_and_watch_keywords?email=:email&app_id=:app_id&token=:token&start=:start&limit=:limit&simple=:simple');//get
          }
        },

        get_app_expose_trend:function(){ //获得app的曝光度趋势图(所有覆盖的关键词,30天内)
          return $resource(base_url + 'user_app_keyword/get_app_expose_trend?app_id=:app_id');//get
        },


        add_user_watch_keyword:function(){
          return $resource(base_url + 'user_app_keyword/add_user_watch_keyword?email=:email&token=:token&n=:n&app_id=:app_id');
        },

        del_user_watch_keyword:function(){
          return $resource(base_url + 'user_app_keyword/del_user_watch_keyword?email=:email&token=:token&n=:n&app_id=:app_id');
        },

        /* 人工选词功能 */
        replace_all_user_app_keyword:function(){
          return $resource(base_url + 'user_app_keyword/replace_all_user_app_keyword?email=:email&token=:token&n=:n&app_id=:app_id&n=:n');

        },
      };
    })

  //testin服务
    .factory('testin', function($resource) {
      return {
        get_testin_url:function(){ //获得testin的登录链接
          return $resource(base_url + 'testin_api/get_testin_url?token=:token');//query
        },
      };
    })

  //app工具服务
    .factory('app_tools', function($resource) {
      return {
        get_word_segments:function(){ //获得某个词的分词结果
          return $resource(base_url + 'app_tools/get_word_segments?n=:n');//get
        },
        get_appstore_hotwords:function(){ //获得最近n天的热词
          return $resource(base_url + 'app_tools/get_appstore_hotwords');//query
        },
        get_aso_check:function(){ //获得最近n天的热词
          return $resource(base_url + 'app_tools/get_aso_check?n=:n&words=:words');//query
        },
        get_combine_words:function() { //获得关键词组词，n是多个词
          return $resource("http://restp1.appbk.com:8080/combine?word=:n");
        },

        get_combine_words_nolimit:function() { //获得关键词组词，n是多个词,最大限度组词
          return $resource("http://restp1.appbk.com:8080/combine_nolimit?word=:n");
        },
        get_word_expand:function() {
          return $resource(base_url + "app_tools/get_word_expand?n=:n");
        },

        get_appstore_hotwords_new:function(){//获得苹果最新的热搜词 (首页 搜索框下面)
          return $resource(base_url + 'app_tools/get_appstore_hotwords_new');
        },


        get_app_rank_update:function() { //app榜单更新预测控制器
          return $resource(base_url + 'app_tools/get_app_rank_update?day=:day');
        },

        get_app_check:function(){
          return $resource(base_url + 'app_tools/get_app_check?app_id=:app_id');

        },

        get_app_search_update:function() { //app搜索更新时间点预测
          return $resource(base_url + 'app_tools/get_app_search_update?day=:day');
        },


      };
    })

  //百度广告服务
    .factory('baidu_ad', function($resource) {
      return {
        get_user:function(){ //根据login token，获得用户信息
          return $resource(base_url + 'baidu_ad/get_user?token=:token');//query
        },
        get_user_app:function(){ //获得用户app
          return $resource(base_url + 'baidu_ad/get_user_app?email=:email&token=:token');//query
        },
        add_user_app:function(){ //添加用户app
          return $resource(base_url + 'baidu_ad/add_user_app?email=:email&token=:token&app_id=:app_id');//query
        },
        add_user_word:function(){ //添加用户关键词
          return $resource(base_url + 'baidu_ad/add_user_word?email=:email&token=:token&app_id=:app_id&n=:n&type=:type');//get
        },
        get_user_words:function(){ //获得用户app关键词
          return $resource(base_url + 'baidu_ad/get_user_words?email=:email&token=:token&app_id=:app_id&type=:type');//query
        },
      };
    })

  //portal监控服务
    .factory('app_portal', function($resource) {
      return {
        get_summary:function(){ //获得基础数据统计信息
          return $resource(base_url + 'app_portal/get_summary');//query
        },
        get_increase:function(){ //获得数据增长情况
          return $resource(base_url + 'app_portal/get_increase');//query
        },
        get_search_job_info:function(){ //获得数据增长情况
          return $resource(base_url + 'app_portal/get_search_job_info');//query
        },
      };
    })

  //用户aso刷榜相关服务
    .factory('user_aso', function($resource) {
      return {
        get_app_possible_keywords:function(){ //获得所有可能的关键词
          return $resource(base_url + 'user_aso/get_app_possible_keywords?email=:email&token=:token&app_id=:app_id');//get
        },
        add_aso_keyword:function(){ //添加aso词
          return $resource(base_url + 'user_aso/add_aso_keyword?email=:email&token=:token&app_id=:app_id&n=:n');//get
        },
        del_aso_keyword:function(){ //删除aso词
          return $resource(base_url + 'user_aso/del_aso_keyword?email=:email&token=:token&app_id=:app_id&n=:n');//get
        },
        get_aso_solution:function(){ //获得刷榜方案
          return $resource(base_url + 'user_aso/get_aso_solution?email=:email&token=:token&app_id=:app_id');//query
        },

        get_app_word_two_date_compare:function(){//app的最新关键词覆盖，和之前关键词覆盖的比较情况
          return $resource(base_url + 'word/get_app_word_two_date_compare?email=:email&app_id=:app_id&token=:token&start=:start&limit=:limit&simple=:simple&cur_date=:cur_date&pre_date:pre_date');//get
        },

        /*********************************关键词监控部分********************************/

        get_app_keywords_rank_and_pos:function(){ //获得用app用户填刷榜关键词每个的热度和搜索结果位置最新数据，需要token
          return $resource(base_url + 'user_aso/get_app_keywords_rank_and_pos?email=:email&app_id=:app_id&token=:token');//query
        },


        get_app_keyword_trend:function(){ //获得一个app在一个关键词下的曝光度趋势图，需要token
          return $resource(base_url + 'user_aso/get_app_keyword_trend?n=:n&app_id=:app_id&token=:token');//get
        },

        get_app_keywords_trend:function(){ //获得一个app用户填写所有刷榜关键词总曝光度的趋势图，需要token
          return $resource(base_url + 'user_aso/get_app_keywords_trend?email=:email&app_id=:app_id&token=:token');//get
        },

        update_search_result:function(){ //更新一组词的搜索结果
          return $resource(base_url + 'user_aso/update_search_result?n=:n');//get
        },

      };
    })


//登录服务
    .factory("auth", function($cookies,$cookieStore, $location,$localStorage, user){
      return{
        login:function(email, password)//登录
        {
          //从服务器端获取登陆信息是否正确的信息
          user.check_user_login_input().get({"email":email,"password":password}, function(data)
          {
            if (data.status>=0) //如果正确
            {
              //保持cookie
              $localStorage.token = data.token;
              $localStorage.email = email;
              $localStorage.expire = data.expire; //本地存储过期时间，过期后必须重新登录
              //跳转到用户app页面
              //$state.go('tab.account', {});
            }
            else
            {
              //展示错误页面,密码错误，或者服务到期等。
              return data.message;
            }
          });
        },
        logout : function() //退出
        {
          //清除cookie
          delete $localStorage.token;
          delete $localStorage.email;
          delete $localStorage.app_id;
          delete $localStorage.expire;
          $localStorage.$save();
          window.location = 'index.html';
          //setTimeout("window.location = 'index.html'",1000);//跳转到首页
        },
        check : function() //检查登录状态和服务器权限
        {
          //需要登录的控制器
          var login_limit_controller = ["/user_app","/dashboard","/login"];
          //有级别限制的控制器
          var level_limit_controller = [];


          //检测是否已经登录
          //if(this.in_array($location.path(),login_limit_controller) && typeof($cookies.username) == "undefined")
          if(typeof($localStorage.email) == "undefined") //如果没有登录
          {
            //跳转到login页面
            window.location = 'index.html#/index_login';//跳转到登录页
            return false;
          }
          else
          {
            //如果已经登录，仍然需要坚持cookie的有效期是否过期
            var cur_time = new Date();
            cur_linux_time = cur_time.getTime();//当前的linux时间
            expire_linux_time = Date.parse($localStorage.expire);
            if ( (expire_linux_time-cur_linux_time) < 0 ) //如果已经过期
            {
              //跳转到login页面
              window.location = 'index.html#/index_login';//跳转到登录页
              return false;
            }
            else
            {
              return true;
            }
          }

        },
        in_array : function(needle, haystack)
        {
          var key = '';
          for(key in haystack)
          {
            if(haystack[key] == needle)
            {
              return true;
            }
          }
          return false;
        }
      }
    })


//导出到excel
    .factory('Excel',function($window){
      var uri='data:application/vnd.ms-excel;base64,',
          template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
          base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
          format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
      return {
        tableToExcel:function(tableId,worksheetName){
          var table=$(tableId),
              ctx={worksheet:worksheetName,table:table.html()},
              href=uri+base64(format(template,ctx));
          return href;
        }
      };
    })


  //用户支付购买相关服务
    .factory('pay', function($resource) {
      return {
        get_charge:function(){ //获得支付凭据
          return $resource(base_url + 'pay/test?app_id=:app_id');//get
        },


        get_product_price:function(){//获取产品价格
          return $resource(base_url + 'pay/get_product_price?product=7');//get  产品编号，对应用户级别，目前只能=7
        },

        create_charge:function() {//创建订单
          return $resource(base_url + 'pay/create_charge?email=:email&token=:token&product=:product&num=:num');//get  产品编号，对应用户级别，目前只能=7
        },

        get_charge_info:function(){
          return $resource(base_url + 'pay/get_charge_info?email=:email&token=:token');//get  产品编号，对应用户级别，目前只能=7

        },



      };
    })


  //用户支付购买相关服务
    .factory('vip', function($resource) {
      return {

        check_job:function(){
          return $resource(base_url + 'vip/check_job?email=:email&token=:token&app_id=:app_id');//get  产品编号，对应用户级别，目前只能=7

        },
        submit_job:function(){
          return $resource(base_url + 'vip/submit_job?email=:email&token=:token&app_id=:app_id&note=:note');//get  产品编号，对应用户级别，目前只能=7

        },
        update_wish_add_and_del_word:function(){
          return $resource(base_url + 'vip/submit_job?email=:email&token=:token&app_id=:app_id&add_word=:add_word&del_word=:del_word');//get  产品编号，对应用户级别，目前只能=7

        }

      };
    })

