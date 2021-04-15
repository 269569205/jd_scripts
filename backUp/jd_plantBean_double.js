
/*
种豆得豆 搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_joy.js
更新时间:2020-08-25
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
会自动关注任务中的店铺跟商品
互助码shareCode请先手动运行脚本查看打印可看到
// quantumultx
[task_local]
1 7-21/2 * * * https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_plantBean.js, tag=种豆得豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdzd.png, enabled=true
// Loon
[Script]
cron "1 7-21/2 * * *" script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_plantBean.js,tag=京东种豆得豆
// Surge
// 京东种豆得豆 = type=cron,cronexp="1 7-21/2 * * *",wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_joy_steal.js
一天只能帮助3个人。多出的助力码无效
注：如果使用Node.js, 需自行安装'crypto-js,got,http-server,tough-cookie'模块. 例: npm install crypto-js http-server tough-cookie got --save
*/

const name = '京东种豆得豆';
const $ = new Env(name);
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//ios等软件用户直接用NobyDa的jd cookie
const cookie = jdCookieNode.CookieJD ? jdCookieNode.CookieJD : $.getdata('CookieJD');
let jdNotify = $.getdata('jdPlantBeanNotify');

//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';

let plantUuids = [ // 这个列表填入你要助力的好友的plantUuid
  '66j4yt3ebl5ierjljoszp7e4izzbzaqhi5k2unz2afwlyqsgnasq',
  'olmijoxgmjutyrsovl2xalt2tbtfmg6sqldcb3q',
  'qawf5ls3ucw25yhfulu32xekqy3h7wlwy7o5jii'
]
let currentRoundId = null;//本期活动id
let lastRoundId = null;//上期id
let roundList = [];
let awardState = '';//上期活动的京豆是否收取
// 添加box功能
// 【用box订阅的好处】
// 1️⃣脚本也可以远程挂载了。助力功能只需在box里面设置助力码。
// 2️⃣所有脚本的cookie都可以备份，方便你迁移到其他支持box的软件。
let isBox = false //默认没有使用box
const boxShareCodeArr = ['jd_plantBean1', 'jd_plantBean2', 'jd_plantBean3'];
isBox = boxShareCodeArr.some((item) => {
  const boxShareCode = $.getdata(item);
  return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
});
if (isBox) {
  plantUuids = [];
  for (const item of boxShareCodeArr) {
    if ($.getdata(item)) {
      plantUuids.push($.getdata(item));
    }
  }
}

var Task = step();
Task.next();

function* step() {
  let message = '', subTitle = '';
  if (cookie) {
    console.log(`获取任务及基本信息`)
    let plantBeanIndexResult = yield plantBeanIndex()
    if (plantBeanIndexResult.code != "0") {
      console.log(`plantBeanIndexResult:${JSON.stringify(plantBeanIndexResult)}`)
      if (plantBeanIndexResult.code === '3') {
        $.setdata('', 'CookieJD');//cookie失效，故清空cookie。
        $.msg(name, '【提示】京东cookie已失效,请重新登录获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        $.done();
        return
      }
      //todo
      return
    }
    roundList = plantBeanIndexResult.data.roundList;
    currentRoundId = roundList[1].roundId;
    lastRoundId = roundList[0].roundId;
    awardState = roundList[0].awardState;
    subTitle = `【京东昵称】${plantBeanIndexResult.data.plantUserInfo.plantNickName}`;
    message += `【上期时间】${roundList[0].dateDesc}\n`;
    message += `【上期成长值】${roundList[0].growth}\n`;
    //定时领取--放到前面执行收取自动生产的营养液
    if (plantBeanIndexResult.data.timeNutrientsRes.state == 1 && plantBeanIndexResult.data.timeNutrientsRes.nutrCount > 0) {
      console.log(`开始领取定时产生的营养液`)
      let receiveNutrientsResult = yield receiveNutrients(currentRoundId)
      console.log(`receiveNutrientsResult:${JSON.stringify(receiveNutrientsResult)}`)
    }
    console.log(`【上轮京豆】${awardState === '4' ? '采摘中' : awardState === '5' ? '可收获了' : '已领取'}`);
    if (awardState === '4') {
      //京豆采摘中...
      message += `【上期状态】${roundList[0].tipBeanEndTitle}\n`;
    } else if (awardState === '5') {
      //收获
      let res = yield getReward();
      // console.log(`种豆得豆收获的京豆情况---res,${JSON.stringify(res)}`);
      console.log('开始领取京豆');
      if (res.code === '0') {
        console.log('京豆领取成功');
        message += `【上期兑换京豆】${res.data.awardBean}个\n`;
        $.msg(name, subTitle, message);
      }
    } else if (awardState === '6') {
      //京豆已领取
      message += `【上期兑换京豆】${roundList[0].awardBeans}个\n`;
    }
    if (roundList[1].dateDesc.indexOf('本期 ') > -1) {
      roundList[1].dateDesc = roundList[1].dateDesc.substr(roundList[1].dateDesc.indexOf('本期 ') + 3, roundList[1].dateDesc.length);
    }
    message += `【本期时间】${roundList[1].dateDesc}\n`;
    message += `【本期成长值】${roundList[1].growth}\n`;
    let shareUrl = plantBeanIndexResult.data.jwordShareInfo.shareUrl
    let myPlantUuid = getParam(shareUrl, 'plantUuid')
    // console.log(`你的plantUuid为${myPlantUuid}`)
    console.log(`\n【您的互助码plantUuid】 ${myPlantUuid}\n`);
    for (let task of plantBeanIndexResult.data.taskList) {
      console.log(`开始【${task.taskName}】任务`)
      if (task.taskType == 7 || task.taskType == 17 || task.taskType == 18) {
        //具体每个人可能不一样
        //7金融双签,18疯抢爆品,17叠蛋糕
        if (task.isFinished != 1) {
          console.log(task.taskName)
          let receiveNutrientsTaskResult = yield receiveNutrientsTask(task.taskType)
          console.log(`receiveNutrientsTaskResult:${JSON.stringify(receiveNutrientsTaskResult)}`)
        }
      } else if (task.awardType == 3) {
        //浏览店铺
        if (task.isFinished != 1) {
          let shopTaskListResult = yield shopTaskList()
          if (shopTaskListResult.code == '0') {
            let shops = shopTaskListResult.data.goodShopList.concat(shopTaskListResult.data.moreShopList)
            let nutrCount = 0
            for (let shop of shops) {
              console.log(shop.shopName)
              if (shop.taskState == '2') {
                let shopNutrientsTaskResult = yield shopNutrientsTask(shop.shopTaskId, shop.shopId)
                if (shopNutrientsTaskResult.code == 0) {
                  if (shopNutrientsTaskResult.data.nutrState && shopNutrientsTaskResult.data.nutrState == '1' && shopNutrientsTaskResult.data.nutrCount > 0) {
                    console.log(`关注店铺${shop.shopName}获得${shopNutrientsTaskResult.data.nutrCount}营养液`)
                    nutrCount += shopNutrientsTaskResult.data.nutrCount
                    if (nutrCount >= task.totalNum - task.gainedNum) {
                      break
                    }
                  } else {
                    console.log(`关注店铺${shop.shopName}未获得营养液`)
                  }
                } else {
                  console.log(`${shop.shopName},shopNutrientsTaskResult:${JSON.stringify(shopNutrientsTaskResult)}`)
                }
              }
            }
          } else {
            console.log(`shopTaskListResult:${JSON.stringify(shopTaskListResult)}`)
          }
        }
      } else if (task.awardType == 10) {
        //浏览频道
        if (task.isFinished != 1) {
          let plantChannelTaskListResult = yield plantChannelTaskList()
          if (plantChannelTaskListResult.code == '0') {
            let channelList = plantChannelTaskListResult.data.goodChannelList.concat(plantChannelTaskListResult.data.normalChannelList)
            let nutrCount = 0
            for (let channel of channelList) {
              // console.log(channel.channelName)
              if (channel.taskState == '2') {
                let plantChannelNutrientsTaskResult = yield plantChannelNutrientsTask(channel.channelTaskId, channel.channelId)
                if (plantChannelNutrientsTaskResult.code == '0') {
                  if (plantChannelNutrientsTaskResult.data.nutrState && plantChannelNutrientsTaskResult.data.nutrState == '1' && plantChannelNutrientsTaskResult.data.nutrNum > 0) {
                    console.log(`浏览频道${channel.channelName}获得${plantChannelNutrientsTaskResult.data.nutrNum}营养液`)
                    nutrCount += plantChannelNutrientsTaskResult.data.nutrNum
                    if (nutrCount >= task.totalNum - task.gainedNum) {
                      break
                    }
                  } else {
                    console.log(`浏览频道${channel.channelName}未获得营养液`)
                  }
                } else {
                  console.log(`${channel.channelName},plantChannelNutrientsTaskResult:${JSON.stringify(plantChannelNutrientsTaskResult)}`)

                }
              }
            }
          } else {
            console.log(`plantChannelTaskListResult:${JSON.stringify(plantChannelTaskListResult)}`)
          }
        }
      } else if (task.awardType == 5) {
        //关注商品
        if (task.isFinished != 1) {
          let productTaskListResult = yield productTaskList()
          if (productTaskListResult.code == '0') {
            let productInfoList = productTaskListResult.data.productInfoList.map(([item]) => item)
            let nutrCount = 0
            for (let productInfo of productInfoList) {
              console.log(productInfo.productName)
              if (productInfo.taskState == '2') {
                let productNutrientsTaskResult = yield productNutrientsTask(productInfo.productTaskId, productInfo.skuId)
                if (productNutrientsTaskResult.code == '0') {
                  if (productNutrientsTaskResult.data.nutrState && productNutrientsTaskResult.data.nutrState == '1' && productNutrientsTaskResult.data.nutrCount > 0) {
                    console.log(`关注商品${productInfo.productName}获得${productNutrientsTaskResult.data.nutrCount}营养液`)
                    nutrCount += productNutrientsTaskResult.data.nutrCount
                    if (nutrCount >= task.totalNum - task.gainedNum) {
                      break
                    }
                  } else {
                    console.log(`关注商品${productInfo.productName}未获得营养液`)
                  }
                } else {
                  console.log(`productNutrientsTaskResult:${JSON.stringify(productNutrientsTaskResult)}`)
                }
              }
            }
          } else {
            console.log(`productTaskListResult:${JSON.stringify(productTaskListResult)}`)
          }
        }
      } else if (task.taskType == 4) {
        //逛逛会场
        if (task.isFinished != 1 && task.gainedNum == '0') {
          if (plantBeanIndexResult.data.roundList[1].roundState == 2) {
            let purchaseRewardTaskResult = yield purchaseRewardTask(plantBeanIndexResult.data.roundList[1].roundId)
            console.log(`purchaseRewardTaskResult:${JSON.stringify(purchaseRewardTaskResult)}`)
          }
        }
      } else if (task.taskType == 19) {
        // 低价包邮
        if (task.isFinished !== 1) {
          let plantReceiveNutrientsTaskRes = yield plantReceiveNutrientsTask();
          console.log(`${task.taskName}获取营养液：：${plantReceiveNutrientsTaskRes.data && plantReceiveNutrientsTaskRes.data.nutrNum}`)
        }
      } else if (task.taskType == 20) {
        // 助力高考
        if (task.isFinished !== 1) {
          let plantReceiveNutrientsTaskRes = yield receiveNutrientsTask(task.taskType);
          console.log(`${task.taskName}获取营养液：：${plantReceiveNutrientsTaskRes.data && plantReceiveNutrientsTaskRes.data.nutrNum}`)
        }
      } else if (task.taskType == 1) {
        console.log('跳过签到，NobyDa的会签')
        // console.log(`【${task.taskName}】未开发${task.awardType},${task.taskType}`)
      } else {
        console.log(`【${task.taskName}】未开发${task.awardType},${task.taskType}`)
      }
      console.log(`【${task.taskName}】任务结束`)
    }

    //任务列表少了金融双签，拉出来执行下
    console.log(`金融双签`)
    let receiveNutrientsTaskResult = yield receiveNutrientsTask(7)
    console.log(`receiveNutrientsTaskResult:${JSON.stringify(receiveNutrientsTaskResult)}`)

    //助力好友
    console.log('开始助力好友')
    for (let plantUuid of plantUuids) {
      if (plantUuid == myPlantUuid) {
        console.log('跳过自己的plantUuid')
        continue
      }
      console.log(`开始助力好友: ${plantUuid}`);
      let helpResult = yield helpShare(plantUuid)
      if (helpResult.code === '0') {
        console.log(`助力好友结果: ${JSON.stringify(helpResult.data.helpShareRes)}`);
        if (helpResult.data.helpShareRes && helpResult.data.helpShareRes.state === '2') {
          console.log('今日助力机会已耗尽，跳出助力');
          break;
        }
      } else {
        console.log(`助力好友失败: ${JSON.stringify(helpResult)}`);
      }
    }

    //天天扭蛋功能
    let eggChance = yield egg();
    if (eggChance.code == 0) {
      if (eggChance.data.restLotteryNum > 0) {
        const eggL = new Array(eggChance.data.restLotteryNum).fill('');
        for (let i = 0; i < eggL.length; i++) {
          console.log(`开始第${i + 1}次扭蛋`);
          let plantEggDoLotteryRes = yield plantEggDoLottery();
          console.log(`天天扭蛋成功：${JSON.stringify(plantEggDoLotteryRes)}`);
        }
      } else {
        console.log('暂无扭蛋机会')
      }
    } else {
      console.log('查询天天扭蛋的机会失败')
    }
    plantBeanIndexResult = yield plantBeanIndex()
    if (plantBeanIndexResult.code == '0') {
      let plantBeanRound = plantBeanIndexResult.data.roundList[1]
      if (plantBeanRound.roundState == 2) {
        //收取营养液
        console.log(`开始收取营养液`)
        for (let bubbleInfo of plantBeanRound.bubbleInfos) {
          console.log(`收取营养液${bubbleInfo.name}`)
          let cultureBeanResult = yield cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
          console.log(`cultureBeanResult:${JSON.stringify(cultureBeanResult)}`)
        }
      }
    } else {
      console.log(`plantBeanIndexResult:${JSON.stringify(plantBeanIndexResult)}`)
    }
    // 偷大于等于3瓶好友的营养液
    let stealRes = yield steal();
    if (stealRes.code == 0) {
      if (stealRes.data.tips) {
        console.log('今日已达上限');
      }
      if (stealRes.data && stealRes.data.friendInfoList && stealRes.data.friendInfoList.length > 0) {
        for (let item of stealRes.data.friendInfoList) {
          if (item.nutrCount >= 3) {
            console.log(`可以偷的好友的信息::${JSON.stringify(item)}`);
            console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`);
            let stealFriendRes = yield collectUserNutr(item.paradiseUuid);
            console.log(`偷取好友营养液情况:${JSON.stringify(stealFriendRes)}`)
            if (stealFriendRes.code == '0') {
              console.log(`偷取好友营养液成功`)
            }
          }
        }
      }
    }
    console.log('结束')
  } else {
    $.msg(name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    $.done();
    return
  }
  if (!jdNotify || jdNotify === 'false') {
    $.msg(name, subTitle, message);
  }
  $.done();
}

function purchaseRewardTask(roundId) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "monitor_refer": "plant_receiveNutrients",
    "monitor_source": "plant_app_plant_index",
    "roundId": roundId,
    "version": "9.0.0.1"
  }
  request(functionId, body);// `body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

//低价包邮
function plantReceiveNutrientsTask() {
  const body = {
    "monitor_refer": "plant_receiveNutrientsTask",
    "monitor_source": "plant_app_plant_index",
    "awardType": "19",
    "version": "9.0.0.1"
  };
  request('receiveNutrientsTask', body);
}

function receiveNutrientsTask(awardType) {
  // let functionId = arguments.callee.name.toString();
  // let body = {
  //     "monitor_refer": "plant_receiveNutrientsTask",
  //     "monitor_source": "plant_m_plant_index",//plant_app_plant_index,plant_m_plant_index
  //     "awardType": `"${awardType}"`,
  //     "version": "9.0.0.1"// "9.0.0.1", "8.4.0.0"
  // }
  //这里很奇怪，试了很多情况都不行，直接这样了
  requestGet(`https://api.m.jd.com/client.action?functionId=receiveNutrientsTask&body=%7B%22awardType%22%3A%22${awardType}%22%2C%22monitor_source%22%3A%22plant_m_plant_index%22%2C%22monitor_refer%22%3A%22plant_receiveNutrientsTask%22%2C%22version%22%3A%228.4.0.0%22%7D&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`)
  // request(functionId, body);// `body=${escape(JSON.stringify(body))}&client=apple&appid=ld`
}

//https://api.m.jd.com/client.action?functionId=receiveNutrients
function receiveNutrients(roundId) {

  let functionId = arguments.callee.name.toString();
  let body = {
    "monitor_refer": "plant_receiveNutrients",
    "monitor_source": "plant_app_plant_index",
    "roundId": roundId,
    "version": "9.0.0.1"
  }

  request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`

}

// https://api.m.jd.com/client.action?functionId=cultureBean
//收取营养液
function cultureBean(roundId, nutrientsType) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "monitor_refer": "plant_index",
    "monitor_source": "plant_app_plant_index",
    "roundId": roundId,
    "nutrientsType": nutrientsType,
    "version": "9.0.0.1"
  }
  request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function productNutrientsTask(productTaskId, skuId) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "monitor_refer": "plant_productNutrientsTask",
    "monitor_source": "plant_app_plant_index",
    "productTaskId": productTaskId,
    "skuId": skuId,
    "version": "9.0.0.1"
  }
  request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function productTaskList() {
  //https://api.m.jd.com/client.action?functionId=productTaskList&body=%7B%7D&uuid=&appid=ld
  let functionId = arguments.callee.name.toString();
  request(functionId);// `body=%7B%7D&uuid=&appid=ld`
}

function plantChannelNutrientsTask(channelTaskId, channelId) {
  let functionId = arguments.callee.name.toString();
  let body = {"channelTaskId": channelTaskId, "channelId": channelId}
  request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function plantChannelTaskList() {
  let functionId = arguments.callee.name.toString();
  request(functionId);// `body=%7B%7D&uuid=&appid=ld`
}

function shopNutrientsTask(shopTaskId, shopId) {
  let functionId = arguments.callee.name.toString();
  let body = {
    "version": "9.0.0.1",
    "monitor_refer": "plant_shopNutrientsTask",
    "monitor_source": "plant_app_plant_index",
    "shopId": shopId,
    "shopTaskId": shopTaskId
  }

  request(functionId, body);// `body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function shopTaskList() {
  let functionId = arguments.callee.name.toString();
  request(functionId);//`body=%7B%7D&uuid=&appid=ld`
}

function helpShare(plantUuid) {
  let body = {
    "plantUuid": plantUuid,
    "monitor_refer": "",
    "wxHeadImgUrl": "",
    "shareUuid": "",
    "followType": "0",
    "monitor_source": "plant_m_plant_index",
    "version": "9.0.0.1"
  }
  request(`plantBeanIndex`, body);
}

//查询天天扭蛋的机会
function egg() {
  request('plantEggLotteryIndex');
}

// 调用扭蛋api
function plantEggDoLottery() {
  request('plantEggDoLottery');
}

function plantBeanIndex() {
  // https://api.m.jd.com/client.action?functionId=plantBeanIndex
  let functionId = arguments.callee.name.toString();
  let body = {"monitor_source": "plant_app_plant_index", "monitor_refer": "", "version": "9.0.0.1"}
  request(functionId, body);//plantBeanIndexBody
}

//偷营养液大于等于3瓶的好友
//①查询好友列表
function steal() {
  const body = {
    pageNum: '1'
  }
  request('plantFriendList', body);
}

//②执行偷好友营养液的动作
function collectUserNutr(paradiseUuid) {
  console.log('开始偷好友');
  console.log(paradiseUuid);
  let functionId = arguments.callee.name.toString();
  const body = {
    "paradiseUuid": paradiseUuid,
    "roundId": currentRoundId
  }
  request(functionId, body);
}

//每轮种豆活动获取结束后,自动收取京豆
function getReward() {
  const body = {
    "roundId": lastRoundId
  }
  request('receivedBean', body);
}

function requestGet(url) {
  const option = {
    url: url,
    headers: {
      Cookie: cookie,
    }
  };
  $.get(option, (err, resp, data) => {
    try {
      if (err) {
        console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
      } else {
        data = JSON.parse(data);
      }
    } catch (e) {
      $.logErr(e, resp)
    } finally {
      sleep(data);
    }
    // try {
    //   sleep(JSON.parse(data))
    // } catch (e) {
    //   $.logErr(e, resp)
    // }
  })
}

function request(function_id, body = {}) {
  $.post(taskurl(function_id, body), (err, resp, data) => {
    try {
      if (err) {
        console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
      } else {
        data = JSON.parse(data);
      }
    } catch (e) {
      $.logErr(e, resp)
    } finally {
      sleep(data);
    }
  })
}

function taskurl(function_id, body) {
  // console.log(`${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`)
  return {
    // url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`,
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${JSON.stringify(body)}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': 'JD4iPhone/167249 (iPhone;iOS 13.5.1;Scale/3.00)',
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}

// function taskurl(function_id, body) {
//     return {
//         url: `${JD_API_HOST}?functionId=${function_id}`,
//         body: body, //escape`functionId=${function_id}&body=${JSON.stringify(body)}&appid=wh5`
//         headers: {
//             Cookie: cookie,
//         },
//         method: "POST",
//     }
// }

function sleep(response) {
  console.log('休息一下');
  setTimeout(() => {
    console.log('休息结束');
    Task.next(response)
  }, 2000);
}

function getParam(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}