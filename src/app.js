express = require("express");
app = express();
router = express.Router();

//引入跨域请求模块
let cors = require("cors");
app.use(cors());

// 加载hbs模块
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

// 运行hbs模块
app.engine('html', hbs.__express);

//路由到控制器
let index = require("./controller/index.js");
index(app);
app.listen(10086);