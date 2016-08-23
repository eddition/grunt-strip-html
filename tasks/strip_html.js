/*
 * grunt-strip-html
 * 
 *
 * Copyright (c) 2016 Eddie Shin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var cheerio = require('cheerio');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('strip_html', 'remove html tags to and format for grunt-contrib-include', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      selectors: 'h1.h2.h3.h4.h5.h6.p.blockquote.th.td.dt.dd.li'.split('.')
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var filepath = f.src, content, $;
      content = grunt.file.read(filepath);

      $ = cheerio.load(content, { decodeEntities: false });

      $(options.selectors.join(',')).each(function() {
        var text = $(this).html();
        
        text = text.replace(/(^|\s|-)+@(\w+)/g, function(str) {
            var res = str + ".html" ;
            var output = res.slice(0,8) + ' "' + res.slice(8)+ '"';

            return output;
        });


        $(this).html(text);
      });

      // Write the destination file.
      // Print a success message.
      var output = $.html().replace(/<p>@/g, "").replace(/@<\/p>/g, "");
      console.log(output);
      grunt.file.write(f.dest, output);
      grunt.log.writeln('File "' + f.dest + '" created.');

    });
  });

};
