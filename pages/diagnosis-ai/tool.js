export const toolDefinition = [
  {
    type: 'function',
    function: {
      name: 'generate_wall_analysis_report',
      description: '根据上传的墙体图片生成结构化墙面分析报告（适用于外墙或内墙）',
      parameters: {
        type: 'object',
        properties: {
          wallType: {
            type: 'string',
            description: "墙体类型，可为 '外墙' 或 '内墙'",
            enum: ['外墙', '内墙'],
          },
          buildingInfo: {
            type: 'object',
            properties: {
              usage: { type: 'string', description: '建筑用途（住宅、商业等）' },
              wallMaterial: { type: 'string', description: '墙体主材料' },
              wallFinishing: {
                type: 'string',
                description: '墙身类型',
                enum: [
                  '马赛克面',
                  '瓷砖面',
                  '外墙涂料',
                  '真石漆旧墙',
                  '氟碳漆',
                  '浮雕漆',
                  '拉毛漆',
                  '水泥抹灰',
                  '红砖墙',
                  '洗石米墙',
                  '其他',
                ],
              },
              other: { type: 'string', description: '其他补充信息' },
            },
          },
          wallAppearance: {
            type: 'object',
            properties: {
              summary: {
                type: 'array',
                items: { type: 'string' },
                description: '墙面外观及表面状态的自然语言描述',
              },
            },
          },
          wallStructure: {
            type: 'object',
            properties: {
              details: {
                type: 'array',
                items: { type: 'string' },
                description: '墙体构造状态及潜在问题的自然语言描述',
              },
            },
          },
        },
        required: ['wallType', 'buildingInfo', 'wallAppearance', 'wallStructure'],
      },
    },
  },
];
