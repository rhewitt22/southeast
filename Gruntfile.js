/* globals module, require */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '* <%= grunt.template.today("yyyy-mm-dd") %> \n' +
        '* Source Files: <%= pkg.repository.url %> */\n'
      },
      target: {
        files: {
          'js/map.js': ['src/js/vendor/leaflet.js', 'src/js/vendor/leaflet.markercluster.min.js', 'src/js/vendor/jquery.easyModal.js', 'src/js/vendor/jquery-autocomplete.min.js', 'src/js/map.js'],
          'js/wildlife.js': ['src/js/wildlife.js'],
          'js/jobs.js': ['src/js/jobs.js']
        }
      }
    },

    concat: {
      js: {
        files: {
          'js/polyfills.js': ['src/js/vendor/picturefill.js'],
          'js/offices.js':   ['src/js/offices.js'],
          'js/map.js':       ['src/js/vendor/leaflet.js', 'src/js/vendor/leaflet.markercluster.min.js', 'src/js/vendor/jquery.easyModal.js', 'src/js/vendor/jquery-autocomplete.min.js', 'src/js/map.js'],
          'js/wildlife.js':  ['src/js/wildlife.js'],
          'js/jobs.js': ['src/js/jobs.js']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        force: true,
        reporter: require('jshint-stylish')
      },
      all: ['src/js/*.js', '!src/js/offices.js']
    },

    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'src/css/unprefixed/styles.css': 'src/scss/styles.scss',
          'src/css/unprefixed/map.css': 'src/scss/map.scss'
        }
      },
      build: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'src/css/styles.css': 'src/scss/styles.scss',
          'src/css/map.css': 'src/scss/map.scss'
        }
      }
    },

    autoprefixer: {
      dev: {
        expand: true,
        flatten: true,
        src: 'src/css/*.css',
        dest: 'css/'
      }
    },

    shell: {
      jekyllServe: {
        command: 'jekyll serve'
      },
      jekyllBuild: {
        command: 'jekyll build --config _config-dev.yml'
      }
    },

    svgstore: {
      options: {
        prefix : 'shape-',
        cleanup: false,
        svg: {
          style: 'display: none;'
        }
      },
      default: {
        files: {
          '_includes/svg-defs.svg': ['src/svg/*.svg']
        }
      }
    },

    svgmin: {
      options: {
        plugins: [
          {
            removeViewBox: false
          },{
            removeUselessStrokeAndFill: false
          }
        ]
      },
      dist: {
        expand: true,
        cwd: 'src/svg',
        src: ['*.svg'],
        dest: 'src/svg/min',
        ext: '.svg'
      }
    },

    perfbudget: {
      default: {
        options: {
          url: 'http://www.fws.gov/southeast/',
          key: 'A.5221be64d468544d6436759414b09177',
          location: 'ec2-us-east-1:IE 11',
          budget: {
            render: '3000',
            SpeedIndex: '5500',
            bytesIn: '2000000'
          }
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },

      site: {
        files: ['**/*.html', '**/*.md', 'img/**/*', '!**/_site/**/*', '!**/node_modules/**/*'],
        tasks: ['shell:jekyllBuild']
      },

      js: {
        files: ['src/js/*.js', '!**/node_modules/**/*'],
        tasks: ['jshint', 'concat', 'shell:jekyllBuild']
      },

      css: {
        files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
        tasks: ['sass', 'autoprefixer', 'shell:jekyllBuild']
      },

      svgIcons: {
        files: ['src/svg/*.svg'],
        tasks: ['svgmin', 'svgstore', 'shell:jekyllBuild']
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('serve', ['shell:jekyllServe']);
  grunt.registerTask('default', ['sass:dev', 'autoprefixer', 'jshint', 'concat', 'shell:jekyllBuild', 'watch']);
  grunt.registerTask('build', ['sass:build', 'autoprefixer', 'jshint', 'uglify', 'shell:jekyllBuild']);
  grunt.registerTask('test', ['perfbudget']);
};