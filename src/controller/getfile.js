let File = require("./../models/file")();
displayFile = async(req, res)=>{
    let dir = req.url.replace(/\//g, "\\");
    console.log(dir); 
    let data = await File.findOne({
        attributes: ['name', 'file'],
        where: {dir: dir}
    });
    if(data){
        console.log(data);
        let file = data.toString();
        console.log(file);
        res.send(file);
        console.log("111");
    }
    else{
        res.send("没有查询到改文件！");
    }

}
module.exports = displayFile;