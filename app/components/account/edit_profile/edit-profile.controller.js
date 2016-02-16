'use strict';

angular.module("app").controller('editProfileCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', '$rootScope', 'AuthenticationService', function ($scope, UserService, $state, $timeout, flashService, $rootScope, AuthenticationService) {

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
      flashService.showSuccess(data.message, true);
    };

    var handleError = function (error) {
      flashService.showError(error.error, false);
    };

    editProfile.service.Update(editProfile.model)
      .success(handleSuccess)
      .error(handleError);
  }

}]);