let project_folder = "dist";
let source_folder = "#src";
let {
    src,
    dest
} = require(`gulp`),
    gulp = require(`gulp`),
    browsersync = require("browser-sync").create(),
    fileinclude = require(`gulp-file-include`),
    del = require(`del`),
    scss = require(`gulp-sass`),
    imagemin = require("gulp-imagemin");

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/*.js",
        img: source_folder + "/img/**/*.{jpg,png,gif,webp,svg}",
        fonts: source_folder + "/fonts/*.otf",
    },
    watch: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,gif,webp,svg}",
        fonts: source_folder + "/fonts/*.otf",
    },
    clean: "./" + project_folder + "/"
}

const browserSync = () => {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false,
    })
}

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

const images = () => {
    return src(path.src.img)
        .pipe(
            imagemin({
                optimizationLevel: 3,
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                interlaced: true,
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

const fonts = () => {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browsersync.stream())
}

const js = () => {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

const css = () => {
    return src(path.src.css)
        .pipe(scss())
        .pipe(fileinclude())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

const clean = () => {
    return del(path.clean);
}

const watchFiles = () => {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.img], images)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, fonts, gulp.parallel(html, css, images, js, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);


exports.html = html;
exports.css = css;
exports.images = images;
exports.js = js;
exports.fonts = fonts;
exports.watch = watch;
exports.build = build;
exports.default = watch;