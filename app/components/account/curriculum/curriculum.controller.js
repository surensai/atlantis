'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', 'flashService','$scope','$state','$uibModal','$translate', function ($timeout, CurriculumService, flashService, $scope, $state,$uibModal,$translate) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.model.wordItem = {};

  curriculum.searchWord = function(){
      var word = curriculum.model.wordItem.wordName;
      var handleSuccess = function (data) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/app-directives/modal/custom-modal.html',
            controller: function ($scope, $uibModalInstance) {
              if (data.length === 0) {
                $scope.modalBody = $translate.instant("curriculum.message.word_notexist_want_procced");
              } else {
                $scope.modalBody =  $translate.instant("curriculum.message.word_exist_want_edit");
              }
              $scope.ok = function () {
                $uibModalInstance.close();
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            }
          });

          modalInstance.result.then(function () {
            $state.go("account.addCustomWord", {word: word});
          }, function () {
            $state.go("account.curriculum");
          });

      };

      var handleError = function () {
        flashService.showError($translate.instant("player.messages.error_getting_words"), false);
      };

      CurriculumService.searchWordApi(word)
        .success(handleSuccess)
        .error(handleError);

  };

  (function () {
    getWords();
  })();
  function getWords() {

      var handleSuccess = function (data) {
        curriculum.customWords = [];
        if (data.length > 0) {
          angular.forEach(data, function(word,index) {
            var privateWord = {};
            privateWord.id = word.id;
            privateWord.Words = word.wordName;
            privateWord.dateAdded = word.createdAt;
            privateWord.picture = false;
            if(word.imageURL){
              privateWord.picture = true;
            }
            curriculum.customWords.push(privateWord);
          });
        }
      };

      var handleError = function () {
        flashService.showError($translate.instant("player.messages.error_getting_words"), false);
      };

      CurriculumService.listWordsApi()
        .success(handleSuccess)
        .error(handleError);

  }
  curriculum.wordsHeaders = {
    Sno: "S. No.",
    Words: "Words",
    dateAdded: "Date Added",
    picture: "Picture",
    actions: "Actions"
  };


  curriculum.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };

  curriculum.deleteListener = function(word){
    var modalInstance = $uibModal.open({
      templateUrl: 'common/app-directives/modal/custom-modal.html',
      controller: function ($scope, $uibModalInstance) {

        $scope.modalTitle = "Warning!";
        $scope.modalBody = $translate.instant("curriculum.message.model_delete_word");
        $scope.ok = function () {
          $uibModalInstance.close(word);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }
    });

    modalInstance.result.then(function (word) {
      curriculum.customWords.splice(curriculum.customWords.indexOf(word),1);

      var handleSuccess = function () {
        flashService.showSuccess($translate.instant("curriculum.message.delete_success"), true);
        $state.go("account.curriculum");

      };

      var handleError = function () {
        flashService.showError($translate.instant("curriculum.message.error_deleting_word"), false);
      };

      CurriculumService.deleteWordApi(word.id)
        .success(handleSuccess)
        .error(handleError);

    }, function () {
      $state.go("account.curriculum");
    });
  };


  curriculum.curriculumdata = [
    {
      milestoneNum: '01',
      milestone: 'Milestone 01'
    },  {
      milestoneNum: '02',
      milestone: 'Milestone 02'
    },
    {
      milestoneNum: '03',
      milestone: 'Milestone 03'
    }, {
      milestoneNum: '04',
      milestone: 'Milestone 04'
    },
    {
      milestoneNum: '05',
      milestone: 'Milestone 05'
    },
    {
      milestoneNum: '06',
      milestone: 'Milestone 06'
    }, {
      milestoneNum: '07',
      milestone: 'Milestone 07'
    }, {
      milestoneNum: '08',
      milestone: 'Milestone 08'
    }, {
      milestoneNum: '09',
      milestone: 'Milestone 09'
    }, {
      milestoneNum: '10',
      milestone: 'Milestone 10'
    }, {
      milestoneNum: '11',
      milestone: 'Milestone 11'
    }, {
      milestoneNum: '12',
      milestone: 'Milestone 12'
    }, {
      milestoneNum: '13',
      milestone: 'Milestone 13'
    }, {
      milestoneNum: '14',
      milestone: 'Milestone 14'
    }, {
      milestoneNum: '15',
      milestone: 'Milestone 15'
    }, {
      milestoneNum: '16',
      milestone: 'Milestone 16'
    }, {
      milestoneNum: '17',
      milestone: 'Milestone 17'
    }, {
      milestoneNum: '18',
      milestone: 'Milestone 18'
    }, {
      milestoneNum: '19',
      milestone: 'Milestone 19'
    }, {
      milestoneNum: '20',
      milestone: 'Milestone 20'
    }];

  curriculum.viewby = 3;
  curriculum.totalItems = curriculum.curriculumdata.length;
  curriculum.currentPage = 1;
  curriculum.itemsPerPage = curriculum.viewby;


}]);
