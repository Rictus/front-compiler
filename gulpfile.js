'use strict';
var gulp = require('gulp');
//TODO : Separer les confs pour en faire devenir des parametres
//TODO : Les parametres de confs qui ne doivent pas sortir d'ici peuvent rester ici. Il faudra merge des objets..
//TODO : Ajouter la cmd de lancement de compilation et de watch dans package.json comme script start
//TODO : Revoir les modules deprecated pour utiliser les plus recents
//TODO : gulp-minify-css > gulp-clean-css
//TODO : Ajouter la gestion des fonts
var gulpServer = require('./gulp_submodules/gulpfile_server.js')(gulp);
var gulpCss = require('./gulp_submodules/gulpfile_css.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpHtml = require('./gulp_submodules/gulp_html.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpJs = require('./gulp_submodules/gulpfile_js.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpImg = require('./gulp_submodules/gulpfile_img.js')(gulp);
var tasksToCompleteBeforeBrowser = [];
var tasksThatReloadBrowser = [];
var startupTasks = [];
var tksNames;
var megaConf = {
    css: {
        active: false,
        module: gulpCss,
        dev: {
            active: true,
            streamCss: false,
            watchPath: "../dev/css/**/*.less",
            destPath: "../dev-public/css/",
            concat: false,
            autoprefix: true,
            autoprefixString: '> 1%',
            less: true,
            minify: false
        },
        prod: {
            active: true,
            streamCss: false,
            watchPath: "../dev/css/**/*.less",
            destPath: "../prod/css/",
            renameTo: "style.min.css",
            concat: true,
            autoprefix: true,
            autoprefixString: '> 1%',
            less: true,
            minify: true
        }
    },
    js: {
        active: false,
        module: gulpJs,
        dev: {
            active: true,
            streamJs: true,
            watchPath: "../dev/js/**/*.js",
            destPath: "../dev-public/js/",
            concat: true,
            renameTo: 'global.min.js',
            uglify: false
        },
        prod: {
            active: true,
            streamJs: false,
            watchPath: "../dev/js/**/*.js",
            destPath: "../prod/js/",
            concat: true,
            renameTo: 'global.min.js',
            uglify: true
        }
    },
    img: {
        active: false,
        module: gulpImg,
        dev: {
            active: true,
            watchPath: "../dev/img/**/*.{png,jpg,jpeg,gif,svg}",
            destPath: "../dev-public/img/"
        },
        prod: {
            active: true,
            watchPath: "../dev/img/**/*.{png,jpg,jpeg,gif,svg}",
            destPath: "../prod/img/"
        }
    },
    html: {
        active: false,
        module: gulpHtml,
        dev: {
            active: true,
            streamHTML: true,
            watchPath: "../dev/*.html",
            destPath: "../dev-public/",
            minify: false
        },
        prod: {
            active: true,
            streamHTML: true,
            watchPath: "../dev/*.html",
            destPath: "../prod/",
            minify: true
        }
    }
};

var browerSync = {
    active: true,
    baseDir: "../prod/",
    indexUrl: "index_color.html",
    serverPort: 3001,
    browsers: ["google chrome"],
    reloadOnTasks: []
};


///loop through confs

for (var key in megaConf) {
    if (megaConf.hasOwnProperty(key) && megaConf[key].active) {
        var responsibleModule = megaConf[key].module;
        responsibleModule.init(megaConf[key]);
        tksNames = responsibleModule.getTasksNames();
        tasksToCompleteBeforeBrowser = tasksToCompleteBeforeBrowser.concat(tksNames);
        tasksThatReloadBrowser = tasksThatReloadBrowser.concat(tksNames);
        startupTasks = startupTasks.concat(tksNames);
    }
}

if (browerSync.active) {
    gulpServer.init(browerSync, tasksToCompleteBeforeBrowser, tasksThatReloadBrowser);
    startupTasks.push(gulpServer.getTasksNames());
}

gulp.task('default', startupTasks, function () {
    console.log(startupTasks);
});


function initCss(taskName, cssConfs) {
    var isArray = function (obj) {
        return typeof obj === "object" && typeof obj.length === "number";
    };
    if (!isArray(cssConfs)) {
        cssConfs = [cssConfs];
    }
    var defaultCssConf = {
        active: false,
        module: gulpCss
    };

    megaConf.css[taskName] = cssConfs;
    //WIP
    //WIP
}


/**
 * Merge all properties of object 1 to object 2
 * @param obj1
 * @param obj2
 * @returns {*}
 */
function mergeObj(obj1, obj2) {
    for (var prop in obj1) {
        if (obj1.hasOwnProperty(prop)) {
            obj2[prop] = obj1[prop];
        }
    }
    return obj2;
}