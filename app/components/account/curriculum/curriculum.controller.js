'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', '$scope', '$state', '$uibModal', 'messagesFactory', '$translate', 'utilsFactory', function ($timeout, CurriculumService, $scope, $state, $uibModal, messagesFactory, $translate, utilsFactory) {

  var curriculum = this;
  curriculum.customWords = [];
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.group = {};
  curriculum.wordsHeaders = {
    Words: $translate.instant("curriculum.customword_headers.words"),
    picture: $translate.instant("curriculum.customword_headers.picture"),
    actions: $translate.instant("curriculum.customword_headers.actions")
  };

  var customWordsCsv = [];

  (function () {
    getWords();
    getWordsByCategory('6,8');
  })();

  curriculum.searchWord = function () {
    var word = curriculum.model.wordItem.wordName, isWordPrsnt = isWordPresent(word);
    var handleSuccess = function (data) {
      var modalInstance = $uibModal.open({
        templateUrl: 'common/app-directives/modal/custom-modal.html',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.modalTitle = "Confirm";
          if (data.length === 0 && !isWordPrsnt) {
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
        if (isWordPrsnt) {
          $state.go("account.editCustomWord", {id: curriculum.model.wordItem.id});
        } else {
          $state.go("account.addCustomWord", {word: word});
        }
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

  //Check word in Local NodeJS server
  function isWordPresent(word) {
    //check if words array length is zero
    if (!curriculum.customWords || curriculum.customWords.length === 0) {
      return false;
    }
    //find the word in Words Array
    for (var wordCounter = 0; wordCounter < curriculum.customWords.length; wordCounter++) {
      var localdbWrd = curriculum.customWords[wordCounter].Words;
      if (word.toLowerCase() === localdbWrd.toLowerCase()) {
        curriculum.model.wordItem = curriculum.customWords[wordCounter];
        return true;
      }
    }
    return false;
  }

  curriculum.submitGroupWords = function () {
    var anatomy_words = [];
    var bathroom_words = [];
    var data = {};

    if (curriculum.group.anatomyWords.length > 0) {
      for (var j = 0; curriculum.group.anatomyWords.length > j; j++) {
        if (curriculum.group.anatomyWords[j].length > 0) {
          for (var k = 0; curriculum.group.anatomyWords[j].length > k; k++) {
            if (curriculum.group.anatomyWords[j][k].groupedflag) {
              anatomy_words.push(curriculum.group.anatomyWords[j][k].Word);
            }
          }
        }
      }
    }

    if (curriculum.group.bathroomWords.length > 0) {
      for (var i = 0; curriculum.group.bathroomWords.length > i; i++) {
        if (curriculum.group.bathroomWords[i].length > 0) {
          for (var ii = 0; curriculum.group.bathroomWords[i].length > ii; ii++) {
            if (curriculum.group.bathroomWords[i][ii].groupedflag) {
              bathroom_words.push(curriculum.group.bathroomWords[i][ii].Word);
            }
          }
        }
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

        $scope.modalTitle = $translate.instant("common.warning");
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
      customWordsCsv.splice(customWordsCsv.indexOf(word), 1);
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
            picture: (word.imageURL)
          });

          customWordsCsv.push({
            Words: word.wordName,
            dateAdded: word.createdAt
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
        curriculum.group.anatomyWords = utilsFactory.chunkArray(sortedanatomyArr, 4);
      }

      if (data.bathroom && data.bathroom.length > 0) {
        curriculum.group.bathroomWords = [];
        var sortedbathroomArr = sortWordsData(data.bathroom);
        curriculum.group.bathroomWords = utilsFactory.chunkArray(sortedbathroomArr, 4);
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

  curriculum.checkAll = function (type, arr) {
    if (arr.length > 0) {
      for (var i = 0; arr.length > i; i++) {
        if (arr[i].length > 0) {
          for (var ii = 0; arr[i].length > ii; ii++) {
            arr[i][ii].groupedflag = type;
          }
        }
      }
    }
  };

  curriculum.checkItemBy = function (topIndex, index, arr, type, selectType) {
    arr[topIndex][index].groupedflag = type;
    var arrBooleanCount = 0;
    var totalCount = 0;
    if (arr.length > 0) {
      for (var i = 0; arr.length > i; i++) {
        if (arr[i].length > 0) {
          totalCount = totalCount + arr[i].length;
          for (var ii = 0; arr[i].length > ii; ii++) {
            if (arr[i][ii].groupedflag) {
              arrBooleanCount++;
            }
          }
        }
      }
    }
    if (selectType === 'anatomy') {
      if (totalCount === arrBooleanCount) {
        curriculum.checkselectAll = true;
      } else {
        curriculum.checkselectAll = false;
      }
    } else {
      if (totalCount === arrBooleanCount) {
        curriculum.selectedAll = true;
      } else {
        curriculum.selectedAll = false;
      }
    }
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

  curriculum.getCSVHeader = function () {
    var arr = [];
    arr[0] = $translate.instant("curriculum.customword_headers.words");
    arr[1] =   $translate.instant("curriculum.customword_headers.date");
    return arr;
    return arr ;
  };
  curriculum.getCustomWordExportData = function () {
    return customWordsCsv;
  };


}]);
