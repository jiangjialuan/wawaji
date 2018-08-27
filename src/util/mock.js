import Mock from 'mockjs';

export default Mock.mock('http://jjl.cn/', {
    //轮播图
  /*data:[
    'http://www.huake.org.cn/Huake_Window/showimages/2016122544161.jpg',
    'http://www.huake.org.cn/Huake_Window/showimages/2016122544161.jpg',
    'http://www.huake.org.cn/Huake_Window/showimages/2016122544161.jpg',
  ]*/

  //娃娃机列表
  /*'data|10': [
    {
      'id|1-10': '@id',
      name: '@name',
      ware_image:'http://www.huake.org.cn/Huake_Window/showimages/2016122544161.jpg',
      'device_status|0-2':0,
      'game_mode|1-2':1,
      'game_time|30-60':30,
      'coin|1-100':30,
    }
  ],
  "meta": {
    "pagination": {
      "total": 10,
      "count": 3,
      "per_page": 3,
      "current_page": 1,
      "total_pages": 4,
    }
  }*/

  //我的娃娃
 /* 'data|10': [
    {
      'id|1-100': 28,
      "user_id": 2,
      "machine_id": 1,
      "log_id": 0,
      "coin": 10,
      "operate_result": 2,
      "ware_id": 1,
      "ware_name": "设备A0074",
      "ware_image": "http://testdoll.artqiyi.com/data_focus/store/store_100052/goods_158/small_201711201309185889.jpg",
      'ware_status|0-2': 0,
      "order_id": 0,
      "created_at": "2017-12-06 02:48:26",
      "updated_at": "2017-12-06 02:48:26"
    },
    ],
    "meta": {
      "pagination": {
        "current_page": 1,
          "per_page": 15,
          "count": 15,
        "total_pages":2,
      }
    }*/

  //我的订单
  /*'data|10': [
    {
      'id|1-100': 1,
      "user_id": '@user_id',
      "order_sn": '@order_sn',
      'status': '1000',
      "out_order_id": '@out_order_id',
      "confirmed_at": '@confirmed_at',
      "created_at": "2017-12-03 11:23:49",
      "updated_at": "2017-12-03 11:23:49",
      'ware|3': [
        {
          'id|1-10': 1,
          "order_id": 1,
          "ware_id": 0,
          "name": "皇冠熊",
          "num": 3,
          "image": "http://doll.artqiyi.com/data_focus/store/store_100052/goods_167/small_201711211156077565.jpg"
        }
      ]

    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "per_page": 15,
      "count": 3,
      "total": 3,
      "total_pages": 1
    }
  }*/

  //订单详情
  /*"data": {
    "id": 1,
    "user_id": 1,
    "order_sn": "17110107443",
    "status": 200,
    "out_order_id": 7443,
    "confirmed_at": null,
    "created_at": "2017-12-03 11:23:49",
    "updated_at": "2017-12-03 11:23:49",
    "ware": [
      {
        "id": 1,
        "order_id": 1,
        "ware_id": 0,
        "name": "皇冠熊",
        "num": 3,
        "image": "http://doll.artqiyi.com/data_focus/store/store_100052/goods_167/small_201711211156077565.jpg"
      },
      ],
      "extension": {
        "order_id": 1,
          "province_id": 2,
          "city_id": 1,
          "district_id": 3,
          "address": "东风东路733号羊城同创汇601",
          "consignee": "董璐",
          "phone": "18738731203",
          "shipping_no": "613370273234",
          "shipping_name": "顺丰快递",
          "shipping_com": "shunfeng",
          "shipped_at": "2017-12-03 11:23:49",
          "province":"广东省",
          "city":"广州市",
          "district":"海珠区",
      }
    }*/

  //收货地址列表
  /*'data|10': [
    {
      'id|1-10': 1,
      'user_id|1-100': 1,
      "province_id": 2,
      "city_id": 23,
      "district_id": 3,
      "address": "东风东路733号羊城同创汇601",
      'consignee': '王先生',
      "phone": '13212541254',
      "is_default": 1,
      "created_at": "2017-12-03 11:23:49",
      "updated_at": "2017-12-03 11:23:49",
      "province":"广东省",
      "city":"广州市",
      "district":"海珠区",
    }
    ],
    "meta": {
      "pagination": {
        "current_page": 1,
        "per_page": 15,
        "count": 6,
        "total": 6,
        "total_pages": 2
      }
    }*/

  //行政地区
  /*"data": [
    {
      "id": 3,
      "name": "北京市",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 22,
      "name": "天津市",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 41,
      "name": "上海市",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 61,
      "name": "重庆市",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 104,
      "name": "河北省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 116,
      "name": "山西省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 128,
      "name": "辽宁省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 143,
      "name": "吉林省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 153,
      "name": "黑龙江省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 167,
      "name": "内蒙古自治区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 180,
      "name": "江苏省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 194,
      "name": "浙江省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 206,
      "name": "安徽省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 224,
      "name": "福建省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 234,
      "name": "江西省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 246,
      "name": "山东省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 264,
      "name": "河南省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 283,
      "name": "湖北省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 301,
      "name": "湖南省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 317,
      "name": "广东省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 339,
      "name": "海南省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 342,
      "name": "广西壮族自治区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 357,
      "name": "四川省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 379,
      "name": "贵州省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 389,
      "name": "云南省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 406,
      "name": "西藏自治区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 414,
      "name": "陕西省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 425,
      "name": "甘肃省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 440,
      "name": "青海省",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 449,
      "name": "宁夏回族自治区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 455,
      "name": "新疆维吾尔自治区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 474,
      "name": "香港特别行政区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 475,
      "name": "澳门特别行政区",
      "parent_id": 0,
      "type": 1
    },
    {
      "id": 476,
      "name": "台湾省",
      "parent_id": 0,
      "type": 1
    }
  ]*/

  //订单跟踪
  /*"data": {
    "order_id": 1,
    "address": "广东省广州市番禺区欢聚时代",
    "consignee": "周泽新",
    "phone": "18520122013",
    "shipping_no": "1200722815552",
    "shipping_name": "韵达快递",
    "shipping_com": "yunda",
    "shipped_at": "2013-03-03 19:24:48",
    "logistics": [
      {
        "time": "2012-07-07 13:35:14",
        "context": "客户已签收"
      },
      {
        "time": "2012-07-07 09:10:10",
        "context": "离开[北京石景山营业厅]派送中，递送员[温]，电话[]"
      },
      {
        "time": "2012-07-06 19:46:38",
        "context": "到达[北京石景山营业厅]"
      },
      {
        "time": "2012-07-06 15:22:32",
        "context": "离开[北京石景山营业厅]派送中，递送员[温]，电话[]"
      },
      {
        "time": "2012-07-06 15:05:00",
        "context": "到达[北京石景山营业厅]"
      },
      {
        "time": "2012-07-06 13:37:52",
        "context": "离开[北京_同城中转站]发往[北京石景山营业厅]"
      },
      {
        "time": "2012-07-06 12:54:41",
        "context": "到达[北京_同城中转站]"
      },
      {
        "time": "2012-07-06 11:11:03",
        "context": "离开[北京运转中心驻站班组] 发往[北京_同城中转站]"
      },
      {
        "time": "2012-07-06 10:43:21",
        "context": "到达[北京运转中心驻站班组]"
      },
      {
        "time": "2012-07-05 21:18:53",
        "context": "离开[福建_厦门支公司] 发往 [北京运转中心_航空]"
      },
      {
        "time": "2012-07-05 20:07:27",
        "context": "已取件，到达 [福建_厦门支公司]"
      }
    ]
  }*/

  //娃娃币
  'data|10': [
    {
      "id": 2,
      "user_id": 4,
      'coin|-100-100': 10,
      "recordable_type": "game_record",
      "recordable_id": 6,
      "created_at": "2017-12-06 10:01:18",
      'recordable': {
        "id": 6,
        "user_id": 4,
        "machine_id": 1,
        "log_id": 0,
        "coin": 10,
        "operate_result": 1,
        "ware_id": 1,
        "ware_name": "",
        "ware_image": "http://testdoll.artqiyi.com/data_focus/device/device_VMtLbvuTNJwNSZEpLysmTE/201712051754431662.jpg",
        "ware_status": 0,
        "order_id": 0,
        "created_at": "2017-12-06 10:01:18",
        "updated_at": "2017-12-06 10:01:18"
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "count": 10
    }
  }


});
