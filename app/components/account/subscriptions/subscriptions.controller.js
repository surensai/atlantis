'use strict';

angular.module("app").controller('subscriptionsCtrl', ['SubscriptionsService', 'flashService', function (SubscriptionsService, flashService) {

  var subscription = this;

  (function () {
    getData();
  })();

  subscription.submitForm = function () {
    var handleSuccess = function (data) {
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);
    };
    subscription.loadPromise = SubscriptionsService.updateApi(subscription.model)
      .success(handleSuccess)
      .error(handleError);
  };

  function getData() {
    var handleSuccess = function (data) {
      subscription.model = data;
    };
    var handleError = function (error) {
      flashService.showError(error.error, false);
    };
    subscription.loadPromise = SubscriptionsService.getApi()
      .success(handleSuccess)
      .error(handleError);
  }

}]);
