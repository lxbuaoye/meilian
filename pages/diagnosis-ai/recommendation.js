export const exteriorWallSolutions = [
  {
    wallType: '马赛克面 / 瓷砖面',
    solutions: [
      {
        solutionName: '方案一（本方案适合现状是小面积空鼓修补）',
        baseTreatmentAndRepair: [
          {
            stepName: '检查空鼓与脱落区域',
            description: '敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          },
          {
            stepName: '清理表面污染物',
            description: '使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          },
          {
            stepName: '修补基层',
            description:
              '对铲除区域用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆填补并找平空缺区域。',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '防水', '抗碱', '耐用', '漆与砖面附着力高'],
        disadvantages: ['墙面不平整，能看到原来的缝隙状'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
        ],
      },
      {
        solutionName: '方案二（本方案适合现状是大面积空鼓及脱落）',
        baseTreatmentAndRepair: [
          {
            stepName: '检查空鼓与脱落区域',
            description: '敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          },
          {
            stepName: '清理表面污染物',
            description: '使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          },
          {
            stepName: '修补基层',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用', '墙面平整更美观'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
          { name: '外墙-铜墙单组份', id: 'af3da5c8672c5895003092ba586174c' },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        baseTreatmentAndRepair: [
          {
            stepName: '检查空鼓与脱落区域',
            description: '敲击检查是否有空鼓、松动、脱落区域，做标记，随后用工具铲除',
          },
          {
            stepName: '清理表面污染物',
            description: '使用高压水枪或清洁剂清洗墙面，去除油污、灰尘、藻类、水泥残留等，随后保持墙面干燥。',
          },
          {
            stepName: '修补基层',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
          },
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '仿石材效果更高端美观', '硬度高', '抗污效果好', '更耐用'],
        disadvantages: ['工期长', '成本高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-数码彩·石漆', id: 'af3da5c8672c5a170030bf2e6bbbbf41' },
          { name: '外墙-疏污面釉', id: '9fc3269d672dcaf7005cdbf5413ab9c2' },
          { name: '外墙-超耐候罩光面漆', id: '9fc3269d672c5c0900319dca7643b20e' },
        ],
      },
    ],
  },
  {
    wallType: '外墙涂料 / 真石漆旧墙 / 氟碳漆 / 浮雕漆 / 拉毛漆 / 水泥抹灰 / 其他',
    solutions: [
      {
        solutionName: '方案一',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          },
          {
            stepName: '原有涂层处理',
            description: '粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '墙面修补',
            description:
              '铲除的区域嵌填外墙专用柔性抗裂砂浆或耐水抗裂弹性腻子，此步骤需要根据实际环境情况进行淋水养护。',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '防水', '抗碱', '耐用'],
        disadvantages: ['墙面不平整，看到原基层凹凸面'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
        ],
      },
      {
        solutionName: '方案二',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          },
          {
            stepName: '原有涂层处理',
            description: '粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '墙面整体找平',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；用外墙专用找平腻子全墙面批刮1~2遍，打磨及淋水养护。',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用', '墙面平整更美观'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
          { name: '外墙-铜墙单组份', id: 'af3da5c8672c5895003092ba586174c' },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否粉化、空鼓、起皮、发霉、渗水。判断原涂层附着力，决定是否铲除。拍照记录病害区域，作为修复依据。',
          },
          {
            stepName: '原有涂层处理',
            description: '粉化严重或附着力差则铲除至牢固基层；若附着力良好：打磨清洁，保留原涂层',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '墙面整体找平',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；用外墙专用找平腻子全墙面批刮1~2遍，打磨及淋水养护。',
          },
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '仿石材效果更高端美观', '硬度高', '抗污效果好', '更耐用'],
        disadvantages: ['工期长', '成本高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-数码彩·石漆', id: 'af3da5c8672c5a170030bf2e6bbbbf41' },
          { name: '外墙-超耐候罩光面漆', id: '9fc3269d672c5c0900319dca7643b20e' },
          { name: '外墙-疏污面釉', id: '9fc3269d672dcaf7005cdbf5413ab9c2' },
        ],
      },
    ],
  },
  {
    wallType: '红砖墙',
    solutions: [
      {
        solutionName: '方案一',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description: '检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          },
          {
            stepName: '墙面修补',
            description: '使用防水抗裂砂浆或聚合物水泥全墙面找平，并淋水养护',
          },
          {
            stepName: '墙面找平',
            description: '使用外墙专用腻子找平，打磨，淋水养护',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '耐用', '现代风设计感'],
        disadvantages: ['无'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
        ],
      },
      {
        solutionName: '方案二（线条分格工艺仿石漆）',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description: '检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          },
          {
            stepName: '墙面修补',
            description: '使用防水抗裂砂浆或聚合物水泥全墙面找平，并淋水养护',
          },
        ],
        coatingSystemConstruction: [
          { stepName: '中性彩色基材满批', description: '' },
          { stepName: '水平定位贴美纹纸', description: '' },
          { stepName: '舒普底漆满刷', description: '（根据实际情况可选做）' },
          { stepName: '数码彩·石漆系列产品喷涂2遍', description: '' },
          { stepName: '撕美纹纸', description: '' },
          { stepName: '喷涂外墙罩光漆', description: '' },
          { stepName: '滚涂疏污面釉', description: '加强抗污能力' },
        ],
        advantages: ['工期较长', '防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿石效果美观典雅'],
        disadvantages: ['仿干挂大理石效果不够逼真'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '辅材-中性彩色基材', id: '5dc6258681880a402705d8c2e28c38d' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-数码彩·石漆', id: 'af3da5c8672c5a170030bf2e6bbbbf41' },
          { name: '外墙-超耐候罩光面漆', id: '9fc3269d672c5c0900319dca7643b20e' },
          { name: '外墙-疏污面釉', id: '9fc3269d672dcaf7005cdbf5413ab9c2' },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description: '检查是否有松动砖块、开裂、渗水、风化、白华（泛碱）等问题，判断是否需局部更换砖块或加固。',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢, 去除粉化物和风化层，确保新涂料附着良好。',
          },
          {
            stepName: '墙面修补',
            description: '使用防水抗裂砂浆或聚合物水泥修补裂缝、缺损处，并淋水养护',
          },
        ],
        coatingSystemConstruction: [
          { stepName: '用专用砂浆粘贴2cm以下发泡陶瓷平板', description: '' },
          { stepName: '滚涂发泡陶瓷专用底漆', description: '' },
          { stepName: '喷涂数码彩·石漆系列产品', description: '' },
          { stepName: '喷涂外墙罩面漆', description: '' },
          { stepName: '滚涂疏污面釉', description: '加强抗污能力' },
        ],
        advantages: ['防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿石效果逼真'],
        disadvantages: ['成本较高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '辅材-发泡陶瓷专用底漆', id: '50de7f5d67721a5503fb612b1abe712f' },
          { name: '外墙-数码彩·石漆', id: 'af3da5c8672c5a170030bf2e6bbbbf41' },
          { name: '外墙-超耐候罩光面漆', id: '9fc3269d672c5c0900319dca7643b20e' },
          { name: '外墙-疏污面釉', id: '9fc3269d672dcaf7005cdbf5413ab9c2' },
        ],
      },
    ],
  },
  {
    wallType: '洗石米墙',
    solutions: [
      {
        solutionName: '方案一',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '修补基层',
            description:
              '对铲除区域用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆填补并找平空缺区域。',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['工期短', '成本较低', '防水', '抗碱', '耐用', '现代风设计感'],
        disadvantages: ['墙面平整度不够，能看到原墙面基理纹路'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
        ],
      },
      {
        solutionName: '方案二（线条分格工艺仿石漆）',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '修补基层',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
          },
        ],
        coatingSystemConstruction: ['喷涂或滚涂铜墙铁壁防水抗碱外墙漆两遍'],
        advantages: ['防水', '抗碱', '耐用'],
        disadvantages: ['工期较长', '成本较高'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '外墙-舒普底漆', id: '7f296b21672c598d003118d32a89a9de' },
          { name: '外墙-铜墙双组份', id: '9c1e6a31672a35d0128e9631228ddc76' },
          { name: '外墙-铜墙单组份', id: 'af3da5c8672c5895003092ba586174c' },
        ],
      },
      {
        solutionName: '方案三（仿石效果更高端）',
        baseTreatmentAndRepair: [
          {
            stepName: '现场勘查与评估',
            description:
              '检查墙面是否有空鼓、开裂、粉化、脱落、霉斑等问题；评估原有洗石米层附着力，决定是否整体铲除或局部修复',
          },
          {
            stepName: '高压水枪冲洗墙面',
            description: '清除灰尘、藻类、油污、浮灰，避免施工附着不牢。',
          },
          {
            stepName: '修补基层',
            description:
              '全墙面用舒普底漆进行封闭处理，提高附着力；使用高强度找平砂浆或水泥基修补砂浆大面积填补并找平，建议整体刮涂耐水抗裂找平腻子1~2遍，此步骤需要根据实际环境情况进行淋水养护',
          },
        ],
        coatingSystemConstruction: [
          '根据业主审美需求做仿石漆工艺，可选黑线分格或凹槽工艺等，每个工艺及搭配效果需要的产品不同，请结合实际与推荐产品进行更深入沟通。',
        ],
        advantages: ['防水', '抗碱', '耐用', '抗污易洁', '耐水性强', '仿干挂石材效果逼真'],
        disadvantages: ['成本较高', '工期较长'],
        recommendedProducts: [
          { name: '辅材-舒普砂浆', id: '6c692678672c55de003186fb262a8d55' },
          { name: '辅材-发泡陶瓷专用底漆', id: '50de7f5d67721a5503fb612b1abe712f' },
          { name: '外墙-数码彩·石漆', id: 'af3da5c8672c5a170030bf2e6bbbbf41' },
          { name: '外墙-超耐候罩光面漆', id: '9fc3269d672c5c0900319dca7643b20e' },
          { name: '外墙-疏污面釉', id: '9fc3269d672dcaf7005cdbf5413ab9c2' },
        ],
      },
    ],
  },
];
