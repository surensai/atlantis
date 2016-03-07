'use strict';

angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'flashService', 'PlayerService', '$timeout', function ($scope, $state, flashService, PlayerService, $timeout) {
    var playerAction = this;
    playerAction.model = {};
    playerAction.data = {};
    playerAction.isUpdate = false;
    playerAction.model.playerItem = {};

    (function () {
        getPlayerById();
    })();


    playerAction.submitForm = function (form) {

        playerAction.submitted = true;
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
        data.firstName = playerAction.model.playerItem.firstName;
        data.lastName = playerAction.model.playerItem.lastName;
        data.profileURL = playerAction.model.playerItem.profileURL;
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

        playerAction.loadPromise = PlayerService.createApi(formData)
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

        playerAction.loadPromise = PlayerService.updateApi(playerAction.data.playerItem.id, formData)
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
            flashService.showSuccess("File uploaded successfully!", false);
        };

        var handleError = function () {
            if (playerAction.isUpdate) {
                updateAction();
            } else {
                addAction();
            }
            flashService.showError("Error in file uploading", false);
        };
        var file = playerAction.myFile;

        playerAction.loadPromise = PlayerService.uploadFileApi(file)
            .success(handleSuccess)
            .error(handleError);
    }

    playerAction.fileReaderSupported = window.FileReader != null;

    $scope.photoChanged = function (files) {
        if (files != null) {
            var file = files[0];
            if (playerAction.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function () {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            playerAction.model.playerItem.profileURL = e.target.result;
                        });
                    };
                });
            }
        }
    };

    function getPlayerById() {
        if ($state.params.id) {
            playerAction.isUpdate = true;
            var handleSuccess = function (data) {
                playerAction.data.playerItem = playerAction.model.playerItem = data;
            };

            var handleError = function () {
                flashService.showError("Error in getting player", false);
            };

            playerAction.loadPromise = PlayerService.getPlayerById($state.params.id)
                .success(handleSuccess)
                .error(handleError);
        }

    }
}]);
