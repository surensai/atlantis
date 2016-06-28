'use strict';

angular.module("app").controller('registerCtrl', ['AuthenticationService', 'UserService', '$timeout', 'messagesFactory', '$state', 'appService', '$uibModal', 'StaticService', '$sce', '$http', function (AuthenticationService, UserService, $timeout, messagesFactory, $state, appService, $uibModal, StaticService, $sce, $http) {

  var register = this;

  (function () {
    if (appService.checkSessionOnURLChange()) {
      $state.go('account.dashboard');
    }
  })();

  register.submitForm = function (form) {
    register.submitted = true;
    if (form.$valid && (register.model.password === register.model.confirmPassword)) {
      getTermsNCondtionData();
      form.$setPristine();
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };
  function getTermsNCondtionData() {
    StaticService.getTermsAPI()
      .success(function (data) {
        openTermsNCondtonPrivacyPolicyPopup(data, false);
      }).error(function () {
    });
  }

  function getPrivacyPolicyData() {
    StaticService.getPrivacyAPI()
      .success(function (data) {
        openTermsNCondtonPrivacyPolicyPopup(data, true);
      }).error(function () {
    });
  }

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

    UserService.Create(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function openTermsNCondtonPrivacyPolicyPopup(data, isRegisterUser) {
    $uibModal.open({
      templateUrl: 'components/user/register/terms-agree-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = data.title;
        $scope.OKBtnLabel = isRegisterUser ? "Submit" : "Agree";
        $scope.isFrameDataLoaded = false;
        $scope.fullHtmlViewURL = data.htmlView;
        $scope.content_url = data.content_url;
        $scope.trustSrc = function (htmlUrl) {
          return $sce.trustAsResourceUrl(htmlUrl);
        };
        $("#externalHtmlView").ready(function () {
          $timeout(function () {
            $scope.isFrameDataLoaded = true;
          }, 1000);
        });
        $scope.ok = function () {
          if (isRegisterUser) {
            save();
          } else {
            getPrivacyPolicyData();
          }
          $uibModalInstance.close();
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  }
}]);
