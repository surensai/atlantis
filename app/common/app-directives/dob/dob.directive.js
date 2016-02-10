'use strict';
angular.module("app").directive('dob', function () {
    return {
        restrict: 'EA',
        scope: {
           source: '='
        },
        templateUrl: 'common/app-directives/dob/dob.view.html',
        transclude: true,
        controller: function ($scope) {

            function daysInMonth(month, year) {
              return new Date(year, month, 0).getDate();
            }

            function setDOBFormate(month, day, year){
              return month + "-" + day + "-" + year;
            }

            $scope.days = ($scope.dob) ? daysInMonth($scope.dob.year, $scope.dob.month) :30;
            $scope.dob = {};
            $scope.dob.year = 1;
            $scope.dob.month = 1;
            $scope.dob.day = 1;
            $scope.months = [
              { 'id' :1, 'name' : 'January' },
              { 'id' :2, 'name' : 'February'},
              { 'id' :3, 'name' : 'March'},
              { 'id' :4, 'name' : 'April'},
              { 'id' :5, 'name' : 'May'},
              { 'id' :6, 'name' : 'June'},
              { 'id' :7, 'name' : 'July'},
              { 'id' :8, 'name' : 'August'},
              { 'id' :9, 'name' : 'September'},
              { 'id' :10,'name' : 'October' },
              { 'id' :11,'name' : 'November'},
              { 'id' :12,'name' : 'December'}
            ];

            $scope.getYears = function(startYear) {
                var currentYear = new Date().getFullYear(), years = [];
                startYear = startYear || 1980;

                while ( startYear <= currentYear ) {
                        years.push(startYear++);
                }
                return years;
            };

            $scope.getDays = function() {
                var days = [], i = 1;
                while ( i <= $scope.days ) {
                        days.push(i++);
                }
                return days;
            };

            $scope.$watchGroup(['dob.year', 'dob.month', 'dob.day'], function(newValues, oldValues, scope) {
                if (newValues[0]){
                  scope.source = setDOBFormate(scope.dob.month, scope.dob.day, scope.dob.year);
                }

                if (newValues[1]){
                  scope.source = setDOBFormate(scope.dob.month, scope.dob.day, scope.dob.year);
                }

                if (newValues[2]){
                  scope.source = setDOBFormate(scope.dob.month, scope.dob.day, scope.dob.year);
                }
            });


        }
    };
});

//
            //$scope.source = ($scope.dob) ? $scope.dob.year : "";
