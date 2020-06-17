'use strict';
import { series } from 'gulp';
import { cloneRoot, cloneFontFolder, cloneJS, cloneSvgSprites } from './clone';
import { setting } from './project';
import { swipeDist, swipeFont, swipeJS, swipeImage, removeTempSvgSprites, swipeCSS, swipeHTML } from './swipe';
import { minifyJS } from './js';
import { spriteSvg, generateImages, inlineSVG, generateSprite } from './images';
import { concatLibsCSS, compileSCSS, minifyCSS } from './css';
import { setHTML, generateHTML } from './html';
import { watchingResources, launchServer } from './server';

exports.cloneRoot = cloneRoot;
exports.setting   = setting;
exports.build     = series(swipeDist, cloneRoot, swipeFont, cloneFontFolder, swipeJS, cloneJS, minifyJS, swipeImage,
    spriteSvg, cloneSvgSprites, removeTempSvgSprites, generateImages, inlineSVG, swipeCSS, concatLibsCSS, generateSprite,
    compileSCSS, minifyCSS, swipeHTML, setHTML, generateHTML);
    
// Default
exports.default = series(exports.build, watchingResources, launchServer);