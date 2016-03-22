'use strict';

angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'flashService', 'PlayerService', '$timeout', '$translate', function ($scope, $state, flashService, PlayerService, $timeout, $translate) {

  var playerAction = this;
  playerAction.model = {};
  playerAction.data = {};
  playerAction.modalTitle = 'Warning!';
  playerAction.modalBody = $translate.instant("user.validationMessages.model_delete_player");
  playerAction.data.deleteObj = {};
  playerAction.isUpdate = false;
  playerAction.model.playerItem = {};
  playerAction.fileError = true;
  playerAction.model.playerItem.gender = 'M';
  playerAction.model.playerItem.age = 5;
  playerAction.model.playerItem.profileURL = "assets/images/fallback-img.png";

  (function () {
    getPlayerById();
  })();


  playerAction.submitForm = function (form) {

    playerAction.submitted = true;
    if (form.$valid && playerAction.fileError) {
      playerAction.added = true;
      if(playerAction.myFile){
        uploadProfilePic(form);
      }else{
        playerAction.model.playerItem.profileURL = undefined;
        if (playerAction.isUpdate) {
          updateAction();
        } else {
          addAction();
        }
      }

    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function stuctureFormData() {
    var data = {};
    data.firstName = playerAction.model.playerItem.firstName;
    data.lastName = playerAction.model.playerItem.lastName;
    data.profileURL = playerAction.model.playerItem.profileURL;
    data.dateofBirth = playerAction.model.playerItem.dateofBirth;
    data.gender = playerAction.model.playerItem.gender;
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();
    var handleSuccess = function (data) {
      flashService.showSuccess($translate.instant("player.messages.add_success"), true);
      $state.go('account.players.details', {id: data.id});
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
    };

    PlayerService.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function updateAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      $state.go('account.players.details', {id: playerAction.model.playerItem.id});
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.invalid_credentials"), false);
    };

    PlayerService.updateApi(playerAction.data.playerItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadProfilePic(form) {
    var handleSuccess = function (data) {
      playerAction.model.playerItem.profileURL = data.files[0].url;
      if (playerAction.isUpdate) {
        updateAction();
      } else {
        addAction();
      }
      form.$setPristine();
      flashService.showSuccess($translate.instant("player.messages.file_upload_success"), true);
    };

    var handleError = function () {
      if (playerAction.isUpdate) {
        updateAction();
      } else {
        addAction();
      }
      flashService.showError($translate.instant("player.messages.error_file_upload"), false);
    };
    var file = playerAction.myFile;
    PlayerService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }

  playerAction.deleteListener = function (obj) {
    playerAction.data.deleteObj = obj;
  };

  playerAction.deleteAction = function () {

    var handleSuccess = function () {
      angular.element('#pop').modal('hide');
      flashService.showSuccess($translate.instant("player.messages.delete_success"), true);
      $state.go("account.players");

    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_deleting_players"), false);
    };

   PlayerService.deleteApi(playerAction.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };


  playerAction.fileReaderSupported = window.FileReader != null;
  playerAction.model.myCroppedImage = '';
  $scope.photoChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (playerAction.fileReaderSupported && file.type.indexOf('image') > -1) {
        playerAction.fileError = true;
        $timeout(function () {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            $timeout(function () {
              playerAction.model.playerItem.profileURL = e.target.result;
            });
          };
        });
      } else {
        playerAction.fileError = false;
      }
    }
  };

  function getPlayerById() {
    if ($state.params.id) {
      playerAction.isUpdate = true;
      var handleSuccess = function (data) {
        playerAction.data.playerItem = playerAction.model.playerItem = data;
        if(!data.profileURL){
          playerAction.model.playerItem.profileURL = "assets/images/fallback-img.png";
        }
      };

      var handleError = function () {
        flashService.showError($translate.instant("player.messages.error_getting_players"), false);
      };

      PlayerService.getPlayerById($state.params.id)
        .success(handleSuccess)
        .error(handleError);
    }

  }
}]);

