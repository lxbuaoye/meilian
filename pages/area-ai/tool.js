export const toolDefinition = [
  {
    type: 'function',
    function: {
      name: 'generateInteriorWallAnalysisReport',
      description: '根据内墙图片生成全面的分析报告，包括推荐风格、色彩搭配、面积估算、住户分析、风水建议和植物推荐。',
      parameters: {
        type: 'object',
        properties: {
          recommendedStyle: {
            type: 'object',
            description: '推荐风格分析',
            properties: {
              styleName: {
                type: 'string',
                description: '推荐的装修风格名称，如：现代简约、北欧风格、中式风格、美式风格、工业风等',
              },
              styleDescription: {
                type: 'string',
                description: '风格特点的详细描述，说明为什么适合这个空间',
              },
              styleFeatures: {
                type: 'array',
                items: { type: 'string' },
                description: '该风格的主要特征列表，至少3条',
              },
              designSuggestions: {
                type: 'array',
                items: { type: 'string' },
                description: '针对该风格的具体设计建议，至少3条',
              },
            },
            required: ['styleName', 'styleDescription', 'styleFeatures', 'designSuggestions'],
          },
          recommendedColorScheme: {
            type: 'object',
            description: '推荐色彩搭配方案',
            properties: {
              primaryColor: {
                type: 'string',
                description: '主色调，如：暖白色、浅灰色、米黄色等',
              },
              secondaryColors: {
                type: 'array',
                items: { type: 'string' },
                description: '辅助色彩列表，至少2-3种颜色',
              },
              colorDescription: {
                type: 'string',
                description: '色彩搭配的整体说明和设计理念',
              },
              colorSuggestions: {
                type: 'array',
                items: { type: 'string' },
                description: '具体的色彩应用建议，至少3条',
              },
            },
            required: ['primaryColor', 'secondaryColors', 'colorDescription', 'colorSuggestions'],
          },
          wallAreaEstimation: {
            type: 'object',
            description: '墙面面积估算',
            properties: {
              estimatedArea: {
                type: 'number',
                description: '估算的墙面总面积（平方米）',
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
          residentAnalysis: {
            type: 'object',
            description: '住户现况分析',
            properties: {
              imageInformation: {
                type: 'string',
                description: '图片所提供的信息描述，包括空间布局、家具、装饰等可见元素',
              },
              familyStructure: {
                type: 'string',
                description: '推测的家庭结构，如：年轻夫妇、三口之家、老人独居等',
              },
              ageGroup: {
                type: 'string',
                description: '推测的年龄群体，如：25-35岁、35-45岁、50岁以上等',
              },
              aestheticPreference: {
                type: 'string',
                description: '推测的审美偏好，如：简约现代、温馨舒适、奢华大气等',
              },
              consumptionCapacity: {
                type: 'string',
                enum: ['高', '中', '低'],
                description: '推测的消费能力水平',
              },
              salesSuggestions: {
                type: 'array',
                items: { type: 'string' },
                description: '针对性的装修销售建议，至少3条，要具体、可操作',
              },
            },
            required: [
              'imageInformation',
              'familyStructure',
              'ageGroup',
              'aestheticPreference',
              'consumptionCapacity',
              'salesSuggestions',
            ],
          },
          fengshui: {
            type: 'object',
            description: '风水分析',
            properties: {
              overallAssessment: {
                type: 'string',
                description: '整体风水评估，包括空间布局、光线、通风等',
              },
              fengshuiSuggestions: {
                type: 'array',
                items: { type: 'string' },
                description: '风水改善建议，至少3条',
              },
              colorFengshui: {
                type: 'string',
                description: '色彩风水建议，说明适合的颜色及其寓意',
              },
              layoutFengshui: {
                type: 'string',
                description: '布局风水建议，包括家具摆放、空间利用等',
              },
            },
            required: ['overallAssessment', 'fengshuiSuggestions', 'colorFengshui', 'layoutFengshui'],
          },
          recommendedPlants: {
            type: 'object',
            description: '推荐搭配植物',
            properties: {
              recommendedPlants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    plantName: {
                      type: 'string',
                      description: '植物名称',
                    },
                    plantDescription: {
                      type: 'string',
                      description: '植物特点描述',
                    },
                    placement: {
                      type: 'string',
                      description: '建议摆放位置',
                    },
                    benefits: {
                      type: 'string',
                      description: '该植物的好处，如净化空气、装饰效果、风水作用等',
                    },
                  },
                  required: ['plantName', 'plantDescription', 'placement', 'benefits'],
                },
                description: '推荐的植物列表，至少3-5种',
              },
              overallPlantGuidance: {
                type: 'string',
                description: '整体植物搭配指导',
              },
            },
            required: ['recommendedPlants', 'overallPlantGuidance'],
          },
        },
        required: [
          'recommendedStyle',
          'recommendedColorScheme',
          'wallAreaEstimation',
          'residentAnalysis',
          'fengshui',
          'recommendedPlants',
        ],
      },
    },
  },
];
