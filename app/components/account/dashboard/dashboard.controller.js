'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService', function (DashboardService) {
  var dashboard = this;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = [];

  (function () {
    var handleSuccess = function (data) {
      dashboard.data.newsFeedsList = data;
    };

    var handleError = function () {
      flashService.showError("Error in getting feeds", false);
    };

    dashboard.loadPromise = DashboardService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  })();

}]);
