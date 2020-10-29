import { watch, series, parallel } from 'gulp';
import browser, {get} from 'browser-sync';
import config from '../../config.json';
import { minifyJS } from '../js';
import { compileSCSS, concatLibsCSS } from '../css';
import { generateImages, generateSprite, spriteSvg } from '../images';
import { generateHTML, setHTML } from '../html';
import { swipeJS, swipeFont, swipeCSS, swipeHTML } from '../swipe';
import { cloneJS, cloneFontFolder } from '../clone';
const browsersync = browser.create('My server');

// Server
const browserSyncSetting = {
    server: {
        baseDir: 'dist/',
        index  : 'index.html'
    },
    port: 3030,
    open: true
};

// Browser-Sync
export const launchServer = (done) => {
    if (browsersync) browsersync.init(browserSyncSetting);
    done();
}
// Server-reload
export const browserSyncReload = (done) => {
  get('My server').reload();
  done();
}
// Watch
export const watchingResources = (done) => {
    watch(config.jsSetting.src, series(swipeJS, cloneJS, minifyJS, browserSyncReload));
    watch(config.fontsSetting.src, series(swipeFont, cloneFontFolder, browserSyncReload));
    watch(config.imgSetting.watchSrc, series(parallel(spriteSvg, generateSprite, generateImages), compileSCSS, browserSyncReload));
    watch(config.htmlSetting.src, series(swipeHTML, parallel(setHTML), generateHTML, browserSyncReload));
    watch(config.cssSetting.src, series(swipeCSS, parallel(concatLibsCSS, compileSCSS), browserSyncReload));
    done();
}
