/**
 * Created by wang on 2015/6/7.
 */
angular.module('user_app')
//用户登录控制器
  .controller("login_controller", function($scope,$route,$templateCache, $localStorage,$location, user)
{
  //登录
  $scope.login = function()
  {
    email = $scope.email;
    password = $scope.password;

    user.check_user_login_input().get({"email":email,"password":password}, function(data)
    {
      if (data.status>=0) //如果正确
      {
        //保持cookie
        $localStorage.token = data.token;
        $localStorage.email = email;
        $localStorage.expire = data.expire; //本地存储过期时间，过期后必须重新登录
        $localStorage.$save();

        //跳转到用户app页面
        window.location = 'index.html';
      }
      else
      {
        //展示错误页面,密码错误，或者服务到期等。
        $scope.message = data.message;
      }
    });
  }
})

//用户注册控制器
  .controller('register_controller',function($scope, $localStorage,user)
{
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

    //从服务器端获取注册信息是否正确的信息
    user.check_user_register_input().get({"email":email,"password":password}, function(data)
    {
      if (data.status>=0) //如果正确
      {
        $scope.message = "";
        //注册
        user.reg_user().get({"email":email,"password":password}, function(data)
        {
          //保持cookie
          $localStorage.token = data.token;
          $localStorage.email = email;
          $localStorage.$save();
          //跳转到用户app页面
          window.location = 'user_main.html';
          //setTimeout("window.location = 'user_main.html'",1000);//延时1秒,否则写localstorate有问题
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
