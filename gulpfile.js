var gulp = require('gulp');
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var rjs = require('gulp-requirejs');
// add required packages
var sass = require('gulp-sass');
var uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
var livereload = require('gulp-livereload');
// var pump = require('pump');

gulp.task('connect', function() {
	connect.server({
		port: 3000,
		livereload: true,
		root: ['dist', 'dist/html']
	});
});

gulp.task('jade', function() {
	gulp.src('src/jade/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('dist/html'))
		.pipe(connect.reload());
});

gulp.task('sass', function() {
	return gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
	return gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('requireJS', function(cb) {
	// pump([
	// 		gulp.src('lib/*.js'), 
	// 		uglify(),
	// 		gulp.dest('dist')
	// 	], cb
	// ); // doesn't work yet
	rjs({
		baseUrl: 'src/js',
		name: '../../node_modules/almond/almond',
		include: ['app'],
		insertRequire: ['app'],
		out: 'bundle.js',
		wrap: true
	})
	.pipe(gulp.dest('dist/js'))
	.pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(['src/js/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload(server));
});

gulp.task('watch', function() {
	gulp.watch('src/jade/*.jade', ['jade']);
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/js/*.js', ['requireJS']);
});

gulp.task('default', ['requireJS', 'jade', 'sass', 'connect', 'js', 'watch']);