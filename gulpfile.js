const gulp = require("gulp");
const minify = require("gulp-babel-minify");

gulp.task("default", () =>
  gulp.src("./gtctoolkit.user.js")
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest("./dist"))
);