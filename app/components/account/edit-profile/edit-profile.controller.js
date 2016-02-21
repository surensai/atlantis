'use strict';

angular.module("app").controller('editProfileCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', '$rootScope', 'AuthenticationService', 'messagesFactory', function ($scope, UserService, $state, $timeout, flashService, $rootScope, AuthenticationService, messagesFactory) {

  var editProfile = this;
  editProfile.service = UserService;
  editProfile.model = angular.copy($rootScope.globals.currentUser);

  editProfile.submitForm = function (form) {
    editProfile.submitted = true;
    if (form.$valid) {
      save();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function save() {

    var handleSuccess = function (data) {
      AuthenticationService.SetCredentials(editProfile.model);
      messagesFactory.editprofileSuccessMessages(data);
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.forgotErrorMessages(status);
      }
    };
    editProfile.loadPromise = editProfile.service.Update(editProfile.model)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
