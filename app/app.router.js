'use strict';
angular.module('app').run(['$rootScope', '$state', '$stateParams', '$location', '$cookieStore', '$http', '$localStorage', 'appService', '$timeout',
  function ($rootScope, $state, $stateParams, $location, $cookieStore, $http, $localStorage, appService, $timeout) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // You can set up the dev / prod
    $rootScope.base_url = appService.setEnvironment('prod');
    $rootScope.globals = $cookieStore.get('globals') || {};

    if ($rootScope.globals && $rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      var isSessionExist = appService.checkSessionOnURLChange();
      var currentUrl = $location.path();
      // force user to be on Dashborad if terms & condition flag is true
      if ((currentUrl.indexOf("dashboard") < 0 && currentUrl.indexOf("account") >= 0 && $rootScope.globals.currentUser) && ($rootScope.globals.currentUser.terms || $rootScope.globals.currentUser.privacy)) {
        $timeout(function () {
          $state.go('account.dashboard');
        }, 10);
        event.preventDefault();
        return;
      }

      if (isSessionExist && appService.onSessionRedirections(currentUrl)) {
        $state.go('account.dashboard');
      } else if (!isSessionExist && ((currentUrl.indexOf("account") > 0) || !currentUrl)) {
        event.preventDefault();
        $state.go('login');
      } else if (isSessionExist && (currentUrl.indexOf("reset-password") > -1)) {
        appService.removeSession();
      } else if ((currentUrl.indexOf("messages") === -1) && $rootScope.messages) {
        delete $rootScope.messages;
        $cookieStore.remove('noSesMes');
      }

      if (currentUrl.indexOf("account/players") >= 0 && oldUrl.indexOf("account/players") === -1) {
        var urlSplit = oldUrl.split('#');
        $cookieStore.put('skipURLPlayers', urlSplit[1]);
      } else if (((currentUrl.indexOf("account/players") >= 0) && (currentUrl.indexOf("account/players/details") === -1)) && oldUrl.indexOf("account/players/details") >= 0) {
        $location.path($cookieStore.get('skipURLPlayers'));
      }
    });
  }
]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  function urlBuilder(viewFolderPath, viewPath) {
    return 'components/' + viewFolderPath + '/' + viewPath + '.view.html';
  }

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
        var handleSuccess = function () {
          //sent mail - common for both
        };
        var handleError = function (error, status) {
          if (error && status) {
            messagesFactory.forgotErrorMessages(status);
          }
          if ($rootScope.messages.type === 'register' && status === 405) {
            $rootScope.messages.isMailActivated = true;
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
  });

}]);
