var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

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
		'public/js/graph/force.js'
		])
	.pipe(concat('force.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/js/build'));

});