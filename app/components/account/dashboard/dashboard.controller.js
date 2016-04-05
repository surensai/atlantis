'use strict';

angular.module("app").controller('dashboardCtrl', ['DashboardService','messagesFactory','$state', '$stateParams', function (DashboardService,messagesFactory,$state,$stateParams) {
  var dashboard = this;
  dashboard.model = {};
  dashboard.data = {};
  dashboard.data.newsFeedsList = {};
  dashboard.data.newsFeeds={};
  (function () {
    var handleSuccess = function (data) {
      if($stateParams.id){
        var tempArr=[];
        for(var i=0; i<data.length; i++){
          if($stateParams.id === data[i].id){
            tempArr.push(data[i]);
            dashboard.data.newsFeedsList = tempArr;
            break;
          }
        }
      }else{
        dashboard.data.newsFeedsList = data;
      }
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
