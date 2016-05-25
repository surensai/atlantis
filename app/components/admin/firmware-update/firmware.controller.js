'use strict';

angular.module("app").controller('firmwareCtrl', ['$timeout', 'firmwareService', 'messagesFactory','AuthenticationService', function ($timeout, firmwareService, messagesFactory, authService) {

  var firmware = this;
  firmware.isUpdate = false;
  firmware.model = {};
  firmware.data = {};

  firmware.show = true;

  firmware.closeAlert = function () {
     firmware.show = false;
  };

  firmware.submitForm = function (form) {
    firmware.submitted = true;
    if (form.$valid && firmware.model.firmware_update_url.name) {
      uploadFirmware(form);
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function addAction() {
    var handleSuccess = function (data) {
      messagesFactory.firmwarecreateSuccess(data);
    };

    var handleError = function (error, status) {
      if(status === 401){
        authService.generateNewToken(function(){
          addAction();
        });
      }
      else {
        messagesFactory.firmwarecreateError(status);
      }
    };


    firmwareService.createApi(firmware.model)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadFirmware(form) {
    var handleSuccess = function (data) {
      firmware.model.firmware_update_url = data.files[0].url;
      addAction(form);
    };

    var handleError = function (error, status) {
      if(status === 401){
        authService.generateNewToken(function(){
          uploadFirmware(form);
        });
      }
      else {
        messagesFactory.firmwareuploadError(status);
      }
    };
    var file = firmware.model.firmware_update_url;

    firmwareService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }



}]);
