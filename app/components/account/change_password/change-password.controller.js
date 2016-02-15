'use strict';

angular.module("app").controller('changePasswordCtrl', ['UserService', '$timeout', 'flashService', function (UserService, $timeout, flashService) {

  var changePassword = this;
  changePassword.model = {};

  changePassword.submitForm = function (form) {
    changePassword.submitted = true;
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
      flashService.showSuccess(data.message, true);
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);

    };
    UserService.changePasswordAPI(changePassword.model)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
