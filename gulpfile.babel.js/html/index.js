import fs from 'fs';
import path from 'path';
import { src, dest } from 'gulp';
import newer from 'gulp-newer';
import fileinclude from 'gulp-file-include';
import htmlhint from 'gulp-htmlhint';
import whitespace from 'gulp-whitespace';
import cheerio from 'cheerio';
import util from 'util';
import ejs from 'gulp-ejs';
import { get } from 'browser-sync';
import config from '../../config.json'

export const setHTML = () =>
    src([config.htmlSetting.src, '!' + config.htmlSetting.except])
    .pipe(newer(config.htmlSetting.dist))
    .pipe(fileinclude({
        prefix  : '@@',
        basepath: '@file'
    }))
    .pipe(htmlhint('templates/htmlhint.json'))
    .pipe(htmlhint.reporter())
    .pipe(whitespace({
        spacesToTabs  : 4,
        removeTrailing: true
    }))
    .pipe(dest(config.dir.dist))

export const generateHTML = (done) => {
    let dPath       = "dist/views",
        projectObj  = {},
        docFiles    = [],
        normalFiles = [],
        categories  = [],
        projectObjStr,
        projectObjJson;

    let projectJson               = fs.readFileSync('templates/projectInfo.json', 'utf-8'),
        projectInfo               = {};
        projectInfo.projectName   = JSON.parse(projectJson).project_name;
        projectInfo.projectAuthor = JSON.parse(projectJson).author;
        projectInfo.projectOrg    = JSON.parse(projectJson).organization;

    fs.readdir(dPath, function(err, files) {
        if (err) {
            throw err;
        }
        files.map(function(file) {
            return path.join(dPath, file);
        }).filter(function(file) {
            return fs.statSync(file).isFile();
        }).forEach(function(file) {
            let dfileData,
                fileInnerText,
                wholeTitle,
                splitTitle,
                nfileData,
                pageStatus,
                splitStatus;

            let stats = fs.statSync(file);

            let extname  = path.extname(file),
                basename = path.basename(file);
            if (extname == '.html') {
                // Document Pages
                if (basename.match(/@/)) {
                    dfileData = {};

                        fileInnerText = fs.readFileSync(file, 'utf8');
                    let $             = cheerio.load(fileInnerText);
                        wholeTitle    = ($('meta[name="list"]').length !== 0) ? $('meta[name="list"]').attr('content') : $('title').text();
                        splitTitle    = wholeTitle.split(' : ');

                    if ($('body').data('pagestatus')) {
                        pageStatus                = $('body').data('pagestatus');
                        splitStatus               = pageStatus.split(' : ');
                        dfileData.splitStatus     = splitStatus[0];
                        dfileData.splitStatusDate = splitStatus[1];
                    }

                    dfileData.title        = splitTitle[0];
                    dfileData.name         = path.basename(file);
                    dfileData.category     = String(dfileData.name).substring(0, 2);
                    dfileData.categoryText = splitTitle[1];
                    dfileData.listTitle    = wholeTitle;
                    dfileData.mdate        = new Date(util.inspect(stats.mtime));
                    docFiles.push(dfileData);
                    if (!categories.includes(dfileData.category)) {
                        categories.push(dfileData.category);
                    }
                    if ($('meta[name="list"]').length !== 0) {
                        $('meta[name="list"]').remove();
                        fs.writeFileSync(file, $.html({
                            decodeEntities: false
                        }), function(err) {
                            if (err) throw err;
                        });
                    }
                } else {
                    // Normal Pages
                    nfileData = {};

                        fileInnerText = fs.readFileSync(file, 'utf8');
                    let $             = cheerio.load(fileInnerText);
                        wholeTitle    = ($('meta[name="list"]').length !== 0) ? $('meta[name="list"]').attr('content') : $('title').text();
                        splitTitle    = wholeTitle.split(' : ');

                    if ($('body').data('pagestatus')) {
                        pageStatus                = $('body').data('pagestatus');
                        splitStatus               = pageStatus.split(' : ');
                        nfileData.splitStatus     = splitStatus[0];
                        nfileData.splitStatusDate = splitStatus[1];
                    }

                    nfileData.title        = splitTitle[0];
                    nfileData.name         = path.basename(file);
                    nfileData.category     = String(nfileData.name).substring(0, 2);
                    nfileData.categoryText = splitTitle[1];
                    nfileData.listTitle    = wholeTitle;
                    nfileData.mdate        = new Date(util.inspect(stats.mtime));
                    normalFiles.push(nfileData);
                    if (!categories.includes(nfileData.category)) {
                        categories.push(nfileData.category);
                    }
                    if ($('meta[name="list"]').length !== 0) {
                        $('meta[name="list"]').remove();
                        fs.writeFileSync(file, $.html({
                            decodeEntities: false
                        }), function(err) {
                            if (err) throw err;
                        });
                    }
                }
            }
        });

        projectObj = {
            project: projectInfo,
            dfiles : docFiles,
            nfiles : normalFiles
        };

        projectObjStr  = JSON.stringify(projectObj);
        projectObjJson = JSON.parse(projectObjStr);

        src("templates/@index.html")
            .pipe(ejs(projectObjJson))
            .pipe(dest("dist/"))
        done();
    });
}
