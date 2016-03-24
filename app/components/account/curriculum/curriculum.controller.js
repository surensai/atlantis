'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', 'flashService', '$scope', '$state', '$uibModal', '$translate', 'messagesFactory', function ($timeout, CurriculumService, flashService, $scope, $state, $uibModal, $translate, messagesFactory) {

  var curriculum = this;
  curriculum.customWords = [];
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.group = {};
  var groupWordCatagory = '6,8';
  curriculum.wordsHeaders = {
    Words: "Words",
    dateAdded: "Date Added",
    picture: "Picture",
    actions: "Actions"
  };

  (function () {
    getWords();
    getWordsByCategory('6,8');
  })();

  curriculum.searchWord = function () {
    var word = curriculum.model.wordItem.wordName;
    var handleSuccess = function (data) {
      var modalInstance = $uibModal.open({
        templateUrl: 'common/app-directives/modal/custom-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          if (data.length === 0) {
            $scope.modalBody = $translate.instant("curriculum.message.word_notexist_want_procced");
          } else {
            $scope.modalBody = $translate.instant("curriculum.message.word_exist_want_edit");
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

  curriculum.submitGroupWords = function () {
    var anatomy_words = [];
    var bathroom_words = [];
    var data = {};
    var i = 0;
    for (i = 0; i < curriculum.group.anatomyWords.length; i++) {
      if (curriculum.group.anatomyWords[i].groupedflag) {
        anatomy_words.push(curriculum.group.anatomyWords[i].Word);
      }
    }
    for (i = 0; i < curriculum.group.bathroomWords.length; i++) {
      if (curriculum.group.bathroomWords[i].groupedflag) {
        bathroom_words.push(curriculum.group.bathroomWords[i].Word);
      }
    }
    data.anatomy_words = anatomy_words;
    data.bathroom_words = bathroom_words;
    var handleSuccess = function (data) {
      messagesFactory.settingsNotificationsSuccessMessages(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.settingsNotificationsErrorMessages(status);
      }
    };
    CurriculumService.updateGroupWordsApi(data)
      .success(handleSuccess)
      .error(handleError);
  };

  curriculum.getKeysOfCollection = function (obj) {
    obj = angular.copy(obj);
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  };

  curriculum.deleteListener = function (word) {
    var modalInstance = $uibModal.open({
      templateUrl: 'common/app-directives/modal/custom-modal.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

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
      curriculum.customWords.splice(curriculum.customWords.indexOf(word), 1);

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

  function getWords() {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        angular.forEach(data, function (word) {

          curriculum.customWords.push({
            id: word.id,
            Words: word.wordName,
            dateAdded: word.createdAt,
            picture: (word.imageURL) ? true : false
          });

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

  function getWordsByCategory(carArr) {
    var handleSuccess = function (data) {
        if (data.anatomy.length > 0) {
          curriculum.group.anatomyWords = [];
          curriculum.group.anatomyWords = data.anatomy;
        }

        if(data.bathroom.length > 0) {
          curriculum.group.bathroomWords = [];
          curriculum.group.bathroomWords = data.bathroom;
        }
    };

    var handleError = function () {
      flashService.showError($translate.instant("player.messages.error_getting_words"), false);
    };

    CurriculumService.getGroupWords(carArr)
      .success(handleSuccess)
      .error(handleError);
  }

}]);
