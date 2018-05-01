const gulp = require('gulp');
const minify = require('gulp-babel-minify');
const tap = require('gulp-tap');
const rename = require('gulp-rename');

const version = 2.5;
const watermark = `// ==UserScript==
// @name         GTC Toolkit
// @namespace    http://www.globaltrainingcenter.com/
// @version      ${version}
// @description  Tools
// @author       Jorge Dominguez
// @copyright    2017, gtcjorge (https://openuserjs.org/users/gtcjorge)
// @include      https://na8.salesforce.com/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      http://globaltrainingcenter.com/date.js
// @updateURL    @updateURL https://github.com/gtcjorge/gtc/raw/master/gtctoolkit.user.js
// @downloadURL  @updateURL https://github.com/gtcjorge/gtc/raw/master/gtctoolkit.user.js
// @connect      www.globaltrainingcenter.com
// @connect      globaltrainingcenter.com
// @connect      login.salesforce.com
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

`;

function minifyfile() {
  return gulp.src('./gtctoolkit-dev.user.js')
    .pipe(minify({
      mangle: {
        keepClassName: true,
      },
    }))
    .pipe(tap((file) => {
      file.contents = Buffer.from(watermark + file.contents.toString());
    }))
    .pipe(rename('gtctoolkit.user.js'))
    .pipe(gulp.dest('./'));
}
gulp.task(minifyfile);

gulp.task('default', gulp.series(minifyfile));
