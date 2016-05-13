'use strict';

angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'messagesFactory', 'PlayerService', '$timeout', '$translate', '$uibModal', function ($scope, $state, messagesFactory, PlayerService, $timeout, $translate, $uibModal) {

  var playerAction = this;
  playerAction.model = {};
  playerAction.data = {};
  playerAction.data.avatarsList = [];
  playerAction.modalTitle = 'Warning!';
  playerAction.modalBody = $translate.instant("user.validationMessages.model_delete_player");
  playerAction.data.deleteObj = {};
  playerAction.isUpdate = false;
  playerAction.isChoosenAvatar = false;
  playerAction.isDOBVaid = false;
  playerAction.model.playerItem = {};
  playerAction.fileError = true;
  playerAction.model.playerItem.gender = 'M';
  playerAction.model.playerItem.age = 5;
  playerAction.previousSelectedFile = [];
  playerAction.fileReaderSupported = window.FileReader != null;
  playerAction.model.croppedImage = '';

  (function () {
    getPlayerById();
    getAvatars();
  })();

  playerAction.submitForm = function (form) {

    playerAction.submitted = true;
    isDOBValid();
    if (form.$valid && playerAction.fileError && playerAction.isDOBVaid && playerAction.model.playerItem.profileURL) {
      playerAction.added = true;
      if(playerAction.previousSelectedFile.length > 0 && !playerAction.isChoosenAvatar){
        uploadProfilePic(form);
      }else{
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
        messagesFactory.createPlayerError(status,error);
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
    $uibModal.open({
      templateUrl: 'common/app-directives/modal/custom-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = $translate.instant('player.delete_modaltitle');
        $scope.modalBody = $translate.instant('player.delete_modalbody');

        $scope.ok = function () {
          playerAction.data.deleteObj = obj;
          playerAction.deleteAction();
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });

  };

  playerAction.deleteAction = function () {

    var handleSuccess = function (data) {
      angular.element('#pop').modal('hide');
      messagesFactory.deletePlayerSuccess(data);
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
      //Restricting file upload to 2MB i.e (1024*1024*2)
      if(files[0].size <= 2097152){
        playerAction.showSizeLimitError = false;
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
              playerAction.isChoosenAvatar = false;
            });
          };
        });
      } else {
        playerAction.fileError = false;
      }
    }else {
        playerAction.showSizeLimitError = true;
    }
    }
  };




  playerAction.showAvatars = function() {
    $uibModal.open({
      templateUrl: 'components/account/player/player-avatars-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

        $scope.selectionAvatar = (playerAction.model.playerItem.profileURL) ? playerAction.model.playerItem.profileURL : '';
        $scope.selectVal;

        $scope.avatarsList = playerAction.data.avatarsList;
        $scope.selectAvatar = function(item, index){
          $scope.selectionAvatar = item.assetURL;
          playerAction.isChoosenAvatar = true;
          $scope.selectVal = index;
        };

        $scope.isAvatarClicked = function(index){
          if($scope.selectVal === index){
            return true;
          } else {
            return false;
          }
        };

        $scope.onCancel = function () {
          $uibModalInstance.dismiss('cancel');
        };

        $scope.onSubmit = function () {
          playerAction.model.playerItem.profileURL = $scope.selectionAvatar;
          $uibModalInstance.dismiss('cancel');
        };


      }]
    });
  };

  function getPlayerById() {
    if ($state.params.id) {
      playerAction.isUpdate = true;
      var handleSuccess = function (data) {
        playerAction.data.playerItem = playerAction.model.playerItem = data;
      };

      var handleError = function (error, status) {
        if (error && status) {
          messagesFactory.getPlayerbyIDError(status);
        }
      };
      PlayerService.getPlayerById($state.params.id)
        .success(handleSuccess)
        .error(handleError);
    }

  }


  function getAvatars() {

      var handleSuccess = function (data) {
        playerAction.data.avatarsList = data;
      };

      var handleError = function (error, status) {
        if (error && status) {
          messagesFactory.getPlayerbyIDError(status);
        }
      };
      PlayerService.getAvatarsAPI()
        .success(handleSuccess)
        .error(handleError);
    }

  function isDOBValid(){
    var dobArr = playerAction.model.playerItem.dateofBirth.split("/");
    if(dobArr[0] > 0 && dobArr[1] > 0 && dobArr[2] > 0) {
      playerAction.isDOBVaid = true;
      isDOBCurrentDateExceed(dobArr);
    } else {
      playerAction.isDOBVaid = false;
    }
  }

  function isDOBCurrentDateExceed(selectedDate){
    var curDate = new Date(), month = selectedDate[0], day = selectedDate[1], year = selectedDate[2];
    if(curDate.getFullYear() === parseInt(year)){
      if(month >= (curDate.getMonth() + 1)){
        playerAction.isDOBVaid = false;
      }
    }
  }


}]);

