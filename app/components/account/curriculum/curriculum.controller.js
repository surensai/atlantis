'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'CurriculumService', 'flashService','$scope','$sce','$state','$uibModal','$translate','ngAudio', function ($timeout, CurriculumService, flashService, $scope, $sce, $state,$uibModal,$translate, ngAudio) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.model.wordItem = {};
  curriculum.model.wordItem.imageURL = "assets/images/fallback-img.png";
  curriculum.imageFileError = true;
  curriculum.audioFileError = true;
  curriculum.fileReaderSupported = window.FileReader != null;
  var URL = window.URL || window.webkitURL;

  curriculum.trustResourceURL = function(){
    return $sce.trustAsResourceUrl(curriculum.model.wordItem.audioURL);
  };

  curriculum.searchWord = function(){
      var word = curriculum.model.wordItem.word;
      var handleSuccess = function (data) {
        if($state.current.name === "account.addCustomWord"){
          if (data.length === 0) {
            curriculum.model.message = $translate.instant("curriculum.message.word_notexist");
          } else {
            curriculum.model.message = $translate.instant("curriculum.message.word_exist");
          }
        }else {
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

        }
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
    if($state.current.name === "account.addCustomWord"){
      curriculum.model.wordItem.word = $state.params.word;
    }else{
      var handleSuccess = function (data) {
        if (data.length > 0) {
          curriculum.customWords = [];

          angular.forEach(data, function(word,index) {
            var privateWord = {};
            privateWord.Sno = index+1;
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

  curriculum.submitForm = function (form) {

    curriculum.submitted = true;
    if (form.$valid && curriculum.imageFileError && curriculum.audioFileError) {
      if(curriculum.myAudioFile && curriculum.myImageFile){
        uploadMultipleFiles(form,curriculum.myAudioFile,curriculum.myImageFile);
      }
      else if(curriculum.myAudioFile){
        curriculum.model.wordItem.imageURL = undefined;
        uploadProfilePic(form, curriculum.myAudioFile);
      }
      else if(curriculum.myImageFile){
        curriculum.model.wordItem.audioURL = undefined;
        uploadProfilePic(form, curriculum.myImageFile);
      }
      else{
        curriculum.model.wordItem.imageURL = undefined;
        curriculum.model.wordItem.audioURL = undefined;
        addAction(form);
      }
    } else {
      $timeout(function () {
        angular.element('.custom-error:first').focus();
      }, 200);
    }

  };

  function stuctureFormData() {
    var data = {};
    data.wordName = curriculum.model.wordItem.word;
    data.imageURL = curriculum.model.wordItem.imageURL;
    data.audioURL = curriculum.model.wordItem.audioURL;
    return data;
  }

  function addAction(form) {
    form.$setPristine();
    var formData = stuctureFormData();
    var handleSuccess = function () {
      flashService.showSuccess("Word added successfully!", true);
      $state.go('account.curriculum');
    };

    var handleError = function () {
      flashService.showError("Invalid word credentials", false);
    };

    curriculum.loadPromise = CurriculumService.saveWordApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadMultipleFiles(form,audioFile,imageFile) {
    var handleSuccess = function (data) {
      curriculum.model.wordItem.audioURL = ngAudio.load(data.files[0].url);

      curriculum.loadPromise = CurriculumService.uploadFileApi(imageFile)
        .success(function(data){
          curriculum.model.wordItem.imageURL = data.files[0].url;
          addAction(form);
          flashService.showSuccess("File uploaded successfully!", false);
        })
        .error(function(){
          flashService.showError("Error in file uploading", false);
        });

    };

    var handleError = function () {
      flashService.showError("Error in file uploading", false);
    };

    curriculum.loadPromise = CurriculumService.uploadFileApi(audioFile)
      .success(handleSuccess)
      .error(handleError);
  }



  function uploadProfilePic(form,file) {
    var handleSuccess = function (data) {
      if(data.files[0].type.includes("audio")){
        curriculum.model.wordItem.audioURL = ngAudio.load(data.files[0].url);
      }else{
        curriculum.model.wordItem.imageURL = data.files[0].url;
      }
      addAction(form);
      flashService.showSuccess("File uploaded successfully!", false);
    };

    var handleError = function () {
      flashService.showError("Error in file uploading", false);
    };

    curriculum.loadPromise = CurriculumService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }

  $scope.photoChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (curriculum.fileReaderSupported && file.type.indexOf('image') > -1) {
        curriculum.imageFileError = true;
        $timeout(function () {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            $timeout(function () {
              curriculum.model.wordItem.imageURL = e.target.result;
            });
          };
        });
      }else{
        curriculum.imageFileError = false;
      }
    }
  };

  $scope.audioFileChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (file.type.indexOf('audio') > -1) {
        curriculum.audioFileError = true;
        $timeout(function () {
          var fileURL = URL.createObjectURL(file);
          curriculum.model.wordItem.audioURL = ngAudio.load(fileURL);
        });
      }else{
        curriculum.audioFileError = false;
      }
    }
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
