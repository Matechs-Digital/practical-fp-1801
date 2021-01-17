const path = require("path")
require("ts-node").register({
    compiler: "ttypescript",
    project: path.join(__dirname, "../tsconfig.build.json")
})
require("./traced")