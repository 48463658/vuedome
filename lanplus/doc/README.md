<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-09 09:13:54
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-02 15:17:45
 -->

## 导航 菜单
- 视频预览  [VidP_videoPreview vidpvideopreview] VideoPreview/videopreview.vue
- 人事管理  ManManage/
	人员信息  [MaM_manmessage mammanmessage] ManManage/manmessage.vue
	企业信息  [MaM_company mamcompany] ManManage/company.vue
	角色管理  [MaM_roles mamroles] ManManage/roles.vue
- 设备管理	[EqM_eqmessage eqmeqmessage] EqManage/eqmessage.vue
- 设备配置  [EqL_eqlayout eqleqlayout] EqLayout/eqlayout.vue
- 数据管理  DataManage/
	识别记录  [DaM_record damrecord] DataManage/record.vue
	操作日志  [DaM_log damlog] DataManage/log.vue
- 数据分析  [DaF_datafrom dafdatafrom] DataFrom/datafrom.vue


人脸尺寸：
 面板机：600 X 1024    860 X 1148    860 X 968
 双光：  可见光1080p  红外640*512


 数据统计数据结构：
 Get: chart/stats/record
 {
    "code": 0,
    "data": [
        {
            "describe": "unusual",//异常人数
            "sum": "17"
        },
        {
            "describe": "total",//识别总人数
            "sum": "397"
        },
        {
            "describe": "noMask",//未待口罩
            "sum": "205"
        },
        {
            "describe": "stranger",//陌生人
            "sum": "324"
        }
    ],
    "message": "success"
}


设备记录筛选加了一个unusual字段默认false  为true异常信息筛选（体温异常，未带口罩，黑名单）



url：chart/line
method：get
{
    "code": 0,
    "data": [
        {
            "day": "2020-03-02",
            "noMask": 1,
            "unusual": 0,
            "stranger": 0
        },
        {
            "day": "2020-03-04",
            "noMask": 5,
            "unusual": 1,
            "stranger": 1
        }....
    ],
    "message": "success"
}


推送加了一个字段 master_map(对库图片)


{
  "companyName": "蓝普金睛",
  "data": {
    "alerm": [
      {
        "unusual": true,
        "email": false,
        "sms": true
      },
      {
        "noMask": true,
        "email": false,
        "sms": true
      },
      {
        "stranger": true,
        "email": false,
        "sms": true
      }
    ],
    "tel": [
      ""
    ],
    "email": [
      ""
    ]
  }
}


/company/update 这个接口
{
    "company_id": "4",
    "title": "测温平台"
}
文件数组： files ['ico','logo']


.gdiconfont {
  font-family: "gdiconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[class^="gdicon"],
[class*=" gdicon"]
/*这里有空格*/

{
  font-family: "gdiconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}