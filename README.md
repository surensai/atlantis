# square-panda-parent-portal

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## prerequisite

npm install  
bower install  


## Project Folder Structure

app/                                                                  
----- common/   // acts as reusable components or partials of our site  
---------- app-directives/  
--------------- dob/  
--------------------dob.directive.js  
--------------------dob.view.html  
--------------- modal/  
--------------------modal.directive.js  
--------------------modal.view.html  
----- components/   // each component is treated as a mini Angular app  
---------- home/  
--------------- homeController.js  
--------------- homeService.js  
--------------- homeView.html  
----- app.module.js  
----- app.routes.js  
assets/  
----- img/      // Images and icons for your app  
----- css/      // All styles and style related files (SCSS or LESS files)  
----- js/       // JavaScript files written for your app that are not for angular  
----- libs/     // Third-party libraries such as jQuery, Moment, Underscore, etc.  
layout/  // All HTML partials like header/footer   
----- header.html  
----- footer.html  
index.html



## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
