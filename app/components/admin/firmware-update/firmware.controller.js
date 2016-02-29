'use strict';

angular.module("app").controller('firmwareCtrl', ['$timeout', '$state', 'firmwareService', 'flashService','$scope', function ($timeout, $state, firmwareService, flashService, $scope) {

  var firmware = this;
  firmware.isUpdate = false;
  firmware.model = {};
  firmware.data = {};

  firmware.submitForm = function (form) {
    firmware.submitted = true;
    if (form.$valid) {
      uploadFirmware(form);
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }
  };

  function addAction() {
    var handleSuccess = function () {
      flashService.showSuccess("firmware added successfully!", true);
    };

    var handleError = function () {
      flashService.showError("Invalid firmware credentials", false);
    };

    firmware.loadPromise = firmwareService.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadFirmware(form) {
    var handleSuccess = function (data) {
      firmware.model.firmware_update_url = data.files[0].url;
      addAction();
      form.$setPristine();
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
