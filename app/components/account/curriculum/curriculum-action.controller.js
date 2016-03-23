'use strict';

angular.module("app").controller('curriculumActionCtrl', ['$timeout', 'CurriculumService', 'flashService','$scope','$state','$uibModal','$translate','ngAudio', function ($timeout, CurriculumService, flashService, $scope, $state,$uibModal,$translate, ngAudio) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.data = {};
  curriculum.model.wordItem = {};
  curriculum.model.wordItem.imageURL = "assets/images/fallback-img.png";
  curriculum.imageFileError = true;
  curriculum.audioFileError = true;
  curriculum.audioFilesize = true;
  curriculum.isAudioUploaded = false;
  curriculum.audioFilesize = true;
  curriculum.isUpdate = false;
  curriculum.fileReaderSupported = window.FileReader != null;
  var URL = window.URL || window.webkitURL;

  curriculum.searchWord = function(){
    var word = curriculum.model.wordItem.wordName;
    var handleSuccess = function (data) {
        if (data.length === 0) {
          curriculum.model.message = $translate.instant("curriculum.message.word_notexist");
        } else {
          curriculum.model.message = $translate.instant("curriculum.message.word_exist");
        }
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_words"), false);
    };

    CurriculumService.searchWordApi(word)
      .success(handleSuccess)
      .error(handleError);

  };

  (function () {
    getWordId();

  })();

  function getWordId() {
    if ($state.params.id) {
      curriculum.isUpdate = true;
      var handleSuccess = function (data) {
        curriculum.data.wordItem = curriculum.model.wordItem = data;
        if(!data.imageURL){
          curriculum.model.wordItem.imageURL = "assets/images/fallback-img.png";
        }
        if(data.audioURL){
          curriculum.model.wordItem.audioURL = ngAudio.load(data.audioURL);
          curriculum.isAudioUploaded = true;
        }
      };

      var handleError = function () {
        flashService.showError($translate.instant("player.messages.error_getting_players"), false);
      };

      CurriculumService.getWordById($state.params.id)
        .success(handleSuccess)
        .error(handleError);
    }
    else{
      curriculum.model.wordItem.wordName = $state.params.word;
    }

  }
  curriculum.refreshFile = function(){
    curriculum.model.wordItem.audioURL = null;
    curriculum.audioFileError = true;
    curriculum.isAudioUploaded = false;
    curriculum.audioFilesize = true;
  };

  curriculum.submitForm = function (form) {

    curriculum.submitted = true;
    if (form.$valid && curriculum.imageFileError && curriculum.audioFileError && curriculum.audioFilesize) {

      if(curriculum.myAudioFile && curriculum.myImageFile){
        uploadMultipleFiles(form,curriculum.myAudioFile,curriculum.myImageFile);
      }
      else if(curriculum.myAudioFile){
        curriculum.model.wordItem.imageURL = undefined;
        uploadProfilePic(form, curriculum.myAudioFile);
      }
      else if(curriculum.myImageFile){
        curriculum.model.wordItem.audioURL = undefined;
        uploadProfilePic(form, curriculum.myImageFile);
      }
      else{
        curriculum.model.wordItem.imageURL = undefined;
        curriculum.model.wordItem.audioURL = undefined;
        if (curriculum.isUpdate) {
          updateAction();
        } else {
          addAction(form);
        }
      }
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function structureFormData() {
    var data = {};
    data.wordName = curriculum.model.wordItem.wordName;
    data.imageURL = curriculum.model.wordItem.imageURL;
    data.audioURL = curriculum.model.wordItem.audioURL;
    return data;
  }

  function addAction(form) {
    form.$setPristine();
    var formData = structureFormData();
    var handleSuccess = function () {
      flashService.showSuccess("Word added successfully!", true);
      $state.go('account.curriculum');
    };

    var handleError = function () {
      flashService.showError("Invalid word credentials", false);
    };

    curriculum.loadPromise = CurriculumService.saveWordApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function updateAction() {
    var formData = structureFormData();
    var handleSuccess = function () {
      $state.go('account.curriculum');
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
    };

    CurriculumService.updateWordApi(curriculum.data.wordItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadMultipleFiles(form,audioFile,imageFile) {
    var handleSuccess = function (data) {
      curriculum.model.wordItem.audioURL = data.files[0].url;

      curriculum.loadPromise = CurriculumService.uploadFileApi(imageFile)
        .success(function(data){
          curriculum.model.wordItem.imageURL = data.files[0].url;
          if (curriculum.isUpdate) {
            updateAction();
          } else {
            addAction(form);
          }
          flashService.showSuccess("File uploaded successfully!", false);
        })
        .error(function(){
          flashService.showError("Error in file uploading", false);
        });

    };

    var handleError = function () {
      flashService.showError("Error in file uploading", false);
    };

    curriculum.loadPromise = CurriculumService.uploadFileApi(audioFile)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadProfilePic(form,file) {
    var handleSuccess = function (data) {
      if(data.files[0].type.includes("audio")){
        curriculum.model.wordItem.audioURL = data.files[0].url;
      }else{
        curriculum.model.wordItem.imageURL = data.files[0].url;
      }
      if (curriculum.isUpdate) {
        updateAction();
      } else {
        addAction(form);
      }
      flashService.showSuccess("File uploaded successfully!", false);
    };

    var handleError = function () {
      flashService.showError("Error in file uploading", false);
    };

    curriculum.loadPromise = CurriculumService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }


  $scope.photoChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (curriculum.fileReaderSupported && file.type.indexOf('image') > -1) {
        curriculum.imageFileError = true;
        $timeout(function () {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            $timeout(function () {
              curriculum.model.wordItem.imageURL = e.target.result;
            });
          };
        });
      }else{
        curriculum.imageFileError = false;
      }
    }
  };

  $scope.audioFileChanged = function (files) {
    if (files != null) {
      curriculum.isAudioUploaded = true;
      curriculum.audioFilesize = true;
      curriculum.audioFileError = true;
      var file = files[0];
        if (curriculum.fileReaderSupported  && file.type.indexOf('audio') > -1) {
          if(file.size <= 2000000) {
            console.log("file size same");
            $timeout(function () {
              var fileURL = URL.createObjectURL(file);
              curriculum.model.wordItem.audioURL = ngAudio.load(fileURL);
            });
          }else{
            curriculum.audioFilesize = false;
            curriculum.isAudioUploaded = false;
            curriculum.model.wordItem.audioURL = undefined;
          }

        } else{
        curriculum.isAudioUploaded = false;
          curriculum.audioFileError = false;
        curriculum.model.wordItem.audioURL = undefined;
      }
    }
  };


}]);
