'use strict';

app.controller('changePasswordCtrl', ['$scope', 'UserService','AuthenticationService', '$state', '$timeout', 'flashService' ,function ($scope, UserService, AuthenticationService, $state, $timeout, flashService) {

  var changePassword = this;
  changePassword.scope = $scope;
  changePassword.data = {};
  changePassword.model = {};
  changePassword.service = UserService;
  changePassword.scope.dob = "";

  changePassword.scope.submitForm = function () {
    changePassword.scope.submitted = true;
    if (changePassword.scope.userForm.$valid) {
      save();
      changePassword.scope.userForm.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  }

  function stuctureFormData() {
    var data = { };
    data.oldPassword = changePassword.data.oldPassword;
    data.password = changePassword.data.newPassword;
    data.confirmPassword = changePassword.data.confirmNewPassword;

    return data;
  }

  function save() {

    var formData = stuctureFormData();

    var handleSuccess = function (data) {

      AuthenticationService.updateCredentials({password:changePassword.data.newPassword});
       flashService.Success(data.message, true)
    };

    var handleError = function (error) {
      flashService.Error(error.error, false)

    };

    changePassword.service.changePasswordAPI(formData)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
