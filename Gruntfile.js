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
          'src/css/styles.css': 'src/scss/styles.scss'
        }
      }
    },

    autoprefixer: {
      global: {
        src: 'src/css/styles.css',
        dest: 'css/styles.css'
      }
    },

    shell: {
      jekyllServe: {
        command: 'jekyll serve'
      },
      jekyllBuild: {
        command: 'jekyll build'
      }
    },

    watch: {
      options: {
        livereload: true
      },

      site: {
        files: ['*.html', '**/*.html', '*.md', '**/*.md', '!_site/**/*.html', '!_site/**/*.md'],
        tasks: ['shell:jekyllBuild']
      },

      js: {
        files: ['src/js/*.js'],
        tasks: ['jshint', 'shell:jekyllBuild']
      },

      css: {
        files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
        tasks: ['sass', 'autoprefixer', 'shell:jekyllBuild']
      },

      svgIcons: {
        files: ['svg/*.svg'],
        tasks: ['svgstore', 'shell:jekyllBuild']
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
          '_includes/svg-defs.svg': ['svg/*.svg']
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('serve', ['shell:jekyllServe']);
  grunt.registerTask('default', ['sass', 'jshint', 'watch']);
  grunt.registerTask('build', ['sass', 'autoprefixer', 'jshint', 'uglify', 'shell:jekyllBuild']);
};