const gulp = require('gulp');
const browserSync = require('browser-sync');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const cache = require('gulp-cache');
const image = require('gulp-image');
const imagemin = require('gulp-imagemin');

// Static server browser-sync
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
});

//Pug
gulp.task('pug', function buildHTML() {
    return gulp.src("dev/pug/*.pug")
        .pipe(changed("dev/pug/*.pug"))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//Styles
gulp.task('styles', function() {
    return gulp.src("dev/stylus/*.styl")
        .pipe(changed("dev/stylus/**/*.styl"))
        .pipe(stylus())
        .pipe(rename({
            prefix: "",
            suffix: ""
        }))
        .pipe(autoprefixer())
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// //Scripts js
// gulp.task('scripts', function() {
//     return gulp.src("dev/js/*.js")
//         .pipe(changed("dev/js/*.js"))
//         .pipe(gulp.dest("build/js"))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

// //Перенос шрифтов в папку build
// gulp.task('fonts', function() {
//     return gulp.src('dev/fonts/*')
//         .pipe(changed('dev/fonts/*'))
//         .pipe(gulp.dest('build/fonts'));
// });

// //Перенос картинок в папку build
// gulp.task('images', function() {
//     return gulp.src('dev/images/**/*')
//         .pipe(changed('dev/images/**/*'))
//         .pipe(image())
//         .pipe(imagemin())
//         .pipe(gulp.dest('build/images/'));
// });

//Сборка библиотек в файл vendor.min.css
gulp.task('stylus-vendor', function() {
    return gulp.src([
            // Библиотеки
            'node_modules/normalize.css/normalize.css'
        ])
        .pipe(concat('vendor.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// //Сборка библиотек в файл vendor.min.js
// gulp.task('scripts-vendor', function() {
//     return gulp.src([
//             // Библиотеки
//             'node_modules/jquery/dist/jquery.min.js',
//             'node_modules/fancybox/dist/js/jquery.fancybox.js',
//             'node_modules/swiper/dist/js/swiper.min.js',
//             'node_modules/jquery.maskedinput/src/jquery.maskedinput.js'
//         ])
//         .pipe(concat('vendor.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest("build/js"))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

//Очистка папки build
gulp.task('clean-build', function() {
    return gulp.src('build', { read: false })
        .pipe(clean());
});

//Очистка кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

//Watcher
gulp.task('watch', function() {
    gulp.watch('dev/stylus/**/*.styl', gulp.parallel("styles"));
    gulp.watch('dev/stylus/*.styl', gulp.parallel("styles"));
    // gulp.watch('dev/js/*.js', gulp.parallel("scripts"));
    gulp.watch('dev/pug/**/*.pug', gulp.parallel("pug"));
    gulp.watch('dev/pug/*.pug', gulp.parallel("pug"));
    gulp.watch('build/*.html', browserSync.reload);
});

//Default
gulp.task('default', gulp.parallel(
    'watch',
    'server',
    'stylus-vendor',
    'styles',
    'pug',
));