import { src, dest } from 'gulp';
import whitespace from 'gulp-whitespace';
import newer from 'gulp-newer';
import config from '../../config.json';

// Clone files in root
export const cloneRoot = () =>
    src([config.dir.src + '*.*', '!src/*.html'])
    .pipe(dest(config.dir.dist))

export const cloneJS = () =>
    src(config.jsSetting.src)
    .pipe(newer(config.jsSetting.dist))
    .pipe(whitespace({
        spacesToTabs  : 4,
        removeTrailing: true
    }))
    .pipe(dest(config.jsSetting.dist))

export const cloneFontFolder = () =>
    src(config.fontsSetting.src)
    .pipe(newer(config.fontsSetting.dist))
    .pipe(dest(config.fontsSetting.dist))
