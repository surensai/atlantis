'use strict';

angular.module("app").controller('dashboardCtrl', ['newsFeedData', function (newsFeedData) {
  var dashboard = this;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = [];

  (function () {
    dashboard.data.newsFeedsList = newsFeedData.data;
  })();

}]);
