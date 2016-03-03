'use strict';

angular.module("app").controller('firmwareCtrl', ['$timeout', 'firmwareService', 'flashService', function ($timeout, firmwareService, flashService) {

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

  function addAction(form) {
    var handleSuccess = function () {
      flashService.showSuccess("firmware added successfully!", true);
    };

    var handleError = function () {
      flashService.showError("Invalid firmware credentials", false);
      form.$setPristine();
    };

    firmware.loadPromise = firmwareService.createApi(firmware.model)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadFirmware(form) {
    var handleSuccess = function (data) {
      firmware.model.firmware_update_url = data.files[0].url;
      addAction(form);
    };

    var handleError = function () {
      flashService.showError("Error in file uploading", false);
    };

    var file = firmware.model.firmware_update_url;

    firmware.loadPromise = firmwareService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }



}]);
