const { src, dest, watch, series } = require ('gulp');

const
    del = require ('gulp-clean'),
    bs = require('browser-sync').create(),
    concat = require('gulp-concat'),
    sass = require('gulp-sass')(require('sass')),
    print = require('gulp-print').default;

//empty path or folder : "."
let folderName = "src";

let watchedHtml = [
    folderName + "/*.html"
];

let minCssName = "style.min.css";
let minCssFolderPath = folderName + "/assets/css"
let watchedCss = [
    folderName + "/*.scss",
    folderName + "/*.css"
];

let jsFolderPath = folderName + "/assets/js"
let watchedJs = [
    jsFolderPath + "/*.js"
];

browsersyncServe = () => {
    bs.init({
        notify : false,
        server : folderName
    });
}
exports.browsersyncServe = browsersyncServe;

browsersyncReload = async () => {
    bs.reload();
}

watchHtml = () => {
    watch(watchedHtml, series(browsersyncReload));
}

copyCss = () => {
    return src(watchedCss)
    .pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
    .pipe(concat(minCssName)) 
    .pipe(dest(minCssFolderPath));
}
exports.copy = copyCss;
watchCss = () => {
    watch(watchedCss, series(copyCss,browsersyncReload));
}

watchJs = () => {
    watch(watchedJs, series(browsersyncReload));
}

delMinifiedCss = () => {
    return src(minCssFolderPath + "/" + minCssName, {read:false, allowEmpty:true})
    .pipe(del())
    .pipe(print());
}
exports.del = delMinifiedCss;

// Todo : on gulp update : restart gulp
// watchGulpFile = () => {
//     watch("gulpfile.js", series());
// }

defaultFunction = async () => {
    copyCss();
    browsersyncServe();
    watchHtml();
    watchCss();
    watchJs();
}
exports.default = defaultFunction;