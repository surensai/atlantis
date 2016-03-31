'use strict';

angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'messagesFactory', 'PlayerService', '$timeout', '$translate', function ($scope, $state, messagesFactory, PlayerService, $timeout, $translate) {

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
  playerAction.previousSelectedFile = [];
  playerAction.fileReaderSupported = window.FileReader != null;
  playerAction.model.croppedImage = '';

  (function () {
    getPlayerById();
  })();


  playerAction.submitForm = function (form) {

    playerAction.submitted = true;
    if (form.$valid && playerAction.fileError) {
      playerAction.added = true;
      if(playerAction.previousSelectedFile.length > 0){
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
      messagesFactory.createPlayerSuccess(data);
      $state.go('account.players.details', {id: data.id});
    };

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.createPlayerError(status);
      }
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

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.updatePlayerError(status);
      }
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
    };

    var handleError = function () {
      if (playerAction.isUpdate) {
        updateAction();
      } else {
        addAction();
      }
      messagesFactory.uploadfileError(status);
    };

    PlayerService.uploadFileApi(playerAction.previousSelectedFile[0])
      .success(handleSuccess)
      .error(handleError);
  }

  playerAction.deleteListener = function (obj) {
    playerAction.data.deleteObj = obj;
  };

  playerAction.deleteAction = function () {

    var handleSuccess = function (data) {
      angular.element('#pop').modal('hide');
      messagesFactory.deletePlayerSuccess(data)
      $state.go("account.players");
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.deletePlayerError(status);
      }
    };

   PlayerService.deleteApi(playerAction.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };


  $scope.photoChanged = function (files) {
    if (files.length > 0 || playerAction.previousSelectedFile.length > 0) {
      playerAction.previousSelectedFile = (files.length > 0) ? files : playerAction.previousSelectedFile;
      var file = (files.length > 0) ? files[0] : playerAction.previousSelectedFile[0];
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

      var handleError = function (error, status) {
        if (error && status) {
          messagesFactory.getPlayerbyIDError(status);
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

