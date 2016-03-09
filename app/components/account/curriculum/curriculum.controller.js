'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'PlayerService', 'flashService','$scope','$sce', function ($timeout, PlayerService, flashService, $scope, $sce) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.show = true;
  curriculum.model.wordItem = {};

  curriculum.fileReaderSupported = window.FileReader != null;
  var URL = window.URL || window.webkitURL;

  curriculum.closeAlert = function () {
    curriculum.show = false;
  };

  curriculum.submitForm = function (form) {

    curriculum.submitted = true;
    if (form.$valid) {
      uploadProfilePic(form);
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function stuctureFormData() {
    var data = {};
    data.word = curriculum.model.wordItem.word;
    data.imageURL = curriculum.model.wordItem.imageURL;
    data.audioURL = $sce.trustAsResourceUrl(curriculum.model.wordItem.audioURL);
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      flashService.showSuccess("Word added successfully!", true);
    };

    var handleError = function () {
      flashService.showError("Invalid word credentials", false);
    };

    curriculum.loadPromise = PlayerService.saveWordApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadProfilePic(form) {
    var handleSuccess = function (data) {
      curriculum.model.wordItem.imageURL = data.files[0].url;
      addAction();
      form.$setPristine();
      flashService.showSuccess("File uploaded successfully!", false);
    };

    var handleError = function () {
      addAction();
      flashService.showError("Error in file uploading", false);
    };
    var file = curriculum.myFile;

    curriculum.loadPromise = PlayerService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }

  $scope.photoChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (curriculum.fileReaderSupported && file.type.indexOf('image') > -1) {
        $timeout(function () {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            $timeout(function () {
              curriculum.model.wordItem.imageURL = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.audioFileChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (file.type.indexOf('audio') > -1) {
        $timeout(function () {
          var fileURL = URL.createObjectURL(file);
          curriculum.model.wordItem.audioURL = $sce.trustAsResourceUrl(fileURL);
        });
      }
    }
  };


}]);
