'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', 'flashService','$scope','$state','$uibModal','$translate', function ($timeout, CurriculumService, flashService, $scope, $state,$uibModal,$translate) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.group = {};

  curriculum.searchWord = function(){
      var word = curriculum.model.wordItem.wordName;
      var handleSuccess = function (data) {
          var modalInstance = $uibModal.open({
            templateUrl: 'common/app-directives/modal/custom-modal.html',
            controller:  ['$scope','$uibModalInstance',function($scope, $uibModalInstance) {
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
            }]
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
    getAnatomyWords();
    getBathroomWords();
  })();
  function getAnatomyWords(){
    var handleSuccess = function (data) {
      curriculum.group.anatomyWords = [];
      if (data.anatomy.length > 0) {
          curriculum.group.anatomyWords = data.anatomy;
      }
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_words"), false);
    };

    CurriculumService.getGroupWords(6)
      .success(handleSuccess)
      .error(handleError);

  }
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
  function getBathroomWords(){
    var handleSuccess = function (data) {
      curriculum.group.bathroomWords = [];
      if (data.bathroom.length > 0) {
        curriculum.group.bathroomWords = data.bathroom;
      }
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_words"), false);
    };

    CurriculumService.getGroupWords(8)
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
      controller: ['$scope','$uibModalInstance', function ($scope, $uibModalInstance) {

        $scope.modalTitle = "Warning!";
        $scope.modalBody = $translate.instant("curriculum.message.model_delete_word");
        $scope.ok = function () {
          $uibModalInstance.close(word);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
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

}]);
