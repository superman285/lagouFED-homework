// 实现这个项目的构建任务

const {src, dest, series, parallel, watch} = require('gulp');

const fs = require('fs');

const del = require('del');

const browserSync = require('browser-sync');

const useRef = require('gulp-useref');
const gulpIf = require('gulp-if');

const eslint = require('gulp-eslint');

const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin');

const sass = require('gulp-sass');
const babel = require('gulp-babel');
const swig = require('gulp-swig');

const tinypngFree = require('gulp-tinypng-free');
const fontSpider = require('gulp-font-spider');

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = ()=> {
  return src('src/assets/styles/*.scss', {base: 'src'})
    .pipe(sass({
      ouutputStyle: 'expanded'
    }))
    .pipe(dest('temp'))

}

const script = ()=> {
  return src('src/assets/scripts/*.js',{base: 'src'})
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest('temp'))
}

const page = ()=> {
  return src('src/*.html',{base: 'src'})
    .pipe(swig({
      data,
      defaults: { cache: false } }))
    .pipe(dest('temp'))
}

const image = ()=> {
  return src('src/assets/images/*',{base: 'src'})
    .pipe(tinypngFree({}))
    .pipe(dest('dist'))
}

const font = ()=> {
  return src('src/assets/fonts/*',{base: 'src'})
    .pipe(fontSpider())
    .pipe(dest('dist'))
}

const extraCopy = () => {
  return src('public/**',{base: 'public'})
    .pipe(dest('dist'))
}


const compile = parallel(style,script,page);

const clean = ()=> {
  return del(['dist','temp'])
}


const bs = browserSync.create();

const devServer = ()=> {
  watch('src/*.html',page)
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/scripts/*.js',script)

  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    files: 'temp/**',
    server: {
      baseDir: ['temp','src','public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const prodServer = ()=> {
  bs.init({
    files: 'dist/**',
    server: {
      notify: false,
      baseDir: ['dist'],
    }
  })
}





const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(useRef({
      searchPath: ['temp', '.']
    }))
    .pipe(gulpIf(/\.js$/,uglify()))
    .pipe(gulpIf(/\.css$/,cleanCss()))
    .pipe(gulpIf(/\.html$/,htmlMin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

const build = series(clean, parallel(series(compile,useref), image, font, extraCopy));

const serve = series(compile,devServer);
const start = series(build,prodServer);

const lint = ()=> {
  return src('src/assets/scripts/*.js')
    .pipe(eslint({
      "parserOptions": {
        "ecmaVersion": 10
      },
      rules: {
        'no-alert': 0,
        'no-bitwise': 0,
        'camelcase': 1,
        'curly': 1,
        'eqeqeq': 0,
        'no-eq-null': 0,
        'guard-for-in': 1,
        'no-empty': 1,
        'no-use-before-define': 0,
        'no-obj-calls': 2,
        'no-unused-vars': 0,
        'new-cap': 1,
        'no-shadow': 0,
        "strict": [2, "never"],
        'no-invalid-regexp': 2,
        'comma-dangle': 2,
        'no-undef': 1,
        'no-new': 1,
        'no-extra-semi': 1,
        'no-debugger': 2,
        'no-caller': 1,
        'semi': 1,
        'quotes': 0,
        'no-unreachable': 2,

      },

      globals: ['$'],

      envs: ['node'],
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(dest('src/assets/scripts'))
}


module.exports = {
  clean,
  compile,
  build,
  serve,
  start,
  lint
}
