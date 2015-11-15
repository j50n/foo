/*
 Copyright (c) 2015 Jason Smith and Path2Response, Inc.


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:


 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.


 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

module.exports = function ( grunt ) {
	"use strict";

	var pkgSource = grunt.file.readJSON( "package.json" );

	grunt.initConfig( {
		pkg: pkgSource,
		tape: {
			options: {
				pretty: false,
				output: "console"
			},
			test: {
				src: [ "test/**/test*.js" ]
			}
		},
		jshint: {
			files: [ "**/*.js", "!node_modules/**/*.js", "!out/**/*.js" ],
			options: {
				jshintrc: ".jshintrc"
			}
		},
		jsbeautifier: {
			files: [ "<%= jshint.files %>", "**/*.json", "!node_modules/**/*.json", "!out/**/*.json" ],
			options: {
				config: ".jsbeautifyrc"
			}
		},
		markdox: {
			options: {
				// Task-specific options go here.
			},
			target: {
				files: [ {
					src: [ "./f*.js" ],
					dest: "apidoc",
					expand: true,
					ext: ".md"
				} ]
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-tape" );
	grunt.loadNpmTasks( "grunt-jsbeautifier" );
	grunt.loadNpmTasks( "grunt-markdox" );

	grunt.registerTask( "format", [ "jsbeautifier", "jshint" ] );
	grunt.registerTask( "test", [ "format", "tape:test" ] );
	grunt.registerTask( "docs", [ "markdox" ] );
	grunt.registerTask( "default", [ "test" ] );
};