export const toolDefinition = [
  {
    type: 'function',
    function: {
      name: 'generateWallAnalysisReport',
      description: '根据墙体类型（外墙或内墙）生成分析报告。若为内墙，将附带玻璃、木制品、不锈钢等部件分析。',
      parameters: {
        type: 'object',
        properties: {
          wallType: {
            type: 'string',
            enum: ['外墙', '内墙', '非建筑图像'],
            description:
              '墙体类型，用于决定报告结构是外墙或内墙及其部件；如不是墙体图像，可返回 "非建筑图像" 用于跳过分析。',
          },
          outerWallReport: {
            type: 'object',
            description: "外墙分析报告，仅在 wallType 为 '外墙' 时填写。",
            properties: {
              basicInfo: {
                type: 'object',
                properties: {
                  wallFinishing: {
                    type: 'string',
                    enum: [
                      '马赛克面',
                      '瓷砖面',
                      '铝板',
                      '铝塑板',
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
                    description: '外墙表面的饰面类型，用于风格判断和施工分析。',
                  },
                },
              },
              mainWall: {
                $ref: '#/definitions/ExteriorWallSection',
              },
            },
          },
          innerWallReport: {
            type: 'object',
            description: "内墙主分析和组件分析，仅在 wallType 为 '内墙' 时填写。",
            properties: {
              basicInfo: {
                type: 'object',
                properties: {
                  wallFinishing: {
                    type: 'string',
                    enum: ['发霉、渗水、潮湿墙面', '旧墙面', '瓷砖墙面', '其他'],
                    description: '墙面的基本判断',
                  },
                },
              },
              mainWall: {
                $ref: '#/definitions/InteriorWallSection',
              },
              glass: {
                $ref: '#/definitions/GlassSection',
                nullable: true,
              },
              wood: {
                $ref: '#/definitions/WoodSection',
                nullable: true,
              },
              steel: {
                $ref: '#/definitions/SteelSection',
                nullable: true,
              },
            },
          },
        },
        required: ['wallType'],
        definitions: {
          ExteriorWallSection: {
            type: 'object',
            properties: {
              material: {
                type: 'string',
                description: '外墙饰面所用材料。',
              },
              surfaceCondition: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '描述外墙表层视觉状态，列出不少于 3 条 (最好是5条)自然语言观察，描述表面状况，如是否色差、泛黄、污染、老化、发白、粗糙、光泽下降, 平整、污染、老化、褪色、泛碱盐析、外墙掉皮、颜色均匀度、传统腻子开裂、外墙掉粉、 发霉问题等。',
              },
              damageNotes: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '列出不少于 3 条(最好是5条)自然语言描述，列出明确结构性缺陷、破损区域、渗水裂缝开裂、空鼓、掉砖、风化、剥落、结构变形等风险，并加入感性词汇增强表达。',
              },
            },
          },
          InteriorWallSection: {
            type: 'object',
            properties: {
              material: {
                type: 'string',
                description: '内墙饰面材料，如乳胶漆、壁纸等。',
              },
              surfaceCondition: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '描述墙面表层视觉状态，列出不少于 3 条 (最好是5条)自然语言观察，描述表面状况，如是否色差、泛黄、污染、老化、发白、粗糙、光泽下降, 平整、污染、老化、褪色、 泛碱盐析、 掉皮、 颜色均匀度、 传统腻子开裂、 掉粉、 发霉问题等。',
              },
              damageNotes: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '列出不少于 3 条(最好是5条)自然语言描述，列出明确结构性缺陷、破损区域、受潮、开裂、剥落、渗水等风险，并加入感性词汇增强表达。',
              },
            },
          },
          GlassSection: {
            type: 'object',
            description: '玻璃构件的状态与缺陷分析。',
            properties: {
              surfaceCondition: {
                type: 'array',
                items: { type: 'string' },
                description: '至少列出 2 条自然语言观察，描述污渍、破损、老化、指纹等问题，格式为 1. 2. 3.',
              },
              damageNotes: {
                type: 'array',
                items: { type: 'string' },
                description: '至少列出 2 条自然语言说明玻璃缺陷（如裂痕、松动），使用具有提示性的修辞词语。',
              },
            },
          },
          WoodSection: {
            type: 'object',
            description: '木制品状态与潜在风险描述。',
            properties: {
              surfaceCondition: {
                type: 'array',
                items: { type: 'string' },
                description: '列出 2 条或更多自然语言描述，指出变色、裂纹、漆面老化等现象。',
              },
              damageNotes: {
                type: 'array',
                items: { type: 'string' },
                description: '指出使用中的缺陷，如磕碰、水渍、发霉等。用感性语言提示维护或更换建议。',
              },
            },
          },
          SteelSection: {
            type: 'object',
            description: '不锈钢构件状态评估与缺陷描述。',
            properties: {
              surfaceCondition: {
                type: 'array',
                items: { type: 'string' },
                description: '用自然语言列出不锈钢表面状态，如划痕、水斑、腐蚀等，至少列出 2 条。',
              },
              damageNotes: {
                type: 'array',
                items: { type: 'string' },
                description: '列出不锈钢件的风险与潜在问题，语气强调并富有建议性，至少 2 条以上。',
              },
            },
          },
        },
      },
    },
  },
];
