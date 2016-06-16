'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', '$rootScope', 'CurriculumService', 'flashService', '$scope', '$state', '$uibModal', 'messagesFactory', '$translate', 'utilsFactory', 'AuthenticationService','appService', function ($timeout, $rootScope, CurriculumService, flashService, $scope, $state, $uibModal, messagesFactory, $translate, utilsFactory, authService, appService) {
  var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
  var curriculum = this;
  curriculum.customWords = [];
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.model.previousWrdItm = "";
  curriculum.addImgInTableRowItem = null;
  curriculum.model.isWordPrsnt = false;
  curriculum.model.customWrdImgArr = [];
  curriculum.curriculumForm = {};
  curriculum.model.customWrdImgURLArr = [];
  curriculum.group = {};
  curriculum.showSizeLimitError = false;
  curriculum.fileReaderSupported = window.FileReader != null;
  curriculum.model.bannedWordList = [];
  curriculum.model.editCustomWrdSubmited = false;
  curriculum.sortType = {};
  curriculum.itemsPerPage = 10;

  curriculum.onEditCustomWord = function (wordItem) {
    curriculum.model.editCustomWrdSubmited = true;
    if (!wordItem.Words || wordItem.Words === "") {
      return;
    }
    //update once updated
    if (wordItem.isEditMode) {
      var isNewFileAdded = false;
      for (var fileCounter = 0; fileCounter < wordItem.picture.length; fileCounter++) {
        if (wordItem.picture[fileCounter].fileObj) {
          isNewFileAdded = true;
          break;
        }
      }
      if (isNewFileAdded) {
        //upload images then update the word
        curriculum.onUploadCustomWordImages(wordItem.picture, wordItem.isEditMode, wordItem);
      } else {
        //Update existing word
        curriculum.model.customWrdImgURLArr = [];
        curriculum.onUpdateCustomWords(wordItem);
      }
    } else {
      curriculum.model.previousWrdItm = wordItem.Words;
      curriculum.model.editCustomWrdSubmited = false;
    }
    wordItem.isEditMode = !wordItem.isEditMode;

  };

  function structureFormData() {
    var data = {};
    data.wordName = curriculum.model.wordItem.wordName;
    data.imageURL = curriculum.model.customWrdImgURLArr;
    data.audioURL = "";
    return data;
  }

  curriculum.onSaveCustomWords = function () {
    var formData = structureFormData();
    var handleError = function (error, status) {
      messagesFactory.savewordsError(status);
    };
    var handleSuccess = function (data) {
      messagesFactory.savewordsSuccess(data);
      clearCustomWordData(curriculum.curriculumForm);
      var word = getCustomWordObj(data);
      curriculum.customWords.push(word);
    };
    CurriculumService.saveWordApi(formData, userID)
      .success(handleSuccess)
      .error(handleError);
  };

  curriculum.onUploadCustomWordImages = function (localImgFilesArr, isUpdateMode, wordItem) {
    //clear
    curriculum.model.customWrdImgURLArr = [];
    var fileObjArr = [];
    var handleSuccess = function (data) {
      for (var dataCounter = 0; dataCounter < data.files.length; dataCounter++) {
        curriculum.model.customWrdImgURLArr.push(data.files[dataCounter].url);
      }
      //call save custom word
      if (!isUpdateMode && curriculum.model.customWrdImgURLArr.length === curriculum.model.customWrdImgArr.length) {
        //Save - Created new word
        curriculum.onSaveCustomWords();
      } else if (isUpdateMode && wordItem && fileObjArr.length === curriculum.model.customWrdImgURLArr.length) {
        //Update existing word
        curriculum.onUpdateCustomWords(wordItem);
      }
    };
    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          CurriculumService.uploadMultipleFileApi(fileObjArr)
            .success(handleSuccess)
            .error(handleError);
        });
      }
      else {
        messagesFactory.uploadfileError(status);
      }
    };
    for (var fileCounter = 0; fileCounter < localImgFilesArr.length; fileCounter++) {
      if (localImgFilesArr[fileCounter].fileObj) {
        fileObjArr.push(localImgFilesArr[fileCounter].fileObj);
      }
    }
    CurriculumService.uploadMultipleFileApi(fileObjArr)
      .success(handleSuccess)
      .error(handleError);
  };
  /*
   * Save Custom word and add images array
   * */
  curriculum.onUpdateCustomWords = function (wordItem) {
    var handleError = function (error, status) {
      messagesFactory.updatewordsError(status);
      wordItem.Words = curriculum.model.previousWrdItm;
    };
    var handleSuccess = function (data) {
      messagesFactory.updatewordSuccess(data);
    };
    //parse data.
    var formData = {};
    formData.id = wordItem.id;
    formData.wordName = wordItem.Words;
    formData.audioURL = "";
    for (var fileUpdateCounter = 0; fileUpdateCounter < wordItem.picture.length; fileUpdateCounter++) {
      if (!wordItem.picture[fileUpdateCounter].fileObj) {
        curriculum.model.customWrdImgURLArr.push(wordItem.picture[fileUpdateCounter].image64Bit);
      }
    }
    formData.imageURL = curriculum.model.customWrdImgURLArr;
    CurriculumService.updateWordApi(wordItem.id, formData)
      .success(handleSuccess)
      .error(handleError);
  };

  curriculum.searchWord = function (word, curriculumForm) {
    curriculum.curriculumForm = curriculumForm;
    var handleSuccess = function (data) {
      if (!isWordPresent(data)) {
        curriculum.model.isWordPrsnt = false;
        //check images added or not
        if (curriculum.model.customWrdImgArr.length > 0) {
          curriculum.onUploadCustomWordImages(curriculum.model.customWrdImgArr);
        } else {
          //save word without image
          curriculum.onSaveCustomWords();
        }
      } else {
        curriculum.model.isWordPrsnt = true;
      }
    };
    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          CurriculumService.searchWordApi(word)
            .success(handleSuccess)
            .error(handleError);
        });
      }
      else {
        messagesFactory.customisesearchwordError(status);
      }
    };
    if (word && curriculumForm.$valid) {
      CurriculumService.searchWordApi(word)
        .success(handleSuccess)
        .error(handleError);
    }
  };
  curriculum.onNewcustomWrdAddImg = function (index) {
    if (curriculum.model.customWrdImgArr.length > 0) {
      curriculum.model.customWrdImgArr.splice(index, 1);
    }
  };
  //Check the owner property in data
  function isWordPresent(dataArr) {
    var isWordPrst = false;
    for (var wrdCounter = 0; wrdCounter < dataArr.length; wrdCounter++) {
      if (dataArr[wrdCounter].hasOwnProperty("owner")) {
        isWordPrst = true;
        break;
      }
    }
    return isWordPrst;
  }

  $scope.photoChanged = function (inputFileObj) {
    var files = inputFileObj.files;
    if (curriculum.model.customWrdImgArr.length < 5) {
      if (files.length > 0) {
        var file = (files.length > 0) ? files[0] : null;
        if (file && file.size <= 5242880) {
          curriculum.showSizeLimitError = false;
          if (curriculum.fileReaderSupported && file && file.type.indexOf('image') > -1) {
            curriculum.fileError = true;
            $timeout(function () {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = function (e) {
                $timeout(function () {
                  var obj = {fileObj: file, image64Bit: e.target.result};
                  curriculum.model.customWrdImgArr.push(obj);
                  //clear the input file value once it is cropped & rendered(issue with selection of same file event is not triggering)
                  inputFileObj.value = null;
                });
              };
            });
          } else {
            curriculum.fileError = false;
          }
        } else {
          curriculum.showSizeLimitError = true;
        }
      }
    } else {
      curriculum.fileUploadExceedErr = true;
    }
  };

  curriculum.onAddImageInRow = function (wrdItm) {
    curriculum.addImgInTableRowItem = wrdItm;
  };

  $scope.updateCustomWrdPhoto = function (inputFileObj) {
    var files = inputFileObj.files, index = curriculum.customWords.indexOf(curriculum.addImgInTableRowItem);
    if (files.length > 0) {
      //Restricting file upload to 5MB i.e (1024*1024*5)
      var file = (files.length > 0) ? files[0] : null;
      if (file && file.size <= 5242880) {
        if (curriculum.fileReaderSupported && file && file.type.indexOf('image') > -1) {
          $timeout(function () {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
              $timeout(function () {
                var obj = {fileObj: file, image64Bit: e.target.result};
                curriculum.customWords[index].picture.push(obj);
                //clear the input file value once it is cropped & rendered(issue with selection of same file event is not triggering)
                inputFileObj.value = null;
              });
            };
          });
        } else {
          curriculum.fileError = false;
        }
      } else {
        curriculum.showSizeLimitError = true;
      }
    }
  };

  curriculum.onClearCustomWordDetails = function (curriculumForm) {
    clearCustomWordData(curriculumForm);
  };

  function groupWordsArrMan(sourceArr){
    var arr = [];
    for (var i = 0; sourceArr.length > i; i++) {
      if (sourceArr[i].length > 0) {
        for (var ii = 0; sourceArr[i].length > ii; ii++) {
          if (sourceArr[i][ii].groupedflag) {
            arr.push(sourceArr[i][ii].Word);
          }
        }
      }
    }
    return arr;
  }

  curriculum.submitGroupWords = function () {
    var data = {};
    data.bathroom_words = data.anatomy_words = [];
    if (curriculum.group.bathroomWords.length > 0) {
      data.bathroom_words = groupWordsArrMan(curriculum.group.bathroomWords);
    }
    if (curriculum.group.anatomyWords.length > 0) {
      data.anatomy_words = groupWordsArrMan(curriculum.group.anatomyWords);
    }

    var handleSuccess = function (data) {
      messagesFactory.submitGroupwordsSuccess(data);
    };

    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          curriculum.submitGroupWords();
        });
      } else {
        messagesFactory.submitGroupwordsError(status);
      }
    };
    CurriculumService.updateGroupWordsApi(data)
      .success(handleSuccess)
      .error(handleError);
  };

  curriculum.deleteListener = function (word) {
    var modalInstance = $uibModal.open({
      templateUrl: 'components/account/curriculum/delete-word.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

        $scope.modalTitle = $translate.instant("common.delete");
        $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word");
        $scope.delete = function () {
          $uibModalInstance.close(word);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });

    modalInstance.result.then(function (word) {
      curriculum.customWords.splice(curriculum.customWords.indexOf(word), 1);
      if(curriculum.customWords.length % curriculum.itemsPerPage === 0){
        curriculum.currentPage = (curriculum.currentPage === 1)? 1 : curriculum.currentPage - 1;
      }
      var handleSuccess = function (data) {
        messagesFactory.deletewordSuccess(data);
        $state.go("account.curriculum");
      };

      var handleError = function (error, status) {
        if (status === 401) {
          authService.generateNewToken(function () {
            CurriculumService.deleteWordApi(word.id)
              .success(handleSuccess)
              .error(handleError);
          });
        }
        else {
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

  curriculum.onRemoveImage = function (index, imageURLArr) {
    $uibModal.open({
      templateUrl: 'components/account/curriculum/delete-word.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = $translate.instant("common.delete");
        $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word_image");
        $scope.delete = function () {
          $uibModalInstance.close();
          imageURLArr.splice(index, 1);
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  };

  function clearCustomWordData(curriculumForm) {
    curriculum.model.wordItem.wordName = "";
    curriculumForm.$setPristine();
    curriculum.model.customWrdImgArr = [];
    curriculum.model.customWrdImgURLArr = [];
    curriculum.model.isWordPrsnt = false;
  }

  function getWords() {
    var handleSuccess = function (data) {
      if (data.length > 0) {
        angular.forEach(data, function (word) {
          var formatedWrd = getCustomWordObj(word);
          curriculum.customWords.push(formatedWrd);
        });
      }
    };
    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getWords();
        });
      }
      else {
        messagesFactory.listwordsError(status);
      }
    };
    curriculum.customWords = [];
    CurriculumService.listWordsApi(userID)
      .success(handleSuccess)
      .error(handleError);
  }

  function getCustomWordObj(word) {
    var customWrdObj, formatedDate, date = new Date(word.createdAt), imageURLArr = [], imgObj;
    //image url validation
    if (word.imageURL) {
      if (angular.isArray(word.imageURL)) {
        for (var imgCounter = 0; imgCounter < word.imageURL.length; imgCounter++) {
          imgObj = {fileObj: null, image64Bit: word.imageURL[imgCounter]};
          imageURLArr.push(imgObj);
        }
      } else {
        imgObj = {fileObj: null, image64Bit: word.imageURL};
        imageURLArr.push(imgObj);
      }
    }
    formatedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    customWrdObj = {
      id: word.id,
      Words: word.wordName,
      dateAdded: word.createdAt,
      picture: imageURLArr,
      isEditMode: false,
      formatedDate: formatedDate
    };
    return customWrdObj;
  }

  function getWordsByCategory(carArr) {
    var handleSuccess = function (data) {
      if (data.anatomy && data.anatomy.length > 0) {
        var totalAnatomyWords = [];
        for (var anatomyIndex = 0; data.anatomy.length > anatomyIndex; anatomyIndex++) {
          if (data.anatomy[anatomyIndex].groupedflag) {
            totalAnatomyWords.push(data.anatomy[anatomyIndex]);
          }
        }
        if (totalAnatomyWords.length === data.anatomy.length) {
          curriculum.checkselectAll = true;
        }
        curriculum.group.anatomyWords = [];
        var sortedanatomyArr = appService.simpleSort(data.anatomy, 'Word');
        curriculum.group.anatomyWords = utilsFactory.chunkArray(sortedanatomyArr, 4);
      }

      if (data.bathroom && data.bathroom.length > 0) {
        var totalBathroomWords = [];
        for (var bathIndex = 0; data.bathroom.length > bathIndex; bathIndex++) {
          if (data.bathroom[bathIndex].groupedflag) {
            totalBathroomWords.push(data.bathroom[bathIndex]);
          }
        }
        if (totalBathroomWords.length === data.bathroom.length) {
          curriculum.selectedAll = true;
        }
        curriculum.group.bathroomWords = [];
        var sortedbathroomArr = appService.simpleSort(data.bathroom, 'Word');
        curriculum.group.bathroomWords = utilsFactory.chunkArray(sortedbathroomArr, 4);
      }
    };
    var handleError = function (error, status) {
      if (status === 401) {
        authService.generateNewToken(function () {
          getWordsByCategory(carArr);
        });
      }
      else {
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
      curriculum.checkselectAll = (totalCount === arrBooleanCount) ? true : false;
    } else {
      curriculum.selectedAll = (totalCount === arrBooleanCount) ? true : false;
    }
  };

  curriculum.onAddBanWord = function (banWordForm) {
    var handleSuccess = function () {
      curriculum.model.banWord = "";
      banWordForm.$setPristine();
      getBannedWordsList();
    };

    var handleError = function(){
      if (status === 401) {
        authService.generateNewToken(function () {
          curriculum.onAddBanWord(banWordForm);
        });
      }
    };

    if (curriculum.model.banWord) {
      var banWordObj = {"word": curriculum.model.banWord};
      CurriculumService.createBannedWordAPI(userID, banWordObj)
        .success(handleSuccess)
        .error(handleError);
    }
  };

  curriculum.onDeleteBanWord = function (banWord) {
    var handleSuccess = function () {
      getBannedWordsList();
    };

    var handleError = function(){
      if (status === 401) {
        authService.generateNewToken(function () {
          curriculum.onDeleteBanWord(banWord);
        });
      }
    };

    $uibModal.open({
      templateUrl: 'components/account/curriculum/delete-word.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.modalTitle = $translate.instant("common.delete");
        $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word");
        $scope.delete = function () {
          $uibModalInstance.close();
          CurriculumService.deleteBannedWordAPI(userID, banWord.id)
            .success(handleSuccess)
            .error(handleError);
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]
    });
  };

  curriculum.customWordListSort = function(type){
    if(typeof curriculum.sortType.reverse === "undefined"){
      curriculum.sortType.reverse = false;
    } else {
      curriculum.sortType.reverse = (curriculum.sortType.reverse) ? false : true;
    }
    curriculum.sortType.column = type;
    curriculum.customWords = appService.simpleSort(curriculum.customWords, type, curriculum.sortType.reverse);
  };

  function getBannedWordsList() {
    var handleSuccess = function (data) {
      curriculum.model.bannedWordList = data;
    };

    var handleError = function(){
      if (status === 401) {
        authService.generateNewToken(function () {
          getBannedWordsList();
        });
      }
    };

    CurriculumService.getBannedWordsAPI(userID)
      .success(handleSuccess)
      .error(handleError);
  }

  (function () {
    getWords();
    getWordsByCategory('6,8');
    getBannedWordsList();
    flashService.showPreviousMessage();
  })();
}]);
