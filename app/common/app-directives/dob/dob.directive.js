+app.directive('dob', function () {
  return {
    restrict: 'EA',
    scope: {
      birthDate: '=birthDate'
    },
    templateUrl: 'common/app-directives/dob/dob.view.html',
    controller: function ($scope) {

        $scope.days = [];
        $scope.dob = {};
        $scope.dob.year = '';
        $scope.dob.month = '';
        $scope.dob.day = '';
        $scope.months = [
          {'id': 1, 'name': 'January'},
          {'id': 2, 'name': 'February'},
          {'id': 3, 'name': 'March'},
          {'id': 4, 'name': 'April'},
          {'id': 5, 'name': 'May'},
          {'id': 6, 'name': 'June'},
          {'id': 7, 'name': 'July'},
          {'id': 8, 'name': 'August'},
          {'id': 9, 'name': 'September'},
          {'id': 10, 'name': 'October'},
          {'id': 11, 'name': 'November'},
          {'id': 12, 'name': 'December'}
        ];

        $scope.getYears = function (startYear) {
          var currentYear = new Date().getFullYear(), years = [];
          startYear = startYear || currentYear - 130;

          while (startYear <= currentYear) {
            years.push(startYear++);
          }
          return years.reverse();
        };

        function setDays (numDays) {
          var days = [], i = 1;
          while (i <= numDays) {
            days.push(i++);
          }
          $scope.days = days;
        }

        function daysInMonth(month, year) {
          return new Date(year, month, 0).getDate();
        }

        function setDOBFormate(month, day, year) {
          month = (month)? month : 0;
          day = (day)? day : 0;
          year = (year)? year : 0;
          return month + "/" + day + "/" + year;
        }

        setDays(30);

        $scope.$watchGroup(['dob.month', 'dob.day', 'dob.year'], function (newValues, oldValues, scope) {
          scope.birthDate = setDOBFormate(scope.dob.month, scope.dob.day, scope.dob.year);
          if(scope.dob.month){
            setDays(daysInMonth(scope.dob.month, scope.dob.year));
          }
        });

        $scope.$watch('birthDate', function (newValue, oldValue,scope) {
          if(newValue){
            var val = newValue.split("/");
            if(val.length > 1){
              if(!isNaN(val[0]) && !isNaN(val[1]) && !isNaN(val[2])){
                scope.dob.month = parseInt(val[0]);
                scope.dob.day = parseInt(val[1]);
                scope.dob.year = parseInt(val[2]);
              }
            } else {
              scope.dob.month = new Date(scope.birthDate).getMonth() + 1;
              scope.dob.day = new Date(scope.birthDate).getDate();
              scope.dob.year = new Date(scope.birthDate).getFullYear();
            }

          }
        });

    }
  };
});

