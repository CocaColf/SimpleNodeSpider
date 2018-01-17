const fs = require('fs');
const url = require('url');
const gbk = require('gbk');
const JSDOM = require('jsdom').JSDOM;
const iconv = require('iconv-lite');

GetInfo('https://www.xs8.cn/chapter/5969520903659001/16024311242144928', data=>{
    //var data = gbk.toString('utf-8', data);

    /*
    var data = iconv.encode(data,'gbk');
    */
    var html = new JSDOM(data);
    let document = html.window.document;
    console.log(document.querySelector('.read-content').innerHTML);


    //淘宝价格抓取： console.log("抓取成功!今天的价格是： " + document.querySelector('.tb-rmb-num').innerHTML);
    //fs.writeFile('yq.html', data);
});

// 重定向计数
var index = 0;
function GetInfo(tUrl, success) {
    index++;

    // 解析 url
    var urlObj = url.parse(tUrl);

    // 选择合适的 http模块
    let http = '';
    if(urlObj.protocol == 'http') {
        http = require('http');
    } else if(urlObj.path) {
        http = require('https');
    }

    // 访问站点
    let req = http.request({
        hostname: urlObj.hostname,
        path: urlObj.path
    }, res=>{

        // 考虑重定向的可能
        if(res.statusCode == 302 || res.statusCode == 301) {
            GetInfo(res.headers.location, success);
            console.log(`我是第${index}次重定向`);
        } else if(res.statusCode == 200) {
            var arr = [];
            res.on('data', buffer=>{
                arr.push(buffer);
            });
            res.on('end', ()=>{
                let b = Buffer.concat(arr);
                success && success(b);
            });
        }         
        });
        req.end();
}

