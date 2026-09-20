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
  }
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
