const $ = new Env('金融工会活动');
//以下用户登录信息
let Authorization='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VySW5mbyI6eyJ1c2VySWQiOiIxMzUwOTc3MTk0NzgwNjM1MTM4IiwidXNlclR5cGUiOiJ1c2VyIiwib3JnSWQiOiIxMzI5NzE3Nzg5NDE4ODE1NDg5In0sImV4cCI6MTYxNDUzMzAzNywiaWF0IjoxNjEwOTMzMDM3LCJidXNpbmVzc0luZm8iOnsibmFtZSI6IuWtmeWuhyIsInBob25lIjoiMTgwMTc1NDU4NjYiLCJnZW5kZXIiOiJtYWxlIiwicHJvdmluY2UiOiIxMjAwMDAiLCJjaXR5IjoiMTIwMTAwIiwiY291bnR5IjoiMTIwMTAxIiwid29ya1VuaXQiOiLmtbfliJvkupLogZTnvZHlhazlj7giLCJ3b3JrRGVwYXJ0bWVudCI6IumHkeiejeW3peS8miIsInBob3RvIjoiaHR0cHM6Ly90aGlyZHd4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9lN2dBRWcxTkVrUHk4VGx1cTV4VFNhcTc3Q1VqcXhoS3ZMaWFQamp3aWN4UElTUUpaa2VpYWF5MjdNRVBKV2tpY2xVSjhDaWJ1RzlVbldEc2ljcFppYURoRlJiREEvMTMyIn19.V9ypW0AHeUBX9xJYY36oj9ivi1_lln5Imj8Tb9_L-0uGgO2QiH8QQ7yPxOdO9TTsxnmic9dDO9r113OItKu2EhlASsY3Ay6TZIy83jMm9aEZWqgTZef9XKbkixxUaPhH2v7h79eurcZO2f89lu81wivLeJ7loIMGcVWqDNHreSc';
let lessonId='1329993461202755585';
let lessonName='《民法典》';
let planId='1330087301587832833';
let homeData={};
let knowledgeData={};
let choseKnowledge={};
let learnRecordDetailId='';


!(async () => {
	//答题首页
	await home();
	console.log("进入首页");
	//子页面
	for(let i = 0; i < homeData.length; i++){
		//if(i==0){
			console.log("进入第"+(i+1)+"个栏目");
			await homeIn(homeData[i].lessonChapterId);
			for(let j = 0; j < knowledgeData.length; j++){
				//
				//if(j==0){
					console.log("进入第"+(j+1)+"个知识点");
					choseKnowledge=knowledgeData[j];
					await knowledge(homeData[i].lessonChapterId,knowledgeData[j].coursewareId);
				//}
				
			}
		//}
	}
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function home() {
  let body = {}
  return new Promise(resolve => {
    $.get(taskUrl("lessons/"+lessonId+"/courseware/list/", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
			homeData=data.data;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function homeIn(inId) {
  let body = {}
  return new Promise(resolve => {
    $.get(taskUrl("learning-plans/"+planId+"/lessons/"+lessonId+"/chapters/"+inId+"/coursewares/", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
			knowledgeData=data.data;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function knowledge(inId,recorseId) {
  let body = {}
  return new Promise(resolve => {
    $.get(taskUrl("learning-plans/"+planId+"/lessons/"+lessonId+"/chapters/"+inId+"/coursewares/"+recorseId+"/resources/", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
			//console.log(data);
			for(let k=0;k<data.data.length;k++){
				if(data.data[k].category=="VIDEO"){
					await createStudy(data.data[k]);
					console.log("等待"+data.data[k].duration+"秒");
					await $.wait(1000*data.data[k].duration);//延迟等待一秒
					await finishStudy(data.data[k])
					console.log("学习完毕");
				}
			}
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function createStudy(data) {
  return new Promise(async resolve => {
	  //转换小时分钟。
	const jdata='{"lessonName":"'+lessonName+'","coursewareId":"'+choseKnowledge.coursewareId+'","lessonId":"'+lessonId+'","resourceId":"'+data.courseResourceId+'","resourceName":"","resourceUrl":"'+data.url+'","verb":"VIDEO","completeCount":0,"totalTime":"'+getFormatDuringTime(data.duration)+'","videoStart":"00:00:00"}';
    const options = {
      "url": `https://mfd-api.boringkiller.cn/api/v1/core/learningrecord/trace/initialize/`,
      "headers": {
        'Host': 'mfd-api.boringkiller.cn',
		'Connection': 'keep-alive',
		'Content-Type': 'application/json',
		'Referer': 'https://servicewechat.com/wxaedec8f5c0b2940d/12/page-frame.html',
		'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 MicroMessenger/7.0.17(0x1700112a) NetType/WIFI Language/zh_CN',
		'Accept':'application/json, text/plain, */*',
		'Accept-Language': 'zh-cn',
		'Authorization':Authorization,
		//'Content-Length': jdata.length
		
      },
	  'body':jdata
    }
	//console.log(options);
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
			//console.log(data);
			learnRecordDetailId=data.data.learnRecordDetailId;
			//console.log(learnRecordDetailId);
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function finishStudy(data) {
  return new Promise(async resolve => {
	var request = require("request");
	  //转换小时分钟。
	const jdata1='{"coursewareId":"'+choseKnowledge.coursewareId+'","coursewareName":"'+choseKnowledge.title+'","lessonId":"'+lessonId+'","lessonName":"'+lessonName+'","resourceId":"'+data.courseResourceId+'","resourceName":"","learnRecordDetailId":"'+learnRecordDetailId+'","verb":"VIDEO","completeCount":0,"totalTime":"'+getFormatDuringTime(data.duration)+'","videoStart":"00:00:00","videoEnd":"'+getFormatDuringTime(data.duration)+'"}';
    const options = {
      "url": `https://mfd-api.boringkiller.cn/api/v1/core/learningrecord/trace/video/`,
      "headers": {
        'Host': 'mfd-api.boringkiller.cn',
		'Connection': 'keep-alive',
		'Content-Type': 'application/json',
		'Referer': 'https://servicewechat.com/wxaedec8f5c0b2940d/12/page-frame.html',
		'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 MicroMessenger/7.0.17(0x1700112a) NetType/WIFI Language/zh_CN',
		'Accept':'application/json, text/plain, */*',
		'Accept-Language': 'zh-cn',
		'Authorization':Authorization,
		//'Content-Length': jdata1.length
		
      },
	  'body':jdata1
    }
	request.put(options, function(err, resp, data) {
        try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
			console.log(data);
			//learnRecordDetailId=data.learnRecordDetailId;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


function taskUrl(action, body = {}) {
  return {
    url: 'https://mfd-api.boringkiller.cn/api/v1/'+action,
    headers: {
      'Host': 'mfd-api.boringkiller.cn',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'https://servicewechat.com/wxaedec8f5c0b2940d/12/page-frame.html',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 MicroMessenger/7.0.17(0x1700112a) NetType/WIFI Language/zh_CN',
	  'Accept':'application/json, text/plain, */*',
      'Accept-Language': 'zh-cn',
	  'Authorization':Authorization
    }
  }
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function getFormatDuringTime(during) {
    var s = Math.floor(during / 1) % 60;
	if(s<10) s="0"+s;
    during = Math.floor(during / 60);
    var i = during % 60;
	if(i<10) i="0"+i;
	during = Math.floor(during / 60);
    var h = during % 24;
	if(h<10) h="0"+h;
    return h+':'+i + ':' + s;
}


// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

