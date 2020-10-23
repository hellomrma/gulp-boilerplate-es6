import { src, dest } from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import { get } from 'browser-sync';
import config from '../../config.json';

export const minifyJS = () =>
    src(config.jsSetting.srcApps)
    .pipe(concat(config.jsSetting.minifyFileName))
    .pipe(uglify())
    .pipe(dest(config.jsSetting.dist))
