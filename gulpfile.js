const gulp = require("gulp");
const inlineCss = require("gulp-inline-css");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const fileinclude = require("gulp-file-include");
const PATH = {
  HTML: "src/html",
  SCSS: "src/scss",
};
const DEST_PATH = {
  HTML: "build/html",
  CSS: "build/css/",
};

gulp.task("serve", () => {
  browserSync.init({
    server: "",
  });
  gulp
    .watch("**/**/*.html", ["html", "inline", "scss"])
    .on("change", browserSync.reload);
});

gulp.task("scss", () => {
  gulp
    .src(PATH.SCSS + "**/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(DEST_PATH.CSS))
    .pipe(browserSync.stream());
});

gulp.task("inline", () => {
  gulp
    .src(DEST_PATH.HTML + "/*.html")
    .pipe(
      inlineCss({
        removeHtmlSelectors: true,
      })
    )
    .pipe(gulp.dest("build/"));
});

gulp.task("html", () => {
  return new Promise((resolve) => {
    gulp
      .src(PATH.HTML + "/*.html")
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file",
        })
      )
      .pipe(gulp.dest(DEST_PATH.HTML))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
    resolve();
  });
});

gulp.task("default", ["serve", "scss"], () => {
  gulp.watch("./src/scss/**/*.scss", ["scss", "inline", "html"]);
});
