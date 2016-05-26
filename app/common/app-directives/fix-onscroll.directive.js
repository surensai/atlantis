"use strict";
angular.module("app").directive('setClassWhenAtTop', function ($window) {
  // wrap window object as jQuery object
  var $win = angular.element($window);

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // get CSS class from directive's attribute value
      var topClass = attrs.setClassWhenAtTop,
      // get element's top relative to the document
        offsetTop = element.offset().top;

      $win.on('scroll', function () {
        if ($win.scrollTop() >= offsetTop) {
          element.addClass(topClass);
        } else {
          element.removeClass(topClass);
        }
      });
    }
  };
});
