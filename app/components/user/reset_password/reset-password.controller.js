'use strict';

app.controller('resetPasswordCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', 'auth', function ($scope, UserService, $state, $timeout, flashService, auth) {

  var resetPassword = this;
  resetPassword.scope = $scope;
  resetPassword.data = {};
  resetPassword.model = {};
  resetPassword.service = UserService;
  resetPassword.scope.dob = "";

  (function initController() {
    if(auth.data.message === "success"){
      $scope.valid = true;
    }else{
      $scope.valid = false;
      flashService.Error("Your session has expired", false);
    }
  })();


  resetPassword.scope.submitForm = function (valid) {
    resetPassword.scope.submitted = true;
    if (valid) {
      save();
      resetPassword.scope.userForm.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  }

  function stuctureFormData() {
    var data = { };
    data.password = resetPassword.data.newPassword;
    data.confirmPassword = resetPassword.data.confirmPassword;

    return data;
  }

  function save() {

    var formData = stuctureFormData();

    var handleSuccess = function (data) {
      resetPassword.data ={};
      flashService.Success(data.message, true);
      $state.go('login');
    };

    var handleError = function (error) {
      flashService.Error(error.error, false);
    };

    resetPassword.service.resetPasswordAPI(formData,$state.params.token)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
