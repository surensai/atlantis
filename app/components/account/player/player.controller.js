'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$state', 'PlayerService', 'flashService','$scope', function ($timeout, $state, PlayerService, flashService, $scope) {

  var player = this;
  player.modalTitle = 'Warning!';
  player.modalBody = 'Are you sure do you want to delete player?';
  player.isUpdate = false;
  player.model = {};
  player.data = {};
  player.data.playersList = [];
  player.data.playerItem = {};
  player.data.deleteObj = {};
  player.model.playerItem = {};

  player.show = true;

  player.closeAlert = function () {
    player.show = false;
  };

  (function () {

    var handleSuccess = function (data) {
      player.data.playersList = data;
      if ($state.params.id) {
        player.isUpdate = true;
        player.data.playerItem = player.model.playerItem = PlayerService.getObjById(player.data.playersList, $state.params.id);
      }
    };

    var handleError = function () {
      flashService.showError("Error in getting players", false);
    };

    player.loadPromise = PlayerService.getAllApi()
      .success(handleSuccess)
      .error(handleError);


  })();

  player.submitForm = function (form) {

    player.submitted = true;
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
    data.firstName = player.model.playerItem.firstName;
    data.lastName = player.model.playerItem.lastName;
    data.profileURL = player.model.playerItem.profileURL;
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      flashService.showSuccess("Player added successfully!", true);
      $state.go('account.players');
    };

    var handleError = function () {
      flashService.showError("Invalid player credentials", false);
    };

    player.loadPromise = PlayerService.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }


  function updateAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      $state.go('account.players');
    };

    var handleError = function () {
      flashService.showError("Invalid player credentials", false);
    };

    player.loadPromise = PlayerService.updateApi(player.data.playerItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  }


  function uploadProfilePic(form) {
    var handleSuccess = function (data) {
      player.model.playerItem.profileURL = data.files[0].url;
      if (player.isUpdate) {
        updateAction();
      } else {
        addAction();
      }
      form.$setPristine();
      flashService.showSuccess("File uploaded successfully!", false);
    };

    var handleError = function () {
      if (player.isUpdate) {
        updateAction();
      } else {
        addAction();
      }
      flashService.showError("Error in file uploading", false);
    };
    var file = player.myFile;

    player.loadPromise = PlayerService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }


  player.deleteListener = function (obj) {
    player.data.deleteObj = obj;
  };

  player.deleteAction = function () {

    var handleSuccess = function () {
      PlayerService.removeItem(player.data.playersList, player.data.deleteObj);
      angular.element('#pop').modal('hide');
      flashService.showSuccess("Player deleted successfully!", false);
    };

    var handleError = function () {
      flashService.showError("Error in deleting", false);
    };

    PlayerService.deleteApi(player.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };

  player.fileReaderSupported = window.FileReader != null;
  $scope.photoChanged = function(files){
    if (files != null) {
      var file = files[0];
      if (player.fileReaderSupported && file.type.indexOf('image') > -1) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function(){
              player.model.playerItem.profileURL = e.target.result;
            });
          }
        });
      }
    }
  };

}]);
