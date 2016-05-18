/**
 * Created by Gajanan on 5/18/2016.
 * Directive : imageLoadCompleteEvt
 * Directive is used to show image preloader till image loads, lazy loading
 */

"use strict";
angular.module("app").directive('imageLoadCompleteEvt', function ($window) {
  return {
    restrict: 'A',
    scope: {
      ngSrc: '@'
    },
    link: function (scope, element) {
      element.on("load", function () {
        // once the image is loaded then remove the preloader(span element)
        element.parent().find("span").remove();
      });
    }
  };
});

