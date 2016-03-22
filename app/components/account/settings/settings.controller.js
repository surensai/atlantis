'use strict';

angular.module("app").controller('settingsCtrl', ['$rootScope', 'UserService', 'AuthenticationService', 'messagesFactory', '$timeout', 'settingsService', '$state',function ($rootScope, UserService, AuthenticationService, messagesFactory, $timeout, settingsService, $state) {
  var settings = this;
  settings.model = {};
  settings.model.userData = angular.copy($rootScope.globals.currentUser);
  settings.isEditClicked = false;
  settings.editprofile = false;
  settings.notification = false;
  settings.selectedMissingLetters = [];

  (function () {
    getNotificationData();
    getMissingLetters();
  })();

  settings.submitForm = function (form) {
    settings.submitted = true;
    settings.editprofile = true;
    $rootScope.globals.flash="";
    if (form.$valid) {
      saveProfile();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function saveProfile() {

    var handleSuccess = function (data) {
      settings.isEditClicked = false;
      AuthenticationService.SetCredentials(settings.model.userData);
      messagesFactory.settingseditprofileSuccessMessages(data);

    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingseditprofileErrorMessages(status);
      }
    };
    UserService.Update(settings.model.userData)
      .success(handleSuccess)
      .error(handleError);
  }

  settings.edit = function () {
    settings.model.userData = angular.copy($rootScope.globals.currentUser);
    settings.isEditClicked = true;
  };

  settings.cancel = function () {
    settings.model.userData = $rootScope.globals.currentUser;
    settings.isEditClicked = false;
  };

  settings.submitchangepassword = function (form) {
    settings.submitted = true;
    $rootScope.globals.flash="";
    if (form.$valid && (settings.model.passwordData.password === settings.model.passwordData.confirmPassword)) {
      changePassword();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function changePassword() {
    var handleSuccess = function (data) {

      messagesFactory.settingschangepasswordSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingschangepasswordErrorMessages(status);
      }
    };
   UserService.changePasswordAPI(settings.model.passwordData)
      .success(handleSuccess)
      .error(handleError);
  }


  settings.submitNotifications = function () {
    settings.notification = true;
    $rootScope.globals.flash="";
    var handleSuccess = function (data) {
      messagesFactory.settingsNotificationsSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingsNotificationsErrorMessages(status);
      }
    };
    settingsService.updateApi(settings.model.notificationObj)
      .success(handleSuccess)
      .error(handleError);
  };

  function getNotificationData() {
    var handleSuccess = function (data) {
      settings.model.notificationObj = data;
    };
    var handleError = function (error, status) {
      if (error && status) {
        // Add messages
      }
    };
    settingsService.getApi()
      .success(handleSuccess)
      .error(handleError);
  }

  function getMissingLetters() {
    var handleSuccess = function (data) {
      settings.selectedMissingLetters = data.list;
      if(data.list.length === 0){
        for(var i= 0; i < settings.getAlphabets().length; i++){
          settings.selectedMissingLetters[i] = "";
        }
      }
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.selectMissinglettesErrorMessages(status);
      }
    };
    settingsService.getMissingCharactersApi()
      .success(handleSuccess)
      .error(handleError);
  }

  settings.updateMissingLetters = function() {
    var handleSuccess = function (data) {
      settings.selectedMissingLetters = data.character;
      messagesFactory.UpadteMissinglettesSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.UpadteMissinglettesErrorMessages(status);
      }
    };
    settingsService.updateMissingCharactersApi({ "character" : settings.selectedMissingLetters })
      .success(handleSuccess)
      .error(handleError);
  };

  settings.getAlphabets = function(){
    return "AABBCCDDEEEFFGGHHIIJKLLMMNNOOPPQRRSSSTTUUVXYZ".split('');
  };

  settings.selectCharacter = function(char, index){
    if(settings.selectedMissingLetters[index] === ""){
      settings.selectedMissingLetters[index] = char;
    } else {
      settings.selectedMissingLetters[index] = "";
    }
  };

  settings.isMissilingLetterSelected = function(char, index){
    if(settings.selectedMissingLetters[index] !== ""){
      return true;
    }

  };

  settings.clearAllAlphabets = function(){
    settings.selectedMissingLetters = [];
  };


}]);
