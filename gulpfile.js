const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const devConfig = require('./webpack.config.js').dev;
//const prodConfig = require('./webpack.config.js').prod;
const pump = require('pump');

gulp.task('webpack', function(cb){
  webpack(devConfig, function(err, stats){
    if(err) throw err;
  });
  cb();
});

//TODO: Write prod webpack config to transpile and minify
// gulp.task('webpack-minify', function(cb){
//   pump([
//     gulp.src('src/js/main.js'),
//     webpack(prodConfig),
//     gulp.dest('public/js')
//   ],cb);
// });

gulp.task('default', ['webpack'], function(cb){
  return nodemon({
    delay: 10,
    ignore: ['public/**/*.*'],
    scripts: {
      start: 'node app.js'
    },
    tasks: ['webpack'],
    watch: '**/*.*'
  });
});
