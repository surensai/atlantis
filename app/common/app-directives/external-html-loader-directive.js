/**
 * Created by Gajanan on 6/28/2016.
 *@externalHtmlPageLoaderDir
 * Directive is used to load the external html content in div element
 */

angular.module('app').directive('externalHtmlPageLoaderDir', ['$parse', function ($parse) {
  return {
    scope: {
      htmlPageUrl: '=',
      isExternalHtmlDataLoaded: '='
    },
    restrict: 'AE',
    link: function ($scope, element, attrs) {
      var htmlPageUrl = $parse(attrs.htmlPageUrl)($scope.$parent);

      function loadExternalHtmlPageData(htmlPageUrl) {
        if (!htmlPageUrl) {
          throw new Error('htmlPageUrl is required!');
        }
        //append the external html content to div
        element.load(htmlPageUrl, function (responseTxt, statusTxt) {
          if (statusTxt == "success") {
            //Success - "External content loaded successfully!"
            $scope.isExternalHtmlDataLoaded = true;
            $scope.$apply();
            // once the html data is loaded then remove the preloader(span element)
            element.parent().find("span").remove();
          }
          if (statusTxt == "error") {
            //Error - "Error: " + xhr.status + ": " + xhr.statusText
          }
        });
      }

      htmlPageUrl = (htmlPageUrl.valueOf()) ? htmlPageUrl : "";
      loadExternalHtmlPageData(htmlPageUrl)
    }
    //end of link method
  }
}]);
