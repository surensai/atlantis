'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', '$rootScope','CurriculumService', '$scope', '$state', '$uibModal', 'messagesFactory', '$translate', 'utilsFactory', function ($timeout, $rootScope, CurriculumService, $scope, $state, $uibModal, messagesFactory, $translate, utilsFactory) {
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
  var curriculum = this;
  curriculum.customWords = [];
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.group = {};

  curriculum.wordsHeaders = {
    Words: $translate.instant("curriculum.customword_headers.word"),
    picture: $translate.instant("curriculum.customword_headers.picture"),
    actions: $translate.instant("curriculum.customword_headers.actions")
  };

  var customWordsCsv = [];
  (function () {
    getWords();
    getWordsByCategory('6,8');
  })();
  curriculum.searchWord = function (word) {
      var handleSuccess = function (data) {
        if( curriculum.customWords.length >=50){
          $uibModal.open({
            templateUrl: 'common/app-directives/modal/custom-modal.html',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.modalTitle = $translate.instant('curriculum.customword_modaltitle');
              $scope.modalBody = $translate.instant('curriculum.customword_modalbody');
              $scope.modalType = $translate.instant('curriculum.customword_modaltype');
              $scope.close = function () {
                $uibModalInstance.dismiss('cancel');
              };
            }]
          });
        }else {
          var isWordPrsnt = false;
        var modalInstance = $uibModal.open({
          templateUrl: 'common/app-directives/modal/custom-modal.html',
          controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
            $scope.modalTitle =  $translate.instant("common.confirm");
            if (data.length > 0) {
              isWordPrsnt = (data[0].owner) ? true : false;
              $scope.modalBody = $translate.instant("curriculum.message.word_exist_want_edit");
            } else {
              isWordPrsnt = false;
              $scope.modalBody = $translate.instant("curriculum.message.word_notexist_want_procced");
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
            $state.go("account.editCustomWord", {id: data[0].id});
          } else {
            $state.go("account.addCustomWord", {word: word});
          }
        }, function () {
          $state.go("account.curriculum");
        });


      };
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
          var date =new Date(word.createdAt);
          var formatedDate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
          curriculum.customWords.push({
            id: word.id,
            Words: word.wordName,
            dateAdded: word.createdAt,
            picture: (word.imageURL)
          });

          customWordsCsv.push({
            Words: word.wordName,
            dateAdded: formatedDate
          });

        });
      }
      curriculum.viewby = 10;
      curriculum.totalItems = curriculum.customWords.length;
      curriculum.currentPage = 1;
      curriculum.itemsPerPage = curriculum.viewby;
    };
    var handleError = function (error, status) {
      if (error && status) {
        messagesFactory.listwordsError(status);
      }
    };
    CurriculumService.listWordsApi(userID)
      .success(handleSuccess)
      .error(handleError);

  }

  function getWordsByCategory(carArr) {
    var handleSuccess = function (data) {
      if (data.anatomy && data.anatomy.length > 0) {
        var totalAnatomyWords = [];
        for(var i=0; data.anatomy.length > i; i++){
          if(data.anatomy[i].groupedflag){
            totalAnatomyWords.push(data.anatomy[i]);
          }
        }
        if(totalAnatomyWords.length === data.anatomy.length){
          curriculum.checkselectAll = true;
        }
        curriculum.group.anatomyWords = [];
        var sortedanatomyArr = sortWordsData(data.anatomy);
        curriculum.group.anatomyWords = utilsFactory.chunkArray(sortedanatomyArr, 4);
      }

      if (data.bathroom && data.bathroom.length > 0) {
        var totalBathroomWords = [];
        for(var i=0; data.bathroom.length > i; i++){
          if(data.bathroom[i].groupedflag){
            totalBathroomWords.push(data.bathroom[i]);
          }
        }
        if(totalBathroomWords.length === data.bathroom.length){
          curriculum.selectedAll = true;
        }
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
    arr[0] = $translate.instant("curriculum.customword_headers.word");
    arr[1] =   $translate.instant("curriculum.customword_headers.created_date");
    return arr;
  };
  curriculum.getCustomWordExportData = function () {
    return customWordsCsv;
  };
}]);
