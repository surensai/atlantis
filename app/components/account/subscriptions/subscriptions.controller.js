'use strict';

angular.module("app").controller('subscriptionsCtrl', ['SubscriptionsService', 'flashService', function (SubscriptionsService, flashService) {

  var subscription = this;

  (function () {
    getData();
  })();

  subscription.closeAlert = function() {
    subscription.show = false;
  };

  subscription.submitForm = function () {
    var handleSuccess = function (data) {
      flashService.showSuccess(data.message, false);
    };
    var handleError = function (error) {
      subscription.show = true;
      flashService.showError(error.error, false);
    };
    subscription.loadPromise = SubscriptionsService.updateApi(subscription.model)
      .success(handleSuccess)
      .error(handleError);
  };

  function getData() {
    var handleSuccess = function (data) {
      subscription.model = data;
      var sp_updates = data.sp_updates === "true";
      var educational_updates =  data.educational_updates === "true";
      var player_updates = data.player_updates === "true";
      subscription.model.sp_updates = sp_updates;
      subscription.model.educational_updates = educational_updates;
      subscription.model.player_updates = player_updates;
    };
    var handleError = function (error) {
      subscription.show = true;
      flashService.showError(error.error, false);
    };
    subscription.loadPromise = SubscriptionsService.getApi()
      .success(handleSuccess)
      .error(handleError);
  }

}]);
