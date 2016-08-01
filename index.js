var gulpAuto = require('./gulpfile.js');
/**
 * TODO PLEASE TEST.
 */
gulpAuto.cssTask("dev", false, "../dev/css/**/*.less", "../dev-public/css/", false, true, '> 1%', true, false);
gulpAuto.jsTask("dev", true, "../dev/js/**/*.js", "../dev-public/js/", true, 'global.min.js', false);
gulpAuto.imgTask("dev", "../dev/img/**/*.{png,jpg,jpeg,gif,svg}", "../dev-public/img/");
gulpAuto.htmlTask("dev", true, "../dev/*.html", "../dev-public/", false);
console.log("launching...");
gulpAuto.launch();
console.log("done");
