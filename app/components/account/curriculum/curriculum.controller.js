'use strict';

angular.module("app").controller('curriculumCtrl', ['$timeout', 'PlayerService', 'flashService','$scope','$sce', function ($timeout, PlayerService, flashService, $scope, $sce) {

  var curriculum = this;
  curriculum.model = {};
  curriculum.show = true;
  curriculum.model.wordItem = {};

  curriculum.fileReaderSupported = window.FileReader != null;
  var URL = window.URL || window.webkitURL;

  curriculum.closeAlert = function () {
    curriculum.show = false;
  };

  curriculum.submitForm = function (form) {

    curriculum.submitted = true;
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
    data.word = curriculum.model.wordItem.word;
    data.imageURL = curriculum.model.wordItem.imageURL;
    data.audioURL = $sce.trustAsResourceUrl(curriculum.model.wordItem.audioURL);
    return data;
  }

  function addAction() {
    var formData = stuctureFormData();
    var handleSuccess = function () {
      flashService.showSuccess("Word added successfully!", true);
    };

    var handleError = function () {
      flashService.showError("Invalid word credentials", false);
    };

    curriculum.loadPromise = PlayerService.saveWordApi(formData)
      .success(handleSuccess)
      .error(handleError);
  }

  function uploadProfilePic(form) {
    var handleSuccess = function (data) {
      curriculum.model.wordItem.imageURL = data.files[0].url;
      addAction();
      form.$setPristine();
      flashService.showSuccess("File uploaded successfully!", false);
    };

    var handleError = function () {
      addAction();
      flashService.showError("Error in file uploading", false);
    };
    var file = curriculum.myFile;

    curriculum.loadPromise = PlayerService.uploadFileApi(file)
      .success(handleSuccess)
      .error(handleError);
  }

  $scope.photoChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (curriculum.fileReaderSupported && file.type.indexOf('image') > -1) {
        $timeout(function () {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            $timeout(function () {
              curriculum.model.wordItem.imageURL = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.audioFileChanged = function (files) {
    if (files != null) {
      var file = files[0];
      if (file.type.indexOf('audio') > -1) {
        $timeout(function () {
          var fileURL = URL.createObjectURL(file);
          curriculum.model.wordItem.audioURL = $sce.trustAsResourceUrl(fileURL);
        });
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
