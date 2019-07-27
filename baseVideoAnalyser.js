'use strict';
const fs = require('fs');

const curDate = Date.now()
//const curDate = (new Date).getTime();

const basefolder = "/home/knabbel/Development/Heiba/";
const videoSubject = ['sfeer/', "algemeen/"]



const maxFileSize = 20
const maxFileAge = 14
analyseFolder('sfeer/', maxFileAge , maxFileSize)
    .then(res => {
        res.map(problem => console.log("Problem", problem))
    })
    .catch(err => console.log('err', err))


function analyseFolder(videoFolder, maxAge = 14, maxSize = 10) {
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(videoFolder)) {
            reject('Folders does not exist')
        }
        let messageArr = []
        return fs.readdir(videoFolder, (err, files) => {
            files.forEach(file => {
                const stats = getFileStats(videoFolder + file)
                const fileSizeInMegabytes = getFileSize(videoFolder + file);
                const age = getFileAge(stats)
                //console.log(`File ${file} has size ${fileSizeInMegabytes} mb and is ${age}  days old`)

                if (age >= maxAge) {
                    messageArr.push({
                        folder: videoFolder,
                        filename: file,
                        problem: "old",
                        valueOfProblem: age,
                        unitOfProblem: "days"
                    })
                }
                if (fileSizeInMegabytes >= maxSize) {
                    messageArr.push({
                        folder: videoFolder,
                        filename: file,
                        problem: "size",
                        valueOfProblem: fileSizeInMegabytes,
                        unitOfProblem: "mb"
                    })
                }
            });
            resolve(messageArr)
        })

    })
}
function getFileStats(file) {
    return (fs.statSync(file))
}

function getFileSize(file) {
    const stats = fs.statSync(file)
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = Math.floor(fileSizeInBytes / 1000000.0);
    return fileSizeInMegabytes
}

function getFileAge(stats) {
    const fileDate = Math.floor(stats.mtime.valueOf())
    const age = Math.floor((curDate - fileDate) / (86400 * 1000))
    return age;
}
