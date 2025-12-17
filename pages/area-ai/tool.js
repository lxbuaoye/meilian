export const toolDefinition = [
  {
    type: 'function',
    function: {
      name: 'generateInteriorWallAnalysisReport',
      description:
        '根据图片生成全面的分析报告，包括空间画像、推荐搭配（根据图片自动判断建筑类型和风格，给出一种推荐方案）、面积估算、住户分析、风水建议和空间焕新计划建议。',
      parameters: {
        type: 'object',
        properties: {
          spaceProfile: {
            type: 'object',
            description: '空间画像分析',
            properties: {
              spaceCondition: {
                type: 'object',
                description: '建筑/空间现况分析',
                properties: {
                  agingIndex: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    description: '老化指数，0-100分，分数越高表示老化程度越严重',
                  },
                  agingIndexDescription: {
                    type: 'string',
                    description: '老化的简单描述，如：房屋老龄化严重, 必须在7个字以内',
                  },
                  safetyRisk: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    description: '安全风险，0-100分，分数越高表示安全风险越大',
                  },
                  safetyRiskDescription: {
                    type: 'string',
                    description: '最严重的风险描述，如：存在掉砖风险, 必须在7个字以内',
                  },
                  estimatedServiceLife: {
                    type: 'number',
                    description: '估算使用年限，单位：年',
                  },
                  originalPossibleUses: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '该建筑/空间原来用途，返回3个可能的用途，如：["住宅", "办公", "商业"]',
                    minItems: 3,
                    maxItems: 3,
                  },
                  suggestedUse: {
                    type: 'string',
                    description: '建议用作，根据分析给出建议的用途，1-2句话',
                  },
                  urgentRenovationSuggestions: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      '急需改造建议，返回4个具体的改造建议，如：["墙面翻新", "电路改造", "防水处理", "结构加固"]',
                    minItems: 4,
                    maxItems: 4,
                  },
                },
                required: [
                  'agingIndex',
                  'agingIndexDescription',
                  'safetyRisk',
                  'safetyRiskDescription',
                  'estimatedServiceLife',
                  'originalPossibleUses',
                  'suggestedUse',
                  'urgentRenovationSuggestions',
                ],
              },
              userAnalysis: {
                type: 'object',
                description: '建筑/空间使用者分析',
                properties: {
                  usagePattern: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      '空间使用特征标签，根据图片中可见的物品、布局等判断空间使用方式，返回2-3个简洁的标签，如：["亲子互动型空间", "高密度收纳需求"]。避免直接推测人员结构，而是描述空间使用特征',
                  },
                  qualityFocus: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      '品质关注方向标签，根据图片中的物品、装修状态等判断用户愿意把钱花在哪里，返回2-3个简洁的标签，如：["实用主义与耐用性", "设计感与氛围营造"]。避免直接推测消费能力，而是描述品质关注方向',
                  },
                  styleDiagnosis: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      '当前风格诊断标签，评价图片中现有的装修风格状态，返回2-3个简洁的标签，如：["传统风格", "现代化升级潜力"]。不是猜测用户喜欢什么，而是评价现在的状态',
                  },
                  keyRenovationTriggers: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      '核心改造痛点标签，通过识别空间中的问题（如采光不好、收纳不足、材质磨损等）来指出需要改造的地方，返回2-3个简洁的标签，如：["采光与通透感提升", "收纳扩容"]',
                  },
                },
                required: ['usagePattern', 'qualityFocus', 'styleDiagnosis', 'keyRenovationTriggers'],
              },
            },
            required: ['spaceCondition', 'userAnalysis'],
          },
          recommendedMatching: {
            type: 'object',
            description: '推荐搭配方案，根据图片中的建筑自动判断风格，给出一种推荐方案',
            properties: {
              buildingType: {
                type: 'string',
                description: '根据图片判断的建筑类型，如：商业建筑、居住建筑、休闲建筑、办公建筑等',
              },
              styleName: {
                type: 'string',
                description: '根据图片判断的建筑风格名称，如：现代简约、北欧风格、中式风格、工业风等',
              },
              styleDescription: {
                type: 'string',
                description: '一句话表达该风格的特点',
              },
              colorScheme: {
                type: 'object',
                properties: {
                  primaryColor: {
                    type: 'string',
                    description: '主色调，如：暖白色、浅灰色等',
                  },
                  primaryColorRgb: {
                    type: 'string',
                    description: '主色调的RGB颜色值，格式为 "rgb(r,g,b)" 或 "#rrggbb"，如：rgb(255,248,220) 或 #FFF8DC',
                  },
                  secondaryColors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        color: {
                          type: 'string',
                          description: '辅助色彩名称',
                        },
                        colorRgb: {
                          type: 'string',
                          description:
                            '辅助色彩的RGB颜色值，格式为 "rgb(r,g,b)" 或 "#rrggbb"，如：rgb(255,248,220) 或 #FFF8DC',
                        },
                        usage: {
                          type: 'string',
                          description: '建议用于哪里，如：墙面、装饰、家具等',
                        },
                      },
                      required: ['color', 'colorRgb', 'usage'],
                    },
                    description: '辅助色彩列表，每个包含颜色名称、RGB颜色值和使用位置说明',
                  },
                },
                required: ['primaryColor', 'primaryColorRgb', 'secondaryColors'],
              },
              colorCardSeries: {
                type: 'string',
                description: '推荐色卡：数码彩涂料系列，如：数码彩经典系列、数码彩艺术系列等',
              },
              plantRecommendation: {
                type: 'string',
                description: '植物搭配推荐',
              },
            },
            required: [
              'buildingType',
              'styleName',
              'styleDescription',
              'colorScheme',
              'colorCardSeries',
              'plantRecommendation',
            ],
          },
          wallAreaEstimation: {
            type: 'object',
            description: '墙面面积估算',
            properties: {
              estimatedArea: {
                type: 'number',
                description: '估算的墙面总面积（平方米）可以偏大一点',
              },
              areaRange: {
                type: 'object',
                properties: {
                  min: {
                    type: 'number',
                    description: '最小估算面积（平方米）',
                  },
                  max: {
                    type: 'number',
                    description: '最大估算面积（平方米）',
                  },
                },
                required: ['min', 'max'],
              },
              confidence: {
                type: 'string',
                enum: ['高', '中', '低'],
                description: '估算的置信度',
              },
            },
            required: ['estimatedArea', 'areaRange', 'confidence'],
          },
          fengshui: {
            type: 'object',
            description: '风水分析',
            properties: {
              currentAssessment: {
                type: 'object',
                description: '现况评估',
                properties: {
                  level: {
                    type: 'string',
                    enum: ['优', '中等', '较弱'],
                    description: '风水现况等级',
                  },
                  reason: {
                    type: 'string',
                    description: '评估原因，1-2句话说明',
                  },
                },
                required: ['level', 'reason'],
              },
              layoutSuggestion: {
                type: 'string',
                description: '布局建议，2-3句话',
              },
              colorSuggestion: {
                type: 'string',
                description: '色彩建议，格式：颜色+有利于……，如：暖色调有利于营造温馨氛围',
              },
              objectArrangement: {
                type: 'string',
                description: '物件布置建议',
              },
            },
            required: ['currentAssessment', 'layoutSuggestion', 'colorSuggestion', 'objectArrangement'],
          },
          salesProposals: {
            type: 'object',
            description:
              '空间焕新计划建议，根据前四项分析内容（空间画像、推荐搭配、面积估算, 风水）给出3个具体的空间焕新计划',
            properties: {
              proposals: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: '方案标题，简洁明了',
                    },
                    description: {
                      type: 'string',
                      description: '方案描述，简单、贴合实际应用，1-2句话',
                    },
                  },
                  required: ['title', 'description'],
                },
                minItems: 3,
                maxItems: 3,
                description: '3个具体的空间焕新计划建议',
              },
            },
            required: ['proposals'],
          },
        },
        required: [
          'spaceProfile',
          'recommendedMatching',
          'wallAreaEstimation',
          'residentAnalysis',
          'fengshui',
          'salesProposals',
        ],
      },
    },
  },
];
