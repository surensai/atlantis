'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService','messagesFactory', function (DashboardService,messagesFactory) {
  var dashboard = this;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = [];

  (function () {
    var handleSuccess = function (data) {
      dashboard.data.newsFeedsList = data;
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.dashboardfeedsError(status);
      }
    };

    DashboardService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  })();

}]);
