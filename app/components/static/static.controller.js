'use strict';

angular.module("app").controller('staticCtrl', [ '$state','StaticService','$sce','$http', function ($state, StaticService, $sce, $http) {

  var self = this;
  self.content = {};

  self.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  if($state.current.name === "page.privacy-policy"){
    getPrivacyContent();
  } else if ($state.current.name === "page.terms-services") {
    getTemsContent();
  }

  function getPrivacyContent(){

    var handleSuccess = function (data) {
      self.content = data;
      $http.get(self.content.htmlView).success(function(data){
        self.content.htmlView = data;
      });
    };

    var handleError = function (error, status) {
      if (error && status) {

      }
    };

    StaticService.getPrivacyAPI()
      .success(handleSuccess)
      .error(handleError);

  }

  function getTemsContent() {

    var handleSuccess = function (data) {
      self.content = data;
      $http.get(self.content.htmlView).success(function(data){
        self.content.htmlView = data;
      });
    };

    var handleError = function (error, status) {
      if (error && status) {

      }
    };

    StaticService.getTermsAPI()
      .success(handleSuccess)
      .error(handleError);

  }

}]);
