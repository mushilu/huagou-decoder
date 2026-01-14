// 建筑结构解码数据定义

export interface ComponentInfo {
  id: string
  name: string
  nameEn?: string
  function: string
  materials: string[]
  craftDetails: string
  historicalNotes?: string
  relatedComponents?: string[]
  order?: number
}

export interface StructureCategory {
  id: string
  name: string
  nameEn?: string
  description: string
  order: number
  components: ComponentInfo[]
}

export interface BuildingStructure {
  buildingId: string
  buildingName: string
  buildingNameEn?: string
  era: string
  overviewDescription: string
  svgDiagram: {
    overview: string // SVG代码
    crossSection?: string // 截面示意SVG
  }
  categories: StructureCategory[]
}

// 故宫太和殿结构配置
export const forbiddenCityStructure: BuildingStructure = {
  buildingId: 'forbidden-city',
  buildingName: '故宫太和殿',
  buildingNameEn: 'Hall of Supreme Harmony',
  era: '明清时期（1406年）',
  overviewDescription: '紫禁城中最大的木结构建筑，采用重檐歇山顶，金碧辉煌的黄琉璃瓦覆顶。整体采用中国古代最高级别的木结构体系，通过榫卯结构相连接，无钉无胶，展现了中国古代建筑的最高工艺水平。',
  categories: [
    {
      id: 'roof',
      name: '屋顶系统',
      nameEn: 'Roof System',
      description: '采用重檐歇山顶，是中国古代最高等级的屋顶形式，两层屋顶以金色琉璃瓦装饰，象征皇权至高无上。',
      order: 1,
      components: [
        {
          id: 'roof-tile',
          name: '琉璃瓦',
          nameEn: 'Glazed Tile',
          function: '防水、装饰、彰显身份',
          materials: ['陶土', '黄釉'],
          craftDetails: '采用手工烧制的琉璃瓦，黄色代表皇权。每块瓦都经过精心打磨和调整，确保排水效果完美。',
          historicalNotes: '明清两代都采用景德镇烧制的琉璃瓦，色泽金黄耀眼。',
          relatedComponents: ['roof-beam', 'roof-ridge'],
          order: 1
        },
        {
          id: 'roof-ridge',
          name: '屋脊装饰',
          nameEn: 'Roof Ridge Decoration',
          function: '防水密封、装饰美观',
          materials: ['琉璃件', '金属配件'],
          craftDetails: '脊上装饰众多琉璃小兽，象征威严。脊两端各有一条龙，中间是凤凰，周围环绕仙人走兽。',
          historicalNotes: '太和殿屋脊上的走兽数量最多（10个），是其他建筑无法比拟的。',
          order: 2
        },
        {
          id: 'roof-beam',
          name: '屋顶梁架',
          nameEn: 'Roof Truss',
          function: '承托屋顶重量，传递力量到下层',
          materials: ['楠木', '杉木'],
          craftDetails: '采用榫卯结构相连接，每根梁都经过精心选材和加工。梁的断面设计合理，既保证强度又不浪费材料。',
          historicalNotes: '使用云南或东南亚进口的优质木材，木质坚硬耐久。',
          relatedComponents: ['roof-tile', 'dougong'],
          order: 3
        }
      ]
    },
    {
      id: 'dougong',
      name: '斗拱系统',
      nameEn: 'Bracket Set System',
      description: '中国古代最精妙的木结构，由斗、拱、昂等小木件巧妙组合而成，既能承重，又能连接，是力学设计的典范。',
      order: 2,
      components: [
        {
          id: 'dou',
          name: '斗',
          nameEn: 'Dou (Square Block)',
          function: '力的传递点，承接上部重量并分散到下部',
          materials: ['楠木'],
          craftDetails: '呈方形，上下有凹陷以安放拱件。斗的尺寸和形状经过精心计算，以适应上下部件。',
          order: 1
        },
        {
          id: 'gong',
          name: '拱',
          nameEn: 'Gong (Curved Arm)',
          function: '连接和跨越，将竖向力转化为斜向力',
          materials: ['楠木'],
          craftDetails: '呈弧形或S形，两端插入斗中。拱的曲度精确计算，以获得最佳的受力性能。',
          historicalNotes: '太和殿的拱件层数多达9层，是现存建筑中最复杂的斗拱系统。',
          relatedComponents: ['ang', 'dou'],
          order: 2
        },
        {
          id: 'ang',
          name: '昂',
          nameEn: 'Ang (Cantilever)',
          function: '向前延伸，支撑飞檐，增加建筑的威严感',
          materials: ['楠木'],
          craftDetails: '向外倾斜的梁件，尖端上翘。通过巧妙的角度设计，既能承重又显得轻盈。',
          relatedComponents: ['gong'],
          order: 3
        }
      ]
    },
    {
      id: 'columns',
      name: '立柱系统',
      nameEn: 'Column System',
      description: '整个建筑的主要竖向支撑，通过石座、铜支座等装置与地面连接，确保整体稳定。',
      order: 3,
      components: [
        {
          id: 'main-column',
          name: '金柱',
          nameEn: 'Main Column',
          function: '建筑的主要承力柱，承担大部分重量',
          materials: ['楠木'],
          craftDetails: '由多根粗大的楠木组成，使用金属箍加强。柱子底部通过铜制的支座连接到石座。',
          historicalNotes: '太和殿有60根金柱，其中内部6根最粗，直径达1.1米。',
          relatedComponents: ['stone-base', 'copper-bracket'],
          order: 1
        },
        {
          id: 'auxiliary-column',
          name: '檐柱',
          nameEn: 'Eaves Column',
          function: '支撑飞檐，承载边缘部分重量',
          materials: ['楠木'],
          craftDetails: '比金柱略细，位于建筑外围，与斗拱系统密切配合。',
          order: 2
        },
        {
          id: 'stone-base',
          name: '石座',
          nameEn: 'Stone Base',
          function: '连接木柱与地面，分散压力，防止木柱腐烂',
          materials: ['汉白玉石'],
          craftDetails: '采用整块汉白玉雕刻而成，设有凹陷以安放金属支座。',
          historicalNotes: '设计精巧，既美观又实用，是石雕艺术的展现。',
          relatedComponents: ['main-column'],
          order: 3
        }
      ]
    },
    {
      id: 'beam-framework',
      name: '梁架系统',
      nameEn: 'Beam Framework',
      description: '横跨柱间的梁系统，通过榫卯结构相互连接，形成完整的水平骨架。',
      order: 4,
      components: [
        {
          id: 'main-beam',
          name: '大梁',
          nameEn: 'Main Beam',
          function: '水平跨越，承载整个建筑的重量',
          materials: ['楠木'],
          craftDetails: '体积巨大，由多根木料层叠组成。梁的断面设计精妙，既保证强度又节省材料。',
          historicalNotes: '太和殿最大的梁长度超过11米，重量达几吨。',
          relatedComponents: ['secondary-beam', 'dougong'],
          order: 1
        },
        {
          id: 'secondary-beam',
          name: '次梁',
          nameEn: 'Secondary Beam',
          function: '承托大梁，分散压力',
          materials: ['楠木'],
          craftDetails: '垂直于大梁放置，通过榫卯与大梁相连。',
          relatedComponents: ['main-beam', 'purlin'],
          order: 2
        },
        {
          id: 'purlin',
          name: '枋',
          nameEn: 'Purlin',
          function: '连接各梁件，增加整体刚度',
          materials: ['楠木'],
          craftDetails: '横贯于各梁之间，与梁件通过榫卯严丝合缝地连接。',
          relatedComponents: ['secondary-beam'],
          order: 3
        }
      ]
    },
    {
      id: 'joinery',
      name: '榫卯工艺',
      nameEn: 'Tenon and Mortise Joinery',
      description: '中国古代建筑的灵魂技艺，通过精确的榫卯结构实现无钉无胶的完美连接。',
      order: 5,
      components: [
        {
          id: 'mortise-tenon',
          name: '榫卯连接',
          nameEn: 'Mortise and Tenon Joint',
          function: '无钉无胶连接各木料，承受剪切力和拉力',
          materials: ['楠木'],
          craftDetails: '一木件凸出部分（榫）插入另一木件凹入部分（卯）。尺寸精确到毫米，完全靠木料本身的摩擦力维持连接。',
          historicalNotes: '太和殿内部有数千处榫卯连接，每处都经过工匠的精心制作。',
          relatedComponents: ['beam-framework', 'columns'],
          order: 1
        },
        {
          id: 'lap-joint',
          name: '搭接',
          nameEn: 'Lap Joint',
          function: '两根梁在同一水平面上叠合，增加接触面积',
          materials: ['楠木'],
          craftDetails: '两根梁相交处，各挖去一半，使其完全贴合。这种设计既节省木料又保证强度。',
          order: 2
        },
        {
          id: 'dovetail',
          name: '燕尾榫',
          nameEn: 'Dovetail Joint',
          function: '防止木件沿长度方向分离',
          materials: ['楠木'],
          craftDetails: '榫头呈燕尾形，卯窝相应为凹形。这种关键部位的设计确保了长期的稳定性。',
          order: 3
        }
      ]
    },
    {
      id: 'platform',
      name: '台基系统',
      nameEn: 'Platform System',
      description: '建筑的基础，采用三层汉白玉台基，象征从凡间到天堂的升华。',
      order: 6,
      components: [
        {
          id: 'upper-platform',
          name: '上台基',
          nameEn: 'Upper Platform',
          function: '直接承托木结构建筑，防止浸水',
          materials: ['汉白玉石'],
          craftDetails: '光滑的石面设有排水沟，确保雨水能快速排走。',
          order: 1
        },
        {
          id: 'middle-platform',
          name: '中台基',
          nameEn: 'Middle Platform',
          function: '过渡和装饰',
          materials: ['汉白玉石', '青石'],
          craftDetails: '装饰有复杂的石雕纹样，包括云纹、龙纹等，彰显皇权。',
          historicalNotes: '台基周围栏杆采用整块石头精心雕刻，每块都是艺术品。',
          relatedComponents: ['balusters'],
          order: 2
        },
        {
          id: 'lower-platform',
          name: '下台基',
          nameEn: 'Lower Platform',
          function: '主要的装饰层，支撑中层',
          materials: ['汉白玉石'],
          craftDetails: '平面最大，设有石狮、望柱等装饰，形成庄严肃穆的氛围。',
          relatedComponents: ['stone-base'],
          order: 3
        },
        {
          id: 'balusters',
          name: '栏杆',
          nameEn: 'Balustrade',
          function: '安全防护，装饰美观',
          materials: ['汉白玉石'],
          craftDetails: '由数百根石柱和横梁组成，每根都经过精心雕刻和打磨。',
          historicalNotes: '台基周围的栏杆共有1400多根，是中国现存最精美的石雕艺术作品之一。',
          relatedComponents: ['middle-platform'],
          order: 4
        }
      ]
    }
  ],
  svgDiagram: {
    overview: `<svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f0f8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5f5f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1000" height="600" fill="url(#skyGradient)"/>

  <!-- 台基 -->
  <rect x="150" y="400" width="700" height="80" fill="#d4d4c8" stroke="#999" stroke-width="2" data-component="platform"/>
  <rect x="150" y="420" width="700" height="20" fill="#c0c0b8" stroke="#999" stroke-width="1"/>
  <rect x="150" y="450" width="700" height="20" fill="#b0b0a8" stroke="#999" stroke-width="1"/>

  <!-- 栏杆 -->
  <line x1="140" y1="400" x2="140" y2="380" stroke="#999" stroke-width="2"/>
  <line x1="860" y1="400" x2="860" y2="380" stroke="#999" stroke-width="2"/>
  <line x1="140" y1="380" x2="860" y2="380" stroke="#999" stroke-width="2"/>

  <!-- 立柱 -->
  <rect x="200" y="340" width="30" height="80" fill="#8b7355" stroke="#5c4033" stroke-width="2" data-component="columns"/>
  <rect x="400" y="320" width="35" height="100" fill="#8b7355" stroke="#5c4033" stroke-width="2" data-component="columns"/>
  <rect x="600" y="320" width="35" height="100" fill="#8b7355" stroke="#5c4033" stroke-width="2" data-component="columns"/>
  <rect x="800" y="340" width="30" height="80" fill="#8b7355" stroke="#5c4033" stroke-width="2" data-component="columns"/>

  <!-- 梁架 -->
  <rect x="170" y="310" width="680" height="20" fill="#a0826d" stroke="#5c4033" stroke-width="2" data-component="beam-framework"/>
  <rect x="170" y="280" width="680" height="20" fill="#b09080" stroke="#5c4033" stroke-width="2" data-component="beam-framework"/>

  <!-- 斗拱 -->
  <circle cx="250" cy="280" r="20" fill="none" stroke="#d4af37" stroke-width="3" data-component="dougong"/>
  <circle cx="450" cy="280" r="22" fill="none" stroke="#d4af37" stroke-width="3" data-component="dougong"/>
  <circle cx="650" cy="280" r="22" fill="none" stroke="#d4af37" stroke-width="3" data-component="dougong"/>
  <circle cx="850" cy="280" r="20" fill="none" stroke="#d4af37" stroke-width="3" data-component="dougong"/>

  <!-- 屋顶梁 -->
  <polygon points="200,250 800,250 750,180 250,180" fill="#c8860b" stroke="#8b6007" stroke-width="2" data-component="roof-beam"/>

  <!-- 屋顶 -->
  <path d="M 150 200 Q 500 80 850 200" fill="#ffd700" stroke="#d4af37" stroke-width="3" data-component="roof-tile"/>
  <path d="M 150 200 Q 500 120 850 200" fill="#ffed4e" stroke="#d4af37" stroke-width="2" data-component="roof-tile"/>

  <!-- 屋脊 -->
  <polygon points="500,80 520,100 480,100" fill="#d4af37" stroke="#8b6007" stroke-width="2" data-component="roof-ridge"/>
  <circle cx="500" cy="85" r="8" fill="#ffd700" stroke="#d4af37" stroke-width="1"/>

  <!-- 标注 -->
  <text x="500" y="550" text-anchor="middle" font-size="16" font-family="serif" font-weight="bold" fill="#333">故宫太和殿结构示意</text>
  <text x="100" y="310" font-size="11" font-family="serif" fill="#666">屋顶</text>
  <text x="100" y="280" font-size="11" font-family="serif" fill="#d4af37">斗拱</text>
  <text x="100" y="310" font-size="11" font-family="serif" fill="#666">梁架</text>
  <text x="100" y="360" font-size="11" font-family="serif" fill="#8b7355">立柱</text>
  <text x="100" y="450" font-size="11" font-family="serif" fill="#999">台基</text>
</svg>`
  }
}

// 赵州桥结构配置
export const zhaoZhouBridgeStructure: BuildingStructure = {
  buildingId: 'zhaozhou-bridge',
  buildingName: '赵州桥',
  buildingNameEn: 'Zhaozhou Bridge',
  era: '隋代（600年）',
  overviewDescription: '世界上现存最古老的石拱桥，跨度37米，采用独特的敞肩拱设计，不仅减轻了桥身重量，还增加了泄洪能力。整座桥没有一根铁钉，完全依靠榫卯结构和石头的自身重力相互支撑，是古代石工艺的杰作。',
  categories: [
    {
      id: 'main-arch',
      name: '主拱结构',
      nameEn: 'Main Arch',
      description: '整座桥的核心承载结构，由28段石拱环相叠而成，拱石紧密咬合。',
      order: 1,
      components: [
        {
          id: 'arch-stone',
          name: '拱石',
          nameEn: 'Arch Stone',
          function: '组成拱圈，承担桥面和车流的全部重量',
          materials: ['灰白色花岗岩'],
          craftDetails: '每块石头约25厘米长，两端呈契形，使其完全贴合成圆弧。没有使用任何胶水或钉子，完全依靠石头的重力相互咬合。',
          historicalNotes: '这种设计在1400多年前就已经出现，远早于西方同类建筑。',
          relatedComponents: ['arch-ring'],
          order: 1
        },
        {
          id: 'arch-ring',
          name: '拱圈',
          nameEn: 'Arch Ring',
          function: '由多层拱石组成，共同形成承重拱圈',
          materials: ['花岗岩'],
          craftDetails: '28段石头层层相叠，形成完整的圆形拱圈。每一层都与下一层紧密衔接，力的分散十分均匀。',
          relatedComponents: ['arch-stone', 'spandrel-wall'],
          order: 2
        }
      ]
    },
    {
      id: 'spandrel-arch',
      name: '敞肩拱',
      nameEn: 'Open Spandrel',
      description: '赵州桥最创新的设计，在两端各开两个小拱，大大减轻了桥身自重，提高了泄洪能力。',
      order: 2,
      components: [
        {
          id: 'secondary-arch',
          name: '次拱',
          nameEn: 'Secondary Arch',
          function: '减轻桥身重量，增加泄洪面积',
          materials: ['花岗岩'],
          craftDetails: '每个次拱跨度约为3.8米，与主拱有机相连。设计巧妙地利用了拱的力学原理。',
          historicalNotes: '这种设计比同时代欧洲的桥梁早出现约1000年。',
          relatedComponents: ['main-arch', 'spandrel-wall'],
          order: 1
        },
        {
          id: 'spandrel-wall',
          name: '桥台',
          nameEn: 'Spandrel Wall',
          function: '连接次拱和主拱，传递力量',
          materials: ['花岗岩'],
          craftDetails: '由多层石头砌成，与拱圈相连，形成统一的整体。',
          relatedComponents: ['secondary-arch', 'bridge-deck'],
          order: 2
        }
      ]
    },
    {
      id: 'bridge-deck',
      name: '桥面',
      nameEn: 'Bridge Deck',
      description: '车流和行人的直接承载面，由厚重的青石板铺设，经历1400多年仍然坚实。',
      order: 3,
      components: [
        {
          id: 'deck-stone',
          name: '桥面石',
          nameEn: 'Deck Stone',
          function: '直接承载车流和行人的重量',
          materials: ['青石'],
          craftDetails: '石板厚度约0.7米，表面光滑但有防滑纹理。每块石板都经过精心打磨。',
          historicalNotes: '中间的石板因为是主要受力位置，磨损最严重，呈现出明显的凹陷，但仍然坚硬如初。',
          relatedComponents: ['guardrail'],
          order: 1
        },
        {
          id: 'guardrail',
          name: '栏杆',
          nameEn: 'Guardrail',
          function: '安全防护，防止行人跌落',
          materials: ['花岗岩'],
          craftDetails: '由石柱和横梁组成，精心雕刻有各种花纹和图案。',
          historicalNotes: '桥上的栏杆已有多处损坏，但从残存的部分仍可看出原来的精美设计。',
          relatedComponents: ['deck-stone'],
          order: 2
        }
      ]
    },
    {
      id: 'pier-foundation',
      name: '桥墩与基础',
      nameEn: 'Pier and Foundation',
      description: '支撑整座桥的基础结构，通过精心计算的形状承受水流冲击和桥身重量。',
      order: 4,
      components: [
        {
          id: 'pier-head',
          name: '桥墩',
          nameEn: 'Pier',
          function: '支撑上部结构，承受所有重量',
          materials: ['花岗岩'],
          craftDetails: '桥墩呈流线型，前端尖锐以减少水流阻力，后端宽阔以增加稳定性。',
          historicalNotes: '赵州桥的桥墩设计考虑到了水流动力学，这在1400多年前是革命性的。',
          order: 1
        },
        {
          id: 'foundation',
          name: '基础',
          nameEn: 'Foundation',
          function: '将桥墩的力传递到土壤，确保整体稳定',
          materials: ['花岗岩', '石灰浆'],
          craftDetails: '基础深度达到地下，采用夯实的方式确保坚实。',
          relatedComponents: ['pier-head'],
          order: 2
        }
      ]
    }
  ],
  svgDiagram: {
    overview: `<svg viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <defs>
    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#b3e5fc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#81d4fa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1000" height="250" fill="#e8f4f8"/>
  <rect y="250" width="1000" height="150" fill="url(#waterGradient)"/>

  <!-- 水流纹 -->
  <path d="M 100 300 Q 200 290 300 310" stroke="#4fc3f7" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M 200 320 Q 350 310 500 330" stroke="#4fc3f7" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M 400 290 Q 600 300 800 310" stroke="#4fc3f7" stroke-width="1" fill="none" opacity="0.5"/>

  <!-- 桥墩 -->
  <polygon points="300,250 320,250 330,350 290,350" fill="#a89968" stroke="#6d5d47" stroke-width="2" data-component="pier-foundation"/>
  <polygon points="680,250 700,250 710,350 670,350" fill="#a89968" stroke="#6d5d47" stroke-width="2" data-component="pier-foundation"/>

  <!-- 基础 -->
  <rect x="280" y="350" width="80" height="30" fill="#8b7355" stroke="#5c4033" stroke-width="1"/>
  <rect x="660" y="350" width="80" height="30" fill="#8b7355" stroke="#5c4033" stroke-width="1"/>

  <!-- 主拱 -->
  <path d="M 300 250 Q 500 80 700 250" fill="none" stroke="#999" stroke-width="8" data-component="main-arch"/>
  <path d="M 305 245 Q 500 90 695 245" fill="none" stroke="#aaa" stroke-width="6" data-component="main-arch"/>

  <!-- 敞肩拱 -->
  <path d="M 320 230 Q 380 140 440 230" fill="none" stroke="#d4af37" stroke-width="4" data-component="spandrel-arch"/>
  <path d="M 560 230 Q 620 140 680 230" fill="none" stroke="#d4af37" stroke-width="4" data-component="spandrel-arch"/>

  <!-- 桥面 -->
  <rect x="300" y="240" width="400" height="20" fill="#a0a090" stroke="#666" stroke-width="2" data-component="bridge-deck"/>

  <!-- 栏杆 -->
  <line x1="300" y1="238" x2="300" y2="200" stroke="#999" stroke-width="2"/>
  <line x1="700" y1="238" x2="700" y2="200" stroke="#999" stroke-width="2"/>
  <line x1="300" y1="200" x2="700" y2="200" stroke="#999" stroke-width="2"/>

  <!-- 标注 -->
  <text x="500" y="30" text-anchor="middle" font-size="16" font-family="serif" font-weight="bold" fill="#333">赵州桥结构示意</text>
  <text x="450" y="100" font-size="12" font-family="serif" fill="#666">主拱跨度：37米</text>
  <text x="350" y="160" font-size="10" font-family="serif" fill="#d4af37">敞肩拱</text>
  <text x="600" y="160" font-size="10" font-family="serif" fill="#d4af37">敞肩拱</text>
  <text x="500" y="290" font-size="11" font-family="serif" fill="#666">桥面</text>
  <text x="350" y="370" font-size="10" font-family="serif" fill="#6d5d47">桥墩</text>
  <text x="700" y="370" font-size="10" font-family="serif" fill="#6d5d47">桥墩</text>
</svg>`
  }
}

// 平遥古城结构配置
export const pingyaoStructure: BuildingStructure = {
  buildingId: 'pingyao-ancient-city',
  buildingName: '平遥古城',
  buildingNameEn: 'Pingyao Ancient City',
  era: '明清时期（1370年）',
  overviewDescription: '世界上保存最完整的古城之一，占地2.25平方公里，城墙周长6.5公里。整个城市按照中国古代的城市规划理念设计，街道呈棋盘式布局，四条大街分别对应"仁义礼智"，展现了古代哲学思想的建筑体现。',
  categories: [
    {
      id: 'city-wall',
      name: '城墙系统',
      nameEn: 'City Wall System',
      description: '环绕整个古城的防御体系，包括城墙、城门、瓮城等多个组成部分。',
      order: 1,
      components: [
        {
          id: 'wall-body',
          name: '城墙',
          nameEn: 'City Wall',
          function: '防御和保护，象征城市的边界和威严',
          materials: ['砖', '夯土'],
          craftDetails: '由青砖砌成的外层和夯土组成的内层构成。城墙高达10米，厚度约5米，采用"三七开"的夯土法加固。',
          historicalNotes: '平遥城墙是中国现存最完整的明清古城墙。',
          relatedComponents: ['city-gate', 'watchtower'],
          order: 1
        },
        {
          id: 'city-gate',
          name: '城门',
          nameEn: 'City Gate',
          function: '控制出入，管理交通',
          materials: ['砖', '木材'],
          craftDetails: '四个主要城门分别朝向东南西北。门洞采用拱形设计，门楼采用传统的歇山顶建筑。',
          historicalNotes: '平遥有6个城门，其中4个是主要城门，2个是便门。',
          relatedComponents: ['wall-body', 'gate-tower'],
          order: 2
        },
        {
          id: 'gate-tower',
          name: '城门楼',
          nameEn: 'Gate Tower',
          function: '军事防御，瞭望和指挥',
          materials: ['砖', '木材'],
          craftDetails: '两层木结构建筑，上层设有射击孔，下层是门洞。采用传统的木构架系统。',
          relatedComponents: ['city-gate'],
          order: 3
        },
        {
          id: 'watchtower',
          name: '城楼',
          nameEn: 'Watchtower',
          function: '观察和预警',
          materials: ['砖', '木材'],
          craftDetails: '每隔一段城墙就建立一个城楼，用于观察城外动静。城楼内部设有螺旋式楼梯。',
          relatedComponents: ['wall-body'],
          order: 4
        }
      ]
    },
    {
      id: 'street-network',
      name: '街道系统',
      nameEn: 'Street Network',
      description: '棋盘式的街道布局，主要街道为"四大街"，象征"仁义礼智"四德。',
      order: 2,
      components: [
        {
          id: 'main-street',
          name: '主街',
          nameEn: 'Main Street',
          function: '主要的商业和交通通道',
          materials: ['青石板'],
          craftDetails: '宽度约8-10米，用整块青石板铺设，中间有排水沟。经历几百年仍然坚硬如初。',
          historicalNotes: '四条主街形成十字，中间是古城的商业中心。',
          relatedComponents: ['secondary-street'],
          order: 1
        },
        {
          id: 'secondary-street',
          name: '副街',
          nameEn: 'Secondary Street',
          function: '分散交通和连接各区域',
          materials: ['砖'],
          craftDetails: '宽度约4-6米，由青砖铺设，为城市提供良好的交通网络。',
          relatedComponents: ['main-street'],
          order: 2
        }
      ]
    },
    {
      id: 'traditional-building',
      name: '民居建筑',
      nameEn: 'Traditional Dwelling',
      description: '古城内保存的大量传统民居，展现了晋商文化和建筑工艺。',
      order: 3,
      components: [
        {
          id: 'courtyard-house',
          name: '四合院',
          nameEn: 'Courtyard House',
          function: '住宅，象征传统家庭结构',
          materials: ['砖', '木材', '石头'],
          craftDetails: '由四栋建筑围成一个中心庭院，中间是天井用于采光和排水。',
          historicalNotes: '平遥的四合院设计特别注重风水和对称，体现了古代的哲学思想。',
          relatedComponents: ['gate-pavilion', 'living-quarters'],
          order: 1
        },
        {
          id: 'gate-pavilion',
          name: '门楼',
          nameEn: 'Gate Pavilion',
          function: '家族身份的象征，控制进出',
          materials: ['砖', '木材'],
          craftDetails: '精美的砖雕和木雕装饰，反映了主人的社会地位。',
          relatedComponents: ['courtyard-house'],
          order: 2
        },
        {
          id: 'living-quarters',
          name: '居住室',
          nameEn: 'Living Quarters',
          function: '起居和工作',
          materials: ['砖', '木材'],
          craftDetails: '采用传统的木构架系统，窗户和门都经过精心设计，既实用又美观。',
          relatedComponents: ['courtyard-house'],
          order: 3
        }
      ]
    },
    {
      id: 'commercial-district',
      name: '商业区',
      nameEn: 'Commercial District',
      description: '古城的商业中心，集中了大量的商铺和会馆。',
      order: 4,
      components: [
        {
          id: 'shop-house',
          name: '商铺',
          nameEn: 'Shop',
          function: '商业活动的场所',
          materials: ['砖', '木材'],
          craftDetails: '一楼为商铺，上楼为住宅或仓库。商铺门面宽敞，便于展示商品。',
          historicalNotes: '平遥是晋商的重要中心，保留了大量的历史商铺。',
          relatedComponents: ['residential-area'],
          order: 1
        },
        {
          id: 'guild-hall',
          name: '会馆',
          nameEn: 'Guild Hall',
          function: '商人的聚集地和活动中心',
          materials: ['砖', '木材', '石头'],
          craftDetails: '规模大，装饰精美，包括戏台、厅堂等多个功能区域。',
          historicalNotes: '平遥有多个行业的会馆，如山西会馆、日升昌会馆等，是研究晋商文化的重要场所。',
          order: 2
        }
      ]
    },
    {
      id: 'religious-building',
      name: '宗教建筑',
      nameEn: 'Religious Building',
      description: '寺庙、庙宇等宗教场所，体现了古代的信仰文化。',
      order: 5,
      components: [
        {
          id: 'temple',
          name: '寺庙',
          nameEn: 'Temple',
          function: '宗教活动和精神寄托',
          materials: ['砖', '木材'],
          craftDetails: '采用传统的寺庙建筑布局，包括山门、大殿、配殿等。',
          historicalNotes: '平遥的寺庙众多，其中城隍庙和日升昌的义庄都是著名的宗教建筑。',
          relatedComponents: ['main-hall', 'side-hall'],
          order: 1
        },
        {
          id: 'main-hall',
          name: '大殿',
          nameEn: 'Main Hall',
          function: '宗教仪式的主要场所',
          materials: ['砖', '木材'],
          craftDetails: '规模最大，采用飞檐翘角的设计，装饰华丽。',
          relatedComponents: ['temple'],
          order: 2
        }
      ]
    }
  ],
  svgDiagram: {
    overview: `<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="800" height="800" fill="#f5e6d3"/>

  <!-- 城墙 -->
  <rect x="50" y="50" width="700" height="700" fill="none" stroke="#8b6f47" stroke-width="15" data-component="city-wall"/>

  <!-- 城门 -->
  <rect x="385" y="40" width="30" height="20" fill="#6d5d47" stroke="#4a4236" stroke-width="1"/>
  <text x="400" y="70" text-anchor="middle" font-size="10" font-family="serif" fill="#333">北门</text>

  <rect x="765" y="385" width="20" height="30" fill="#6d5d47" stroke="#4a4236" stroke-width="1"/>
  <text x="790" y="405" font-size="10" font-family="serif" fill="#333">东门</text>

  <rect x="385" y="760" width="30" height="20" fill="#6d5d47" stroke="#4a4236" stroke-width="1"/>
  <text x="400" y="795" text-anchor="middle" font-size="10" font-family="serif" fill="#333">南门</text>

  <rect x="30" y="385" width="20" height="30" fill="#6d5d47" stroke="#4a4236" stroke-width="1"/>
  <text x="20" y="405" text-anchor="end" font-size="10" font-family="serif" fill="#333">西门</text>

  <!-- 城楼 -->
  <circle cx="400" cy="55" r="6" fill="#8b6f47"/>
  <circle cx="770" cy="400" r="6" fill="#8b6f47"/>
  <circle cx="400" cy="780" r="6" fill="#8b6f47"/>
  <circle cx="45" cy="400" r="6" fill="#8b6f47"/>

  <!-- 主街（十字） -->
  <line x1="400" y1="100" x2="400" y2="700" stroke="#d4c5a9" stroke-width="12" data-component="street-network"/>
  <line x1="100" y1="400" x2="700" y2="400" stroke="#d4c5a9" stroke-width="12" data-component="street-network"/>

  <!-- 副街网络 -->
  <line x1="250" y1="100" x2="250" y2="700" stroke="#e8d9c3" stroke-width="6"/>
  <line x1="550" y1="100" x2="550" y2="700" stroke="#e8d9c3" stroke-width="6"/>
  <line x1="100" y1="250" x2="700" y2="250" stroke="#e8d9c3" stroke-width="6"/>
  <line x1="100" y1="550" x2="700" y2="550" stroke="#e8d9c3" stroke-width="6"/>

  <!-- 主要建筑区（用矩形代表） -->
  <!-- 北区 -->
  <rect x="150" y="120" width="80" height="80" fill="#d4b5a0" stroke="#8b6f47" stroke-width="1" data-component="traditional-building"/>
  <rect x="570" y="120" width="80" height="80" fill="#d4b5a0" stroke="#8b6f47" stroke-width="1" data-component="traditional-building"/>

  <!-- 中区 -->
  <rect x="280" y="280" width="80" height="80" fill="#c9a485" stroke="#8b6f47" stroke-width="1" data-component="commercial-district"/>
  <rect x="440" y="280" width="80" height="80" fill="#c9a485" stroke="#8b6f47" stroke-width="1" data-component="commercial-district"/>

  <!-- 南区 -->
  <rect x="150" y="600" width="80" height="80" fill="#d4b5a0" stroke="#8b6f47" stroke-width="1" data-component="traditional-building"/>
  <rect x="570" y="600" width="80" height="80" fill="#d4b5a0" stroke="#8b6f47" stroke-width="1" data-component="traditional-building"/>

  <!-- 宗教建筑 -->
  <polygon points="400,300 430,350 370,350" fill="#c89666" stroke="#8b6f47" stroke-width="2" data-component="religious-building"/>
  <text x="400" y="390" text-anchor="middle" font-size="9" font-family="serif" fill="#666">庙宇</text>

  <!-- 标注 -->
  <text x="400" y="30" text-anchor="middle" font-size="16" font-family="serif" font-weight="bold" fill="#333">平遥古城平面图</text>
  <text x="70" y="795" font-size="11" font-family="serif" fill="#333">城墙周长：6.5公里</text>
  <text x="70" y="810" font-size="11" font-family="serif" fill="#333">保存最完整的明清古城</text>
</svg>`
  }
}

// 导出所有建筑结构配置
export const buildingStructures: Record<string, BuildingStructure> = {
  'forbidden-city': forbiddenCityStructure,
  'zhaozhou-bridge': zhaoZhouBridgeStructure,
  'pingyao-ancient-city': pingyaoStructure
}

// 根据建筑ID获取结构配置
export function getStructureConfig(buildingId: string): BuildingStructure | undefined {
  return buildingStructures[buildingId]
}

// 获取所有可用的结构配置
export function getAllStructureConfigs(): BuildingStructure[] {
  return Object.values(buildingStructures)
}
