// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        "jquery": "../../javascripts/lib/jquery-1.11.1.min",
        "jquery-ui":"../../javascripts/lib/jquery-ui-1.10.4.custom.min"

    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['jquery','jquery-ui','../../javascripts/app/main'],function(){});
