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
          renovationProposal: {
            type: 'object',
            properties: {
              baseRepair: {
                type: 'array',
                items: { type: 'string' },
                description: '基础修复建议的自然语言描述',
              },
              refinishing: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '用自然语言描述的方式, 给出表面翻新的建议 (涂料或者仿石漆), 包含推荐颜色搭配或者风格, 是否添加窗套线条等等',
              },
              protection: {
                type: 'array',
                items: { type: 'string' },
                description: '防护处理建议的自然语言描述',
              },
            },
          },
        },
        required: [
          'wallType',
          'buildingInfo',
          'wallAppearance',
          'wallStructure',
          'environmentFactors',
          'renovationProposal',
        ],
      },
    },
  },
];
