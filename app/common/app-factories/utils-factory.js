'use strict';
angular.module('app').factory('utilsFactory', ['$filter', function ($filter) {

	function getUTCDate(date, format){
		if(!date) {
			return null;
		}
		if(!format){
			return new Date($filter('date')(date, 'MM/dd/yyyy','UTC'));
		}
		return $filter('date')(date, format,'UTC');
	}

	function validateObjectById (obj) {
        if (angular.isUndefined(obj) || jQuery.isEmptyObject(obj)) {
            return true;
        } else if (obj.id !== -1) {
            return true;
        } else {
            return false;
        }
  }

	function isDefinedAndNotNull(textVal) {
		return !_.isUndefined(textVal) && !_.isNull(textVal);
	}

	function utcDateFromString(string){
		if(!string){
			return null;
		}
		return new Date($filter('date')(string, 'MM/dd/yyyy','UTC'));
	}

	function stringFromUtcDate(dateObject,format){
		if(!dateObject){
			return null;
		}
		if(!format){
			return $filter('date')(dateObject, 'yyyy-MM-dd','UTC');
		}
		return $filter('date')(dateObject, format,'UTC');
	}

	function utcDateTimeFromString(string){
		if(!string){
			return null;
		}
		return new Date($filter('date')(string, 'yyyy-MM-ddTHH:mm:ssZ','UTC'));
	}

	function stringFromUtcDateTime(dateTimeObject,format){
		if(!dateTimeObject){
			return null;
		}
		if(!format){
			return $filter('date')(dateTimeObject, 'yyyy-MM-ddTHH:mm:ssZ','UTC');
		}
		return $filter('date')(dateTimeObject, format,'UTC');
	}

	return {
		validateObjectById: validateObjectById,
		isDefinedAndNotNull: isDefinedAndNotNull,
		utcDateFromString:utcDateFromString,
		stringFromUtcDate:stringFromUtcDate,
		utcDateTimeFromString:utcDateTimeFromString,
		stringFromUtcDateTime:stringFromUtcDateTime,
		getUTCDate: getUTCDate
	};
}]);
