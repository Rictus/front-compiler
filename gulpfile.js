'use strict';

//TODO : Revoir les modules deprecated pour utiliser les plus recents
//TODO : gulp-minify-css > gulp-clean-css
//TODO : Ajouter la gestion des fonts
var gulp = require('gulp');
var gulpServer = require('./gulp_submodules/gulpfile_server.js')(gulp);
var gulpCss = require('./gulp_submodules/gulpfile_css.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpHtml = require('./gulp_submodules/gulp_html.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpJs = require('./gulp_submodules/gulpfile_js.js')(gulp, gulpServer.getBrowserSyncInstance);
var gulpImg = require('./gulp_submodules/gulpfile_img.js')(gulp);
var tasksToCompleteBeforeBrowser = [];
var tasksThatReloadBrowser = [];
var startupTasks = [];
var tksNames;

function isArray(obj) {
    return typeof obj === "object" && typeof obj.length === "number";
}

var megaConf = {
    css: {},
    js: {},
    img: {},
    html: {}
};
var browserSync = {
    active: false
};

/**
 *
 * @param taskName
 * @param streamJs
 * @param watchPath
 * @param destPath
 * @param concat
 * @param renameTo
 * @param uglify
 */
var jsTask = function (taskName, streamJs, watchPath, destPath, concat, renameTo, uglify) {
    streamJs = !!streamJs;
    concat = !!concat;
    uglify = !!uglify;
    renameTo = typeof renameTo === "string" ? renameTo : "global.min.js";
    megaConf["js"].active = true;
    megaConf["js"].module = gulpJs;
    megaConf["js"][taskName] = {
        active: true,
        streamJs: streamJs,
        watchPath: watchPath,
        destPath: destPath,
        concat: concat,
        renameTo: renameTo,
        uglify: uglify
    };
};

/**
 *
 * @param taskName
 * @param streamCss
 * @param watchPath
 * @param destPath
 * @param concat
 * @param concatedFilename
 * @param autoprefix
 * @param autoprefixString
 * @param less
 * @param minify
 */
var cssTask = function (taskName, streamCss, watchPath, destPath, concat, concatedFilename, autoprefix, autoprefixString, less, minify) {
    streamCss = !!streamCss;
    concat = !!concat;
    concatedFilename = typeof concatedFilename === "string" ? concatedFilename : "style.min.css";
    autoprefix = !!autoprefix;
    autoprefixString = typeof autoprefix === "string" ? autoprefix : '> 1%';
    less = !!less;
    minify = !!minify;
    megaConf["css"]["active"] = true;
    megaConf["css"].module = gulpCss;
    megaConf["css"][taskName] = {
        active: true,
        streamCss: streamCss,
        watchPath: watchPath,
        destPath: destPath,
        concat: concat,
        renameTo: concatedFilename,
        autoprefix: autoprefix,
        autoprefixString: autoprefixString,
        less: less,
        minify: minify
    };
};

/**
 *
 * @param taskName
 * @param watchPath
 * @param destPath
 */
var imgTask = function (taskName, watchPath, destPath) {
    megaConf["img"].active = true;
    megaConf["img"].module = gulpImg;
    megaConf["img"][taskName] = {
        active: true,
        watchPath: watchPath,
        destPath: destPath
    };
};

/**
 *
 * @param taskName
 * @param streamHTML
 * @param watchPath
 * @param destPath
 * @param minify
 */
var htmlTask = function (taskName, streamHTML, watchPath, destPath, minify) {
    minify = !!minify;
    megaConf["html"].active = true;
    megaConf["html"].module = gulpHtml;
    megaConf["html"][taskName] = {
        active: true,
        streamHTML: streamHTML,
        watchPath: watchPath,
        destPath: destPath,
        minify: minify
    };
};

/**
 * Only one browserTask is allowed.
 * @param baseDir           The directory from where the browser is launched. Usually same directory as your index.html
 * @param indexUrl          The name of your index.html file
 * @param serverPort        The port where to launch the server
 * @param browsers          A string describing which browser to launch. Default value is your default browser.
 *                          Supposedly, you would be able to launch multiple browsers. But never succeed.
 *                          Example : "google chrome"
 * @param reloadOnTasks     An array containing all your tasks names from where the browser should be reloaded when its completed.
 */
var browserTask = function (baseDir, indexUrl, serverPort, browsers, reloadOnTasks) {
    reloadOnTasks = isArray(reloadOnTasks) ? reloadOnTasks : [];
    browsers = isArray(browsers) ? browsers : [browsers];
    browserSync = {
        active: true,
        baseDir: baseDir,
        indexUrl: indexUrl,
        serverProt: serverPort,
        browsers: browsers,
        reloadOnTasks: reloadOnTasks
    };
};


var launch = function () {
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

    if (browserSync["active"]) {
        gulpServer.init(browserSync, tasksToCompleteBeforeBrowser, tasksThatReloadBrowser);
        startupTasks.push(gulpServer.getTasksNames());
    }

    gulp.task('default', startupTasks, function () {
        console.log(startupTasks);
    });
};

cssTask("dev", false, "../test/dev/*.less", "../test/prod/", true, "style.min.css", true, '> 1%', true, true);
jsTask("dev", false, "../test/dev/*.js", "../test/prod/", true, "global.min.js", true);
imgTask("dev", "../test/dev/*.{jpg,png,jpeg,gif,svg}", "../test/prod/");
htmlTask("dev", false, "../test/dev/*.html", "../test/prod/", true);
launch();
