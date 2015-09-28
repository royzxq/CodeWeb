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

});