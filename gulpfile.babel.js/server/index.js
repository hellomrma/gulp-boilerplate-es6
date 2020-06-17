import { watch, series } from 'gulp';
import browser from 'browser-sync';
import config from '../../config.json';
import { minifyJS } from '../js';
import { compileSCSS, concatLibsCSS, minifyCSS } from '../css';
import { inlineSVG, generateImages, generateSprite, spriteSvg } from '../images';
import { generateHTML, setHTML } from '../html';
import { swipeJS, swipeFont, swipeImage, swipeCSS, swipeHTML, removeTempSvgSprites } from '../swipe';
import { cloneJS, cloneFontFolder, cloneSvgSprites } from '../clone';
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
// Watch
export const watchingResources = (done) => {
    watch(config.jsSetting.src, series(swipeJS, cloneJS, minifyJS));
    watch(config.fontsSetting.src, series(swipeFont, cloneFontFolder));
    watch(config.imgSetting.src, series(series(swipeImage, spriteSvg, cloneSvgSprites, removeTempSvgSprites, generateImages, inlineSVG), series(swipeCSS, concatLibsCSS, generateSprite, compileSCSS, minifyCSS), (done) => {
        browsersync.reload();
        done();
    }));
    watch(config.htmlSetting.src, series(swipeHTML, setHTML, generateHTML));
    watch(config.cssSetting.src, series(series(swipeCSS, concatLibsCSS, generateSprite, compileSCSS, minifyCSS), (done) => {
        browsersync.reload();
        done();
    }));
    done();
}