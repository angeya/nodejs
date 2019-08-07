let File = require("./../models/file")();
let fs = require('fs');
let path = require('path');
let tempPath = path.resolve(__dirname, '../public/temp');

console.log("---------2222-------------");

// 写入数据库
insert = async (fName, fPath, fFile) => {
    await File.create({
        name: fName,
        path: fPath,
        dir: fPath + fName,
        file: fFile,
    });
    console.log("成功写入数据库！");
}

//定义文件名与路径
let fName;
let fPath;

//调用文件遍历方法 
module.exports =  async function fileToDb(dir) {
    console.log("dir为" + dir);
    console.log("访问模块！");
    //根据文件路径读取文件
    await readDir(dir);
    console.log("88888888888888888888888888888888888888888");   
}
function readDir (dir){
    fs.readdir(dir, async function (err, files) {
        if (err) {
            throw err;
        } 
        else {
            //遍历读取到的文件列表  
            for (let i in files) {
                let filename = files[i]
                console.log(filename,"1111111111111111111")
                //获取当前文件的绝对路径
                fPath = dir;     
                let dirF = path.resolve(dir,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(dirF, async (error, stats)=>{
                    if(error){
                        throw error;
                    }
                    else{
                        var isFile = stats.isFile();//是文件  
                        var isDir = stats.isDirectory();//是文件夹  
                        if (isFile) {
                            console.log("是文件");
                            console.log(tempPath);
                            fPath = dir.replace(tempPath, "");//全部替换 
                            console.log(fPath);
                            // fPath = path.resolve(__dirname, "../public/temp/");
                            fName = filename;
                            //同步读取文件
                            let fFile = fs.readFileSync(dirF, (err) => {
                                if (err) {
                                    throw err;
                                }
                            });
                            console.log(fName+"ooooooooooooooooooo");
                            console.log(fPath+"-------------------");
                            await insert(fName, fPath, fFile);
                        }
                        if (isDir) {
                            console.log("是文件夹！");
                            readDir(dirF);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        }
                    }
                });
            };
        }
    });
}