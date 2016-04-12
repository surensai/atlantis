'use strict';

angular.module("app").controller('settingsCtrl', ['$rootScope', 'UserService', 'AuthenticationService', 'messagesFactory', '$timeout', 'settingsService', function ($rootScope, UserService, AuthenticationService, messagesFactory, $timeout, settingsService) {
  var settings = this;
  settings.model = {};
  settings.model.userData = angular.copy($rootScope.globals.currentUser);
  settings.isEditClicked = false;
  settings.editprofile = false;
  settings.notification = false;
  settings.missingLetters = [];
  settings.selectedMisLetters = [];


  (function () {
    getNotificationData();
    getMissingLetters();
  })();

  settings.submitForm = function (form) {
    settings.submitted = true;
    settings.editprofile = true;
    $rootScope.globals.flash = "";
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
    $rootScope.globals.flash = "";
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
    $rootScope.globals.flash = "";
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
      if(data.length > 0) {
        var letterGroups = _.groupBy(data, function(item) {
          return [item.letter].sort();
        });

        var keys = [];

        for (var k in letterGroups) {
          if (letterGroups.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
          k = keys[i];
          settings.missingLetters.push(letterGroups[k]);
        }
        settings.missingLetters_row_2 = settings.missingLetters.splice(0,13);
      }
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.selectmissinglettesErrorMessages(status);
      }
    };
    settingsService.getMissingCharactersApi()
      .success(handleSuccess)
      .error(handleError);
  }

  settings.updateMissingLetters = function () {
    var handleSuccess = function (data) {
      messagesFactory.updateMissingLettersSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.updateMissingLettersErrorMessages(status);
      }
    };

    addSelectedLetterIds(settings.missingLetters_row_2, 'add');
    addSelectedLetterIds(settings.missingLetters, 'add');

    settingsService.updateMissingCharactersApi({"character": settings.selectedMisLetters})
      .success(handleSuccess)
      .error(handleError);
  };

  settings.selectCharacter = function (rowInd, letterInd, type) {
    if(type === 1){
      if (settings.missingLetters_row_2[rowInd][letterInd].missingCharacter) {
        settings.missingLetters_row_2[rowInd][letterInd].missingCharacter = false;
      } else {
        settings.missingLetters_row_2[rowInd][letterInd].missingCharacter = true;
      }
    } else {
      if (settings.missingLetters[rowInd][letterInd].missingCharacter) {
        settings.missingLetters[rowInd][letterInd].missingCharacter = false;
      } else {
        settings.missingLetters[rowInd][letterInd].missingCharacter = true;
      }
    }

  };

  settings.isMissilingLetterSelected = function (rowInd, letterInd, type) {
    if(type === 1){
      if (settings.missingLetters_row_2[rowInd][letterInd].missingCharacter) {
        return true;
      }
    } else {
      if (settings.missingLetters[rowInd][letterInd].missingCharacter) {
        return true;
      }
    }
  };

  settings.clearAllAlphabets = function () {
    addSelectedLetterIds(settings.missingLetters, 'clear');
    addSelectedLetterIds(settings.missingLetters_row_2, 'clear');
  };

  settings.isLetterVowel = function (char) {
    var vowels = "AEIOU";
    if(vowels.indexOf(char) !== -1){
      return true;
    }
  };

  function addSelectedLetterIds(arr, type){
    for(var i=0; arr.length > i; i++){
      for(var ii = 0; arr[i].length > ii; ii++ ) {
        if(type === 'add'){
          if(arr[i][ii].missingCharacter){
            settings.selectedMisLetters.push(arr[i][ii].id);
          }
        } else {
          arr[i][ii].missingCharacter = false;
        }

      }
    }
  }



}]);
