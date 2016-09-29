const gulp = require('gulp');
const pump = require('pump');

const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const nodemon = require('gulp-nodemon');
const order = require('gulp-order');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const zip = require('gulp-zip');

gulp.task('jsMinify', function (cb) {
  pump([
    gulp.src('./public/js/main.js'),
    babel({
      presets: ['babili'],
      comments: false
    }),
    replace('Opinionated','O'),
    rename({suffix: '.min'}),   
    gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('jsDeploy', ['jsMinify'], function(cb){
  pump([
    gulp.src(['./public/js/*.js', '!./public/js/main.js']), 
    order([
      'knockout.min.js',
      'knockout.mapping.min.js',
      'main.js'
    ]),
    concat('main.js'),
    gulp.dest('./deploy/public/js')
  ],
  cb
  );
});

gulp.task('cssDeploy', function(cb){
  pump([
    gulp.src('./public/css/*.css'),
    cleanCSS(),
    gulp.dest('./deploy/public/css')
  ],
  cb
  );
});

gulp.task('copyDeploy', function(cb){
  pump([
    gulp.src(['./app.js', 
              './helpers.js', 
              './playerFactory.js', 
              './roomFactory.js', 
              './wsMsg.js',
              './node_modules/**',
              './public/favicon.ico',
              './package.json'
             ], {base: '.'}),
    gulp.dest('./deploy')
  ],
  cb
  );
});

gulp.task('htmlDeploy', ['jsDeploy'], function(cb){
  pump([
    gulp.src('./views/*.vash'),
    inject(gulp.src('./deploy/public/js/*.js'),
           {
            removeTags: true, 
            ignorePath: '/deploy/public/'
           }),
    gulp.dest('./deploy/views')
  ],
  cb
  );
  
});

gulp.task('deploy', ['cssDeploy', 'copyDeploy', 'htmlDeploy'], function(cb){
  pump([
    gulp.src('./deploy/**'),
    zip('deploy.zip'),
    gulp.dest('./')
  ],
  cb
  );
});

gulp.task('htmlDev', function(cb){
  pump([
    gulp.src('./views/*.vash'),
    
    inject(gulp.src(['./public/js/*.js', '!./public/js/main.min.js'])
           .pipe(order([
                  'knockout.min.js',
                  'knockout.mapping.min.js',
                  'main.js'
                ])),
           {
            ignorePath: '/public/'
           }),
    gulp.dest('./views')
  ],
  cb
  );
});

gulp.task('watch', ['htmlDev'], function(cb){
  return nodemon();
});