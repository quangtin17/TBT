const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const data = require('gulp-data');
const fs = require('fs');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
let dev = true;
const dataJson = require('./data/data.json');
gulp.task('liquify', () => {
	gulp.src('app/*.{html,liquid}')
		.pipe($.liquify(dataJson, {base: 'app/_includes'}))
	.pipe(gulp.dest('.tmp'))
	.pipe(reload({stream: true}));
});

gulp.task('styles', () => {
	return gulp.src('app/src/*.scss')
	.pipe($.plumber())
	.pipe($.if(dev, $.sourcemaps.init()))
	.pipe($.sass.sync({
		outputStyle: 'expanded',
		precision: 10,
		includePaths: ['.']
	}).on('error', $.sass.logError))
	.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
	.pipe($.if(dev, $.sourcemaps.write()))
	.pipe(gulp.dest('.tmp/src'))
	.pipe(reload({stream: true}));
});
gulp.task('json', () => {
	return gulp.src('data/*.json')
		.pipe(reload({ stream: true }));
});
gulp.task('scripts', () => {
	return gulp.src('app/scripts/**/*.js')
	.pipe($.plumber())
	.pipe($.if(dev, $.sourcemaps.init()))
	.pipe($.babel())
	.pipe($.if(dev, $.sourcemaps.write('.')))
	.pipe(gulp.dest('.tmp/scripts'))
	.pipe(reload({stream: true}));
});

function lint(files) {
	return gulp.src(files)
	.pipe($.eslint({ fix: true }))
	.pipe(reload({stream: true, once: true}))
	.pipe($.eslint.format())
	.pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
	return lint('app/scripts/**/*.js')
	.pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
	return lint('test/spec/**/*.js')
	.pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['liquify', 'styles', 'scripts'], () => {
	return gulp.src('.tmp/*.html')
	.pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
	.pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
	.pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
	.pipe($.if(/\.html$/, $.htmlmin({
		collapseWhitespace: false,
		minifyCSS: true,
		minifyJS: {compress: {drop_console: true}},
		processConditionalComments: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true
	})))
	.pipe(gulp.dest('dist'))
});

gulp.task('images', () => {
	return gulp.src('app/images/**/*')
	.pipe($.cache($.imagemin()))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
	.concat('app/fonts/**/*'))
	.pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
	return gulp.src([
	'app/*',
	'!app/*.html'
	], {
	dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
	runSequence(['clean', 'wiredep'], ['liquify', 'styles', 'scripts', 'fonts'], () => {
	browserSync.init({
		notify: false,
		port: 9000,
		server: {
		baseDir: ['.tmp', 'app'],
		routes: {
			'/bower_components': 'bower_components',
		'/node_modules': 'node_modules'
		}
		}
	});

	gulp.watch([
		'.tmp/*.html',
		'.tmp/*.liquid',
		'data/*.json',
		'app/images/**/*',
		'.tmp/fonts/**/*'
	]).on('change', reload);
	gulp.watch(['app/*.{html,liquid}', 'app/_includes/*.{html,liquid}'], ['liquify']);
	gulp.watch('app/src/**/*.scss', ['styles']);
	gulp.watch('data/*.json', ['json']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/fonts/**/*', ['fonts']);
	gulp.watch('bower.json', ['wiredep', 'fonts']);
	});
});

gulp.task('serve:dist', ['default'], () => {
	browserSync.init({
	notify: false,
	port: 9000,
	server: {
		baseDir: ['dist']
	}
	});
});

gulp.task('serve:test', ['scripts'], () => {
	browserSync.init({
	notify: false,
	port: 9000,
	ui: false,
	server: {
		baseDir: 'test',
		routes: {
		'/scripts': '.tmp/scripts',
		'/bower_components': 'bower_components'
		}
	}
	});

	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
	gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
	gulp.src('app/src/*.scss')
	.pipe($.filter(file => file.stat && file.stat.size))
	.pipe(wiredep({
		ignorePath: /^(\.\.\/)+/
	}))
	.pipe(gulp.dest('app/src'));

	gulp.src('app/*.html')
	.pipe(wiredep({
		exclude: ['bootstrap-sass'],
		ignorePath: /^(\.\.\/)*\.\./
	}))
	.pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
	return new Promise(resolve => {
	dev = false;
	runSequence(['clean', 'wiredep'], 'build', resolve);
	});
});