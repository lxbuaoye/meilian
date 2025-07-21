const { CLOUD_STROAGE_PATH } = getApp().globalData;

export const exteriorWallSolutions = [
  {
    wallType: '马赛克面 / 瓷砖面 / 铝板 / 铝塑板',
    solutions: [
      {
        solutionName: '方案一（本方案适合现状是小面积空鼓修补）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/masaike/1-min.png`,
        baseTreatmentAndRepair: [
          '检查空鼓与脱落区域, 敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          '清理表面污染物, 使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          '修补基层, 对铲除区域用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆填补并找平空缺区域。',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '防水', '抗碱', '耐用', '漆与砖面附着力高'],
        disadvantages: ['墙面不平整，能看到原来的缝隙状'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
        ],
      },
      {
        solutionName: '方案二（本方案适合现状是大面积空鼓及脱落）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/masaike/2-min.png`,
        baseTreatmentAndRepair: [
          '检查空鼓与脱落区域: 敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          '清理表面污染物: 使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          '修补基层: 全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用', '墙面平整更美观'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
          {
            name: '外墙-铜墙单组份',
            id: 'af3da5c8672c5895003092ba586174c',
          },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/masaike/3-min.png`,
        baseTreatmentAndRepair: [
          '检查空鼓与脱落区域: 敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          '清理表面污染物: 使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          '修补基层: 全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '仿石材效果更高端美观', '硬度高', '抗污效果好', '更耐用'],
        disadvantages: ['工期长', '成本高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-数码彩·石漆',
            id: 'af3da5c8672c5a170030bf2e6bbbbf41',
          },
          {
            name: '外墙-疏污面釉',
            id: '9fc3269d672dcaf7005cdbf5413ab9c2',
          },
          {
            name: '外墙-超耐候罩光面漆',
            id: '9fc3269d672c5c0900319dca7643b20e',
          },
        ],
      },
    ],
  },
  {
    wallType: '外墙涂料 / 真石漆旧墙 / 氟碳漆 / 浮雕漆 / 拉毛漆 / 水泥抹灰 / 其他',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/rujiaoqi/1-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          '原有涂层处理: 粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '墙面修补: 铲除的区域嵌填外墙专用柔性抗裂砂浆或耐水抗裂弹性腻子，此步骤需要根据实际环境情况进行淋水养护。',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '防水', '抗碱', '耐用'],
        disadvantages: ['墙面不平整，看到原基层凹凸面'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
        ],
      },
      {
        solutionName: '方案二',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/rujiaoqi/2-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          '原有涂层处理: 粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '墙面整体找平: 全墙面用舒普底漆进行封闭处理，提高附着力；用外墙专用找平腻子全墙面批刮1~2遍，打磨及淋水养护。',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用', '墙面平整更美观'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
          {
            name: '外墙-铜墙单组份',
            id: 'af3da5c8672c5895003092ba586174c',
          },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/rujiaoqi/3-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          '原有涂层处理: 粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '墙面整体找平: 全墙面用舒普底漆进行封闭处理，提高附着力；用外墙专用找平腻子全墙面批刮1~2遍，打磨及淋水养护。',
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '仿石材效果更高端美观', '硬度高', '抗污效果好', '更耐用'],
        disadvantages: ['工期长', '成本高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-数码彩·石漆',
            id: 'af3da5c8672c5a170030bf2e6bbbbf41',
          },
          {
            name: '外墙-超耐候罩光面漆',
            id: '9fc3269d672c5c0900319dca7643b20e',
          },
          {
            name: '外墙-疏污面釉',
            id: '9fc3269d672dcaf7005cdbf5413ab9c2',
          },
        ],
      },
    ],
  },
  {
    wallType: '红砖墙',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/hongzhuanqiang/1-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          '墙面修补: 使用防水抗裂砂浆或聚合物水泥全墙面找平，并淋水养护',
          '墙面找平: 使用外墙专用腻子找平，打磨，淋水养护',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '耐用', '现代风设计感'],
        disadvantages: ['无'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
        ],
      },
      {
        solutionName: '方案二（线条分格工艺仿石漆）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/hongzhuanqiang/2-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          '墙面修补: 使用防水抗裂砂浆或聚合物水泥全墙面找平，并淋水养护',
        ],
        coatingSystemConstruction: [
          '中性彩色基材满批',
          '水平定位贴美纹纸',
          '舒普底漆满刷（根据实际情况可选做）',
          '数码彩·石漆系列产品喷涂2遍',
          '撕美纹纸',
          '喷涂外墙罩光漆',
          '滚涂疏污面釉加强抗污能力',
        ],
        advantages: ['工期较长', '防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿石效果美观典雅'],
        disadvantages: ['仿干挂大理石效果不够逼真'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '辅材-中性彩色基材',
            id: '5dc6258681880a402705d8c2e28c38d',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-数码彩·石漆',
            id: 'af3da5c8672c5a170030bf2e6bbbbf41',
          },
          {
            name: '外墙-超耐候罩光面漆',
            id: '9fc3269d672c5c0900319dca7643b20e',
          },
          {
            name: '外墙-疏污面釉',
            id: '9fc3269d672dcaf7005cdbf5413ab9c2',
          },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/hongzhuanqiang/3-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          '墙面修补: 使用防水抗裂砂浆或聚合物水泥修补裂缝、缺损处，并淋水养护',
        ],
        coatingSystemConstruction: [
          '用专用砂浆粘贴2cm以下发泡陶瓷平板',
          '滚涂发泡陶瓷专用底漆',
          '喷涂数码彩·石漆系列产品',
          '喷涂外墙罩面漆',
          '滚涂疏污面釉加强抗污能力',
        ],
        advantages: ['防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿石效果逼真'],
        disadvantages: ['成本较高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '辅材-发泡陶瓷专用底漆',
            id: '50de7f5d67721a5503fb612b1abe712f',
          },
          {
            name: '外墙-数码彩·石漆',
            id: 'af3da5c8672c5a170030bf2e6bbbbf41',
          },
          {
            name: '外墙-超耐候罩光面漆',
            id: '9fc3269d672c5c0900319dca7643b20e',
          },
          {
            name: '外墙-疏污面釉',
            id: '9fc3269d672dcaf7005cdbf5413ab9c2',
          },
        ],
      },
    ],
  },
  {
    wallType: '洗石米墙',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/ximishi/1-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '修补基层: 对铲除区域用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆填补并找平空缺区域。',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '耐用', '现代风设计感'],
        disadvantages: ['墙面平整度不够，能看到原墙面基理纹路'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
        ],
      },
      {
        solutionName: '方案二（线条分格工艺仿石漆）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/ximishi/2-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '修补基层: 全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '外墙-舒普底漆',
            id: '7f296b21672c598d003118d32a89a9de',
          },
          {
            name: '外墙-铜墙双组份',
            id: '9c1e6a31672a35d0128e9631228ddc76',
          },
          {
            name: '外墙-铜墙单组份',
            id: 'af3da5c8672c5895003092ba586174c',
          },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/ximishi/3-min.png`,
        baseTreatmentAndRepair: [
          '现场勘查与评估: 检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          '高压水枪冲洗墙面: 清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          '修补基层: 全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿干挂石材效果逼真'],
        disadvantages: ['成本较高', '工期较长'],
        recommendedProducts: [
          {
            name: '辅材-舒普砂浆',
            id: '6c692678672c55de003186fb262a8d55',
          },
          {
            name: '辅材-发泡陶瓷专用底漆',
            id: '50de7f5d67721a5503fb612b1abe712f',
          },
          {
            name: '外墙-数码彩·石漆',
            id: 'af3da5c8672c5a170030bf2e6bbbbf41',
          },
          {
            name: '外墙-超耐候罩光面漆',
            id: '9fc3269d672c5c0900319dca7643b20e',
          },
          {
            name: '外墙-疏污面釉',
            id: '9fc3269d672dcaf7005cdbf5413ab9c2',
          },
        ],
      },
    ],
  },
];

export const interiorWallSolutions = [
  {
    wallType: '发霉、渗水、潮湿墙面',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/famei/1-min.png`,
        baseTreatmentAndRepair: [
          '检查霉变原因（如漏水、渗水、结露、通风差等）,确认受潮范围和墙体损坏程度',
          '清除霉斑：使用刮刀、钢丝刷或砂纸去除表面霉点和松动层，用含氯消毒液（如84稀释液）或专业除霉剂反复擦拭墙面，彻底杀菌',
          '干燥处理，必要时用鼓风机或除湿设备加快干燥',
          '根源处理（根据原因）: 修补水管/外墙渗漏；增加通风、使用除湿设备。',
          '铲除发霉区域涂层及腻子层，直至坚实基层',
          '涂刷舒普底漆，可以达到防水抗碱防霉功能',
          '重新批刮耐水腻子（如找平腻子或抗碱腻子）1~2遍',
          '打磨找平，确保墙面平整',
        ],
        coatingSystemConstruction: [
          '涂刷腻子伴侣，保证基层牢固',
          '涂刷数码彩抗碱底漆',
          '涂刷数码彩内墙漆，推荐“能系列”，功能性突出，除了美化家居，还能更好地保护墙面，持久耐用',
        ],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '防霉', '耐用', '平面易清洁'],
        disadvantages: ['没有艺术纹理质感', '缺乏个性化定制'],
        recommendedProducts: [
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '内墙-能系列-洁霸',
            id: '7f296b21672dcf38005c5e3c22f61c38',
          },
        ],
      },
      {
        solutionName: '方案二（线条分格工艺仿石漆）',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/famei/2-min.png`,
        baseTreatmentAndRepair: [
          '检查霉变原因（如漏水、渗水、结露、通风差等）,确认受潮范围和墙体损坏程度',
          '清除霉斑：使用刮刀、钢丝刷或砂纸去除表面霉点和松动层，用含氯消毒液（如84稀释液）或专业除霉剂反复擦拭墙面，彻底杀菌',
          '干燥处理，必要时用鼓风机或除湿设备加快干燥',
          '根源处理（根据原因）: 修补水管/外墙渗漏；增加通风、使用除湿设备。',
          '铲除发霉区域涂层及腻子层，直至坚实基层',
          '涂刷舒普底漆，可以达到防水抗碱防霉功能',
          '重新批刮耐水腻子（如找平腻子或抗碱腻子）1~2遍',
          '打磨找平，确保墙面平整',
        ],
        coatingSystemConstruction: [
          '涂刷腻子伴侣，保证基层牢固与防霉性',
          '涂刷数码彩艺术墙漆，根据业主和设计图需求，先打板定样，个性化涂装。',
        ],
        advantages: ['防水', '抗碱', '耐用', '防霉', '自定义质感和纹理更能体现个性化'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '艺术墙漆-雅晶石',
            id: '7f296b21672b2cad0008b84558edf017',
          },
          {
            name: '艺术墙漆-配套产品-易洁面釉',
            id: '65ac45726738827b01616106276c4144',
          },
        ],
      },
    ],
  },
  {
    wallType: '旧墙面 / 其他',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/laohua/1-min.png`,
        baseTreatmentAndRepair: [
          '清理表面：铲除起皮、松动旧漆，使用铲刀或打磨机处理',
          '使用嵌缝石膏或防裂腻子填补裂缝或钉孔，必要时贴网格布加强',
          '局部修补后整体涂刷舒普底漆，可以达到防水抗碱防霉功能',
          '整体批刮环保耐水的内墙腻子1~2遍并打磨，确保墙面平整',
        ],
        coatingSystemConstruction: [
          '涂刷腻子伴侣，保证基层牢固',
          '涂刷数码彩抗碱底漆',
          '涂刷数码彩内墙漆，推荐“能系列”，功能性突出，除了美化家居，还能更好地保护墙面，持久耐用',
        ],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '防霉', '耐用', '平面易清洁'],
        disadvantages: ['没有艺术纹理质感', '缺乏个性化定制'],
        recommendedProducts: [
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '内墙-能系列-洁霸',
            id: '7f296b21672dcf38005c5e3c22f61c38',
          },
        ],
      },
      {
        solutionName: '方案二',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/laohua/2-min.png`,
        baseTreatmentAndRepair: [
          '清理表面：铲除起皮、松动旧漆，使用铲刀或打磨机处理',
          '除霉（如有）：喷涂专用除霉剂，彻底干燥后清洁',
          '使用嵌缝石膏或防裂腻子填补裂缝或钉孔，必要时贴网格布加强',
          '局部修补后整体涂刷舒普底漆，可以达到防水抗碱防霉功能',
          '整体批刮环保耐水的内墙腻子1~2遍并打磨，确保墙面平整',
        ],
        coatingSystemConstruction: [
          '涂刷腻子伴侣，保证基层牢固',
          '涂刷数码彩艺术墙漆，根据业主和设计图需求，先打板定样，个性化涂装。',
        ],
        advantages: ['防水', '抗碱', '耐用', '防霉', '自定义质感和纹理更能体现个性化'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '艺术墙漆-雅晶石',
            id: '7f296b21672b2cad0008b84558edf017',
          },
          {
            name: '艺术墙漆-配套产品-易洁面釉',
            id: '65ac45726738827b01616106276c4144',
          },
        ],
      },
    ],
  },
  {
    wallType: '瓷砖墙面',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/cizhuan/1-min.png`,
        baseTreatmentAndRepair: [
          '清洁瓷砖表面：使用去油剂和清洁剂彻底清洗油污、水垢、霉斑等；',
          '打磨瓷砖面层：用砂纸或电动打磨机粗化瓷砖表面（特别是抛光砖），增强涂料附着力；',
          '干燥养护：彻底干燥，保持表面无明水、无潮湿。',
        ],
        coatingSystemConstruction: ['直接喷涂或滚涂数码彩超能焕新漆1-2遍'],
        advantages: ['工期短', '成本较低', '耐水', '耐脏污易清洁'],
        disadvantages: ['没有填补瓷砖缝隙'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-超能焕新漆',
            id: 'fbf3bf436864e7630455b3f86465e9fd',
          },
        ],
      },
      {
        solutionName: '方案二',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/cizhuan/2-min.png`,
        baseTreatmentAndRepair: [
          '清洁瓷砖表面：使用去油剂和清洁剂彻底清洗油污、水垢、霉斑等；',
          '打磨瓷砖面层：用砂纸或电动打磨机粗化瓷砖表面（特别是抛光砖），增强涂料附着力；',
          '修补勾缝/破损：使用专用腻子或瓷砖修补剂填补破损、缝隙；',
          '干燥养护：彻底干燥，保持表面无明水、无潮湿。',
        ],
        coatingSystemConstruction: [
          '涂刷数码彩舒普底漆，具有防水功能，同时增强附着力；',
          '选择柔性腻子全面找平一遍，厚度1–2mm，干燥后打磨平整',
          '涂刷腻子伴侣，保证基层牢固',
          '涂刷数码彩抗碱底漆',
          '涂刷数码彩内墙漆，推荐“能系列”，功能性突出，除了美化家居，还能更好地保护墙面，持久耐用',
        ],
        advantages: ['工期较长', '成本较高', '防水', '抗碱', '防霉', '耐用', '平面易清洁'],
        disadvantages: ['没有艺术纹理质感', '缺乏个性化定制'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '内墙-能系列-洁霸',
            id: '7f296b21672dcf38005c5e3c22f61c38',
          },
        ],
      },
      {
        solutionName: '方案三',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/cizhuan/3-min.png`,
        baseTreatmentAndRepair: [
          '清洁瓷砖表面：使用去油剂和清洁剂彻底清洗油污、水垢、霉斑等；',
          '打磨瓷砖面层：用砂纸或电动打磨机粗化瓷砖表面（特别是抛光砖），增强涂料附着力；',
          '修补勾缝/破损：使用专用腻子或瓷砖修补剂填补破损、缝隙；',
          '干燥养护：彻底干燥，保持表面无明水、无潮湿。',
        ],
        coatingSystemConstruction: [
          '涂刷数码彩舒普底漆，具有防水功能，同时增强附着力；',
          '选择柔性腻子全面找平一遍，厚度1–2mm，干燥后打磨平整',
          '涂刷腻子伴侣，保证基层牢固',
          '涂刷数码彩艺术墙漆，根据业主和设计图需求，先打板定样，个性化涂装。',
        ],
        advantages: ['防水', '抗碱', '耐用', '防霉', '自定义质感和纹理更能体现个性化'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-腻子伴侣',
            id: '9fc3269d672b2d9400090b9032a095f7',
          },
          {
            name: '艺术·舒普底漆',
            id: '9fc3269d672c650a0032d0d53a98226e',
          },
          {
            name: '艺术墙漆-雅晶石',
            id: '7f296b21672b2cad0008b84558edf017',
          },
          {
            name: '艺术墙漆-配套产品-易洁面釉',
            id: '65ac45726738827b01616106276c4144',
          },
        ],
      },
    ],
  },
];
export const glassSolutions = [
  {
    wallType: '玻璃',
    solutions: [
      {
        solutionName: '方案一',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/boli/1-min.png`,
        baseTreatmentAndRepair: [
          '检查玻璃是否存在划痕、水垢、污渍、贴膜残胶或轻微破损',
          '确定是普通玻璃、磨砂玻璃还是镀膜玻璃。',
          '使用玻璃专用清洁剂和无纤维布彻底去除灰尘、油污。',
          '对于顽固污渍如水垢，可用稀释后的醋水或专业除垢剂清洗',
          '划痕修复（可选）:轻微划痕：使用玻璃抛光剂或氧化铈配合电动抛光机轻抛； 深划痕：更换玻璃或考虑贴膜遮挡。',
        ],
        coatingSystemConstruction: ['改色：喷涂或滚涂数码彩超能焕新漆1-2遍'],
        advantages: ['工期短', '成本较低', '耐用', '易洁', '可个性化调色', '水性环保', '隐私性高'],
        disadvantages: ['不透光'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-超能焕新漆',
            id: 'fbf3bf436864e7630455b3f86465e9fd',
          },
        ],
      },
      {
        solutionName: '方案二',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/boli/2-min.png`,
        baseTreatmentAndRepair: [
          '检查玻璃是否存在划痕、水垢、污渍、贴膜残胶或轻微破损',
          '确定是普通玻璃、磨砂玻璃还是镀膜玻璃。',
          '使用玻璃专用清洁剂和无纤维布彻底去除灰尘、油污。',
          '对于顽固污渍如水垢，可用稀释后的醋水或专业除垢剂清洗',
          '划痕修复（可选）:轻微划痕：使用玻璃抛光剂或氧化铈配合电动抛光机轻抛； 深划痕：更换玻璃或考虑贴膜遮挡。',
        ],
        coatingSystemConstruction: ['透明磨砂：喷涂或滚涂磨砂玻璃漆1-2遍'],
        advantages: ['工期短', '成本较低', '耐用', '易洁', '透明可调色', '水性环保'],
        disadvantages: ['隐私性没有改色强'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
        ],
      },
    ],
  },
];
export const woodSolutions = [
  {
    wallType: '木制品',
    solutions: [
      {
        solutionName: '通用方案',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/wood/1-min.png`,
        baseTreatmentAndRepair: [
          '细砂纸打磨至微磨砂质感，去除表面蜡质和老化涂层',
          '使用酒精或中性清洁剂清理表面灰尘、油污',
        ],
        coatingSystemConstruction: ['喷涂或刷涂水性木器改色漆（或雾感全屋改色漆）1-2遍'],
        advantages: ['工期短', '成本较低', '耐用', '易洁', '可个性化调色', '水性环保'],
        disadvantages: ['无'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-水性木器改色漆',
            id: 'ff47e010677218cb008646cc02a21216',
          },
          {
            name: '能系列-雾感全屋改色',
            id: 'af3da5c8672c4bd3002ed2ed7736ac67',
          },
        ],
      },
    ],
  },
];
export const steelSolutions = [
  {
    wallType: '铝合金',
    solutions: [
      {
        solutionName: '通用方案',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/steel/1-min.png`,
        baseTreatmentAndRepair: [
          '使用中性清洗剂或专用清洁剂清除油污、灰尘、霉斑等。必要时使用高压水枪。',
          '打磨除锈：对老化漆层、氧化层进行打磨，露出干净铝基面，打磨至无脱粉、无锈蚀。',
          '修补破损：若有凹坑、孔洞，用环氧腻子填平，待干后打磨平整。',
          '除油除尘：使用酒精或去脂剂彻底除油，并用清洁布擦净浮尘。',
        ],
        coatingSystemConstruction: ['喷涂或刷涂数码彩超能焕新漆1-2遍'],
        advantages: ['工期短', '成本较低', '耐用', '易洁', '可个性化调色', '水性环保'],
        disadvantages: ['无'],
        recommendedProducts: [
          {
            name: '辅材-强效去污膏',
            id: '2ed3518f686e863c04e797297a52eee6',
          },
          {
            name: '辅材-超能焕新漆',
            id: 'fbf3bf436864e7630455b3f86465e9fd',
          },
        ],
      },
    ],
  },
];
