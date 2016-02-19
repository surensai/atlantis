'use strict';
angular.module('app').run(['$rootScope', '$state', '$stateParams', '$location', '$cookieStore', '$http',
  function ($rootScope, $state, $stateParams, $location, $cookieStore, $http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.globals = $cookieStore.get('globals') || {};

    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function () {
      var loggedIn = $rootScope.globals.currentUser;
      if(!loggedIn && $location.path().indexOf("account") > 0){
        $state.go('login');
      }

      var afterLoginRestrictions = ['/login', '/register', '/forgot-password'];
      var loginRestrictions = $.inArray($location.path(), afterLoginRestrictions) !== -1;
      if (loginRestrictions && loggedIn) {
        $state.go('account.dashboard');
      }

      if(($location.path().indexOf("messages") === -1) && $rootScope.messages){
        delete $rootScope.messages;
        $cookieStore.remove('noSesMes');
      }
    });
  }
]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  function urlBuilder(viewFolderPath, viewPath) {
    return 'components/' + viewFolderPath + '/' + viewPath + '.view.html';
  }

  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: urlBuilder('home', 'home'),
    controller: 'homeCtrl',
    controllerAs: "home",
    data: {
      pageTitle: 'Square Panda Inc.'
    }
  }).state('login', {
    url: '/login',
    templateUrl: urlBuilder('user/login', 'login'),
    controller: 'loginCtrl',
    controllerAs: 'login',
    data: {
      pageTitle: 'Square Panda - Sign in'
    }
  }).state('register', {
    url: '/register',
    templateUrl: urlBuilder('user/register', 'register'),
    controller: 'registerCtrl',
    controllerAs: "register",
    data: {
      pageTitle: 'Square Panda - Register'
    }
  }).state('reset_password', {
    url: '/reset_password/:token',
    templateUrl: urlBuilder('user/reset_password', 'reset-password'),
    controller: 'resetPasswordCtrl',
    controllerAs: "resetPassword",
    data: {
      pageTitle: 'Square Panda - Reset Password'
    },
    resolve: {
      auth: function (UserService, $stateParams) {
        return UserService.authorizeTokenAPI($stateParams.token);
      }
    }
  }).state('forgot_password', {
    url: '/forgot_password',
    templateUrl: urlBuilder('user/forgot_password', 'forgot-password'),
    controller: 'forgotPasswordCtrl',
    controllerAs: "forgot",
    data: {
      pageTitle: 'Square Panda - Forgot password'
    }
  }).state('about', {
    url: '/about',
    templateUrl: urlBuilder('static', 'about'),
    controller: 'staticCtrl',
    controllerAs: "static",
    data: {
      pageTitle: 'Square Panda - About'
    }
  }).state('messages', {
    url: '/messages',
    templateUrl: "layout/messages.html",
    controller: function($cookieStore, $rootScope, $state){
      $rootScope.messages = $cookieStore.get('noSesMes');
      if(!$rootScope.messages){
        $state.go("login");
      }
    },
    data: {
      pageTitle: 'Square Panda - Successfully Registered'
    }
  }).state('account', {
    url: '/account',
    templateUrl: "layout/account-nav.html",
    data: {
      pageTitle: 'Square Panda - Account'
    }
  }).state('account.dashboard', {
    url: '/dashboard',
    templateUrl: urlBuilder('account/dashboard', 'dashboard'),
    controller: 'dashboardCtrl',
    controllerAs: "dashboard",
    data: {
      pageTitle: 'Square Panda - Dashboard'
    },
    resolve: {
      newsFeedData: function (DashboardService) {
        return DashboardService.getAllApi();
      }
    }
  }).state('account.subscriptions', {
    url: '/subscriptions',
    templateUrl: urlBuilder('account/subscriptions', 'subscriptions'),
    controller: 'subscriptionsCtrl',
    controllerAs: "subscription",
    data: {
      pageTitle: 'Square Panda - Dashboard'
    }
  }).state('account.players', {
    url: '/players',
    templateUrl: urlBuilder('account/player', 'players'),
    controller: 'playerCtrl',
    controllerAs: "player",
    data: {
      pageTitle: 'Square Panda - Players'
    },
    resolve: {
      playersListData: function (PlayerService) {
        return PlayerService.getAllApi();
      }
    }
  }).state('account.addplayer', {
    url: '/player/add',
    templateUrl: urlBuilder('account/player', 'player-add'),
    controller: 'playerCtrl',
    controllerAs: "player",
    data: {
      pageTitle: 'Square Panda - Add Player'
    },
    resolve: {
      playersListData: function (PlayerService) {
        return PlayerService.getAllApi();
      }
    }
  }).state('account.editPlayer', {
    url: '/player/:id/edit',
    templateUrl: urlBuilder('account/player', 'player-add'),
    controller: 'playerCtrl',
    controllerAs: "player",
    data: {
      pageTitle: 'Square Panda - Edit Player'
    },
    resolve: {
      playersListData: function (PlayerService) {
        return PlayerService.getAllApi();
      }
    }
  }).state('account.curriculum', {
    url: '/curriculum',
    templateUrl: urlBuilder('account/curriculum', 'curriculum'),
    controller: 'curriculumCtrl',
    controllerAs: "curriculum",
    data: {
      pageTitle: 'Square Panda - Curriculum'
    }
  }).state('account.settings', {
    url: '/settings',
    templateUrl: urlBuilder('account/settings', 'settings'),
    data: {
      pageTitle: 'Square Panda - Settings'
    }
  }).state('account.edit_profile', {
    url: '/edit',
    templateUrl: urlBuilder('account/edit-profile', 'edit-profile'),
    controller: 'editProfileCtrl',
    controllerAs: "editProfile",
    data: {
      pageTitle: 'Square Panda - Edit Profile'
    }
  }).state('account.change_password', {
    url: '/change_password',
    templateUrl: urlBuilder('account/change-password', 'change-password'),
    controller: 'changePasswordCtrl',
    controllerAs: "changePassword",
    data: {
      pageTitle: 'Square Panda - Change Password'
    }
  });

}]);
