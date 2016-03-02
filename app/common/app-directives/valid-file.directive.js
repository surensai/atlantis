angular.module("app").directive('validFile',function(){
    return {
        require:'fileModel',
        link:function(scope,el,attrs,ngModel){
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    };
});
