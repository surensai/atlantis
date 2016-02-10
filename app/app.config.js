/*jslint devel: false, nomen: true, white: true, indent: 4 */
/*globals app, _ ,angular */
/**
 * application configuration for common share controllers,factorier,translations ..etc
 */
var app = angular.module('app').config(['$windowProvider', '$translateProvider', function ( $windowProvider, $translateProvider ) {
	'use strict';

	$translateProvider.useStaticFilesLoader({
	    prefix: 'assets/i18n/',
	    suffix: '.json'
	});

	var browserLanguage = $windowProvider.$get().navigator.language ? $windowProvider.$get().navigator.language : $windowProvider.$get().navigator.browserLanguage;
	if (browserLanguage === undefined) {
		browserLanguage = 'en';
	} else {
		browserLanguage = browserLanguage.toLowerCase();
	}

  	$translateProvider.preferredLanguage('en');

}]);