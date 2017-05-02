const gulp = require('gulp');
const bs = require('browser-sync').create();
const nightwatch = require('nightwatch');
const mocha = require('gulp-mocha');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const path = require('path');
const shell = require('gulp-shell');
const jsonfile = require('jsonfile');
const fs = require('fs');
const scrape = require('website-scraper');
const rimraf = require('rimraf');
const rework = require('gulp-rework');
const reworkNPM = require('rework-npm');

/**
 * js をビルドします
 */
function buildWebpack() {
  const src = path.resolve(webpackConfig.context, webpackConfig.entry['onsen-ex']);
  return gulp.src(src)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(webpackConfig.output.path));
}

/**
 * css をビルドします。
 * といっても今はコピーするだけ
 */
function buildCSS() {
  return gulp.src('src/styles/*.css')
    .pipe(rework(reworkNPM()))
    .pipe(gulp.dest('dist/styles'));
}

/**
 * リリースに必要なファイルだけ release ディレクトリにコピーします
 */
const releaseCopy = gulp.parallel([
  releaseCopyJSCSS, releaseCopyManifest
]);

function releaseCopyJSCSS() {
  return gulp.src(
    ['dist/scripts/*.js', 'dist/styles/*.css'],
    { base: './dist' }
  )
    .pipe(gulp.dest('release'));
}

function releaseCopyManifest() {
  return gulp.src(
    ['manifest.json'],
    { base: './' }
  )
    .pipe(gulp.dest('release'));
}

/**
 * release ディレクトリをzip圧縮します。
 * @param done
 */
function zip(done) {
  return shell.task([
    'zip release.zip -qr release -X'
  ])(done);
}

/**
 * テスト用に manifest.json の matches に localhost を追加します
 */
function appendLocalhostToMatches(done) {
  const testURL = 'http://localhost:9001/*';
  jsonfile.readFile('./release/manifest.json', (err, json) => {
    if (err) {
      throw err;
    }
    if (!json['content_scripts'][0]['matches'].includes(testURL)) {
      json['content_scripts'][0]['matches'].push(testURL);
    }
    jsonfile.writeFile('./release/manifest.json', json, {spaces: 2}, function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  });
}

/**
 * テスト用に release ディレクトリから crx を作ります。
 * @see https://developer.chrome.com/extensions/crx#scripts
 */
function crxMake(done) {
  return shell.task([
    '/bin/bash ./crxmake.sh release var/private.pem var'
  ])(done);
}

/**
 * release.crx を base64 に変換してファイルに出力します。
 * @param done
 */
function createBase64CRX(done) {
  fs.readFile('./var/release.crx', (err, crx) => {
    if (err) {
      throw err;
    }
    const base64CRX = crx.toString('base64');
    fs.writeFile('./var/release.crx.base64', base64CRX, (err) => {
      if (err) {
        throw err;
      }
      done();
    });
  });
}

/**
 * 音泉のページをダウンロードしてきてローカルにモックを作ります。
 * @param done
 */
function generateMock(done) {
  rimraf('test/mock', () => {
    scrape({
      urls: ['http://www.onsen.ag'],
      directory: 'test/mock/',
    }).then((result) => {
      done();
    });
  });
}

/**
 * E2Eテストを実行します
 * @param done
 */
function runNightwatch(done) {
  nightwatch.runner({
    config: 'nightwatch.config.js',
    env: 'default'
  }, function (passed) {
    done();
    if (passed) {
      process.exit();
    } else {
      process.exit(1);
    }
  });
}

/**
 * E2Eテスト用のサーバを起動します。
 * @param done
 */
function runTestServer(done) {
  bs.init({
    notify: false,
    port: 9001,
    open: false,
    server: { baseDir: ['test/mock'] },
    snippetOptions: { blacklist: ['/'] },
    ui: false
  }, function() {
    done();
  });
}

/**
 * 拡張機能をテスト時に読み込めるよう準備をします。
 * @param done
 * @returns {*}
 */
function prepareTest(done) {
  return gulp.series(
    appendLocalhostToMatches,
    crxMake,
    createBase64CRX
  )(done);
}

const build = gulp.series(
  gulp.parallel([buildWebpack, buildCSS]),
  releaseCopy
);

const test = gulp.series(
  runTestServer,
  runNightwatch
);

const buildForChromeWebStore = gulp.series(
  build,
  zip
);

gulp.task('buildWebpack', buildWebpack);
gulp.task('releaseCopy', releaseCopy);
gulp.task('zip', zip);
gulp.task('appendLocalhostToMatches', appendLocalhostToMatches);
gulp.task('crxMake', crxMake);
gulp.task('createBase64CRX', createBase64CRX);
gulp.task('generateMock', generateMock);
gulp.task('runTestServer', runTestServer);
gulp.task('runNightwatch', runNightwatch);
gulp.task('prepareTest', prepareTest);

gulp.task('build', build);
gulp.task('test', test);
gulp.task('buildForChromeWebStore', buildForChromeWebStore);
