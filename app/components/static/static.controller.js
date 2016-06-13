'use strict';

angular.module("app").controller('staticCtrl', [ '$state','StaticService','$sce','flashService','AuthenticationService', function ($state, StaticService, $sce, flashService, authService) {

  var self = this;
  self.contentFrameURL = "";

  if($state.current.name === "page.privacy-policy"){
    getPrivacyContent();
  } else if ($state.current.name === "page.terms-services") {
    getTemsContent();
  } else if($state.current.name === "page.warrentyinfo"){
    getWarrentyContent();
  }


  self.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  function getWarrentyContent(){

    var handleSuccess = function (data) {
      self.contentFrameURL = data.htmlView;
    };

    var handleError = function () {
      if(status === 401){
        authService.generateNewToken(function(){
          getWarrentyContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };

  StaticService.getwarrantyAPI()
    .success(handleSuccess)
    .error(handleError);
}
  function getPrivacyContent(){

    var handleSuccess = function (data) {
      self.contentFrameURL = data.htmlView;
    };

    var handleError = function () {
      if(status === 401){
        authService.generateNewToken(function(){
          getPrivacyContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };

    StaticService.getPrivacyAPI()
      .success(handleSuccess)
      .error(handleError);

  }

  function getTemsContent() {

    var handleSuccess = function (data) {
        self.contentFrameURL = data.htmlView;
    };

    var handleError = function (error, status) {
      if(status === 401){
        authService.generateNewToken(function(){
          getTemsContent();
        });
      }
      else {
        flashService.showError($translate.instant('common.messages.error_getting_data'), false);
      }
    };

    StaticService.getTermsAPI()
      .success(handleSuccess)
      .error(handleError);

  }

}]);
