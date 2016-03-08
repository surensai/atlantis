'use strict';

angular.module("app").controller('playerCtrl', ['$timeout', '$state', 'PlayerService', 'flashService', '$scope', function ($timeout, $state, PlayerService, flashService, $scope) {

    var player = this;
    player.model = {};
    player.data = {};
    player.modalTitle = 'Warning!';
    player.modalBody = 'Are you sure do you want to delete player?';
    player.data.playersList = [];
    player.playerObj = {};
    player.data.deleteObj = {};
    player.show = true;
    player.reverse = false;
    player.displayChartIndex = 0;
    player.predicate = 'Sno';

    player.getKeysOfCollection = function (obj) {
        obj = angular.copy(obj);
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    };

    player.closeAlert = function () {
        player.show = false;
    };

    (function () {
        getPlayers();
    })();

    function getPlayers() {
        var handleSuccess = function (data) {
            if (data) {
                var playerId = data[0].id;
                if ($state.params.id) {
                    playerId = $state.params.id;
                }
                player.data.playersList = data;
                player.playerObj = PlayerService.getObjById(data, playerId);
                $state.go('account.players.details', {id: playerId});
            }
        };

        var handleError = function () {
            flashService.showError("Error in getting players", false);
        };

        player.loadPromise = PlayerService.getAllApi()
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

    player.bigBadges =  [{
        milestone: 'Milestone 01',
        percentage: '130%',
        type: 'badge-gold'
    },{
        milestone: 'Milestone 02',
        percentage: '100%',
        type: 'badge-silver'
    },{
        milestone: 'Milestone 03',
        percentage: '80%',
        type: 'badge-bronze'
    },{
        milestone: 'Milestone 04',
        percentage: '120%',
        type: 'badge-silver'
    }, {
      milestone: 'Milestone 05',
      percentage: '115%',
      type: 'badge-silver'
    },{
      milestone: 'Milestone 06',
      percentage: '90%',
      type: 'badge-bronze'
    },{
      milestone: 'Milestone 07',
      percentage: '50%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 08',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 09',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 10',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 11',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 12',
      percentage: '0%',
      type: 'badge-inactive'
    }, {
      milestone: 'Milestone 13',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 14',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 15',
      percentage: '0%',
      type: 'badge-inactive'
    },{
      milestone: 'Milestone 16',
      percentage: '0%',
      type: 'badge-inactive'
    }];

    player.wordsData = [
        {
            'Sno': 1,
            'Words': "Apple",
            'Attempts': 9,
            'LastPlayed': "1288323623006",
            'LastAttempt': false
        },
        {
            'Sno': 2,
            'Words': "Cat",
            'Attempts': 1,
            'LastPlayed': "1288323628006",
            'LastAttempt': true
        },
        {
            'Sno': 3,
            'Words': "Book",
            'Attempts': 8,
            'LastPlayed': "1288323623806",
            'LastAttempt': false
        },
        {
            'Sno': 4,
            'Words': "Zoo",
            'Attempts': 7,
            'LastPlayed': "1288323623096",
            'LastAttempt': true
        },
        {
            'Sno': 5,
            'Words': "Pot",
            'Attempts': 8,
            'LastPlayed': "1288323622006",
            'LastAttempt': true
        },
        {
            'Sno': 6,
            'Words': "Apple",
            'Attempts': 3,
            'LastPlayed': "1288323623006",
            'LastAttempt': true
        }
    ];

    player.drag = 'drag feedback';
    player.drop = 'drop feedback';

    player.showGraph = function (index) {
        player.displayChartIndex = index;
    };

}]);
