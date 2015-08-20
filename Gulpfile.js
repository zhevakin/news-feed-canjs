var gulp = require('gulp'),
    serve = require('browser-sync'),
    sync = require('run-sequence'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat');

var paths = {
    app: ['components/**/*.{js,css,html}', 'index.html'],
    css: ['components/**/*.css']
};

gulp.task('build', function () {
    var processors = [
        autoprefixer()
    ];
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('serve', function () {
    serve({
        port: 4500,
        open: false,
        server: {
            baseDir: '.'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.app, ['build', serve.reload]);
});

gulp.task('dev', function (done) {
    sync('build', 'serve', 'watch', done);
});