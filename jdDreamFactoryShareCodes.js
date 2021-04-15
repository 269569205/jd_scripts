/*
京喜工厂互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写东东萌宠的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 DREAM_FACTORY_SHARE_CODES(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let shareCodes = [
  '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==@Fw0fWVzLkmAdljVdD9yF_g==@JDLbU5vQ7XnXhdo_v6Yl6Q8cERgnl5tj7O1n-eBp_3o=@55lc0Q8VXOUYwqg54CVf1g==@NhDMDsB950brvtjPJAyO0A==@MIQRUlz4_L8LFQLiDVXb6w==@aDThVd9xrUHL_IMFTVSX5A==@XPGULh30rtBObYNRSroMPQ==',//账号一的好友shareCode,不同好友中间用@符号隔开
  '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==@NhDMDsB950brvtjPJAyO0A==@MIQRUlz4_L8LFQLiDVXb6w==@aDThVd9xrUHL_IMFTVSX5A==@XPGULh30rtBObYNRSroMPQ==',//账号一的好友shareCode,不同好友中间用@符号隔开
   '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
    '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
	 '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
	  '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
	   '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
	    '6fvc6SL6o9DYj4Y4czt7qw==@MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==@ohjNqJLST47CO17bT4xsKw==',//账号一的好友shareCode,不同好友中间用@符号隔开
		 'MZi7exvogQ2x-9pWU3hPag==@mIKQTB4C8OE6AuNvXzaCLw==@GDU5ONT4DRM2wwUaK5p6nA==@m_LHBcX7do_OQ5qAxLg-Xw==@rFfpiK7zwAbg4964VrvX5g==@3fC3jOIM7F5WbTai2NMR6Q==',//账号一的好友shareCode,不同好友中间用@符号隔开

]
// 判断github action里面是否有京喜工厂互助码
if (process.env.DREAM_FACTORY_SHARE_CODES) {
  if (process.env.DREAM_FACTORY_SHARE_CODES.indexOf('&') > -1) {
    console.log(`您的互助码选择的是用&隔开\n`)
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split('&');
  } else if (process.env.DREAM_FACTORY_SHARE_CODES.indexOf('\n') > -1) {
    console.log(`您的互助码选择的是用换行隔开\n`)
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split('\n');
  } else {
    shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split();
  }
} else if (process.env.DREAM_FACTORY_SHARE_CODES) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < shareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['shareCodes' + index] = shareCodes[i];
}
