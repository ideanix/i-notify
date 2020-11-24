const Promise = require("es6-promise").Promise;
const { exec } = require('child_process');

class CommitInfo {

    static git() {
        return new Promise((resolve, reject) => {
            exec(this.gitCommand(), (err, stdout, stderr) => {
                if (err) {
                    err.stderr = stderr;
                    return reject(err);
                }
                let commitInfo = this.formatToJson(stdout);
                return resolve(commitInfo);
            })
        });
    }

    /**
     * @returns {string} git command
     * https://git-scm.com/docs/pretty-formats
     */
    static gitCommand() {
        const gitFormat = ["%h", "%H", "%cr", "%f", "%an", "%ae", "%d"].join("$$$");
        return `git describe --tags --abbrev=0 && git branch --show-current && git log -1 --no-color --decorate=short --pretty=format:'${gitFormat}' HEAD`;
    }

    static formatToJson(data) {
        const gitData = data.split("$$$");
        const [ currentTag, currentBranch, shortRevision ] = gitData[0].split("\n")
        const refsFixed = this.fixGitRefs(gitData[6]);
        return {
            "shortRevision": shortRevision,
            "currentTag": currentTag,
            "currentBranch": currentBranch,
            "revision": gitData[1],
            "date": gitData[2],
            "subject": gitData[3],
            "author": gitData[4],
            "authorEmail": gitData[5],
            "refs": refsFixed
        };
    }

    static fixGitRefs(rawString) {
        let refs = rawString;
        refs = refs.trim();
        refs = refs.replace("(", "");
        refs = refs.replace(")", "");
        return refs.split(", ");
    }
}

module.exports = CommitInfo;
