'use strict';

app.controller('playerCtrl', ['$scope', '$state', 'PlayerService', 'flashService', 'playersListData', '$translate', function ($scope, $state, PlayerService, flashService, playersListData, $translate) {

  var player = this;
  player.scope = $scope;
  player.scope.modalTitle = 'Warning!';
  player.scope.modalBody = 'Are you sure do you want to delete player?';
  player.scope.isUpdate = false;
  player.service = PlayerService;

  player.data = {};
  player.data.playersList = [];
  player.data.playerItem = {};
  player.data.deleteObj = {};

  player.model = {};


  function init(){
    player.data.playersList = playersListData.data;

    if($state.params.id){
      player.scope.isUpdate = true;
      player.data.playerItem = player.model.playerItem = player.service.getObjById(player.data.playersList, $state.params.id);
    }
  }

  player.scope.submitForm = function () {

    player.scope.submitted = true;
    if (player.scope.playerForm.$valid) {
      var handleSuccess = function (data, status) {
        player.model.playerItem.profileURL = data.files[0].url;
        if(player.scope.isUpdate) {
          updateAction();
        } else {
          addAction();
        }
        player.scope.playerForm.$setPristine();
        flashService.Success("File uploaded successfully!", false);
      };

      var handleError = function (error) {
        flashService.Error("Error in deleting", false);
      };
      var file = $scope.myFile;

      player.service.uploadFileApi(file)
        .success(handleSuccess)
        .error(handleError);
    } else {
      player.scope.timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  }

  function stuctureFormData() {
    var data = {};
    data.firstName = player.model.playerItem.firstName;
    data.lastName = player.model.playerItem.lastName;
    data.profileURL = player.model.playerItem.profileURL;
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();
    var handleSuccess = function (data, status) {
      flashService.Success("Player added successfully!", true); //($translate('add_success') try to use this
      $state.go('account.players');
    };

    var handleError = function (error) {
      flashService.Error("Invalid player credentials", false);
    };

    player.service.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }


  function updateAction() {
    var formData = stuctureFormData();
    var handleSuccess = function (data, status) {
      $state.go('account.players');
    };

    var handleError = function (error) {
      flashService.Error("Invalid player credentials", false);
    };

    player.service.updateApi(player.data.playerItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  }


  player.scope.deleteListener = function (obj) {
    player.data.deleteObj = obj;
  }

  player.scope.deleteAction = function(){

    var handleSuccess = function (data, status) {
      player.service.removeItem(player.data.playersList, player.data.deleteObj);
      angular.element('#pop').modal('hide');
      flashService.Success("Player deleted successfully!", false);
    };

    var handleError = function (error) {
      flashService.Error("Error in deleting", false);
    };

    player.service.deleteApi(player.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  }


  init();

}]);
