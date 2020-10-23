import path from 'path';
import { src, dest } from 'gulp';
import cache from 'gulp-cached';
import imagemin from 'gulp-imagemin';
import vinylBuffer from 'vinyl-buffer';
import svgSprite from 'gulp-svg-sprite';
import spritesmith from 'gulp.spritesmith-multi';
import sort from 'gulp-sort';
import merge from 'merge-stream';
import config from '../../config.json';

export const generateImages = () =>
    src(config.imgSetting.src)
    .pipe(cache('optimizeImage'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ], {
      verbose: true
    }))
    .pipe(dest(config.imgSetting.dist))

export const generateSprite = () => {
    var opts = {
        spritesmith: function(options, sprite, icons) {
            options.imgPath            = `../img/${options.imgName}`;
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

    var imgStream = spriteData.img
      .pipe(vinylBuffer())
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 5}),
      ], {
        verbose: true
      }))
      .pipe(dest('./dist/img/'));
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
        .pipe(imagemin([
          imagemin.svgo({
            plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
            ]
          })
        ], {
          verbose: true
        }))
        .pipe(dest(`${config.dir.dist}/img/`))
}
