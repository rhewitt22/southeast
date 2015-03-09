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
      global: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'js'
        }]
      }
    },

    concat: {
      polyfills: {
        src: ['src/js/vendor/picturefill.js'],
        dest: 'js/polyfills.js',
      },
      map: {
        src: [
          'src/js/yaml.js', 
          'src/js/vendor/jquery-1.11.2.js', 
          'src/js/vendor/leaflet.min.js', 
          'src/js/vendor/jquery.easyModal.js', 
          'src/js/vendor/jquery-autocomplete.min.js', 
          'src/js/map.js'
        ],
        dest: 'js/map.js'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        force: true,
        reporter: require('jshint-stylish')
      },
      all: ['src/js/*.js']
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'src/css/styles.css': 'src/scss/styles.scss',
          'src/css/map.css': 'src/scss/map.scss'
        }
      }
    },

    autoprefixer: {
      global: {
        expand: true,
        flatten: true,
        src: 'src/css/*.css',
        dest: 'css/'
      }
    },

    shell: {
      jekyllServe: {
        command: 'jekyll serve --baseurl='
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
  grunt.registerTask('default', ['sass', 'autoprefixer', 'jshint', 'concat', 'shell:jekyllBuild', 'watch']);
  grunt.registerTask('build', ['sass', 'autoprefixer', 'jshint', 'concat', 'uglify', 'shell:jekyllBuild']);
};