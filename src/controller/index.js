let path = require("path");
let multer = require("multer");
let fs = require("fs");
let proPath = path.resolve(__dirname, "..");
let unzip = require("unzip");
let fileToDb = require(proPath+"/controller/upload");

let getfile = require("../controller/getfile");

let sequelize = require("./../config/database");
let file = require("./../models/file");
let File = file(sequelize);

module.exports = (app)=>{
    //使用multer接收form表单的文件
    app.use(multer({dest: "./public/temp"}).array("file"));
    app.use("/tiles/", (req, res)=>{
        // console.log("00000000000000000000"); 
        getfile(req, res);
    });
    app.get("/", (req, res)=>{
        res.sendFile(proPath+"/views/index.html");
    });
    app.get("/file/:path", (req, res)=>{
        console.log((req.url).replace("/file/", ""));
        (async function() {
            let data = await File.findOne({
                attributes: ['name', 'id', 'file'],
                where: { name: (req.url).replace("/file/", "")}
            });
            fs.writeFileSync("./" + data.name, data.file, (err)=>{
                if (err) {
                    throw err;
                    console.log(err);
                }
                else{
                    console.log("文件写入成功！")
                }
            });
            let f = fs.readFileSync("./" + data.name);
            fs.unlink("./" + data.name, (err)=>{
                if (err) {
                    throw err;
                }
            });
            res.send(f);
            // console.log(data.file);
        })();
    });
    app.post("/commit", async (req, res)=>{
        //文件的上传是同步进行的
        console.log("--------------------");
        let f = req.files[0];

        //在上传的目录中重命名
        let fileName = path.resolve(proPath, "./public/temp/" + f.originalname);
        fs.renameSync(path.resolve(proPath, "./public/temp/" + f.filename), fileName, (err) => {
            if (err) {
                throw err;
            }
            else{
                console.log("文件已经重命名！");
            }
        });
        console.log("文件已经重命名！");
        res.send("后台还在处理");
        //判断是否需要解压
        if(f.mimetype == "application/x-zip-compressed"){
            let dirName = fileName.split('.')[0];
            //解压并重命名文件夹
            function unZip(){
                return new Promise((resolve, reject) => {
                    fs.createReadStream(fileName).
                    pipe(unzip.Extract({path: dirName}))
                    .on('close', () => {
                        console.log('管道流关闭！');
                        resolve('ok');
                    }).on('error', (err) => {
                        reject(err);
                    });
                }); 
            }
            await unZip();
            console.log("文件解压完成！");
            fs.unlinkSync(fileName, (error)=>{
                if(error){
                    throw error;
                }
            });
            let dir = dirName.replace(/\//g, "\\")+"\\"
            console.log("文件可能已经删除,文件夹为："+dir);
            
            await fileToDb(dir);
            console.log("。。。。。。。。。。。文件上传完成、、、、、、、、、、、、、、、")
        }
        else{
            res.send("请上传zip文件");
            console.log("文件类型不符合");
        }
    });
}