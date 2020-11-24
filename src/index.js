const CommitInfo = require("./git/commit-info");

const data = CommitInfo.git().then(dataa => {
    console.log(dataa)
})
console.log(data)
