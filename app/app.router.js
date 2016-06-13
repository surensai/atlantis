'use strict';
angular.module('app').run(['$rootScope', '$state', '$stateParams', '$location', '$cookieStore', '$http', '$localStorage', 'appService',
  function ($rootScope, $state, $stateParams, $location, $cookieStore, $http, $localStorage, appService) {

    window.addEventListener('load', function () {
      appService.handleOffline();
    });

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.base_url = "http://ec2-52-71-125-138.compute-1.amazonaws.com";
    $rootScope.globals = $cookieStore.get('globals') || {};

    if ($rootScope.globals && $rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      var loggedIn = $rootScope.globals && $rootScope.globals.currentUser;

      if($location.path().indexOf("reset-password") > -1){
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        delete $localStorage.token;
      }

      if (!loggedIn && $location.path().indexOf("account") > 0) {
        event.preventDefault();
        $state.go('login');
      }

      var afterLoginRestrictions = ['/login', '/register', '/forgot-password'];
      var loginRestrictions = $.inArray($location.path(), afterLoginRestrictions) !== -1;
      if (loginRestrictions && loggedIn) {
        $state.go('account.dashboard');
      }

      if (($location.path().indexOf("messages") === -1) && $rootScope.messages) {
        delete $rootScope.messages;
        $cookieStore.remove('noSesMes');
      }

      //disable back button for players module
      if (($location.path().indexOf("account/players") >= 0) && $state.current.name === "account.players.details" && !$rootScope.firstPlayerId) { //players.details
        $rootScope.firstPlayerId = newUrl;
        $rootScope.playerModuleURL = oldUrl;
      } else if ($rootScope.firstPlayerId === oldUrl && newUrl === $rootScope.playerModuleURL) {
        event.preventDefault();
      }
    });
  }
]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  function urlBuilder(viewFolderPath, viewPath) {
    return 'components/' + viewFolderPath + '/' + viewPath + '.view.html';
  }

  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('login', {
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
  }).state('reset-password', {
    url: '/reset-password/:token',
    templateUrl: urlBuilder('user/reset-password', 'reset-password'),
    controller: 'resetPasswordCtrl',
    controllerAs: "resetPassword",
    data: {
      pageTitle: 'Square Panda - Reset Password'
    },
    resolve: {
      auth: function (UserService, $stateParams, $rootScope) {
        return UserService.authorizeTokenAPI($rootScope.base_url, $stateParams.token);
      }
    }
  }).state('user-confirm-register', {
    url: '/user/confirmation/:token',
    templateUrl: urlBuilder('user/register', 'register.confirm-register'),
    controller: function ($scope, auth) {
      if (auth) {
        $scope.confirmRegister = auth.data;
      }
    },
    data: {
      pageTitle: 'Square Panda - Confirm Registration'
    },
    resolve: {
      auth: function (UserService, $stateParams) {
        return UserService.confirmRegistrationAPI($stateParams.token);
      }
    }
  }).state('forgot-password', {
    url: '/forgot-password',
    templateUrl: urlBuilder('user/forgot-password', 'forgot-password'),
    controller: 'forgotPasswordCtrl',
    controllerAs: "forgot",
    data: {
      pageTitle: 'Square Panda - Forgot password'
    }
  }).state('messages', {
    url: '/messages',
    templateUrl: "layout/messages.html",
    params: {data: null},
    controller: function ($cookieStore, $rootScope, $scope, $state, $stateParams, UserService, messagesFactory) {
      $rootScope.messages = $cookieStore.get('noSesMes');
      if (!$rootScope.messages) {
        $state.go("login");
      }
      //resend email
      $scope.onResendEmail = function () {
        var handleSuccess = function (data) {
          //sent mail - common for both
        };
        var handleError = function (error, status) {
          if (error && status) {
            messagesFactory.forgotErrorMessages(status);
          }
        };
        //Forget Password
        if ($rootScope.messages.type === "forgot") {
          UserService.forgotPasswordAPI($stateParams.data)
            .success(handleSuccess)
            .error(handleError);
        } else {
          //Register User - resend activation email
          UserService.resendActivationEmailAPI($stateParams.data)
            .success(handleSuccess)
            .error(handleError);
        }

      };
    },
    data: {
      pageTitle: 'Square Panda - Successfully Registered'
    }
  }).state('progress', {
    url: '/progress',
    templateUrl: "layout/underconstructionpage.html",
    data: {
      pageTitle: 'Square Panda - In Progress'
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
    }
  }).state('account.feeds', {
    url: '/dashboard/:id/feed',
    templateUrl: urlBuilder('account/dashboard', 'newsfeeds'),
    controller: 'dashboardCtrl',
    controllerAs: "dashboard",
    data: {
      pageTitle: 'Square Panda - Dashboard Feeds'
    }
  }).state('account.players', {
    url: '/players',
    templateUrl: urlBuilder('account/player', 'players'),
    controller: 'playerCtrl',
    controllerAs: "player",
    data: {
      pageTitle: 'Square Panda - Players'
    }
  }).state('account.addplayer', {
    url: '/player/add',
    templateUrl: urlBuilder('account/player', 'player-action'),
    controller: 'playerActionCtrl',
    controllerAs: "playerAction",
    data: {
      pageTitle: 'Square Panda - Add Player'
    }
  }).state('account.editPlayer', {
    url: '/player/:id/edit',
    templateUrl: urlBuilder('account/player', 'player-action'),
    controller: 'playerActionCtrl',
    controllerAs: "playerAction",
    data: {
      pageTitle: 'Square Panda - Edit Player'
    }
  }).state('account.curriculum', {
    url: '/curriculum',
    templateUrl: urlBuilder('account/curriculum', 'curriculum'),
    controller: 'curriculumCtrl',
    controllerAs: "curriculum",
    data: {
      pageTitle: 'Square Panda - Curriculum'
    }
  }).state('account.addCustomWord', {
    url: '/curriculum/addword',
    templateUrl: urlBuilder('account/curriculum', 'curriculum-action'),
    controller: 'curriculumActionCtrl',
    controllerAs: "curriculum",
    params: {'word': null},
    data: {
      pageTitle: 'Square Panda - Add Word'
    }
  }).state('account.editCustomWord', {
    url: '/curriculum/:id/editword',
    templateUrl: urlBuilder('account/curriculum', 'curriculum-action'),
    controller: 'curriculumActionCtrl',
    controllerAs: "curriculum",
    data: {
      pageTitle: 'Square Panda - Edit Word'
    }
  }).state('account.viewCustomWord', {
    url: '/curriculum/:id/viewword',
    cache: false,
    templateUrl: urlBuilder('account/curriculum', 'curriculum-action'),
    controller: 'curriculumActionCtrl',
    controllerAs: "curriculum",
    data: {
      pageTitle: 'Square Panda - view Word'
    }
  }).state('account.settings', {
    url: '/settings',
    templateUrl: urlBuilder('account/settings', 'settings'),
    controller: 'settingsCtrl',
    controllerAs: "settings",
    data: {
      pageTitle: 'Square Panda - Settings'
    }
  }).state('account.players.details', {
    url: '/details/:id',
    templateUrl: urlBuilder('account/player', 'player-info'),
    controller: 'playerCtrl',
    controllerAs: 'player',
    data: {
      pageTitle: 'Square Panda - Player Details'
    }
  }).state('page', {
    url: '/page',
    templateUrl: urlBuilder('static', 'page'),
    data: {
      pageTitle: 'Square Panda Inc.'
    }
  }).state('page.press', {
    url: '/press',
    templateUrl: urlBuilder('static', 'press'),
    controller: 'staticCtrl',
    controllerAs: "self",
    data: {
      pageTitle: 'Square Panda - Press'
    }
  }).state('page.warrentyinfo', {
    url: '/warrentyinfo',
    templateUrl: urlBuilder('static', 'warrentyinfo'),
    controller: 'staticCtrl',
    controllerAs: "self",
    data: {
      pageTitle: 'Square Panda - Warranty Information'
    }
  }).state('page.privacy-policy', {
    url: '/privacy-policy',
    templateUrl: urlBuilder('static', 'privacy-policy'),
    controller: 'staticCtrl',
    controllerAs: "self",
    data: {
      pageTitle: 'Square Panda - privacy-policy'
    }
  }).state('page.terms-services', {
    url: '/terms-services',
    templateUrl: urlBuilder('static', 'terms-services'),
    controller: 'staticCtrl',
    controllerAs: "self",
    data: {
      pageTitle: 'Square Panda - terms-services'
    }
  }).state('admin', {
    url: '/admin',
    templateUrl: "layout/account-nav.html",
    data: {
      pageTitle: 'Square Panda Inc.'
    }
  }).state('admin.firmware-update', {
    url: '/firmware-update',
    templateUrl: urlBuilder('admin/firmware-update', 'firmware'),
    controller: 'firmwareCtrl',
    controllerAs: "firmware",
    data: {
      pageTitle: 'Square Panda Inc.'
    }
  });

}]);
