'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService','flashService', function (DashboardService,flashService) {
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

    DashboardService.getAllApi()
      .success(handleSuccess)
      .error(handleError);
  })();

}]);
