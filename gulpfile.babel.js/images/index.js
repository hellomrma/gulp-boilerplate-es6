import path from 'path';
import { src, dest } from 'gulp';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import size from 'gulp-size';
import svgMin from 'gulp-svgmin';
import sassInlineSvg from 'gulp-sass-inline-svg';
import svgSprite from 'gulp-svg-sprite';
import spritesmith from 'gulp.spritesmith-multi';
import sort from 'gulp-sort';
import merge from 'merge-stream';
import config from '../../config.json';

export const generateImages = () =>
    src(config.imgSetting.src)
    .pipe(newer(config.imgSetting.dist))
    .pipe(imagemin(config.imgSetting.minOpts))
    .pipe(size({
        showFiles: false
    }))
    .pipe(dest(config.imgSetting.dist))

export const inlineSVG = () =>
    src(config.imgSetting.svg)
    .pipe(newer(config.imgSetting.dist))
    .pipe(svgMin())
    .pipe(sassInlineSvg({
        destDir: 'src/css/scss/svg'
    }))

export const generateSprite = () => {
    var opts = {
        spritesmith: function(options, sprite, icons) {
            options.imgPath            = `../img/sprites/${options.imgName}`;
            options.cssName            = `_${sprite}.scss`;
            options.cssTemplate        = `./src/css/sprites-data/spritesmith-mixins.handlebars`
            options.cssSpritesheetName = sprite;
            options.padding            = 4;
            options.algorithm          = 'binary-tree';
            return options;
        }
    };
    var spriteData = src('./src/img/sprites/**/*.png').pipe(spritesmith(opts)).on('error', function(err) {
        console.log(err);
    });

    var imgStream = spriteData.img.pipe(dest('./dist/img/sprites'));
    var cssStream = spriteData.css.pipe(dest('./src/css/sprites-data'));

    return merge(imgStream, cssStream);
}

export const spriteSvg = () => {
    const folder = `${config.dir.src}/img/sprites-svg`;

    let options = {
        spritesmith: (options) => {
            const { folder, dir } = options;
            return {
                shape: {
                    spacing: {
                        padding: 4
                    },
                    id: {
                        generator: function(name) {
                            return path.basename(name.split(`${config.dir.src}/css/sprites-data`).join(this.separator), '.svg');
                        }
                    }
                },
                mode: {
                    css: {
                        dest  : './',
                        bust  : false,
                        sprite: 'sprite-svg.svg',
                        render: {
                            scss: {
                                template: path.join(`${config.dir.src}/css/sprites-data`, 'sprite-svg-mixins.handlebars'),
                                dest    : path.posix.relative(`${config.dir.src}/img`, path.posix.join(`${config.dir.src}/css`, 'sprites-data', '_sprite-svg-mixins.scss'))
                            }
                        }
                    }
                },
                variables: {
                    spriteName: 'sprite',
                    baseName  : path.posix.relative(`${config.dir.src}/css`, path.posix.join(`${config.dir.src}/img`, 'sprite-svg')),
                    svgToPng  : ''
                }
            }
        },
    };

    return src(path.join(`${config.dir.src}/img/sprites-svg`, '*.svg'))
        .pipe(sort())
        .pipe(svgSprite(options.spritesmith({ folder, config })))
        .pipe(dest(`${config.dir.src}/sprite-svg-temp/`))
}