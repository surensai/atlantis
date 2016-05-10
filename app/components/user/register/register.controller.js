'use strict';

angular.module("app").controller('registerCtrl', ['AuthenticationService', 'UserService', '$timeout', 'messagesFactory', '$state', function (AuthenticationService, UserService, $timeout, messagesFactory, $state) {

  var register = this;

  register.submitForm = function (form) {
    register.submitted = true;
    if (form.$valid && (register.model.password === register.model.confirmPassword)) {
      save();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function stuctureFormData() {
    var data = {};
    data.firstName = register.model.firstName;
    data.lastName = register.model.lastName;
    data.email = register.model.email;
    data.password = register.model.password;
    data.role = "PARENT";
    return data;
  }

  function save() {
    var formData = stuctureFormData();
    var handleSuccess = function (data) {
      messagesFactory.registerSuccessMessages(data);
      $state.go('messages');
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.registerErrorMessages(status);
      }
    };
    UserService.Create(formData)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
