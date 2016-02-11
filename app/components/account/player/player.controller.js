'use strict';

angular.module("app").controller('playerCtrl', ['$scope', '$state', 'PlayerService', 'flashService', 'playersListData', function ($scope, $state, PlayerService, flashService, playersListData) {

  var player = this;
  player.modalTitle = 'Warning!';
  player.modalBody = 'Are you sure do you want to delete player?';
  player.isUpdate = false;
  player.service = PlayerService;

  player.data = {};
  player.data.playersList = [];
  player.data.playerItem = {};
  player.data.deleteObj = {};

  player.model = {};

  (function initController() {
    player.data.playersList = playersListData.data;

    if($state.params.id){
      player.isUpdate = true;
      player.data.playerItem = player.model.playerItem = player.service.getObjById(player.data.playersList, $state.params.id);
    }
  })();

  player.submitForm = function (form) {

    player.submitted = true;
    if (form.$valid) {
      var handleSuccess = function (data) {
        player.model.playerItem.profileURL = data.files[0].url;
        if(player.isUpdate) {
          updateAction();
        } else {
          addAction();
        }
        form.$setPristine();
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
      player.timeout(function () {
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
      flashService.Success("Player added successfully!", true);
      $state.go('account.players');
    };

    var handleError = function () {
      flashService.Error("Invalid player credentials", false);
    };

    player.service.createApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }


  function updateAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      $state.go('account.players');
    };

    var handleError = function () {
      flashService.Error("Invalid player credentials", false);
    };

    player.service.updateApi(player.data.playerItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  }


  player.deleteListener = function (obj) {
    player.data.deleteObj = obj;
  };

  player.deleteAction = function(){

    var handleSuccess = function () {
      player.service.removeItem(player.data.playersList, player.data.deleteObj);
      angular.element('#pop').modal('hide');
      flashService.Success("Player deleted successfully!", false);
    };

    var handleError = function () {
      flashService.Error("Error in deleting", false);
    };

    player.service.deleteApi(player.data.deleteObj.id)
      .success(handleSuccess)
      .error(handleError);
  };

}]);
