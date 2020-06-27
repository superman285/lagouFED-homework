// 实现这个项目的构建任务

const sass = require('sass');
const loadGruntTasks = require('load-grunt-tasks');


module.exports = grunt => {


  grunt.initConfig({

    sass: {
      options: {
        implementation: sass
      },
      main: {
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      },
      dev: {
        files: {
          'temp/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      },
      dev: {
        files: {
          'temp/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    swigtemplates: {
      options: {
        defaultContext: {
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
        },
        templatesDir: 'src'
      },
      main: {
        dest: 'dist/',
        src: ['src/*.html']
      },
      dev: {
        dest: 'temp/',
        src: ['src/*.html']
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['assets/scripts/vendor.js','assets/styles/vendor.css'],
          dest: 'dist'
        }]
      },
      devFonts: {
        files: [{
          expand: true,
          src: ['**'],
          cwd: 'src/assets/fonts/',
          dest: 'temp/assets/fonts',
          flatten: true,
          filter: 'isFile',
        }]
      },
      devImages: {
        files: [{
          expand: true,
          src: ['**'],
          cwd: 'src/assets/images/',
          dest: 'temp/assets/images',
          flatten: true,
          filter: 'isFile',
        }]
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      distJS: {
        src: ['dist/*.js'],
        dest: 'dist/assets/scripts/vendor.js',
      },
      distCSS: {
        src: ['dist/*.css'],
        dest: 'dist/assets/styles/vendor.css',
      },
    },
    clean: {
      temp: 'temp/**',
      dist: 'dist/**',
      release: 'release/**',
      assets: 'assets/**'
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      main: {
        files: [{
          expand: true,
          cwd: 'dist/assets/styles',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/assets/styles',
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'temp/assets/styles',
          src: ['*.css', '!*.min.css'],
          dest: 'temp/assets/styles',
        }]
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      main: {
        src: 'dist/assets/scripts/*.js',
        dest: 'dist/assets/scripts/*.js'
      }
    },
    imagemin: {
      images: {
        options: {
          optimizationLevel: 1
        },
        files: [{
          expand: true,
          cwd: 'src/assets/images',
          src: ['*.{png,jpg,jpeg,gif}'],
          dest: 'dist/assets/images'
        }]
      },
      fonts: {
        options: {
          optimizationLevel: 1
        },
        files: [{
          expand: true,
          cwd: 'src/assets/fonts',
          src: '**',
          dest: 'dist/assets/fonts'
        }]
      }
    },
    useref: {
      html: 'dist/*.html',
      temp: '.'
    },
    browserSync: {
      options: {
        server: {
          baseDir: ['temp', 'src', 'public'],
          routes: {
            '/node_modules': 'node_modules'
          }
        }
      },
      main: {
        bsFiles: {
          src: 'temp/*.html'
        }
      }
    }
  })

  loadGruntTasks(grunt);

  grunt.registerTask('transformCSS:main', ['sass:main','cssmin:main'])
  grunt.registerTask('transformJS:main', ['babel:main'])
  grunt.registerTask('transformCSS:dev', ['sass:dev','cssmin:dev'])
  grunt.registerTask('transformJS:dev', ['babel:dev'])

  grunt.registerTask('compile:dev',['clean','transformCSS:dev','transformJS:dev','swigtemplates:dev','copy:devFonts','copy:devImages']);
  grunt.registerTask('compile',['clean','transformCSS:main','transformJS:main','swigtemplates:main']);

  grunt.registerTask('develop',['compile:dev','browserSync']);

  grunt.registerTask('build',['compile','useref','concat','copy:main','imagemin','clean:assets']);


}
