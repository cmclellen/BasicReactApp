var
	gulp = require('gulp'),
	react = require('gulp-react'),
	minify_html = require('gulp-minify-html'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	browser_sync = require('browser-sync'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	path = require('path'),
	babel = require('gulp-babel');

var constants = {
	tasks: {
		jsx: 'jsx',
		html: 'html',
		js: 'js',
		browser_sync: 'browser-sync',
		watch: 'watch',
		default: 'default'
	},
	paths: {
		src: './src/',
		dist: './dist/'
	}
};

constants.paths.src_jsx = constants.paths.src + '**/*.jsx';
constants.paths.src_html = constants.paths.src + '**/*.html';
constants.paths.src_js = constants.paths.src + '**/*.js';
constants.paths.dist_js = constants.paths.dist + 'js';
constants.paths.dist_html = constants.paths.dist;

gulp.task(constants.tasks.jsx, function() {
	return gulp.src(constants.paths.src_jsx)
    .pipe(react({harmony: true}))
    .pipe(gulp.dest(constants.paths.dist));
});

gulp.task(constants.tasks.js, function() {
	return gulp.src(constants.paths.src_js)
		.pipe(plumber())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(constants.paths.dist));
});

gulp.task(constants.tasks.html, function() {
	gulp.src(constants.paths.src_html)
		.pipe(plumber())
		.pipe(changed(constants.paths.dist_html))
		.pipe(minify_html())
		.pipe(gulp.dest(constants.paths.dist_html));
});

gulp.task(constants.tasks.browser_sync, function() {
	var files = [constants.paths.dist + '**/*.*'];
	browser_sync.init(files, {
		server: {
			baseDir: constants.paths.dist
		}
	});
});

gulp.task(constants.tasks.watch, function() {
	gulp.watch([constants.paths.src_js], [constants.tasks.js]);
	gulp.watch([constants.paths.src_jsx], [constants.tasks.jsx]);
	gulp.watch([constants.paths.src_html], [constants.tasks.html]);
});

gulp.task(constants.tasks.default, [
	constants.tasks.html,
	constants.tasks.js,
	constants.tasks.jsx,
	constants.tasks.watch,
	constants.tasks.browser_sync
]);