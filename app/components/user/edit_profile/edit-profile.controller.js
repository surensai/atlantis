'use strict';

app.controller('editProfileCtrl', ['$scope', 'UserService', '$state', '$timeout', 'flashService', '$rootScope', function ($scope, UserService, $state, $timeout, flashService, $rootScope) {

  var editProfile = this;
  editProfile.scope = $scope;
  editProfile.data = {};
  editProfile.model = {};
  editProfile.service = UserService;
  editProfile.scope.dob = "";
  editProfile.data = $rootScope.globals.currentUser;

  editProfile.scope.submitForm = function () {
    editProfile.scope.submitted = true;
    if (
      editProfile.scope.userForm.$valid) {
      save();
      editProfile.scope.userForm.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function stuctureFormData() {
    var data = {};
    data.firstName =
      editProfile.data.firstName;
    data.lastName =
      editProfile.data.lastName;
    data.mobileNumber =
      editProfile.data.mobileNumber;

    return data;
  }

  function save() {

    var formData = stuctureFormData();

    var handleSuccess = function (data) {
      $rootScope.globals = {
        currentUser: angular.copy(editProfile.data)
      };
      editProfile.scope.userClicked=true;
      flashService.Success(data.message, true);
     $timeout(function(){
      editProfile.scope.userClicked=false;
       flashService.Success(data.message, true)
       $rootScope.globals.flash = {};
     },1000)


    };

    var handleError = function (error) {
      flashService.Error(error.error, false);
    };

    editProfile.service.Update(formData)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
