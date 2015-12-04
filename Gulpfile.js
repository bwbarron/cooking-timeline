var gulp = require("gulp");
var connect = require("gulp-connect");

gulp.task("connect", function () {
    connect.server({
        root: ".",
        livereload: true
    });
});

gulp.task("watch", function () {
    gulp.watch("index.html", connect.reload());
    gulp.watch("/css/main.css", connect.reload());
    gulp.watch("/js/*.js", connect.reload());
});

gulp.task("default", ["watch", "connect"]);