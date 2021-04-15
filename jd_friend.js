/*
joy总动员
 */
const $ = new Env('joy总动员');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const helpAuthor = true; // 是否帮助作者助力，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let friendBody = [
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22oOO65BY0hrDJVHO9q9jk7Q%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=f170654a0d60d7c235d59f3272169aa4&st=1609421400820&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22F0EdP5NfemMuYZOuuPtWeQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=fb60d1a854ad02cb1bb0e8c9b860c564&st=1609421782489&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22V3IJYdz33tgQjTf2N5sJxL22PE%252B9Cjx0%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=a6859f5db6fe3b2072413aac8ada738c&st=1609421791458&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22hfi6vpNOF5a8iQB69A3joQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=fa3c5a5ec5cc2c0917956cc1953e1ebf&st=1609421797047&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22IfGCI0UJ4HI1trmx1peLdw%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=9f07e2267ee1af2a6b4d74aff5599aa5&st=1609421808336&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%227IvQAyhrIQ1IQo%252FeuAQLzw%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=020071221042b99de2b27e439615d8c1&st=1609421818632&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22Mu4uKSZhQwuRwAxxcYrXHQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=9b3f7261c835f5003249d3bf562e3922&st=1609421827602&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22oVyf6jVgchhQLi1meLF8UQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=6bbb42ec4d6df4e0cb575446fb503eb1&st=1609421831050&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22Ip99PYMqNMkzDpSSlc12yw%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=5ea157ef5abcb86750289f59592a4be0&st=1609421841433&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22cmDlh6FLScTjwvzAch1Z2Q%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=8f2b2844ad81a772811054695547d4ba&st=1609421846904&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22VGAr8tpbghHN4S8V8zOIyA%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=be1693790dd33ee3ac64430eb05e9c26&st=1609421852909&sv=112&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22f%252Fp06uk5e%252FPzUJZtEpM71pD8Tnq8AdgZ%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=206f8b8f7b044fac89627ffcba7ee4c5&st=1609421858521&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%228leqNSLFagedLYJD8aayFVOnm69NNz1f%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=e820cd8465c5cd5943f7b8d0ef698ab4&st=1609421863332&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22mcUfJbbTz9gBgfBGLrTm1qYriUrERY7S%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=ca992c239f802f98c08cb0751930c4bb&st=1609421868203&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22sXPJrK11bfx15Zd%252B2iWDXA%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=e6d6a23078eb8c4b2919bff3b9279ed6&st=1609421873367&sv=112&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22aD8dKBHjvH1BIfBwPFEPow%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=f293483bc173fde16e1a8ab314d24a13&st=1609421877528&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22VGAr8tpbghHN4S8V8zOIyA%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=0b9a2105db9df6ce6c06faf2d76b87af&st=1609421880722&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22e%252Fx4pxNB1inPCMg65RTmqG5YP5AOxt8f%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=a5ff7ec8f618874e1c721137b7249a53&st=1609421883744&sv=112&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22i2dQGybge5xZP%252FgmIfMBBA%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=5c6d0a1463dedb42efd59947f357742f&st=1609421891974&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22F0EdP5NfemMuYZOuuPtWeQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=1242ab5f5f801f5dc913f7bb9232f2de&st=1609421899834&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22kFjnMMfPiMlbYUrjLVxfBvHUtLKrXdc0%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=79f227d03e9537f11eb900fc334cf9ad&st=1609421903106&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22aD8dKBHjvH1BIfBwPFEPow%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=c12b6e118191587e6574c4a859809a2b&st=1609421907213&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22VkNtaNVunxKVNaTsBuL4WQ%253D%253D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=b3df1a185d1321aeb2ee9e11f6232968&st=1609421910983&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%226xaWXhG8gOoxIT3QDJBtT9LVwAXlBq2D%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=50281e3582732194b10200977723ed43&st=1609421918909&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22transType%22%3A0%2C%22oppositePin%22%3A%22PiIvyKdPOqoaTcz31oXPI2fJ3eg0XNUe%22%2C%22source%22%3A2%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=a1860b1477a347e577b8712db7d0b5a9&st=1609421923443&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb'
]
let removeBody = [
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22aD8dKBHjvH1BIfBwPFEPow%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=0b984c40b50be8c78e0b6a6886c72870&st=1609423456364&sv=112&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22f%5C/p06uk5e%5C/PzUJZtEpM71pD8Tnq8AdgZ%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=c860616a332f67b2f41a7f9734d18670&st=1609423497333&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22hfi6vpNOF5a8iQB69A3joQ%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=9704ffe6c77875b82eb8cce42acb62cc&st=1609423503583&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22Ip99PYMqNMkzDpSSlc12yw%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=44185d90bb69a44a08c95b3a4c61d271&st=1609423507034&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22sXPJrK11bfx15Zd%2B2iWDXA%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=d44075b4dc60831097c438f9b5045a47&st=1609423510983&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22cmDlh6FLScTjwvzAch1Z2Q%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=50dfc34b01a1d38c1f5323972f41023f&st=1609423514833&sv=111&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22Mu4uKSZhQwuRwAxxcYrXHQ%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=e86658e5482ec4f1cc58b60b954d176e&st=1609423518118&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22kFjnMMfPiMlbYUrjLVxfBvHUtLKrXdc0%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=f16992f054e8cb68cf972dbef734ee74&st=1609423521419&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22mcUfJbbTz9gBgfBGLrTm1qYriUrERY7S%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=51c6ecb0dcae185cb3b838c508426088&st=1609423525235&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22oVyf6jVgchhQLi1meLF8UQ%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=967a286159530cd60bce61a16748d273&st=1609423529035&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%226xaWXhG8gOoxIT3QDJBtT9LVwAXlBq2D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=3ec3e251ece56a721bc5b885ae34e7f7&st=1609423532401&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22i2dQGybge5xZP%5C/gmIfMBBA%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=e258a663471cc9d54bcd94c36037701d&st=1609423535685&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22V3IJYdz33tgQjTf2N5sJxL22PE%2B9Cjx0%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=cdc8a3a6327fd1b62b857fd1fb78d252&st=1609423538985&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22IfGCI0UJ4HI1trmx1peLdw%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=568d98a5952a37a0b64255f3275e2655&st=1609423543570&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22VkNtaNVunxKVNaTsBuL4WQ%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=8a5d49e107157e6f69c1339db4a4fd88&st=1609423547936&sv=102&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22VGAr8tpbghHN4S8V8zOIyA%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=9ab365445f456c76b915a971e177b61d&st=1609423551369&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22PiIvyKdPOqoaTcz31oXPI2fJ3eg0XNUe%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=dcc2b2e9ededab68cedb2a26770278ce&st=1609423555254&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%227IvQAyhrIQ1IQo%5C/euAQLzw%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=3c574761f9b07b9d06c8c14480c2b53f&st=1609423559120&sv=121&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22e%5C/x4pxNB1inPCMg65RTmqG5YP5AOxt8f%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=b853b67fc744c4e503a8f23399dda4e9&st=1609423563854&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22F0EdP5NfemMuYZOuuPtWeQ%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=79bb54cee1f3bf43f966456718427514&st=1609423572154&sv=100&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%22oOO65BY0hrDJVHO9q9jk7Q%3D%3D%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=228d1a91d0d8ab778f647b0582a6ea6d&st=1609423575321&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb',
  'adid=CC1CDB91-EADC-4790-B669-DE4F85E425B7&area=12_904_908_57903&body=%7B%22oppositePin%22%3A%228leqNSLFagedLYJD8aayFVOnm69NNz1f%22%2C%22source%22%3A2%2C%22transType%22%3A3%7D&build=167490&client=apple&clientVersion=9.3.2&d_brand=apple&d_model=iPhone8%2C1&eid=eidI55930119Nzc3NUIwOTAtNjNBMi00Rg%3D%3Dk9iMPEBPjXpii/VVVYfSpocvZIf3V%2Bm2Go5MZ2y8LiYFi7RMve53r%2BINJc8BGfxbsUniaT69gPh8Zx6o&isBackground=N&joycious=11&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=1a509cff5a1237c1fe453e9bd8372a2e5ce55390&osVersion=13.4.1&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=8982374fc5647544806348509757fe0a&st=1609423578954&sv=101&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJj9/1TOUo17mdWrXEKMH6NhjrEufHENCs2xA1vZiU1aqDR6L1%2BA%2ByOpHKZCMbWtCU40pNC2to7d1c5wm7YUH354dMG5K4VJCNv9dsCibhpog3YenA4%2B%2BthY3MWXh87RbVJXGl1pc2FvYtH/%2BFwdanLIBRQEs7YQKahuJjYFAAIr25ZzCIi%2B88QA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=eca3570e9aa3c15b2fad65c40a87f0fb'
]
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://api.m.jd.com/';
!(async () => {
  $.newShareCodes = []
  // await getAuthorShareCode();
  // await getAuthorShareCode2();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdFriend();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdFriend() {
  for (let i = 0; i < friendBody.length; ++i) {
    await addFriend(friendBody[i])
    await $.wait(500)
  }
  $.bean = 0
  $.friends = []
  await getFriendList()
  console.log($.friends.length)
  for (let i = 0; i < $.friends.length; ++i) {
    const friend = $.friends[i]
    if (friend['intimacyStatus'] === 0) {
      await getFriendDetail(friend['unionPin'])
    }
  }
  await getCardList()
  await getCardList(7)
  await getCardList(9)
  for (let i = 0; i < removeBody.length; ++i) {
    await addFriend(removeBody[i])
    await $.wait(500)
  }
  console.log(`${$.name} 任务运行完成，共计获得 ${$.bean} 京豆`)
}

function addFriend(body) {
  return new Promise(resolve => {
    $.post(taskPostUrl('jdf_updateFriendshipStatus', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data)
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

function getFriendList() {
  return new Promise(resolve => {
    $.get(taskGetUrl('getFriendList', {"clientType": "jdApp"}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0') {
              $.friends = data.data.friends
            }
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

function getFriendDetail(unionPin) {
  return new Promise(resolve => {
    $.get(taskGetUrl('getIntimacyDetail', {"unionPin": unionPin, "clientType": "jdApp"}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0') {
              console.log(`与好友【${unionPin}】匹配成功，匹配程度：${data.data.intimacy.total}`)
              await openBox(unionPin)
              await $.wait(500)
            }
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

function openBox(unionPin, type = 1) {
  return new Promise(resolve => {
    $.get(taskGetUrl('openBox', {"pin": unionPin, "clientType": "jdApp", "type": type}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0') {
              console.log(`打开宝箱成功，获得${data.data.bean ? data.data.bean : 0}京豆`)
              $.bean += data.data.bean ? data.data.bean : 0
            } else {
              console.log(data)
            }
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

function getCardList(cardId=null) {
  let body = {"clientType": "jdApp"}
  if(cardId) body['cardId'] = cardId
  return new Promise(resolve => {
    $.get(taskGetUrl('getCardList', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0' && data.data.box) {
              const boxs = data.data.box
              for (let i = 0; i < boxs.length; ++i) {
                const box = boxs[i]
                if (box['status'] === 1) {
                  console.log(`去开宝箱【${box['name']}】`)
                  await openBox(null, box['boxId'])
                }
              }

            }
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

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}


function taskPostUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}`,
    body: body,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}

function taskGetUrl(function_id, body) {
  //console.log(`https://api.m.jd.com/?appid=joy-friend&functionId=${function_id}&body=${escape(JSON.stringify(body))}`)
  return {
    url: `https://api.m.jd.com/?appid=joy-friend&functionId=${function_id}&body=${escape(JSON.stringify(body))}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded",
      "referer": "https://an.jd.com/babelDiy/Zeus/q1eB6WUB8oC4eH1BsCLWvQakVsX/index.html"
    }
  }
}


function taskUrl(function_id, body) {
  body["version"] = "9.0.0.1";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
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

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
