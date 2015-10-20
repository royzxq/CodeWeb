var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('default', function() {
	gulp.src([
		'public/js/app/app.js',
		'public/js/app/**/*.js'
		])
	.pipe(concat('oj.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/js/build'));

	gulp.src([
		'public/js/graph/graph_ui.js',
		'public/js/graph/graph.js'
		])
	.pipe(concat('graph.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/js/build'));

	gulp.src([
		'public/js/graph/graph_ui.js',
		'public/js/graph/graph_fruch.js'
		])
	.pipe(concat('graph_fruch.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/js/build'));

	gulp.src([
		'public/js/graph/graph_ui.js',
		'public/js/graph/force.js'
		])
	.pipe(concat('force.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/js/build'));

	gulp.src('public/images/*')
	.pipe(imagemin({
		progressive: true,
		use: [jpegtran()]
	}))
	.pipe(gulp.dest('public/js/build'));

	gulp.src([
		'public/stylesheets/wp-backgrounds.css',
		'public/stylesheets/style.css'
		])
	.pipe(concat('layout.min.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('public/stylesheets'));

	gulp.src([
		'public/stylesheets/wp-backgrounds.css',
		'public/stylesheets/style.css',
		'public/stylesheets/graph.css',
		'public/stylesheets/mjCont.css'
		])
	.pipe(concat('graph_layout.min.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('public/stylesheets'));



});