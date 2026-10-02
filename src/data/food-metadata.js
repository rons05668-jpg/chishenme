/**
 * 新增条目与分类标注。旧数据 ID 不变；类型、地域、时段互相独立。
 * exclusions 是常见配料，uncertainExclusions 是配方不固定时需确认的配料。
 * 这些标签服务于偏好排除，不是过敏原检测或门店配方保证。
 */
export const EXTRA_FOODS = [
  {
    "id": "jidan-gai",
    "name": "番茄鸡蛋盖饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "番茄鸡蛋盖饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "tudou-gai",
    "name": "土豆牛肉盖饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "土豆牛肉盖饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "mogu-fan",
    "name": "香菇滑鸡饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "香菇滑鸡饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "jizhao-fan",
    "name": "照烧鸡腿饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "照烧鸡腿饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "man-yu-fan",
    "name": "鳗鱼饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鳗鱼饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "hai-nan-ji",
    "name": "海南鸡饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "海南鸡饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "bo-luo-fan",
    "name": "菠萝炒饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "菠萝炒饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "la-chang-fan",
    "name": "腊肠焖饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "腊肠焖饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "dou-jiao-fan",
    "name": "豆角焖饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "豆角焖饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "paella",
    "name": "西班牙海鲜饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "西班牙海鲜饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "zhu-tong-fan",
    "name": "竹筒饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "竹筒饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "云贵"
    ]
  },
  {
    "id": "ba-bao-fan",
    "name": "八宝饭",
    "emoji": "🍚",
    "price": [
      12,
      32
    ],
    "category": "米饭",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "八宝饭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "pian-er-chuan",
    "name": "片儿川",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "片儿川，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "pian-chuan",
    "name": "虾爆鳝面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "虾爆鳝面，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "ao-zao-mian",
    "name": "奥灶面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "奥灶面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "cong-you-mian",
    "name": "葱油拌面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "葱油拌面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "he-nan-hui",
    "name": "河南烩面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "河南烩面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "mian-pian",
    "name": "炒面片",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "炒面片，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "ding-ding-mian",
    "name": "丁丁炒面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "丁丁炒面，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "you-mian",
    "name": "莜面栲栳栳",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "莜面栲栳栳，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "yan-mai",
    "name": "延吉冷面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "延吉冷面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "wu-dong",
    "name": "乌冬面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "乌冬面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "qiao-mai",
    "name": "荞麦面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "荞麦面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "sukiyaki-udon",
    "name": "寿喜烧乌冬",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "寿喜烧乌冬，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "pho",
    "name": "越南牛肉河粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "越南牛肉河粉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "pad-thai",
    "name": "泰式炒河粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "泰式炒河粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "laksa",
    "name": "叻沙米粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "叻沙米粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "sha-cha-mian",
    "name": "沙茶面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "沙茶面，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "lao-you-fen",
    "name": "老友粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "老友粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "zhu-jiao-fen",
    "name": "猪脚粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "猪脚粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "yu-xue-fen",
    "name": "鸭血粉丝汤",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鸭血粉丝汤，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "fei-chang-fen",
    "name": "肥肠粉",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "肥肠粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "fen-gan",
    "name": "炒粉干",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "炒粉干，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "chao-he-fen",
    "name": "干炒牛河",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "干炒牛河，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "su-tang-mian",
    "name": "菌菇汤面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "菌菇汤面，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "liang-mian",
    "name": "鸡丝凉面",
    "emoji": "🍜",
    "price": [
      10,
      28
    ],
    "category": "粉面",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鸡丝凉面，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "niu-rou-jiao",
    "name": "牛肉水饺",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "牛肉水饺，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "su-jiao",
    "name": "素三鲜饺子",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "素三鲜饺子，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "xia-jiao",
    "name": "虾仁水饺",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "虾仁水饺，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "jian-jiao",
    "name": "锅贴",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "锅贴，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "tang-bao",
    "name": "蟹黄汤包",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "蟹黄汤包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "shao-mai",
    "name": "糯米烧麦",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "糯米烧麦，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "cha-shao-bao",
    "name": "叉烧包",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "叉烧包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "nai-huang-bao",
    "name": "奶黄包",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "奶黄包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "cong-you-bing",
    "name": "葱油饼",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "葱油饼，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "niu-rou-bing",
    "name": "牛肉馅饼",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "牛肉馅饼，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "jiu-cai-he",
    "name": "韭菜盒子",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "韭菜盒子，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "jian-bao",
    "name": "水煎包",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "水煎包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "hua-juan",
    "name": "花卷",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "花卷，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "man-tou",
    "name": "馒头",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "馒头，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "fa-gao",
    "name": "发糕",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "发糕，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "guo-kui",
    "name": "锅盔",
    "emoji": "🥟",
    "price": [
      8,
      25
    ],
    "category": "包饺饼类",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "锅盔，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "fan-qie-guo",
    "name": "番茄牛腩锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "番茄牛腩锅，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "jun-gu-guo",
    "name": "菌菇火锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "菌菇火锅，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "云贵"
    ]
  },
  {
    "id": "shou-xi-guo",
    "name": "寿喜锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "寿喜锅，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "shuan-yang",
    "name": "铜锅涮羊肉",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "铜锅涮羊肉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "suan-cai-guo",
    "name": "酸菜白肉锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "酸菜白肉锅，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "su-tang-yu-guo",
    "name": "酸汤鱼锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "酸汤鱼锅，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "云贵"
    ]
  },
  {
    "id": "la-pai-guo",
    "name": "腊排骨火锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "腊排骨火锅，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "云贵"
    ]
  },
  {
    "id": "hai-xian-guo",
    "name": "海鲜火锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "海鲜火锅，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "nian-gao-guo",
    "name": "韩式年糕锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "韩式年糕锅，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "dong-yin-guo",
    "name": "泰式酸辣海鲜锅",
    "emoji": "🍲",
    "price": [
      35,
      90
    ],
    "category": "火锅锅物",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "泰式酸辣海鲜锅，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "da-pan-ji",
    "name": "大盘鸡",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "大盘鸡，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "tie-guo-yu",
    "name": "铁锅炖鱼",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "铁锅炖鱼，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "di-san-xian",
    "name": "地三鲜",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "地三鲜，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "xiao-ji-mo",
    "name": "小鸡炖蘑菇",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "小鸡炖蘑菇，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "zhu-rou-fen",
    "name": "猪肉炖粉条",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "猪肉炖粉条，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "东北"
    ]
  },
  {
    "id": "hong-shao-rou",
    "name": "红烧肉",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "红烧肉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "tang-cu-ji",
    "name": "糖醋里脊",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "糖醋里脊，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "qing-jiao-rou",
    "name": "青椒肉丝",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "青椒肉丝，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "mu-xu-rou",
    "name": "木须肉",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "木须肉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "yu-xiang-qie",
    "name": "鱼香茄子",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鱼香茄子，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "ma-po-dou",
    "name": "麻婆豆腐",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "麻婆豆腐，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "gan-bian-dou",
    "name": "干煸四季豆",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "干煸四季豆，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "hui-guo-rou",
    "name": "回锅肉",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "回锅肉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "gong-bao-ji",
    "name": "宫保鸡丁",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "宫保鸡丁，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "fu-qi-fei",
    "name": "夫妻肺片",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "夫妻肺片，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "kou-shui-ji",
    "name": "口水鸡",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "口水鸡，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "la-zi-ji",
    "name": "辣子鸡",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "辣子鸡，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "suan-cai-yu",
    "name": "酸菜鱼",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "酸菜鱼，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "shui-zhu-yu",
    "name": "水煮鱼",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "水煮鱼，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "duo-jiao-yu",
    "name": "剁椒鱼头",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "剁椒鱼头，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "湘式"
    ]
  },
  {
    "id": "nong-jia-rou",
    "name": "农家小炒肉",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "农家小炒肉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "湘式"
    ]
  },
  {
    "id": "zheng-la-rou",
    "name": "腊味合蒸",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "腊味合蒸，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "湘式"
    ]
  },
  {
    "id": "bai-qie-ji",
    "name": "白切鸡",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "白切鸡，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "qing-zheng-yu",
    "name": "清蒸鲈鱼",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "清蒸鲈鱼，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "bai-zhuo-xia",
    "name": "白灼虾",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "白灼虾，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "suan-rong-bei",
    "name": "蒜蓉粉丝扇贝",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "蒜蓉粉丝扇贝，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "xiang-la-xie",
    "name": "香辣蟹",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "香辣蟹，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "yan-shui-ya",
    "name": "盐水鸭",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "盐水鸭，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "long-jing-xia",
    "name": "龙井虾仁",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "龙井虾仁，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "dong-po-rou",
    "name": "东坡肉",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "东坡肉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "xiang-gu-cai",
    "name": "香菇青菜",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "香菇青菜，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "shou-si-cai",
    "name": "手撕包菜",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "手撕包菜，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "湘式"
    ]
  },
  {
    "id": "gan-guo-hua",
    "name": "干锅花菜",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "干锅花菜，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "湘式"
    ]
  },
  {
    "id": "ye-xiang-ji",
    "name": "椰香咖喱鸡",
    "emoji": "🥘",
    "price": [
      18,
      48
    ],
    "category": "家常菜",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "椰香咖喱鸡，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "yang-rou-chuan",
    "name": "羊肉串",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "羊肉串，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "niu-rou-chuan",
    "name": "牛肉串",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "牛肉串，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "kao-ji-chi",
    "name": "烤鸡翅",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤鸡翅，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "kao-qie-zi",
    "name": "烤茄子",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤茄子，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "kao-yu-mi",
    "name": "烤玉米",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤玉米，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "kao-sheng-hao",
    "name": "烤生蚝",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤生蚝，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "ri-shi-chuan",
    "name": "日式烤鸡串",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "日式烤鸡串，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "kao-rou-bing",
    "name": "烤肉夹饼",
    "emoji": "🍢",
    "price": [
      15,
      55
    ],
    "category": "烧烤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤肉夹饼，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "nuo-mi-ji",
    "name": "糯米鸡",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "糯米鸡，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "feng-zhua",
    "name": "豉汁凤爪",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "豉汁凤爪，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "zheng-pai-gu",
    "name": "豉汁蒸排骨",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "豉汁蒸排骨，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "jing-xia-jiao",
    "name": "水晶虾饺",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "水晶虾饺，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "xian-shui-jiao",
    "name": "咸水角",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "咸水角，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "luo-bo-gao",
    "name": "萝卜糕",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "萝卜糕，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "yu-tou-gao",
    "name": "芋头糕",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "芋头糕，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "zha-chun-juan",
    "name": "炸春卷",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "炸春卷，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "ci-fan-tuan",
    "name": "粢饭团",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "粢饭团，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "zong-zi",
    "name": "鲜肉粽",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鲜肉粽，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "lang-ya-tu",
    "name": "狼牙土豆",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "狼牙土豆，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "云贵"
    ]
  },
  {
    "id": "shang-xin-fen",
    "name": "伤心凉粉",
    "emoji": "🥢",
    "price": [
      8,
      26
    ],
    "category": "小吃点心",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "伤心凉粉，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "jian-ji-xiong",
    "name": "香煎鸡胸配蔬菜",
    "emoji": "🍽️",
    "price": [
      35,
      85
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "香煎鸡胸配蔬菜，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "kao-chun-ji",
    "name": "烤春鸡",
    "emoji": "🍽️",
    "price": [
      35,
      85
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "烤春鸡，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "jian-san-wen",
    "name": "香煎三文鱼",
    "emoji": "🍽️",
    "price": [
      35,
      85
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "香煎三文鱼，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "de-guo-chang",
    "name": "德式烤肠拼盘",
    "emoji": "🍽️",
    "price": [
      35,
      85
    ],
    "category": "西式主菜",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "德式烤肠拼盘，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "ji-rou-juan",
    "name": "鸡肉卷",
    "emoji": "🥪",
    "price": [
      15,
      35
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鸡肉卷，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "yu-pai-bao",
    "name": "鱼排汉堡",
    "emoji": "🥪",
    "price": [
      15,
      35
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "鱼排汉堡，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "san-wen-bao",
    "name": "贝果三明治",
    "emoji": "🥪",
    "price": [
      15,
      35
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "贝果三明治，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "fan-tuan",
    "name": "金枪鱼饭团",
    "emoji": "🥪",
    "price": [
      15,
      35
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "金枪鱼饭团，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "日韩"
    ]
  },
  {
    "id": "dong-yin-gong",
    "name": "冬阴功汤",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "冬阴功汤，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "东南亚"
    ]
  },
  {
    "id": "yang-rou-pao",
    "name": "羊肉泡馍",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "重口",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "羊肉泡馍，浓郁咸香；价格与配料请以门店为准。",
    "cuisines": [
      "西北"
    ]
  },
  {
    "id": "pi-dan-zhou",
    "name": "皮蛋瘦肉粥",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "皮蛋瘦肉粥，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "nan-gua-zhou",
    "name": "南瓜粥",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "南瓜粥，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "xiaomi-zhou",
    "name": "小米粥",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "小米粥，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "hai-xian-zhou",
    "name": "海鲜砂锅粥",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "海鲜砂锅粥，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "yu-pian-zhou",
    "name": "生滚鱼片粥",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "生滚鱼片粥，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "hu-la-tang",
    "name": "胡辣汤",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "微辣",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "胡辣汤，香辣开胃；价格与配料请以门店为准。",
    "cuisines": [
      "华北"
    ]
  },
  {
    "id": "yin-er-tang",
    "name": "银耳莲子羹",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "银耳莲子羹，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "yu-mi-tang",
    "name": "玉米排骨汤",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "玉米排骨汤，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "lian-ou-tang",
    "name": "莲藕排骨汤",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "莲藕排骨汤，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "luo-song-tang",
    "name": "罗宋汤",
    "emoji": "🥣",
    "price": [
      8,
      30
    ],
    "category": "粥汤",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "罗宋汤，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "dan-ta",
    "name": "蛋挞",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "蛋挞，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "bo-luo-bao",
    "name": "菠萝包",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "菠萝包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "ke-song",
    "name": "可颂",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "可颂，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "ou-bao",
    "name": "全麦欧包",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "全麦欧包，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "ti-la-mi-su",
    "name": "提拉米苏",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "提拉米苏，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "zhi-shi-gao",
    "name": "芝士蛋糕",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "芝士蛋糕，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "西式"
    ]
  },
  {
    "id": "dou-hua",
    "name": "甜豆花",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "甜豆花，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "家常"
    ]
  },
  {
    "id": "tang-yuan",
    "name": "芝麻汤圆",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "芝麻汤圆，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  {
    "id": "hong-dou-sha",
    "name": "红豆沙",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "红豆沙，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "yang-zhi-gan",
    "name": "杨枝甘露",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "杨枝甘露，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "粤式"
    ]
  },
  {
    "id": "bing-fen",
    "name": "冰粉",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "冰粉，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "川渝"
    ]
  },
  {
    "id": "gui-hua-gao",
    "name": "桂花糕",
    "emoji": "🥐",
    "price": [
      8,
      30
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "scenes": [
      "外卖",
      "出去吃"
    ],
    "desc": "桂花糕，温和口味；价格与配料请以门店为准。",
    "cuisines": [
      "江浙"
    ]
  },
  /* ================= 纽约 · Parsons School of Design 步行 20 分钟内 ================= */
  /*
   * 数据说明（务必如实告知用户，不要夸大）：
   *  - 以下 100 家为 Parsons School of Design（66 Fifth Ave, New York, NY 10013）
   *    步行约 20 分钟（约 1.5 公里）范围内的真实门店，覆盖 Greenwich Village /
   *    West Village / East Village 西侧 / NoHo / SoHo / Union Square / Flatiron /
   *    Chelsea(14–23 St) / Gramercy / Meatpacking / NoLita。
   *  - 人均价格由美元原价按 1 USD ≈ 7.2 CNY 换算为人民币区间；纽约店人均普遍
   *    高于国内，因此在「20元以内 / 20–40元」档位下会被筛掉，这是预期行为。
   *  - 英文店名、地址、招牌菜与人均价位来自公开检索结果，为**录入时的快照**，
   *    不保证实时有效：门店可能搬迁、停业或调价。desc 中已内嵌完整地址与步行
   *    时间，并统一以「价格与配料以门店为准。」结尾。
   *  - 菜系受 CUISINES 枚举限制：中东 / 拉美 / 南亚 / 非洲等菜系暂无对应项，
   *    暂归入「西式」或「家常」，筛选维度因此不如国内条目精细。
   */
  {
    "id": "2bros-pizza-st-marks",
    "name": "2 Bros Pizza",
    "emoji": "🍕",
    "price": [
      14,
      36
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "32 St Marks Pl, New York, NY 10003",
    "desc": "纽约仅存的真正平价披萨连锁，芝士单片约 $1.5–2、人均约 $2–5（约 ¥14–36），地址 32 St Marks Pl, New York, NY 10003，从 Parsons 步行约 17 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 1
  },
  {
    "id": "doughnut-project-morton",
    "name": "The Doughnut Project",
    "emoji": "🍩",
    "price": [
      29,
      43
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "10 Morton St, New York, NY 10014",
    "desc": "西村手工甜甜圈小店，招牌枫糖培根与各式创意口味，人均约 $4–6（约 ¥29–43），地址 10 Morton St, New York, NY 10014，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 2
  },
  {
    "id": "bleecker-street-pizza-7th-ave",
    "name": "Bleecker Street Pizza",
    "emoji": "🍕",
    "price": [
      29,
      50
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "69 7th Ave S, New York, NY 10014",
    "desc": "西村街角薄底披萨店，招牌 Nonna Maria 芝士片，人均约 $4–7（约 ¥29–50），地址 69 7th Ave S, New York, NY 10014，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 4
  },
  {
    "id": "caffe-reggio-macdougal",
    "name": "Caffe Reggio",
    "emoji": "☕",
    "price": [
      29,
      50
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "119 MacDougal St, New York, NY 10012",
    "desc": "1927 年开业的格林威治村老咖啡馆，卡布奇诺约 $5、人均约 $4–7（约 ¥29–50），地址 119 MacDougal St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 7
  },
  {
    "id": "joes-pizza-carmine",
    "name": "Joe's Pizza",
    "emoji": "🍕",
    "price": [
      29,
      50
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "7 Carmine St, New York, NY 10014",
    "desc": "1975 年开业的纽约单片披萨标杆，芝士片约 $3.25–3.5、人均约 $4–7（约 ¥29–50），地址 7 Carmine St, New York, NY 10014，从 Parsons 步行约 10 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 3
  },
  {
    "id": "ottos-tacos-2nd-ave",
    "name": "Otto's Tacos",
    "emoji": "🌮",
    "price": [
      29,
      50
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "141 2nd Ave, New York, NY 10003",
    "desc": "东村墨西哥小馆，单个塔可约 $4–5、人均约 $4–7（约 ¥29–50），地址 141 2nd Ave, New York, NY 10003，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜",
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 5
  },
  {
    "id": "taqueria-diana-2nd-ave",
    "name": "Taqueria Diana",
    "emoji": "🌮",
    "price": [
      29,
      50
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "129 2nd Ave, New York, NY 10003",
    "desc": "东村人气塔可店，单个塔可约 $4–5、人均约 $4–7（约 ¥29–50），地址 129 2nd Ave, New York, NY 10003，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜",
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 6
  },
  {
    "id": "murrays-bagels-6th-ave",
    "name": "Murray's Bagels",
    "emoji": "🥯",
    "price": [
      29,
      58
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "500 6th Ave, New York, NY 10011",
    "desc": "格林威治村经典纽约贝果店，抹酱贝果约 $4–5、人均约 $4–8（约 ¥29–58），地址 500 6th Ave, New York, NY 10011，从 Parsons 步行约 5 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 8
  },
  {
    "id": "rays-candy-store-ave-a",
    "name": "Ray's Candy Store",
    "emoji": "🍟",
    "price": [
      29,
      65
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "113 Avenue A, New York, NY 10009",
    "desc": "东村开了几十年的小食老店，比利时薯条、奶昔与冰淇淋，人均约 $4–9（约 ¥29–65），地址在 113 Avenue A, New York, NY 10009，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 2
  },
  {
    "id": "zaragoza-mexican-deli-ave-a",
    "name": "Zaragoza Mexican Deli",
    "emoji": "🌮",
    "price": [
      29,
      65
    ],
    "category": "小吃点心",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "215 Avenue A, New York, NY 10009",
    "desc": "东村墨西哥小食店，玉米饼塔可与墨西哥卷饼，人均约 $4–9（约 ¥29–65），地址在 215 Avenue A, New York, NY 10009，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 1
  },
  {
    "id": "breads-bakery-16th-st",
    "name": "Breads Bakery",
    "emoji": "🥐",
    "price": [
      36,
      58
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "18 E 16th St, New York, NY 10003",
    "desc": "联合广场旁人气烘焙房，招牌巧克力 babka 与可颂，人均约 $5–8（约 ¥36–58），地址 18 E 16th St, New York, NY 10003，从 Parsons 步行约 6 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 11
  },
  {
    "id": "mamouns-falafel-macdougal",
    "name": "Mamoun's Falafel",
    "emoji": "🧆",
    "price": [
      36,
      58
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "119 MacDougal St, New York, NY 10012",
    "desc": "1971 年开业的格林威治村中东小吃鼻祖，炸豆丸子皮塔约 $5–7、人均约 $5–8（约 ¥36–58），地址 119 MacDougal St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 9
  },
  {
    "id": "tompkins-square-bagels-avenue-a",
    "name": "Tompkins Square Bagels",
    "emoji": "🥯",
    "price": [
      36,
      58
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "165 Avenue A, New York, NY 10009",
    "desc": "东村手工现烤贝果名店，抹酱贝果约 $5–6、人均约 $5–8（约 ¥36–58），地址 165 Avenue A, New York, NY 10009，从 Parsons 步行约 20 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 10
  },
  {
    "id": "pommes-frites-macdougal",
    "name": "Pommes Frites",
    "emoji": "🍟",
    "price": [
      36,
      65
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "128 MacDougal St, New York, NY 10012",
    "desc": "格林威治村比利时双炸薯条小店，配三十多种酱料，人均约 $5–9（约 ¥36–65），地址 128 MacDougal St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 12
  },
  {
    "id": "sunny-and-annies-deli-ave-b",
    "name": "Sunny & Annie's Deli",
    "emoji": "🥪",
    "price": [
      36,
      72
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "94 Avenue B, New York, NY 10009",
    "desc": "东村家庭经营的小熟食店，现做三明治与卷饼，人均约 $5–10（约 ¥36–72），地址在 94 Avenue B, New York, NY 10009，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 3
  },
  {
    "id": "mr-wu-dim-sum-university-pl",
    "name": "Mr Wu Dim Sum",
    "emoji": "🥟",
    "price": [
      36,
      86
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "粤式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "126 University Pl, New York, NY 10003",
    "desc": "联合广场旁粤式早茶点心，小笼汤包、虾饺与烧卖，人均约 $5–12（约 ¥36–86），地址在 126 University Pl, New York, NY 10003，从 Parsons 步行约 5 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 4
  },
  {
    "id": "joes-steam-rice-roll-st-marks",
    "name": "Joe's Steam Rice Roll",
    "emoji": "🥢",
    "price": [
      40,
      79
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "粤式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "36 St Marks Pl, New York, NY 10003",
    "desc": "广式现蒸肠粉专门店，布拉牛肉肠与虾肠，人均约 $5.5–11（约 ¥40–79），地址在 36 St Marks Pl, New York, NY 10003，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-5.js",
    "__index": 5
  },
  {
    "id": "caffe-panna-irving-place",
    "name": "Caffè Panna",
    "emoji": "🍦",
    "price": [
      43,
      58
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "77 Irving Pl, New York, NY 10003",
    "desc": "Gramercy 意式冰淇淋与咖啡店，每日更换口味，单份约 $6–7、人均约 $6–8（约 ¥43–58），地址 77 Irving Pl, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 14
  },
  {
    "id": "van-leeuwen-7th-st",
    "name": "Van Leeuwen Ice Cream",
    "emoji": "🍨",
    "price": [
      43,
      58
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "48 1/2 E 7th St, New York, NY 10003",
    "desc": "从东村冰淇淋车起家的手工冰淇淋店，单球约 $6–7、人均约 $6–8（约 ¥43–58），地址 48 1/2 E 7th St, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 13
  },
  {
    "id": "eileens-cheesecake-cleveland",
    "name": "Eileen's Special Cheesecake",
    "emoji": "🍰",
    "price": [
      43,
      65
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "17 Cleveland Pl, New York, NY 10012",
    "desc": "纽约老字号芝士蛋糕，可按块或整只购买，人均约 $6–9（约 ¥43–65），地址在 17 Cleveland Pl, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 5
  },
  {
    "id": "otafuku-9th-st",
    "name": "Otafuku",
    "emoji": "🍢",
    "price": [
      43,
      65
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "220 E 9th St, New York, NY 10003",
    "desc": "东村「小东京」日式街头小吃老店，章鱼小丸子与大阪烧约 $6–8、人均约 $6–9（约 ¥43–65），地址 220 E 9th St, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 15
  },
  {
    "id": "punjabi-grocery-deli-1st-st",
    "name": "Punjabi Grocery & Deli",
    "emoji": "🍛",
    "price": [
      43,
      65
    ],
    "category": "米饭",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "114 E 1st St, New York, NY 10009",
    "desc": "东村印度素食外卖窗口，咖喱配米饭或饼约 $6–8、人均约 $6–9（约 ¥43–65），地址 114 E 1st St, New York, NY 10009，从 Parsons 步行约 20 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 16
  },
  {
    "id": "streecha-7th-st",
    "name": "Streecha",
    "emoji": "🥟",
    "price": [
      43,
      65
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "33 E 7th St, New York, NY 10003",
    "desc": "东村乌克兰教堂地下室的手工饺子馆，波兰饺子与罗宋汤约 $6–8、人均约 $6–9（约 ¥43–65），地址 33 E 7th St, New York, NY 10003，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 17
  },
  {
    "id": "vanessas-dumpling-14th-st",
    "name": "Vanessa's Dumpling House",
    "emoji": "🥟",
    "price": [
      43,
      65
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "华北"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "220 E 14th St, New York, NY 10003",
    "desc": "北京风味平价水饺与芝麻饼老店，四只煎饺约 $2、人均约 $6–9（约 ¥43–65），地址 220 E 14th St, New York, NY 10003，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 18
  },
  {
    "id": "artichoke-basilles-14th-st",
    "name": "Artichoke Basille's Pizza",
    "emoji": "🍕",
    "price": [
      43,
      72
    ],
    "category": "快餐简餐",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "321 E 14th St, New York, NY 10003",
    "desc": "东村起家的招牌洋蓟芝士方块披萨，单片约 $5–6、人均约 $6–10（约 ¥43–72），地址 321 E 14th St, New York, NY 10003，从 Parsons 步行约 17 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 20
  },
  {
    "id": "los-tacos-no1-9th-ave",
    "name": "Los Tacos No. 1",
    "emoji": "🌮",
    "price": [
      43,
      72
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "75 9th Ave, New York, NY 10011",
    "desc": "切尔西市场内蒂华纳风格塔可名店，单个塔可约 $5、人均约 $6–10（约 ¥43–72），地址 75 9th Ave, New York, NY 10011，从 Parsons 步行约 18 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜",
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 19
  },
  {
    "id": "dumpling-man-st-marks",
    "name": "Dumpling Man",
    "emoji": "🥟",
    "price": [
      50,
      65
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "华北"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "100 St Marks Pl, New York, NY 10009",
    "desc": "圣马可广场的手工现包饺子店，可选猪肉、鸡肉、虾或素馅，人均约 $7–9（约 ¥50–65），地址 100 St Marks Pl, New York, NY 10009，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类",
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 21
  },
  {
    "id": "prince-street-pizza-prince-st",
    "name": "Prince Street Pizza",
    "emoji": "🍕",
    "price": [
      50,
      72
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "27 Prince St, New York, NY 10012",
    "desc": "NoLita 传奇辣味意式香肠方块披萨，单片约 $5–6、人均约 $7–10（约 ¥50–72），地址 27 Prince St, New York, NY 10012，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 23
  },
  {
    "id": "rice-to-riches-spring-st",
    "name": "Rice to Riches",
    "emoji": "🍮",
    "price": [
      50,
      72
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "37 Spring St, New York, NY 10012",
    "desc": "NoLita 专做各式口味米布丁的甜品店，小份约 $7–8、人均约 $7–10（约 ¥50–72），地址 37 Spring St, New York, NY 10012，从 Parsons 步行约 16 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-1.js",
    "__index": 22
  },
  {
    "id": "kati-roll-company-macdougal",
    "name": "The Kati Roll Company",
    "emoji": "🌯",
    "price": [
      50,
      79
    ],
    "category": "包饺饼类",
    "taste": "微辣",
    "cuisines": [
      "家常"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "99 MacDougal St, New York, NY 10012",
    "desc": "印度卡提卷饼小店，鸡肉与羊肉卷配芒果拉西，人均约 $7–11（约 ¥50–79），地址在 99 MacDougal St, New York, NY 10012，从 Parsons 步行约 9 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 6
  },
  {
    "id": "bh-dairy-2nd-ave",
    "name": "B&H Dairy",
    "emoji": "🍲",
    "price": [
      50,
      86
    ],
    "category": "粥汤",
    "taste": "清淡",
    "cuisines": [
      "家常"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "127 2nd Ave, New York, NY 10003",
    "desc": "1938 年开业的犹太奶品素食老店，罗宋汤、土豆饺与薄饼，人均约 $7–12（约 ¥50–86），地址在 127 2nd Ave, New York, NY 10003，从 Parsons 步行约 7 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 7
  },
  {
    "id": "blue-ribbon-fried-chicken-1st-st",
    "name": "Blue Ribbon Fried Chicken",
    "emoji": "🍗",
    "price": [
      58,
      72
    ],
    "category": "快餐简餐",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "28 E 1st St, New York, NY 10003",
    "desc": "东村炸鸡专门店，炸鸡三明治与炸鸡块人均约 $8–10（约 ¥58–72），地址 28 E 1st St, New York, NY 10003，从 Parsons 步行约 17 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 25
  },
  {
    "id": "saigon-shack-macdougal",
    "name": "Saigon Shack",
    "emoji": "🥖",
    "price": [
      58,
      72
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "114 MacDougal St, New York, NY 10012",
    "desc": "格林威治村平价越南菜，越式法棍三明治约 $9–10、人均约 $8–10（约 ¥58–72），地址 114 MacDougal St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜",
      "鱼虾贝类"
    ],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-1.js",
    "__index": 24
  },
  {
    "id": "xian-famous-foods-st-marks",
    "name": "Xi'an Famous Foods",
    "emoji": "🍜",
    "price": [
      58,
      108
    ],
    "category": "粉面",
    "taste": "辣",
    "cuisines": [
      "西北"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "81 St Marks Pl, New York, NY 10003",
    "desc": "西安手撕面与孜然羊肉夹馍，招牌油泼辣子，人均约 $8–15（约 ¥58–108），地址在 81 St Marks Pl, New York, NY 10003，从 Parsons 步行约 16 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 8
  },
  {
    "id": "spot-dessert-bar-st-marks",
    "name": "Spot Dessert Bar",
    "emoji": "🍰",
    "price": [
      72,
      108
    ],
    "category": "甜品烘焙",
    "taste": "清淡",
    "cuisines": [
      "日韩",
      "西式"
    ],
    "meals": [
      "下午茶",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "13 St Marks Pl, New York, NY 10003",
    "desc": "以抹茶熔岩蛋糕出名的亚洲风甜品吧，人均约 $10–15（约 ¥72–108），地址在 13 St Marks Pl, New York, NY 10003 地下一层，从 Parsons 步行约 10 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-2.js",
    "__index": 2
  },
  {
    "id": "kong-sihk-tong-bayard",
    "name": "Kong Sihk Tong",
    "emoji": "🍛",
    "price": [
      72,
      115
    ],
    "category": "米饭",
    "taste": "清淡",
    "cuisines": [
      "粤式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "下午茶",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "65 Bayard St, New York, NY 10013",
    "desc": "港式茶餐厅，厚多士、焗猪扒饭与奶茶，人均约 $10–16（约 ¥72–115），地址在 65 Bayard St, New York, NY 10013，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-4.js",
    "__index": 9
  },
  {
    "id": "taim-spring-st",
    "name": "Taïm Mediterranean Kitchen",
    "emoji": "🥙",
    "price": [
      79,
      115
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "45 Spring St, New York, NY 10012",
    "desc": "以色列风味法拉费与鹰嘴豆泥，可选辣酱哈瓦吉，人均约 $11–16（约 ¥79–115），地址在 45 Spring St, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-2.js",
    "__index": 4
  },
  {
    "id": "zooba-kenmare",
    "name": "Zooba",
    "emoji": "🥙",
    "price": [
      86,
      130
    ],
    "category": "快餐简餐",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "100 Kenmare St, New York, NY 10012",
    "desc": "埃及街头小吃店，招牌库莎丽与哈瓦什口袋饼，人均约 $12–18（约 ¥86–130），地址在 100 Kenmare St, New York, NY 10012，从 Parsons 步行约 17 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-2.js",
    "__index": 7
  },
  {
    "id": "nom-wah-tea-parlor-doyers",
    "name": "Nom Wah Tea Parlor",
    "emoji": "🥟",
    "price": [
      86,
      144
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "粤式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "13 Doyers St, New York, NY 10013",
    "desc": "1920 年开业的老牌粤式点心早茶，虾饺烧卖蛋挞，人均约 $12–20（约 ¥86–144），地址在 13 Doyers St, New York, NY 10013，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [
      "内脏"
    ],
    "__file": "batch-4.js",
    "__index": 10
  },
  {
    "id": "the-bao-st-marks",
    "name": "The Bao",
    "emoji": "🥟",
    "price": [
      86,
      144
    ],
    "category": "包饺饼类",
    "taste": "微辣",
    "cuisines": [
      "江浙"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "13 St Marks Pl, New York, NY 10003",
    "desc": "圣马可广场上海小笼汤包与生煎专门店，人均约 $12–20（约 ¥86–144），地址在 13 St Marks Pl, New York, NY 10003，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-5.js",
    "__index": 8
  },
  {
    "id": "sanshi-rice-noodle-2nd-ave",
    "name": "Sanshi Rice Noodle",
    "emoji": "🍜",
    "price": [
      94,
      130
    ],
    "category": "粉面",
    "taste": "微辣",
    "cuisines": [
      "云贵"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "118 2nd Ave, New York, NY 10003",
    "desc": "云南过桥米线专门店，花胶鸡汤米线汤浓料足，人均约 $13–18（约 ¥94–130），地址在 118 2nd Ave, New York, NY 10003，从 Parsons 步行约 7 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 9
  },
  {
    "id": "minca-ramen-east-5th",
    "name": "Minca",
    "emoji": "🍜",
    "price": [
      94,
      137
    ],
    "category": "粉面",
    "taste": "重口",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "536 E 5th St, New York, NY 10009",
    "desc": "东村豚骨拉面老店，汤头浓郁可选辣度，人均约 $13–19（约 ¥94–137），地址在 536 E 5th St, New York, NY 10009，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 8
  },
  {
    "id": "taqueria-st-marks-place",
    "name": "Taqueria St. Marks Place",
    "emoji": "🌮",
    "price": [
      94,
      144
    ],
    "category": "小吃点心",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "79 St Marks Pl, New York, NY 10003",
    "desc": "东村人气墨西哥塔可小店，配洋葱与香菜，人均约 $13–20（约 ¥94–144），地址在 79 St Marks Pl, New York, NY 10003，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-2.js",
    "__index": 9
  },
  {
    "id": "ho-foods-7th-st",
    "name": "Ho Foods",
    "emoji": "🍜",
    "price": [
      101,
      144
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "家常"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "110 E 7th St, New York, NY 10009",
    "desc": "台湾红烧牛肉面与咸豆浆早餐，人均约 $14–20（约 ¥101–144），地址在 110 E 7th St, New York, NY 10009，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 11
  },
  {
    "id": "meskerem-ethiopian-macdougal",
    "name": "Meskerem Ethiopian Cuisine",
    "emoji": "🍛",
    "price": [
      101,
      158
    ],
    "category": "家常菜",
    "taste": "微辣",
    "cuisines": [
      "家常"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "124 MacDougal St, New York, NY 10012",
    "desc": "西村老牌埃塞俄比亚餐厅，英吉拉薄饼配各式炖菜，人均约 $14–22（约 ¥101–158），地址在 124 MacDougal St, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 10
  },
  {
    "id": "yakitori-taisho-st-marks",
    "name": "Yakitori Taisho",
    "emoji": "🍢",
    "price": [
      101,
      158
    ],
    "category": "烧烤",
    "taste": "重口",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "5 St Marks Pl, New York, NY 10003",
    "desc": "炭烤串烧居酒屋，串烧单点或 10 串套餐，人均约 $14–22（约 ¥101–158），地址在 5 St Marks Pl, New York, NY 10003，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类",
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 10
  },
  {
    "id": "okiboru-udon-2nd-ave",
    "name": "Okiboru House of Udon",
    "emoji": "🍜",
    "price": [
      108,
      158
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "124 2nd Ave, New York, NY 10003",
    "desc": "手打乌冬与蘸面，昆布鲣鱼汤底配天妇罗，人均约 $15–22（约 ¥108–158），地址在 124 2nd Ave, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 12
  },
  {
    "id": "panna-ii-garden-1st-ave",
    "name": "Panna II Garden",
    "emoji": "🍛",
    "price": [
      108,
      158
    ],
    "category": "米饭",
    "taste": "微辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "93 1st Ave, New York, NY 10003",
    "desc": "挂满彩灯的印度咖喱小馆，套餐含前菜与主菜，人均约 $15–22（约 ¥108–158），地址在 93 1st Ave, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 11
  },
  {
    "id": "kenka-st-marks",
    "name": "Kenka",
    "emoji": "🍢",
    "price": [
      108,
      173
    ],
    "category": "烧烤",
    "taste": "重口",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "25 St Marks Pl, New York, NY 10003",
    "desc": "东村平价日式居酒屋，串烧与拉面为主，人均约 $15–24（约 ¥108–173），地址在 25 St Marks Pl, New York, NY 10003，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类",
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 12
  },
  {
    "id": "awash-ethiopian-6th-st",
    "name": "Awash Ethiopian Restaurant",
    "emoji": "🍲",
    "price": [
      108,
      180
    ],
    "category": "家常菜",
    "taste": "微辣",
    "cuisines": [
      "家常"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "338 E 6th St, New York, NY 10003",
    "desc": "埃塞俄比亚炖菜配英吉拉薄饼，含丰富素食套餐，人均约 $15–25（约 ¥108–180），地址在 338 E 6th St, New York, NY 10003，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 13
  },
  {
    "id": "sobaya-e-9th-st",
    "name": "Sobaya",
    "emoji": "🍜",
    "price": [
      108,
      180
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "229 E 9th St, New York, NY 10003",
    "desc": "东村手打荞麦面老店，天妇罗荞麦冷面与热汤面，人均约 $15–25（约 ¥108–180），地址在 229 E 9th St, New York, NY 10003，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 11
  },
  {
    "id": "somtum-der-ave-a",
    "name": "Somtum Der",
    "emoji": "🥗",
    "price": [
      108,
      180
    ],
    "category": "家常菜",
    "taste": "辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "85 Avenue A, New York, NY 10009",
    "desc": "米其林推荐的泰北伊桑菜，青木瓜沙拉与烤鸡，人均约 $15–25（约 ¥108–180），地址在 85 Avenue A, New York, NY 10009，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜",
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 12
  },
  {
    "id": "corner-bistro-west-4th",
    "name": "Corner Bistro",
    "emoji": "🍔",
    "price": [
      115,
      173
    ],
    "category": "西式主菜",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "331 W 4th St, New York, NY 10014",
    "desc": "西村老牌汉堡酒吧，招牌 Bistro Burger 配培根与芝士，人均约 $16–24（约 ¥115–173），地址在 331 W 4th St, New York, NY 10014，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 13
  },
  {
    "id": "cafe-mogador-st-marks",
    "name": "Cafe Mogador",
    "emoji": "🍳",
    "price": [
      130,
      187
    ],
    "category": "西式主菜",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "101 St Marks Pl, New York, NY 10009",
    "desc": "摩洛哥与地中海风味全天早午餐，招牌柠檬橄榄鸡塔吉锅，人均约 $18–26（约 ¥130–187），地址在 101 St Marks Pl, New York, NY 10009，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-2.js",
    "__index": 16
  },
  {
    "id": "don-ceviche-1st-ave",
    "name": "Don Ceviche",
    "emoji": "🐟",
    "price": [
      130,
      187
    ],
    "category": "小吃点心",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "57 1st Ave, New York, NY 10003",
    "desc": "秘鲁柠汁腌鱼生与海鲜小盘，酸辣开胃，人均约 $18–26（约 ¥130–187），地址在 57 1st Ave, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类",
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 14
  },
  {
    "id": "ippudo-ny-4th-ave",
    "name": "Ippudo NY",
    "emoji": "🍜",
    "price": [
      130,
      187
    ],
    "category": "粉面",
    "taste": "重口",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "65 4th Ave, New York, NY 10003",
    "desc": "博多豚骨拉面名店，招牌白丸与赤丸，人均约 $18–26（约 ¥130–187），地址在 65 4th Ave, New York, NY 10003，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 15
  },
  {
    "id": "barn-joo-union-square",
    "name": "Barn Joo Union Square",
    "emoji": "🍚",
    "price": [
      130,
      194
    ],
    "category": "米饭",
    "taste": "辣",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "35 Union Square West, New York, NY 10003",
    "desc": "联合广场韩式小馆，招牌石锅拌饭与烤肉，人均约 $18–27（约 ¥130–194），地址在 35 Union Square West, New York, NY 10003，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 20
  },
  {
    "id": "chow-house-bleecker",
    "name": "Chow House",
    "emoji": "🥘",
    "price": [
      130,
      194
    ],
    "category": "家常菜",
    "taste": "辣",
    "cuisines": [
      "川渝"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "181 Bleecker St, New York, NY 10012",
    "desc": "格林威治村川菜小馆，麻辣牛肉与水煮鱼出名，人均约 $18–27（约 ¥130–194），地址在 181 Bleecker St, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类",
      "香菜"
    ],
    "__file": "batch-2.js",
    "__index": 19
  },
  {
    "id": "nan-xiang-soup-dumplings-st-marks",
    "name": "Nan Xiang Soup Dumplings",
    "emoji": "🥟",
    "price": [
      130,
      194
    ],
    "category": "包饺饼类",
    "taste": "清淡",
    "cuisines": [
      "江浙"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "15 St Marks Pl, New York, NY 10003",
    "desc": "上海小笼包与生煎馒头，蟹粉口味另有供应，人均约 $18–27（约 ¥130–194），地址在 15 St Marks Pl, New York, NY 10003，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类",
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 18
  },
  {
    "id": "nyonya-grand-st",
    "name": "Nyonya",
    "emoji": "🍜",
    "price": [
      130,
      194
    ],
    "category": "粉面",
    "taste": "微辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "199 Grand St, New York, NY 10013",
    "desc": "马来西亚娘惹菜老店，咖喱面与海南鸡饭出名，人均约 $18–27（约 ¥130–194），地址在 199 Grand St, New York, NY 10013，从 Parsons 步行约 18 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 17
  },
  {
    "id": "trattoria-spaghetto-bleecker",
    "name": "Trattoria Spaghetto",
    "emoji": "🍝",
    "price": [
      130,
      194
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "232 Bleecker St, New York, NY 10014",
    "desc": "西村家庭式意大利餐馆，意面与窑烤披萨为主，人均约 $18–27（约 ¥130–194），地址在 232 Bleecker St, New York, NY 10014，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 21
  },
  {
    "id": "886-taiwanese-st-marks",
    "name": "886",
    "emoji": "🍗",
    "price": [
      130,
      202
    ],
    "category": "家常菜",
    "taste": "微辣",
    "cuisines": [
      "江浙"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "26 St Marks Pl, New York, NY 10003",
    "desc": "东村现代台菜小馆，招牌盐酥鸡与卤肉饭，人均约 $18–28（约 ¥130–202），地址在 26 St Marks Pl, New York, NY 10003，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 13
  },
  {
    "id": "jacks-wife-freda-lafayette",
    "name": "Jack's Wife Freda",
    "emoji": "🍳",
    "price": [
      144,
      202
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "下午茶"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "226 Lafayette St, New York, NY 10012",
    "desc": "SoHo 人气全天早午餐，招牌绿番茄沙克舒卡与芝士通心粉，人均约 $20–28（约 ¥144–202），地址在 226 Lafayette St, New York, NY 10012，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-2.js",
    "__index": 23
  },
  {
    "id": "mala-project-1st-ave",
    "name": "MáLà Project",
    "emoji": "🥘",
    "price": [
      144,
      202
    ],
    "category": "火锅锅物",
    "taste": "辣",
    "cuisines": [
      "川渝"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "122 1st Ave, New York, NY 10009",
    "desc": "自选食材的川式麻辣干锅，可自定辣度，人均约 $20–28（约 ¥144–202），地址在 122 1st Ave, New York, NY 10009，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "内脏",
      "鱼虾贝类",
      "香菜"
    ],
    "__file": "batch-2.js",
    "__index": 22
  },
  {
    "id": "mayree-east-1st",
    "name": "MayRee",
    "emoji": "🍛",
    "price": [
      144,
      209
    ],
    "category": "米饭",
    "taste": "辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "58 E 1st St, New York, NY 10003",
    "desc": "泰南风味小馆，招牌打抛猪肉与咖喱蟹，人均约 $20–29（约 ¥144–209），地址在 58 E 1st St, New York, NY 10003，从 Parsons 步行约 18 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 25
  },
  {
    "id": "pylos-east-7th",
    "name": "Pylos",
    "emoji": "🥗",
    "price": [
      144,
      209
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "128 E 7th St, New York, NY 10009",
    "desc": "东村希腊家常菜，陶罐炖菜与烤肉串为招牌，人均约 $20–29（约 ¥144–209），地址在 128 E 7th St, New York, NY 10009，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-2.js",
    "__index": 24
  },
  {
    "id": "yuca-bar-avenue-a",
    "name": "Yuca Bar",
    "emoji": "🍛",
    "price": [
      144,
      216
    ],
    "category": "西式主菜",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "111 Avenue A, New York, NY 10009",
    "desc": "拉美小盘与哥伦比亚风味主菜，晚间营业到很晚，人均约 $20–30（约 ¥144–216），地址在 111 Avenue A, New York, NY 10009，从 Parsons 步行约 20 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜",
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 16
  },
  {
    "id": "soothr-13th-st",
    "name": "Soothr",
    "emoji": "🍜",
    "price": [
      144,
      230
    ],
    "category": "粉面",
    "taste": "微辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "204 E 13th St, New York, NY 10003",
    "desc": "泰式船面与冬阴功汤面，酸辣鲜香，人均约 $20–32（约 ¥144–230），地址在 204 E 13th St, New York, NY 10003，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类",
      "香菜",
      "辣"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 17
  },
  {
    "id": "maharlika-filipino-1st-ave",
    "name": "Maharlika Filipino Moderno",
    "emoji": "🍚",
    "price": [
      180,
      252
    ],
    "category": "米饭",
    "taste": "重口",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "111 1st Ave, New York, NY 10003",
    "desc": "菲律宾家常菜，招牌铁板碎猪肉与蒜香米饭，人均约 $25–35（约 ¥180–252），地址在 111 1st Ave, New York, NY 10003，从 Parsons 步行约 16 分钟。价格与配料以门店为准。",
    "exclusions": [
      "内脏"
    ],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-4.js",
    "__index": 18
  },
  {
    "id": "nar-turkish-20th-st",
    "name": "NAR Modern Turkish Cuisine",
    "emoji": "🍖",
    "price": [
      180,
      252
    ],
    "category": "烧烤",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "34 E 20th St, New York, NY 10003",
    "desc": "土耳其烤肉串与地中海小菜拼盘，人均约 $25–35（约 ¥180–252），地址在 34 E 20th St, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-4.js",
    "__index": 19
  },
  {
    "id": "taverna-kyclades-1st-ave",
    "name": "Taverna Kyclades",
    "emoji": "🐙",
    "price": [
      202,
      324
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "228 1st Ave, New York, NY 10009",
    "desc": "东村家庭式希腊海鲜馆，烤章鱼、羊排与希腊沙拉，人均约 $28–45（约 ¥202–324），地址在 228 1st Ave, New York, NY 10009，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 14
  },
  {
    "id": "hanoi-house-st-marks",
    "name": "Hanoi House",
    "emoji": "🍜",
    "price": [
      216,
      288
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "119 St Marks Pl, New York, NY 10009",
    "desc": "越式河粉小馆，招牌牛骨髓河粉，人均约 $30–40（约 ¥216–288），地址在 119 St Marks Pl, New York, NY 10009，从 Parsons 步行约 19 分钟。价格与配料以门店为准。",
    "exclusions": [
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 1
  },
  {
    "id": "fish-cheeks-bond-st",
    "name": "Fish Cheeks",
    "emoji": "🦐",
    "price": [
      216,
      324
    ],
    "category": "家常菜",
    "taste": "辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "55 Bond St, New York, NY 10012",
    "desc": "泰式海鲜家常菜，招牌咖喱蟹与烤鱼，酸辣浓郁，人均约 $30–45（约 ¥216–324），地址在 55 Bond St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "鱼虾贝类",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 21
  },
  {
    "id": "thai-villa-e-19th",
    "name": "Thai Villa",
    "emoji": "🍛",
    "price": [
      216,
      324
    ],
    "category": "粉面",
    "taste": "微辣",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "5 E 19th St, New York, NY 10003",
    "desc": "泰式料理，招牌冬阴功与泰式炒河粉，人均约 $30–45（约 ¥216–324），地址在 5 E 19th St, New York, NY 10003，从 Parsons 步行约 7 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-3.js",
    "__index": 2
  },
  {
    "id": "cheli-st-marks",
    "name": "CheLi",
    "emoji": "🦀",
    "price": [
      216,
      360
    ],
    "category": "家常菜",
    "taste": "清淡",
    "cuisines": [
      "江浙"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "19 St Marks Pl, New York, NY 10003",
    "desc": "圣马可广场精致上海菜，蟹粉小笼与红烧肉，人均约 $30–50（约 ¥216–360），地址在 19 St Marks Pl, New York, NY 10003，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-5.js",
    "__index": 15
  },
  {
    "id": "hunan-slurp-1st-ave",
    "name": "Hunan Slurp",
    "emoji": "🌶️",
    "price": [
      216,
      360
    ],
    "category": "粉面",
    "taste": "辣",
    "cuisines": [
      "湘式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "112 1st Ave, New York, NY 10009",
    "desc": "东村新派湘菜，衡阳小炒肉与手工米粉，人均约 $30–50（约 ¥216–360），地址在 112 1st Ave, New York, NY 10009，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "内脏"
    ],
    "uncertainExclusions": [],
    "__file": "batch-5.js",
    "__index": 16
  },
  {
    "id": "madame-vo-10th-st",
    "name": "Madame Vo",
    "emoji": "🍜",
    "price": [
      216,
      360
    ],
    "category": "粉面",
    "taste": "清淡",
    "cuisines": [
      "东南亚"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "212 E 10th St, New York, NY 10003",
    "desc": "24 小时熬制牛骨汤底的越南河粉与蒜香牛肋，人均约 $30–50（约 ¥216–360），地址在 212 E 10th St, New York, NY 10003，从 Parsons 步行约 18 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 22
  },
  {
    "id": "szechuan-mountain-house-st-marks",
    "name": "Szechuan Mountain House",
    "emoji": "🌶️",
    "price": [
      252,
      324
    ],
    "category": "家常菜",
    "taste": "辣",
    "cuisines": [
      "川渝"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "23 St Marks Pl, New York, NY 10003",
    "desc": "川菜馆，招牌水煮鱼与麻辣香锅，人均约 $35–45（约 ¥252–324），地址在 23 St Marks Pl, New York, NY 10003，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "内脏"
    ],
    "__file": "batch-3.js",
    "__index": 3
  },
  {
    "id": "buvette-grove",
    "name": "Buvette",
    "emoji": "🥐",
    "price": [
      252,
      360
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "42 Grove St, New York, NY 10014",
    "desc": "法式小酒馆，招牌烤鸡与法式吐司，人均约 $35–50（约 ¥252–360），地址在 42 Grove St, New York, NY 10014，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 4
  },
  {
    "id": "da-andrea-w-13th",
    "name": "Da Andrea",
    "emoji": "🍝",
    "price": [
      252,
      360
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "35 W 13th St, New York, NY 10011",
    "desc": "北意餐厅，招牌手工意面与炖小牛膝，人均约 $35–50（约 ¥252–360），地址在 35 W 13th St, New York, NY 10011，从 Parsons 步行约 4 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 5
  },
  {
    "id": "boqueria-w-19th",
    "name": "Boqueria",
    "emoji": "🥘",
    "price": [
      288,
      360
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "53 W 19th St, New York, NY 10011",
    "desc": "西班牙小吃吧，招牌海鲜饭与蒜香虾，人均约 $40–50（约 ¥288–360），地址在 53 W 19th St, New York, NY 10011，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-3.js",
    "__index": 6
  },
  {
    "id": "empellon-taqueria-w-4th",
    "name": "Empellón Taqueria",
    "emoji": "🌮",
    "price": [
      288,
      396
    ],
    "category": "西式主菜",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "230 W 4th St, New York, NY 10014",
    "desc": "墨西哥小馆，招牌塔可与牛油果酱，人均约 $40–55（约 ¥288–396），地址在 230 W 4th St, New York, NY 10014，从 Parsons 步行约 17 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-3.js",
    "__index": 8
  },
  {
    "id": "la-esquina-kenmare",
    "name": "La Esquina",
    "emoji": "🥑",
    "price": [
      288,
      396
    ],
    "category": "西式主菜",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "114 Kenmare St, New York, NY 10012",
    "desc": "墨西哥餐厅，招牌慢炖猪肉塔可，人均约 $40–55（约 ¥288–396），地址在 114 Kenmare St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-3.js",
    "__index": 9
  },
  {
    "id": "olio-e-piu-greenwich",
    "name": "Olio e Più",
    "emoji": "🍕",
    "price": [
      288,
      396
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "3 Greenwich Ave, New York, NY 10014",
    "desc": "意式餐厅，招牌松露意面与罗马式披萨，人均约 $40–55（约 ¥288–396），地址在 3 Greenwich Ave, New York, NY 10014，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 10
  },
  {
    "id": "cookshop-10th-ave",
    "name": "Cookshop",
    "emoji": "🍳",
    "price": [
      324,
      432
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "156 10th Ave, New York, NY 10011",
    "desc": "美式时令餐厅，招牌烤鸡与周末早午餐，人均约 $45–60（约 ¥324–432），地址在 156 10th Ave, New York, NY 10011，从 Parsons 步行约 18 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 11
  },
  {
    "id": "shuka-macdougal",
    "name": "Shuka",
    "emoji": "🥙",
    "price": [
      324,
      432
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "38 MacDougal St, New York, NY 10012",
    "desc": "东地中海餐厅，招牌鹰嘴豆泥与烤羊肉，人均约 $45–60（约 ¥324–432），地址在 38 MacDougal St, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-3.js",
    "__index": 12
  },
  {
    "id": "via-carota-grove",
    "name": "Via Carota",
    "emoji": "🥬",
    "price": [
      324,
      432
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "51 Grove St, New York, NY 10014",
    "desc": "意式小馆，招牌蔬菜拼盘与手工意面，人均约 $45–60（约 ¥324–432），地址在 51 Grove St, New York, NY 10014，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 13
  },
  {
    "id": "eds-lobster-bar-lafayette",
    "name": "Ed's Lobster Bar",
    "emoji": "🦞",
    "price": [
      324,
      468
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "222 Lafayette St, New York, NY 10012",
    "desc": "海鲜小馆，招牌龙虾卷与生蚝，人均约 $45–65（约 ¥324–468），地址在 222 Lafayette St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 14
  },
  {
    "id": "i-sodi-christopher",
    "name": "I Sodi",
    "emoji": "🍝",
    "price": [
      360,
      468
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "105 Christopher St, New York, NY 10014",
    "desc": "托斯卡纳风味意餐，招牌柠檬宽面与千层面，人均约 $50–65（约 ¥360–468），地址在 105 Christopher St, New York, NY 10014，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 15
  },
  {
    "id": "blue-ribbon-sushi-sullivan",
    "name": "Blue Ribbon Sushi",
    "emoji": "🍣",
    "price": [
      360,
      504
    ],
    "category": "米饭",
    "taste": "清淡",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "119 Sullivan St, New York, NY 10012",
    "desc": "日式寿司吧，招牌刺身拼盘与手卷，人均约 $50–70（约 ¥360–504），地址在 119 Sullivan St, New York, NY 10012，从 Parsons 步行约 13 分钟。价格与配料以门店为准。",
    "exclusions": [
      "鱼虾贝类"
    ],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 16
  },
  {
    "id": "raouls-prince",
    "name": "Raoul's",
    "emoji": "🥩",
    "price": [
      360,
      504
    ],
    "category": "西式主菜",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "180 Prince St, New York, NY 10012",
    "desc": "法式小馆，招牌牛排薯条与鸭肝，人均约 $50–70（约 ¥360–504），地址在 180 Prince St, New York, NY 10012，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-3.js",
    "__index": 17
  },
  {
    "id": "redfarm-hudson",
    "name": "RedFarm",
    "emoji": "🥟",
    "price": [
      360,
      504
    ],
    "category": "小吃点心",
    "taste": "清淡",
    "cuisines": [
      "家常",
      "粤式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "529 Hudson St, New York, NY 10014",
    "desc": "新派中餐，招牌灌汤小笼包与烤鸭，人均约 $50–70（约 ¥360–504），地址在 529 Hudson St, New York, NY 10014，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "香菜"
    ],
    "__file": "batch-3.js",
    "__index": 18
  },
  {
    "id": "vinyl-steakhouse-w-19th",
    "name": "Vinyl Steakhouse",
    "emoji": "🍖",
    "price": [
      360,
      504
    ],
    "category": "西式主菜",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "35 W 19th St, New York, NY 10011",
    "desc": "美式牛排馆，招牌干式熟成牛排，人均约 $50–70（约 ¥360–504），地址在 35 W 19th St, New York, NY 10011，从 Parsons 步行约 8 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-3.js",
    "__index": 19
  },
  {
    "id": "balthazar-spring",
    "name": "Balthazar",
    "emoji": "🥖",
    "price": [
      396,
      504
    ],
    "category": "西式主菜",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "早餐",
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "80 Spring St, New York, NY 10012",
    "desc": "法式 brasserie，招牌牛排薯条与海鲜塔，人均约 $55–70（约 ¥396–504），地址在 80 Spring St, New York, NY 10012，从 Parsons 步行约 15 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-3.js",
    "__index": 20
  },
  {
    "id": "casa-mono-irving",
    "name": "Casa Mono",
    "emoji": "🐙",
    "price": [
      396,
      504
    ],
    "category": "小吃点心",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "52 Irving Pl, New York, NY 10003",
    "desc": "西班牙 tapas 吧，招牌烤章鱼与鸭肝，人均约 $55–70（约 ¥396–504），地址在 52 Irving Pl, New York, NY 10003，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣"
    ],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-3.js",
    "__index": 21
  },
  {
    "id": "cote-w-22nd",
    "name": "COTE Korean Steakhouse",
    "emoji": "🥩",
    "price": [
      396,
      504
    ],
    "category": "烧烤",
    "taste": "重口",
    "cuisines": [
      "日韩"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "16 W 22nd St, New York, NY 10010",
    "desc": "韩式烤肉牛排馆，招牌干式熟成牛肉烧烤，人均约 $55–70（约 ¥396–504），地址在 16 W 22nd St, New York, NY 10010，从 Parsons 步行约 11 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-3.js",
    "__index": 22
  },
  {
    "id": "lartusi-w-10th",
    "name": "L'Artusi",
    "emoji": "🍄",
    "price": [
      396,
      504
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "228 W 10th St, New York, NY 10014",
    "desc": "意式餐厅，招牌烤蘑菇与手工意面，人均约 $55–70（约 ¥396–504），地址在 228 W 10th St, New York, NY 10014，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [],
    "__file": "batch-3.js",
    "__index": 23
  },
  {
    "id": "minetta-tavern-macdougal",
    "name": "Minetta Tavern",
    "emoji": "🍔",
    "price": [
      396,
      504
    ],
    "category": "西式主菜",
    "taste": "重口",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "午餐",
      "晚餐",
      "夜宵"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "113 MacDougal St, New York, NY 10012",
    "desc": "法式牛排馆，招牌黑标汉堡与干式熟成牛排，人均约 $55–70（约 ¥396–504），地址在 113 MacDougal St, New York, NY 10012，从 Parsons 步行约 12 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "辣"
    ],
    "__file": "batch-3.js",
    "__index": 24
  },
  {
    "id": "il-buco-bond",
    "name": "Il Buco",
    "emoji": "🧀",
    "price": [
      432,
      504
    ],
    "category": "西式主菜",
    "taste": "清淡",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "47 Bond St, New York, NY 10012",
    "desc": "意式地中海餐厅，招牌海鲜与手工意面，人均约 $60–70（约 ¥432–504），地址在 47 Bond St, New York, NY 10012，从 Parsons 步行约 14 分钟。价格与配料以门店为准。",
    "exclusions": [],
    "uncertainExclusions": [
      "鱼虾贝类"
    ],
    "__file": "batch-3.js",
    "__index": 25
  },
  {
    "id": "cosme-21st-st",
    "name": "Cosme",
    "emoji": "🌮",
    "price": [
      432,
      648
    ],
    "category": "西式主菜",
    "taste": "微辣",
    "cuisines": [
      "西式"
    ],
    "meals": [
      "晚餐"
    ],
    "scenes": [
      "出去吃"
    ],
    "region": "parsons-nyc",
    "address": "35 E 21st St, New York, NY 10010",
    "desc": "现代墨西哥风味餐厅，招牌鸭肉卷饼与玉米料理，人均约 $60–90（约 ¥432–648），地址在 35 E 21st St, New York, NY 10010，从 Parsons 步行约 16 分钟。价格与配料以门店为准。",
    "exclusions": [
      "辣",
      "香菜"
    ],
    "uncertainExclusions": [],
    "__file": "batch-4.js",
    "__index": 25
  }
  /* ================= 纽约条目结束 ================= */

]

const groups = {
  '包饺饼类': 'chaoshou huntun jiaozi shengjian xiaolongbao baozi zhoutao jianbing roujiamo shouzhuabing jidan-guanbing',
  '家常菜': 'shuizhuroupian maoxuewang',
  '火锅锅物': 'jigongbao mala-xiangguo',
  '烧烤': 'shaokao tieban-youyu hanshi-kaorou',
  '粉面': 'liangpi kaolengmian',
  '小吃点心': 'changfen shousi',
  '米饭': 'zhishi-jufan',
  '粥汤': 'niuroutang',
  '甜品烘焙': 'shuangpinnai naicha bake',
  '快餐简餐': 'pisa pisa-juan',
}
const oldCategories = { 米饭: '米饭', 面食: '粉面', 粉面: '粉面', 火锅: '火锅锅物', 小吃: '小吃点心', 快餐: '快餐简餐', 西餐: '西式主菜' }
const cuisineGroups = {
  川渝: 'jigongbao huiguorou-fan yuxiangrousi-fan gongbaojiding-fan suancaiyu-fan shuizhuroupian mala-xiangguo chongqing-xiaomian dandanmian suanlafen chaoshou maocai huoguo chuanchuan maoxuewang',
  粤式: 'zhujiaofan baozai shaola-fan changfen chaoshan-niurou zhuduji shuangpinnai gali-yudan',
  江浙: 'yangzhou-chaofan yangchunmian shengjian xiaolongbao',
  东北: 'guobaorou-fan kaolengmian',
  西北: 'shouzhuafan lanzhou-lamian youpomian saozi-mian banmian-xinjiang roujiamo',
  华北: 'zhajiangmian daoxiaomian jiaozi jianbing yangxiezi',
  日韩: 'hanshibanfan shiguo-banfan zhupai-fan niudong rishi-lamian hanshi-zhajiang buduiguo guandongzhu zhangyu-wanzi shousi hanshi-kaorou',
  云贵: 'suantangfen xiaoguo-mixian',
  湘式: 'choudoufu',
  西式: 'yidalimian hanbao mcd-style kfc-style sanmingzhi zhishi-jufan pisa niupai qingshi pisa-juan bake',
}
const containsId = (ids, id) => ids.split(' ').includes(id)
const breakfastIds = 'lanzhou-lamian chongqing-xiaomian reganmian yangchunmian huntun changfen niuroufen baozi zhoutao jianbing shouzhuabing jidan-guanbing sanmingzhi bake naicha'
const breakfastNames = /包$|饺$|馒头|花卷|发糕|烧麦|葱油饼|牛肉馅饼|韭菜盒子|粢饭团|鲜肉粽|糯米鸡|豉汁凤爪|蒸排骨|虾饺|萝卜糕|芋头糕|粥|胡辣汤/
const teaNames = /奶|蛋挞|面包|可颂|欧包|蛋糕|提拉米苏|豆花|汤圆|豆沙|杨枝甘露|冰粉|桂花糕|银耳/
const offal = /牛杂|肥肠|猪肚|毛血旺|夫妻肺片|鸭血粉丝/
const seafood = /鱼|虾|蟹|贝|鱿|蚝|海鲜|章鱼|三文|鳗|螺蛳|金枪/
const variableIds = 'gaijiaofan mala-xiangguo mixian malatang maocai huoguo chuanchuan ganguo kaoyu chaoshan-niurou buduiguo malaban shaokao jiaozi huntun guandongzhu biandang shousi mcd-style kfc-style'
const variableNames = /火锅|鱼锅|海鲜锅|年糕锅|水饺|锅贴|馄饨|汤包|饭团/
export function enrichFood(food) {
  let category = oldCategories[food.category] || food.category
  for (const [type, ids] of Object.entries(groups)) if (containsId(ids, food.id)) category = type
  const cuisines = food.cuisines || Object.entries(cuisineGroups)
    .filter(([, ids]) => containsId(ids, food.id)).map(([name]) => name)
  if (!cuisines.length) cuisines.push('家常')
  let meals = ['午餐', '晚餐']
  if (category === '甜品烘焙') meals = ['下午茶']
  else if (category === '烧烤' || category === '小吃点心') meals = ['午餐', '晚餐', '下午茶', '夜宵']
  if (containsId(breakfastIds, food.id) || breakfastNames.test(food.name)) meals = ['早餐', ...meals]
  if (teaNames.test(food.name) && !meals.includes('下午茶')) meals.push('下午茶')
  if (['粉面', '包饺饼类', '粥汤'].includes(category) && !meals.includes('夜宵')) meals.push('夜宵')
  const exclusions = []
  const uncertainExclusions = []
  const text = food.name + food.desc
  if (offal.test(text)) exclusions.push('内脏')
  // 鱼香指调味，不代表鱼肉；需先排除该词再判断食材。
  if (seafood.test(text.replaceAll('鱼香', ''))) exclusions.push('鱼虾贝类')
  if (text.includes('香菜')) exclusions.push('香菜')
  if (['微辣', '辣'].includes(food.taste) || /辣椒|辣油|辣粉|辣酱/.test(text)) exclusions.push('辣')
  if (food.taste === '重口') uncertainExclusions.push('辣')
  if (containsId(variableIds, food.id) || variableNames.test(food.name)) uncertainExclusions.push('内脏', '鱼虾贝类', '辣')
  if (['粉面', '火锅锅物', '家常菜', '烧烤', '粥汤'].includes(category) || /煎饼|灌饼|凉粉/.test(food.name)) uncertainExclusions.push('香菜')
  if (['yangzhou-chaofan', 'huntun', 'luo-bo-gao', 'yu-tou-gao', 'zha-chun-juan'].includes(food.id)) uncertainExclusions.push('鱼虾贝类')
  const known = [...new Set(food.exclusions || exclusions)]
  return { ...food, category, cuisines, meals: [...new Set(food.meals || meals)], exclusions: known,
    uncertainExclusions: [...new Set(food.uncertainExclusions || uncertainExclusions)].filter((tag) => !known.includes(tag)) }
}
