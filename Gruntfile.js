/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= pkg.license %> */\n'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>\n'
			},
			dist: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>',
				report: 'gzip'
			},
			dist: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		mocha: {
			all: {
				src: ['test/**/*.html'],
				options: {
					mocha: {
						ignoreLeaks: false
					},
					run: true
				}
			}
		},
		watch: {
			files: '<%= jshint.files %>',
			tasks: ['test']
		},
		connect: {
			server: {
				options: {
					hostname: '*',
					port: 3000,
					base: '.',
					keepalive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('test', ['jshint', 'mocha']);
	grunt.registerTask('build', ['jshint', 'mocha', 'concat', 'uglify']);
};
