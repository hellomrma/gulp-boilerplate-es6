import fs from 'fs';
import inquirer from 'inquirer';

// Setting Project
export const setting = (done) => {
    const questions = [{
        type   : 'input',
        name   : 'project_name',
        message: '프로젝트 명:'
    },
    {
        type   : 'input',
        name   : 'author',
        message: '담당자 (여러명일 경우 콤마(,)로 구분):'
    },
    {
        type   : 'input',
        name   : 'organization',
        message: '담당 조직명:'
    }];
    inquirer.prompt(questions).then(function(answers) {
        const answerData = JSON.stringify(answers);
        fs.writeFile('templates/projectInfo.json', answerData, function(err) {
            if (err) throw err;
            console.log('프로젝트 정보 입력이 완료 되었습니다.');
        });
        done();
    });
}