'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', '$scope', '$state', '$uibModal', 'messagesFactory', '$translate', function ($timeout, CurriculumService, $scope, $state, $uibModal, messagesFactory, $translate) {

  var curriculum = this;
  curriculum.customWords = [];
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.group = {};
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
          $scope.modalTitle = "Confirm";
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

    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.customisesearchwordError(status);
      }
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
      messagesFactory.submitGroupwordsSuccess(data);
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.submitGroupwordsError(status);
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

      var handleSuccess = function (data) {
        messagesFactory.deletewordSuccess(data);
        $state.go("account.curriculum");
      };

      var handleError = function (error, status) {
        if (error && status) {
          messagesFactory.deletewordError(status);
        }
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
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.listwordsError(status);
      }
    };
    CurriculumService.listWordsApi()
      .success(handleSuccess)
      .error(handleError);

  }

  function getWordsByCategory(carArr) {
    var handleSuccess = function (data) {
      if (data.anatomy && data.anatomy.length > 0) {
        curriculum.group.anatomyWords = [];


        var sortedanatomyArr = sortWordsData(data.anatomy);
        curriculum.group.anatomyWords = chunk(sortedanatomyArr, 4);
      }

      if (data.bathroom && data.bathroom.length > 0) {
        curriculum.group.bathroomWords = [];
        var sortedbathroomArr = sortWordsData(data.bathroom);
        curriculum.group.bathroomWords = chunk(sortedbathroomArr, 4);
      }
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.getGroupwordsError(status);
      }
    };
    CurriculumService.getGroupWords(carArr)
      .success(handleSuccess)
      .error(handleError);
  }

  curriculum.checkAll = function (event, selectedAll, words) {
    angular.element("#href-remove a").removeAttr("href");
    event.stopPropagation();

    if (selectedAll) {
      selectedAll = true;
    } else {
      selectedAll = false;
    }
    angular.forEach(words, function (item) {
      item.groupedflag = selectedAll;
    });
  };

  function sortWordsData(arr) {
    arr.sort(function (a, b) {
      if (a.Word.toLowerCase() < b.Word.toLowerCase()) {
        return -1;
      }
      if (a.Word.toLowerCase() > b.Word.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    for (var i = 0; i < arr.length; i++) {
      arr[i].Word;
    }
    return arr;
  }

  function chunk(arr, size) {
    var newArr = [];
    size = arr.length / 4;
    size = Math.ceil(size);
    for (var i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

}]);
