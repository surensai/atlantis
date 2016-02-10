'use strict';

app.controller('registerCtrl', ['$scope', 'AuthenticationService', 'UserService', '$state', '$timeout', 'flashService' ,function ($scope, AuthenticationService, UserService, $state, $timeout, flashService) {

    var register = this;
    register.scope = $scope;
    register.data = {};
    register.model = {};
    register.service = UserService;
    register.scope.dob = "";

    register.scope.submitForm = function () {
        register.scope.submitted = true;
        if (register.scope.userForm.$valid) {
            save();
            register.scope.userForm.$setPristine();
        } else {
            $timeout(function () {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    }

    function stuctureFormData() {
        var data = { };
        data.firstName = register.data.firstName;
        data.lastName = register.data.lastName;
        data.email = register.data.email;
        data.password = register.data.password;
        data.role = "TEACHER";
        return data;
    }

    function save() {

        var formData = stuctureFormData();

        var handleSuccess = function (data) {
            flashService.Success(data.message, true);
        };

        var handleError = function (error) {
          var message = "";
          if(error.status === 400){
            message = "Password is small"
          }
          if(error.error === "E_UNKNOWN"){
            message = "Email already registered"
          }else{
            message = error.error;
          }
          flashService.Error(message, false);
        };
        register.service.Create(formData)
            .success(handleSuccess)
            .error(handleError);
    }

}]);
