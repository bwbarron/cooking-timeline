var gulp = require("gulp");
var connect = require("gulp-connect");

gulp.task("connect", function () {
    connect.server({
        livereload: true
    });
});

gulp.task("reload", function () {
    gulp.src(["*.html", "views/*.html", "css/*.css", "js/*.js"])
        .pipe(connect.reload());
});

gulp.task("watch", function () {
    gulp.watch("*.html", ["reload"]);
    gulp.watch("views/*.html", ["reload"]);
    gulp.watch("css/*.css", ["reload"]);
    gulp.watch("js/*.js", ["reload"]);
});

gulp.task("default", ["watch", "connect"]);