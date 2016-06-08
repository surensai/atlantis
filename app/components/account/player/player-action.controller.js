'use strict';

angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'messagesFactory', 'PlayerService', '$timeout', '$translate', '$uibModal', 'AuthenticationService', function ($scope, $state, messagesFactory, PlayerService, $timeout, $translate, $uibModal, authService) {

  var playerAction = this;
  playerAction.model = {};
  playerAction.data = {};
  playerAction.data.avatarsList = [];
  playerAction.modalTitle = 'Warning!';
  playerAction.modalBody = $translate.instant("player.messages.delete_player");
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
  })();

  playerAction.submitForm = function (form) {
    playerAction.submitted = true;
    isDOBValid();
    if (form.$valid && playerAction.fileError && playerAction.isDOBVaid) {
      playerAction.added = true;
      if (playerAction.previousSelectedFile.length > 0 && !playerAction.isChoosenAvatar) {
        uploadProfilePic(form);
      } else {
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
    if (!playerAction.isChoosenAvatar) {
      data.imgbase64 = playerAction.model.playerItem.imgbase64;
    } else {
      data.imgbase64 = "";
    }
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();

    var handleSuccess = function (data) {
      messagesFactory.createPlayerSuccess(data);
      $state.go('account.players.details', {id: data.id});
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          addAction();
        });
      }
      else {
        messagesFactory.createPlayerError(status, error);
      }
    };

    PlayerService.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function updateAction() {
    var formData = stuctureFormData();
    var handleSuccess = function (data) {
      messagesFactory.updatePlayerSuccess(data);
      $state.go('account.players.details', {id: playerAction.model.playerItem.id});
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          updateAction();
        });
      }
      else {
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

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          uploadProfilePic(form);
        });
      }
      else {
        if (playerAction.isUpdate) {
          updateAction();
        } else {
          addAction();
        }
        messagesFactory.uploadfileError(status);
      }

    };

    PlayerService.uploadFileApi(playerAction.previousSelectedFile[0])
      .success(handleSuccess)
      .error(handleError);
  }

  playerAction.deleteListener = function (obj) {
    $uibModal.open({
      templateUrl: 'components/account/player/delete-player.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = $translate.instant('common.are_you_sure');
        $scope.clickedOnReadmore = true;

        $scope.readMore = function () {
          $scope.clickedOnReadmore = false;
        };

        $scope.readLess = function () {
          $scope.clickedOnReadmore = true;
        };

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
      messagesFactory.deletePlayerSuccess(data);
      $state.go("account.players");
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          PlayerService.deleteApi(playerAction.data.deleteObj.id)
            .success(handleSuccess)
            .error(handleError);
        });
      }
      else {
        messagesFactory.deletePlayerError(status);
      }
    };

    PlayerService.deleteApi(playerAction.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };

  /*
   Open the crop image popup to crop the selected image
   */
  playerAction.onOpenCropImg = function (selectedImg) {
    $uibModal.open({
      templateUrl: 'components/account/player/player-image-crop-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.selectedImage = selectedImg;
        $scope.croppedImage = '';
        $scope.croppedImageSize = '';
        playerAction.isChoosenAvatar = false;
        $scope.onCancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
        $scope.onSubmit = function () {
          playerAction.model.playerItem.profileURL = "";
          playerAction.model.playerItem.imgbase64 = $scope.croppedImage;
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  };

  $scope.photoChanged = function (inputFileObj) {
    var files = inputFileObj.files;
    if (files.length > 0 || playerAction.previousSelectedFile.length > 0) {
      //Restricting file upload to 5MB i.e (1024*1024*5)
      var file = (files.length > 0) ? files[0] : null;
      if (file && file.size <= 5242880) {
        playerAction.showSizeLimitError = false;
        playerAction.previousSelectedFile = (files.length > 0) ? files : playerAction.previousSelectedFile;
        file = file ? file : playerAction.previousSelectedFile[0];
        if (playerAction.fileReaderSupported && file.type.indexOf('image') > -1) {
          playerAction.fileError = true;
          $timeout(function () {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
              $timeout(function () {
                playerAction.isChoosenAvatar = false;
                playerAction.onOpenCropImg(e.target.result);
                //clear the input file value once it is cropped & rendered(issue with selection of same file event is not triggering)
                inputFileObj.value = null;
              });
            };
          });
        } else {
          playerAction.fileError = false;
        }
      } else {
        playerAction.showSizeLimitError = true;
      }
    }
  };

  playerAction.showAvatars = function () {
    getAvatars(function(){
      $uibModal.open({
        templateUrl: 'components/account/player/player-avatars-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

          $scope.selectionAvatar = (playerAction.model.playerItem.profileURL) ? playerAction.model.playerItem.profileURL : '';
          $scope.selectVal;

          $scope.avatarsList = playerAction.data.avatarsList;
          $scope.selectAvatar = function (item, index) {
            $scope.selectionAvatar = item.assetURL;
            playerAction.isChoosenAvatar = true;
            $scope.selectVal = index;
          };

          $scope.isAvatarClicked = function (index) {
            if ($scope.selectVal === index) {
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
            //clear cropped image
            playerAction.model.playerItem.imgbase64 = "";
            $uibModalInstance.dismiss('cancel');
          };


        }]
      });
    });
  };

  function getPlayerById() {
    if ($state.params.id) {
      playerAction.isUpdate = true;
      var handleSuccess = function (data) {
        playerAction.data.playerItem = playerAction.model.playerItem = data;
      };

      var handleError = function (error, status) {
        if (status === 401) {
          authService.generateNewToken(function () {
            getPlayerById();
          });
        }
        else {
          messagesFactory.getPlayerbyIDError(status);
        }
      };
      PlayerService.getPlayerById($state.params.id)
        .success(handleSuccess)
        .error(handleError);
    }

  }


  function getAvatars(cb) {

    var handleSuccess = function (data) {
      playerAction.data.avatarsList = data;
      if(cb){
        cb();
      }
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getAvatars();
        });
      }
      else {
        messagesFactory.getPlayerbyIDError(status);
      }
    };
    PlayerService.getAvatarsAPI()
      .success(handleSuccess)
      .error(handleError);
  }

  function isDOBValid() {
    var dobArr = playerAction.model.playerItem.dateofBirth.split("/");
    if (dobArr[0] > 0 && dobArr[1] > 0 && dobArr[2] > 0) {
      playerAction.isDOBVaid = true;
      isDOBCurrentDateExceed(dobArr);
    } else {
      playerAction.isDOBVaid = false;
    }
  }

  function isDOBCurrentDateExceed(selectedDate) {
    var curDate = new Date(), month = selectedDate[0], day = selectedDate[1], year = selectedDate[2];
    if (curDate.getFullYear() === parseInt(year)) {
      if (month >= (curDate.getMonth() + 1)) {
        playerAction.isDOBVaid = false;
      }
    }
  }


}]);

