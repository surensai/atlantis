app.directive('spinner', function() {
  return {
    restrict: 'A',
    scope: {
      spinner: '=',
      doIt: "&doIt"
    },
    link: function(scope, element, attrs) {
      var spinnerButton = angular.element("<button class='btn btn-lg btn-primary btn-block disabled'><i class='glyphicon glyphicon-repeat spinning'></i>Loading...</button>");
      element.after(spinnerButton);

      scope.$watch('spinner', function(showSpinner) {
        spinnerButton.toggle(showSpinner);
        element.toggle(!showSpinner);
      });
    }
  };
});
