'use strict';

angular.module("app").controller('registerCtrl', ['AuthenticationService', 'UserService', '$timeout', 'messagesFactory', '$state','appService','$uibModal','StaticService', function (AuthenticationService, UserService, $timeout, messagesFactory, $state, appService, $uibModal, StaticService) {

  var register = this;

  (function () {
    if(appService.checkSessionOnURLChange()){
      $state.go('account.dashboard');
    }
  })();

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
      $state.go('messages', {data: {"email": formData.email}});
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.registerErrorMessages(status);
      }
    };

    /*StaticService.getTermsAPI()
      .success(function(data){
        showTerms(data, 'terms')
      }).error(function(){

    });*/

    UserService.Create(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function showTerms(data, type){
    $uibModal.open({
      templateUrl: 'components/user/register/terms-agree-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance, $sce) {
        $scope.modalTitle = 'Terms and conditions';
        $scope.content_url = data.htmlView;

        $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
        };

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  }

}]);
