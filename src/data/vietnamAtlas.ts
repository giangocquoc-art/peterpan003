/**
 * vietnamAtlas.ts — Comprehensive data model for Vietnam's provincial-level administrative units
 *
 * P-ShareHub: Interactive Vietnam Atlas
 * Based on 2025 administrative restructuring (Resolution 60-NQ/TW)
 * 34 provincial-level units + Hoàng Sa & Trường Sa archipelago entries
 *
 * All content is in Vietnamese and uses real historical/cultural information.
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

export type RegionType = 'north' | 'central' | 'south' | 'highlands' | 'islands'
export type UnitType = 'city' | 'province' | 'archipelago'

export interface VietnamPlace {
  id: string
  slug: string
  name: string
  type: UnitType
  region: RegionType
  coordinates: [number, number] // [lat, lng]
  shortDescription: string
  icon: string // emoji
  accentColor: string
  tags: string[]
  historyHighlights: string[]
  notableHeroes: Array<{ name: string; period: string; shortDescription: string }>
  landmarks: Array<{ name: string; shortDescription: string }>
  foods: Array<{ name: string; shortDescription: string }>
  cultureNotes: string[]
  suggestedLearningQuestions: string[]
  relatedPlaces: string[] // slugs
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772]

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getPlaceBySlug(slug: string): VietnamPlace | undefined {
  return vietnamAtlas.find((place) => place.slug === slug)
}

export function getPlacesByRegion(region: RegionType): VietnamPlace[] {
  return vietnamAtlas.filter((place) => place.region === region)
}

// ─── Data: North Region (Bắc Bộ) ────────────────────────────────────────────

const northPlaces: VietnamPlace[] = [
  // ★★★ RICH ENTRY: Hà Nội ★★★
  {
    id: '1',
    slug: 'ha-noi',
    name: 'Hà Nội',
    type: 'city',
    region: 'north',
    coordinates: [21.0285, 105.8542],
    shortDescription:
      'Thủ đô ngàn năm văn hiến, trái tim của cả nước, nơi hội tụ di sản lịch sử và văn hóa Việt Nam.',
    icon: '🏛️',
    accentColor: '#C41E3A',
    tags: ['thủ đô', 'văn hiến', 'di sản', 'lịch sử', 'ăn uống'],
    historyHighlights: [
      'Năm 1010, Lý Thái Tổ dời đô từ Hoa Lư về Đại La và đổi tên thành Thăng Long, mở đầu cho ngàn năm văn hiến.',
      'Văn Miếu - Quốc Tử Giám được xây dựng năm 1070 dưới triều Lý, là trường đại học đầu tiên của Việt Nam.',
      'Hà Nội từng là thủ phủ của toàn xứ Bắc Kỳ dưới thời Pháp thuộc, chứng kiến nhiều sự kiện lịch sử quan trọng.',
      'Ngày 10/10/1954, Hà Nội được giải phóng, quân đội Nhân dân Việt Nam tiến về tiếp quản thủ đô.',
    ],
    notableHeroes: [
      {
        name: 'Lý Thái Tổ',
        period: '974–1028',
        shortDescription: 'Vua sáng lập triều Lý, người quyết định dời đô về Thăng Long năm 1010.',
      },
      {
        name: 'Nguyễn Trãi',
        period: '1380–1442',
        shortDescription: 'Danh nhân văn hóa thế giới, tác giả Bình Ngô Đại Cáo, quân sư của Lê Lợi.',
      },
      {
        name: 'Hồ Chí Minh',
        period: '1890–1969',
        shortDescription: 'Lãnh tụ dân tộc, đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình ngày 2/9/1945.',
      },
    ],
    landmarks: [
      { name: 'Văn Miếu - Quốc Tử Giám', shortDescription: 'Trường đại học đầu tiên Việt Nam, biểu tượng tri thức và văn hiến.' },
      { name: 'Hồ Gươm (Hồ Hoàn Kiếm)', shortDescription: 'Trái tim Hà Nội, gắn với truyền thuyết Lê Lợi trả gươm cho Rùa Vàng.' },
      { name: 'Hoàng Thành Thăng Long', shortDescription: 'Di tích khảo cổ thế giới, trung tâm quyền lực từ thời Lý đến thời Nguyễn.' },
      { name: 'Chùa Một Cột', shortDescription: 'Biểu tượng Hà Nội ngàn năm, kiến trúc độc đáo hình hoa sen.' },
    ],
    foods: [
      { name: 'Phở Hà Nội', shortDescription: 'Món quốc hồn quốc túy, nước dùng trong, bánh phở mềm, thơm vị hồi gừng.' },
      { name: 'Bún chả', shortDescription: 'Thịt nướng than hoa thơm lừng, chấm nước mắm chua ngọt, ăn kèm bún và rau sống.' },
      { name: 'Chả cá Lã Vọng', shortDescription: 'Cá lăng xào nghệ với thì là, món đặc sản trứ danh của Hà Thành.' },
      { name: 'Bánh cuốn Thanh Trì', shortDescription: 'Bánh mỏng trắng ngần, nhân mộc nhĩ thịt, chấm nước mắm chua ngọt.' },
    ],
    cultureNotes: [
      'Hà Nội nổi tiếng với văn hóa 36 phố phường, mỗi phố mang một nghề truyền thống riêng biệt.',
      'Trà đá vỉa hè và cà phê trứng là nét văn hóa đặc trưng không thể thiếu của người Hà Nội.',
    ],
    suggestedLearningQuestions: [
      'Tại sao Lý Thái Tổ quyết định dời đô từ Hoa Lư về Thăng Long?',
      'Truyền thuyết Hồ Gươm phản ánh khát vọng gì của dân tộc Việt Nam?',
      'Văn Miếu - Quốc Tử Giám có ý nghĩa gì đối với truyền thống hiếu học của người Việt?',
    ],
    relatedPlaces: ['phu-tho', 'ninh-binh', 'hai-phong'],
  },

  // ★★★ RICH ENTRY: Hải Phòng ★★★
  {
    id: '2',
    slug: 'hai-phong',
    name: 'Hải Phòng',
    type: 'city',
    region: 'north',
    coordinates: [20.8449, 106.6881],
    shortDescription:
      'Thành phố cảng lớn nhất miền Bắc, đô thị-type hải quân quan trọng, nổi tiếng với hoa phượng đỏ và hải sản tươi sống.',
    icon: '🚢',
    accentColor: '#E63946',
    tags: ['cảng biển', 'hoa phượng', 'hải sản', 'đô thị'],
    historyHighlights: [
      'Hải Phòng là cảng biển quan trọng từ thời phong kiến, được người Pháp phát triển thành cảng thương mại lớn đầu thế kỷ 20.',
      'Trong chiến tranh, Hải Phòng chịu nhiều đợt oanh tạc, đặc biệt sự kiện 23/11/1946 khi quân Pháp nổ súng chiếm thành phố.',
      'Năm 2025, Hải Phòng sáp nhập với tỉnh Hải Dương theo Nghị quyết 60-NQ/TW.',
    ],
    notableHeroes: [
      {
        name: 'Nguyễn Bỉnh Khiêm',
        period: '1491–1585',
        shortDescription: 'Trạng Trình - nhà tiên tri, nhà thơ lỗi lạc, sinh tại Vĩnh Bảo, Hải Phòng.',
      },
      {
        name: 'Đỗ Động',
        period: '?–1285',
        shortDescription: 'Danh tướng thời Trần, hy sinh trong kháng chiến chống Nguyên Mông tại Hải Phòng.',
      },
      {
        name: 'Nguyễn Đức Cảnh',
        period: '1908–1932',
        shortDescription: 'Người sáng lập tổ chức Cộng sản đầu tiên ở Hải Phòng, lãnh đạo phong trào công nhân.',
      },
    ],
    landmarks: [
      { name: 'Đảo Cát Bà', shortDescription: 'Khu dự trữ thiên nhiên thế giới, vườn quốc gia với hệ sinh thái đa dạng.' },
      { name: 'Bãi biển Đồ Sơn', shortDescription: 'Bãi biển nổi tiếng miền Bắc, nơi diễn ra Lễ hội chọi trưa Đồ Sơn.' },
      { name: 'Chùa Dư Hàng', shortDescription: 'Ngôi chùa cổ hơn 1000 năm, gắn liền với lịch sử Phật giáo vùng biển.' },
      { name: 'Nhà hát lớn Hải Phòng', shortDescription: 'Công trình kiến trúc Pháp thuộc địa, biểu tượng văn hóa thành phố cảng.' },
    ],
    foods: [
      { name: 'Bánh đa cua', shortDescription: 'Mì sợi đỏ đặc trưng, nước dùng cua thịt, tôm, chả cá - linh hồn ẩm thực Hải Phòng.' },
      { name: 'Nem cua bể', shortDescription: 'Nem chiên giòn nhân thịt cua bể, đặc sản chỉ có ở thành phố cảng.' },
      { name: 'Cà phê bột Hải Phòng', shortDescription: 'Cà phê rang xay mịn pha phin, vị đậm đà đặc trưng khác biệt.' },
      { name: 'Ốc hương Đồ Sơn', shortDescription: 'Ốc hương tươi sống vùng biển Đồ Sơn, hấp sả hoặc nướng mỡ hành.' },
    ],
    cultureNotes: [
      'Hải Phòng được mệnh danh là "Thành phố hoa phượng đỏ" với sắc đỏ rực mỗi mùa hè.',
      'Lễ hội chọi trưa Đồ Sơn là di sản văn hóa phi vật thể, thể hiện tinh thần thượng võ của người vùng biển.',
    ],
    suggestedLearningQuestions: [
      'Vai trò của cảng Hải Phòng đối với kinh tế miền Bắc như thế nào?',
      'Tại sao Nguyễn Bỉnh Khiêm được gọi là "Trạng Trình"?',
      'Hệ sinh thái đảo Cát Bà có gì đặc biệt so với các vườn quốc gia khác?',
    ],
    relatedPlaces: ['ha-noi', 'quang-ninh', 'hung-yen'],
  },

  // ★★★ RICH ENTRY: Quảng Ninh ★★★
  {
    id: '13',
    slug: 'quang-ninh',
    name: 'Quảng Ninh',
    type: 'province',
    region: 'north',
    coordinates: [21.0064, 107.2944],
    shortDescription:
      'Vùng đất di sản thế giới Vịnh Hạ Long, nơi giao thoa giữa biển đảo và núi rừng, thủ đô than đá của Việt Nam.',
    icon: '🏔️',
    accentColor: '#1B4965',
    tags: ['Hạ Long', 'UNESCO', 'than', 'biển đảo', 'di sản'],
    historyHighlights: [
      'Vịnh Hạ Long được UNESCO công nhận là Di sản Thiên nhiên Thế giới hai lần (1994 và 2000).',
      'Năm 1288, Trần Hưng Đạo đánh tan quân Mông Nguyên trong trận Bạch Đằng bằng cọc gỗ, bảo vệ bờ cõi.',
      'Quảng Ninh là vùng đất có lịch sử khai thác than đá hơn 100 năm, góp phần quan trọng vào công nghiệp hóa.',
    ],
    notableHeroes: [
      {
        name: 'Trần Hưng Đạo',
        period: '1228–1300',
        shortDescription: 'Danh tướng ba lần đánh thắng quân Mông Nguyên, anh hùng dân tộc, gắn với Bạch Đằng.',
      },
      {
        name: 'Trần Nhân Tông',
        period: '1258–1308',
        shortDescription: 'Vua Trần sáng lập thiền phái Trúc Lâm Yên Tử, Phật hoàng dân tộc.',
      },
      {
        name: 'Tôn Thất Tùng',
        period: '1912–1982',
        shortDescription: 'Bác sĩ xuất sắc sinh tại Quảng Ninh, người Việt Nam đầu tiên tiến hành phẫu thuật gan.',
      },
    ],
    landmarks: [
      { name: 'Vịnh Hạ Long', shortDescription: 'Di sản thế giới với hơn 1600 hòn đảo đá vôi kỳ vĩ, kỳ quan thiên nhiên.' },
      { name: 'Yên Tử', shortDescription: 'Cố đô của Phật giáo Việt Nam, nơi Trần Nhân Tông tu hành và sáng lập Trúc Lâm.' },
      { name: 'Động Thiên Cung', shortDescription: 'Hang động tuyệt đẹp với các nhũ đá đa sắc, được mệnh danh "thiên cung hạ giới".' },
      { name: 'Bãi Cháy', shortDescription: 'Bãi biển du lịch nổi tiếng, cầu nối với đảo Vịnh Hạ Long.' },
    ],
    foods: [
      { name: 'Chả mực Hạ Long', shortDescription: 'Mực tươi giã nhuyễn chiên giòn, đặc sản trứ danh của vùng biển Hạ Long.' },
      { name: 'Sam biển', shortDescription: 'Hải sản quý hiếm, chế biến thành nhiều món như sam xào sả ớt, gỏi sam.' },
      { name: 'Bánh gật gù', shortDescription: 'Bánh cuốn mỏng ăn với chả mực, nước dùng tôm, món đặc sản Tiên Yên.' },
      { name: 'Ngán biển', shortDescription: 'Hải sản đặc sản Quảng Ninh, hấp sả hoặc nướng, vị ngọt thơm đặc trưng.' },
    ],
    cultureNotes: [
      'Yên Tử là trung tâm Phật giáo Trúc Lâm, thể hiện tinh thần nhập thế "đạo pháp - dân tộc" của người Việt.',
      'Vùng than Hồng Quảng có truyền thống đấu tranh công nhân lâu đời từ thời Pháp thuộc.',
    ],
    suggestedLearningQuestions: [
      'Vịnh Hạ Long được hình thành như thế nào theo địa chất học?',
      'Trận Bạch Đằng 1288 có ý nghĩa gì trong lịch sử chống ngoại xâm?',
      'Thiền phái Trúc Lâm Yên Tử khác gì với các phái Phật giáo khác?',
    ],
    relatedPlaces: ['hai-phong', 'ha-noi', 'lao-cai'],
  },

  // ★★★ RICH ENTRY: Lào Cai ★★★
  {
    id: '7',
    slug: 'lao-cai',
    name: 'Lào Cai',
    type: 'province',
    region: 'north',
    coordinates: [22.4856, 103.9708],
    shortDescription:
      'Cửa ngõ Tây Bắc, nơi đỉnh Fansipan "Nóc nhà Đông Dương" vươn lên, quê hương của nhiều dân tộc thiểu số.',
    icon: '⛰️',
    accentColor: '#2D6A4F',
    tags: ['Fansipan', 'Sa Pa', 'dân tộc', 'ruộng bậc thang', 'Tây Bắc'],
    historyHighlights: [
      'Sa Pa được người Pháp phát hiện và xây dựng thành trạm nghỉ dưỡng từ đầu thế kỷ 20, nổi tiếng với khí hậu ôn đới.',
      'Lào Cai là cửa khẩu đường bộ quan trọng nhất với Trung Quốc, nối liền bằng đường sắt Hải Phòng - Côn Minh.',
      'Năm 2025, Lào Cai sáp nhập với Yên Bái theo Nghị quyết 60-NQ/TW, tạo tỉnh mới rộng hơn.',
    ],
    notableHeroes: [
      {
        name: 'Hoàng Văn Thụ',
        period: '1909–1944',
        shortDescription: 'Lãnh tụ cộng sản, Bí thư Xứ ủy Bắc Kỳ, hy sinh tại Lào Cai.',
      },
      {
        name: 'Nguyễn Quang Bền',
        period: '1914–1999',
        shortDescription: 'Anh hùng Lực lượng vũ trang Nhân dân, có công lớn trong bảo vệ biên giới Tây Bắc.',
      },
      {
        name: 'Lũy đẻo Pha Đin',
        period: 'Cận đại',
        shortDescription: 'Biểu tượng cho tinh thần vượt núi của người dân Tây Bắc trong kháng chiến.',
      },
    ],
    landmarks: [
      { name: 'Đỉnh Fansipan', shortDescription: 'Nóc nhà Đông Dương cao 3143m, điểm đến của những người yêu leo núi.' },
      { name: 'Ruộng bậc thang Sa Pa', shortDescription: 'Kỳ quan nông nghiệp, tác phẩm nghệ thuật của đồng bào dân tộc Mông, Dao.' },
      { name: 'Chợ Bắc Hà', shortDescription: 'Chợ phiên vùng cao nổi tiếng, nơi giao lưu văn hóa các dân tộc Tây Bắc.' },
      { name: 'Bản Cát Cát', shortDescription: 'Bản làng dân tộc H\'Mông, bảo tồn nghề dệt thổ cẩm và văn hóa truyền thống.' },
    ],
    foods: [
      { name: 'Thắng cố', shortDescription: 'Món ăn truyền thống của đồng bào Mông, nấu từ nội tạng ngựa, bò, hương vị đậm đà.' },
      { name: 'Cơm lam Sa Pa', shortDescription: 'Cơm nếp nướng trong ống tre, thơm dẻo, ăn kèm thịt nướng và chẩm chéo.' },
      { name: 'Cá hồi Sa Pa', shortDescription: 'Cá hồi nuôi nước lạnh, chế biến tươi sống, nướng hoặc hấp.' },
      { name: 'Lẩu cá tầm', shortDescription: 'Cá tầm nuôi vùng lạnh Sa Pa, thịt dai ngọt, nấu lẩu đặc sản.' },
    ],
    cultureNotes: [
      'Lào Cai là nơi sinh sống của hơn 20 dân tộc anh em, mỗi dân tộc có phong tục, trang phục và lễ hội riêng.',
      'Tín ngưỡng worshipping và văn hóa thổi kèn khèn Mông là di sản văn hóa phi vật thể đặc sắc.',
    ],
    suggestedLearningQuestions: [
      'Vì sao Fansipan được gọi là "Nóc nhà Đông Dương"?',
      'Văn hóa ruộng bậc thang phản ánh trí tuệ nông nghiệp nào của đồng bào dân tộc?',
      'Chợ phiên vùng cao có vai trò gì trong đời sống các dân tộc thiểu số?',
    ],
    relatedPlaces: ['dien-bien', 'son-la', 'thai-nguyen'],
  },

  // Basic entries: North region
  {
    id: '8',
    slug: 'dien-bien',
    name: 'Điện Biên',
    type: 'province',
    region: 'north',
    coordinates: [21.386, 103.02],
    shortDescription: 'Đất chiến thắng lịch sử Điện Biên Phủ, nơi làm thay đổi cục diện thế giới.',
    icon: '⚔️',
    accentColor: '#8B0000',
    tags: ['chiến thắng', 'lịch sử', 'Tây Bắc'],
    historyHighlights: [
      'Ngày 7/5/1954, chiến dịch Điện Biên Phủ toàn thắng sau 56 ngày đêm, làm sụp đổ tô giới Pháp.',
    ],
    notableHeroes: [
      { name: 'Võ Nguyên Giáp', period: '1911–2013', shortDescription: 'Tổng tư lệnh chiến dịch Điện Biên Phủ, danh tướng huyền thoại.' },
      { name: 'Bế Văn Đàn', period: '1931–1954', shortDescription: 'Anh hùng LLVTND, hy sinh khi làm giá súng cứu đồng đội tại Điện Biên Phủ.' },
    ],
    landmarks: [
      { name: 'Chiến trường Điện Biên Phủ', shortDescription: 'Di tích lịch sử quốc gia đặc biệt, nơi diễn ra trận chiến quyết định.' },
      { name: 'Đồi A1', shortDescription: 'Đỉnh cao chiến đấu khốc liệt nhất trong chiến dịch Điện Biên Phủ.' },
    ],
    foods: [
      { name: 'Pa pỉnh tộp', shortDescription: 'Cá suối nướng gập, đặc sản Thái Đen Tây Bắc.' },
      { name: 'Xôi ngũ sắc', shortDescription: 'Xôi 5 màu từ lá cây rừng, món đặc sản dân tộc Thái.' },
    ],
    cultureNotes: ['Điện Biên là quê hương của dân tộc Thái, Khơ Mú với văn hóa xòe và múa sạp đặc sắc.'],
    suggestedLearningQuestions: ['Chiến thắng Điện Biên Phủ có ý nghĩa như thế nào đối với phong trào giải phóng dân tộc thế giới?'],
    relatedPlaces: ['lao-cai', 'son-la'],
  },
  {
    id: '9',
    slug: 'son-la',
    name: 'Sơn La',
    type: 'province',
    region: 'north',
    coordinates: [21.3245, 103.9193],
    shortDescription: 'Vùng đất Tây Bắc với nhà tù lịch sử và cao nguyên Mộc Châu xinh đẹp.',
    icon: '🌿',
    accentColor: '#2E7D32',
    tags: ['Tây Bắc', 'Mộc Châu', 'trà'],
    historyHighlights: [
      'Nhà tù Sơn La được thực dân Pháp xây dựng năm 1908, nơi giam giữ nhiều chiến sĩ cách mạng.',
    ],
    notableHeroes: [
      { name: 'Tô Hiệu', period: '1912–1944', shortDescription: 'Chiến sĩ cộng sản, lãnh đạo phong trào cách mạng trong nhà tù Sơn La.' },
      { name: 'Cù Chính Lan', period: '1914–1951', shortDescription: 'Anh hùng LLVTND, người Thái dũng cảm trong kháng chiến chống Pháp.' },
    ],
    landmarks: [
      { name: 'Nhà tù Sơn La', shortDescription: 'Di tích lịch sử, "trường học đỏ" nơi rèn luyện ý chí cách mạng.' },
      { name: 'Cao nguyên Mộc Châu', shortDescription: 'Thiên nhiên tuyệt đẹp với đồi chè, hoa mận, thảo nguyên xanh mướt.' },
    ],
    foods: [
      { name: 'Bánh chưng gạo Tây Bắc', shortDescription: 'Bánh chưng nếp nương, nhân thịt lợn gác bếp, gói lá chuối rừng.' },
      { name: 'Cá nướng Pa pỉnh tộp', shortDescription: 'Cá suối nướng nguyên con, ướp gia vị dân tộc Thái.' },
    ],
    cultureNotes: ['Sơn La là nơi sinh sống của dân tộc Thái, Mông, Mường với lễ hội Hoa Mận và hội Xòe truyền thống.'],
    suggestedLearningQuestions: ['Nhà tù Sơn La được gọi là "trường học đỏ" vì lý do gì?'],
    relatedPlaces: ['dien-bien', 'lao-cai'],
  },
  {
    id: '10',
    slug: 'tuyen-quang',
    name: 'Tuyên Quang',
    type: 'province',
    region: 'north',
    coordinates: [22.3286, 105.2323],
    shortDescription: 'Đất thiêng Tân Trào, thủ đô kháng chiến, nơi khai sinh chính quyền cách mạng.',
    icon: '🔥',
    accentColor: '#D84315',
    tags: ['Tân Trào', 'kháng chiến', 'ATK'],
    historyHighlights: [
      'Tân Trào là căn cứ địa cách mạng (ATK), nơi Đại hội Đảng toàn quốc (8/1945) quyết định Tổng khởi nghĩa.',
    ],
    notableHeroes: [
      { name: 'Hoàng Văn Thụ', period: '1909–1944', shortDescription: 'Lãnh tụ cộng sản, hy sinh tại chiến khu Tây Bắc.' },
      { name: 'Kim Đồng', period: '1929–1943', shortDescription: 'Đội trưởng Đội nhi đồng cứu quốc đầu tiên, thiếu anh hùng.' },
    ],
    landmarks: [
      { name: 'ATK Tân Trào', shortDescription: 'An toàn khu, căn cứ của Đảng và Mặt trận Việt Minh trong Cách mạng tháng Tám.' },
      { name: 'Hồ Na Hang', shortDescription: 'Hồ nước trong xanh giữa núi rừng Tây Bắc, cảnh quan nguyên sơ.' },
    ],
    foods: [
      { name: 'Bánh chưng Tuyên Quang', shortDescription: 'Bánh chưng nếp nương, gói bằng lá chít, hương vị đặc trưng vùng núi.' },
      { name: 'Thịt trâu gác bếp', shortDescription: 'Thịt trâu sấy khói, đặc sản dân tộc Tày, ăn kèm chẩm chéo.' },
    ],
    cultureNotes: ['Tuyên Quang nổi tiếng với Lễ hội Lồng Tồng, cầu mùa màng bội thu của dân tộc Tày.'],
    suggestedLearningQuestions: ['Vì sao Tân Trào được chọn làm căn cứ địa cách mạng?'],
    relatedPlaces: ['thai-nguyen', 'phu-tho'],
  },
  {
    id: '11',
    slug: 'thai-nguyen',
    name: 'Thái Nguyên',
    type: 'province',
    region: 'north',
    coordinates: [21.5895, 105.8312],
    shortDescription: 'Thủ phủ thép miền Bắc, trung tâm công nghiệp và giáo dục lớn.',
    icon: '🔩',
    accentColor: '#455A64',
    tags: ['thép', 'công nghiệp', 'chè', 'giáo dục'],
    historyHighlights: [
      'Thái Nguyên là nơi xây dựng nhà máy thép đầu tiên miền Bắc với sự giúp đỡ của Liên Xô (1959).',
    ],
    notableHeroes: [
      { name: 'Đặng Văn Ngữ', period: '1910–1967', shortDescription: 'Bác sĩ, nhà nghiên cứu y học xuất sắc, hy sinh trên đường công tác.' },
      { name: 'Nông Văn Dền', period: '1922–1954', shortDescription: 'Anh hùng LLVTND, dân tộc Tày dũng cảm trong kháng chiến chống Pháp.' },
    ],
    landmarks: [
      { name: 'Hồ Núi Cốc', shortDescription: 'Hồ nước lớn giữa núi rừng, gắn với truyền thuyết tình yêu Chàng Cọ, Cô Ngàn.' },
      { name: 'Bảo tàng Văn hóa các dân tộc Việt Nam', shortDescription: 'Nơi trưng bày di sản văn hóa 54 dân tộc anh em.' },
    ],
    foods: [
      { name: 'Chè Thái Nguyên', shortDescription: 'Chè xanh danh tiếng, hương vị thanh tao, là niềm tự hào của vùng đất.' },
      { name: 'Bún chả Thái Nguyên', shortDescription: 'Bún với chả nướng than hoa, nước dùng ngọt thanh đặc trưng.' },
    ],
    cultureNotes: ['Thái Nguyên là vùng đất của dân tộc Tày, Nùng với văn hóa Then - lượn đặc sắc.'],
    suggestedLearningQuestions: ['Vai trò của nhà máy thép Thái Nguyên đối với công cuộc công nghiệp hóa miền Bắc?'],
    relatedPlaces: ['tuyen-quang', 'bac-giang'],
  },
  {
    id: '12',
    slug: 'phu-tho',
    name: 'Phú Thọ',
    type: 'province',
    region: 'north',
    coordinates: [21.3286, 105.2016],
    shortDescription: 'Đất tổ Hùng Vương, cội nguồn dân tộc, nơi dòng Lả uốn lượn.',
    icon: '👑',
    accentColor: '#6A1B9A',
    tags: ['Hùng Vương', 'đất tổ', 'cội nguồn'],
    historyHighlights: [
      'Đền Hùng là nơi thờ các vua Hùng, những người sáng lập nhà nước Văn Lang đầu tiên của người Việt.',
    ],
    notableHeroes: [
      { name: 'Hùng Vương', period: '~2879–258 TCN', shortDescription: 'Các vua Hùng dựng nước Văn Lang, tổ tiên chung của dân tộc Việt.' },
      { name: 'Thánh Gióng', period: 'Thời Hùng Vương', shortDescription: 'Thánh trẻ cưỡi ngựa sông đánh giặc Ân, một trong tứ bất tử.' },
    ],
    landmarks: [
      { name: 'Đền Hùng', shortDescription: 'Quần thể di tích thờ các vua Hùng, quốc lễ mùng 10 tháng 3 âm lịch.' },
      { name: 'Hồ Đạ Điêng', shortDescription: 'Hồ nước ngọt lớn, cảnh quan thiên nhiên yên bình giữa đất tổ.' },
    ],
    foods: [
      { name: 'Bánh chưng', shortDescription: 'Bánh四方隐喻天地, truyền thuyết Lang Liêu dâng vua Hùng, biểu tượng Tết Việt.' },
      { name: 'Bánh tai', shortDescription: 'Bánh tráng mỏng ăn với thịt bò luộc, đặc sản Phú Thọ.' },
    ],
    cultureNotes: ['Lễ hội Đền Hùng là quốc lễ, ngày giỗ tổ Hùng Vương mùng 10/3 âm lịch cả nước nghỉ nhớ.'],
    suggestedLearningQuestions: ['Vì sao người Việt có câu "Dù ai đi ngược về xuôi, nhớ ngày giỗ tổ mùng 10 tháng 3"?'],
    relatedPlaces: ['ha-noi', 'tuyen-quang', 'son-la'],
  },
  {
    id: '14',
    slug: 'bac-giang',
    name: 'Bắc Giang',
    type: 'province',
    region: 'north',
    coordinates: [21.3141, 106.2856],
    shortDescription: 'Vùng đất trãi dài bên sông Cầu, nổi tiếng với vải thiều và di tích Yên Thế.',
    icon: '🌳',
    accentColor: '#33691E',
    tags: ['vải thiều', 'Yên Thế', 'nông nghiệp'],
    historyHighlights: [
      'Khởi nghĩa Yên Thế (1887–1913) kéo dài gần 30 năm, là phong trào chống Pháp mạnh mẽ nhất Bắc Kỳ.',
    ],
    notableHeroes: [
      { name: 'Hoàng Hoa Thám', period: '1858–1913', shortDescription: 'Thủ lĩnh khởi nghĩa Yên Thế, chống Pháp gần 30 năm tại Bắc Giang.' },
      { name: 'Lê Duẩn', period: '1907–1986', shortDescription: 'Tổng Bí thư Đảng Cộng sản Việt Nam, sinh tại Triệu Sơn, Thanh Hóa, hoạt động tại Bắc Giang.' },
    ],
    landmarks: [
      { name: 'Khu di tích Yên Thế', shortDescription: 'Nơi diễn ra khởi nghĩa chống Pháp, biểu tượng tinh thần bất khuất.' },
      { name: 'Chùa Vĩnh Nghiêm', shortDescription: 'Chùa cổ thời Trần, trung tâm Phật giáo Trúc Lâm tại Bắc Giang.' },
    ],
    foods: [
      { name: 'Vải thiều Bắc Giang', shortDescription: 'Trái vải ngọt lịm, cùi mỏng, hương thơm đặc trưng - đặc sản số một.' },
      { name: 'Bánh đa Kế', shortDescription: 'Bánh đa nướng giòn, ăn kèm chả và nước dùng, món đặc sản địa phương.' },
    ],
    cultureNotes: ['Bắc Giang nổi tiếng với lễ hội Lim, nơi hát quan họ giao duyên bên dòng sông Cầu.'],
    suggestedLearningQuestions: ['Khởi nghĩa Yên Thế kéo dài gần 30 năm phản ánh điều gì về tinh thần dân tộc?'],
    relatedPlaces: ['ha-noi', 'thai-nguyen', 'bac-giang'],
  },
  {
    id: '15',
    slug: 'ninh-binh',
    name: 'Ninh Bình',
    type: 'province',
    region: 'north',
    coordinates: [20.2539, 105.9745],
    shortDescription: 'Hạ Long trên cạn, cố đô Hoa Lư, nơi núi non hùng vĩ và di sản thế giới Tràng An.',
    icon: '🛶',
    accentColor: '#00695C',
    tags: ['Tràng An', 'Hoa Lư', 'UNESCO', 'Hạ Long trên cạn'],
    historyHighlights: [
      'Năm 968, Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, lập ra triều Đinh và đóng đô tại Hoa Lư.',
    ],
    notableHeroes: [
      { name: 'Đinh Bộ Lĩnh', period: '924–979', shortDescription: 'Vua Đinh Tiên Hoàng, thống nhất 12 sứ quân, lập ra nhà nước Đại Cồ Việt.' },
      { name: 'Lê Hoàn', period: '941–1005', shortDescription: 'Lê Đại Hành, nhiếp chính và lên ngôi, đánh Tống bình Chiêm, xây dựng Hoa Lư.' },
    ],
    landmarks: [
      { name: 'Quần thể Tràng An', shortDescription: 'Di sản thế giới kép (văn hóa & thiên nhiên), "Hạ Long trên cạn" kỳ vĩ.' },
      { name: 'Cố đô Hoa Lư', shortDescription: 'Kinh đô đầu tiên của nhà nước phong kiến tập quyền Đại Cồ Việt.' },
    ],
    foods: [
      { name: 'Cơm cháy Ninh Bình', shortDescription: 'Cơm cháy giòn rụm, chấm nước sốt cà chua thịt bò, đặc sản trứ danh.' },
      { name: 'Dê núi Ninh Bình', shortDescription: 'Thịt dê núi Ninh Bình nổi tiếng, chế biến thành nhiều món ngon.' },
    ],
    cultureNotes: ['Ninh Bình là vùng đất "địa linh nhân kiệt" với phong cảnh non nước hữu tình hùng vĩ.'],
    suggestedLearningQuestions: ['Vì sao Đinh Bộ Lĩnh chọn Hoa Lư làm kinh đô?'],
    relatedPlaces: ['ha-noi', 'phu-tho', 'thanh-hoa'],
  },
  {
    id: '16',
    slug: 'hung-yen',
    name: 'Hưng Yên',
    type: 'province',
    region: 'north',
    coordinates: [20.6612, 106.0545],
    shortDescription: 'Vùng đất bên dòng Hồng, nổi tiếng nhãn lồng và phố Hiến thương cảng xưa.',
    icon: '🏮',
    accentColor: '#C62828',
    tags: ['nhãn lồng', 'Phố Hiến', 'đồng bằng'],
    historyHighlights: [
      'Phố Hiến (Hưng Yên) từng là thương cảng sầm uất bậc nhất Đàng Ngoài thế kỷ 17-18.',
    ],
    notableHeroes: [
      { name: 'Phạm Hồng Thái', period: '1896–1924', shortDescription: 'Nhà cách mạng, ám sát toàn quyền Pháp Merlin tại Quảng Châu.' },
      { name: 'Nguyễn Văn Linh', period: '1915–1998', shortDescription: 'Tổng Bí thư Đảng, khởi xướng công cuộc Đổi Mới, quê Hưng Yên.' },
    ],
    landmarks: [
      { name: 'Phố Hiến', shortDescription: 'Di tích lịch sử, thương cảng cổ sầm uất bậc nhất Đàng Ngoài.' },
      { name: 'Chùa Chuông', shortDescription: 'Ngôi chùa cổ linh thiêng, trung tâm Phật giáo Hưng Yên.' },
    ],
    foods: [
      { name: 'Nhãn lồng Hưng Yên', shortDescription: 'Trái nhãn ngọt thanh, cùi dày, đặc sản danh tiếng khắp nước.' },
      { name: 'Bánh rế Hưng Yên', shortDescription: 'Bánh ngọt giòn làm từ trứng, bột, đường, quấn hình rế tơ.' },
    ],
    cultureNotes: ['Hưng Yên nổi tiếng với hội chùa Chuông và văn hóa làng quê đồng bằng Bắc Bộ.'],
    suggestedLearningQuestions: ['Phố Hiến từng sầm uất như thế nào so với Thăng Long xưa?'],
    relatedPlaces: ['ha-noi', 'hai-phong', 'bac-giang'],
  },
  {
    id: '17',
    slug: 'thanh-hoa',
    name: 'Thanh Hóa',
    type: 'province',
    region: 'north',
    coordinates: [19.81, 105.79],
    shortDescription: 'Vùng đất xứ Thanh, quê hương của các triều vua Lê và phong trào Cần Vương.',
    icon: '🏯',
    accentColor: '#4E342E',
    tags: ['Lê Lợi', 'Lam Sơn', 'Cần Vương'],
    historyHighlights: [
      'Năm 1418, Lê Lợi khởi nghĩa tại Lam Sơn, sau 10 năm đánh đuổi quân Minh, lập ra triều Lê sơ.',
    ],
    notableHeroes: [
      { name: 'Lê Lợi', period: '1385–1433', shortDescription: 'Vua Lê Thái Tổ, lãnh đạo khởi nghĩa Lam Sơn, giải phóng đất nước khỏi ách Minh.' },
      { name: 'Nguyễn Thị Lộc', period: '1426–?', shortDescription: 'Nữ tướng Lam Sơn, vợ Trần Nguyên Hãn, dũng cảm trên chiến trường.' },
    ],
    landmarks: [
      { name: 'Lam Kinh', shortDescription: 'Cố đô của triều Lê sơ, nơi Lê Lợi khởi binh chống quân Minh.' },
      { name: 'Bãi biển Sầm Sơn', shortDescription: 'Bãi biển nổi tiếng miền Trung, nơi nghỉ mát lý tưởng.' },
    ],
    foods: [
      { name: 'Nem chua Thanh Hóa', shortDescription: 'Nem chua cay nồng, làm từ thịt lợn lên men, đặc sản xứ Thanh.' },
      { name: 'Chả tôm Sầm Sơn', shortDescription: 'Chả tôm giòn rụm, tươi ngon từ hải sản Sầm Sơn.' },
    ],
    cultureNotes: ['Thanh Hóa nổi tiếng với câu "Thanh hóa nhất thiện nhị thiên" - đất đất thiện lành.'],
    suggestedLearningQuestions: ['Khởi nghĩa Lam Sơn đã diễn ra như thế nào và để lại bài học gì?'],
    relatedPlaces: ['ninh-binh', 'nghe-an', 'ha-noi'],
  },
  {
    id: '18',
    slug: 'nghe-an',
    name: 'Nghệ An',
    type: 'province',
    region: 'central',
    coordinates: [19.23, 104.07],
    shortDescription: 'Vùng đất học, quê hương của Chủ tịch Hồ Chí Minh và bao anh hùng dân tộc.',
    icon: '📖',
    accentColor: '#1565C0',
    tags: ['Bác Hồ', 'xứ Nghệ', 'Vinh', 'học'],
    historyHighlights: [
      'Nghệ An là quê hương của Chủ tịch Hồ Chí Minh, sinh ngày 19/5/1890 tại làng Kim Liên.',
    ],
    notableHeroes: [
      { name: 'Hồ Chí Minh', period: '1890–1969', shortDescription: 'Lãnh tụ dân tộc, Anh hùng giải phóng dân tộc, Danh nhân văn hóa thế giới.' },
      { name: 'Phan Bội Châu', period: '1867–1940', shortDescription: 'Nhà cách mạng, lãnh đạo phong trào Đông Du, sáng lập Việt Nam Quang phục hội.' },
    ],
    landmarks: [
      { name: 'Kim Liên', shortDescription: 'Quê hương Bác Hồ, di tích lịch sử quốc gia đặc biệt.' },
      { name: 'Cửa Lò', shortDescription: 'Bãi biển nổi tiếng, nơi giao lưu biển đảo xứ Nghệ.' },
    ],
    foods: [
      { name: 'Cháo lươn Nghệ An', shortDescription: 'Cháo lươn nấu nghệ, huyết vịt, tiêu, cay nồng đậm đà xứ Nghệ.' },
      { name: 'Bánh mì chảo', shortDescription: 'Bánh mì ăn với chảo thịt bò, pate, trứng, đặc sản Vinh.' },
    ],
    cultureNotes: ['Nghệ An nổi tiếng với câu "Xứ Nghệ đất học, đất nghèo nhưng người giỏi".'],
    suggestedLearningQuestions: ['Vì sao Nghệ An được gọi là "đất học"?'],
    relatedPlaces: ['ha-tinh', 'thanh-hoa'],
  },
  {
    id: '19',
    slug: 'ha-tinh',
    name: 'Hà Tĩnh',
    type: 'province',
    region: 'central',
    coordinates: [18.35, 105.9],
    shortDescription: 'Vùng đất Hoan Châu, nơi sông Lam hiền hòa và núi Hồng lãng mạn.',
    icon: '🌊',
    accentColor: '#006064',
    tags: ['sông Lam', 'Hương Sơn', 'xứ Nghệ'],
    historyHighlights: [
      'Hà Tĩnh là quê hương của Đại thi hào Nguyễn Du, tác giả Truyện Kiều - kiệt tác văn học Việt Nam.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Du', period: '1766–1820', shortDescription: 'Đại thi hào, tác giả Truyện Kiều, danh nhân văn hóa thế giới.' },
      { name: 'Nguyễn Thị Minh Khai', period: '1910–1941', shortDescription: 'Nữ anh hùng cách mạng, hy sinh anh dũng ở Saigon.' },
    ],
    landmarks: [
      { name: 'Hương Sơn', shortDescription: 'Danh lam thắng cảnh "Chùa Hương", nơi hội tụ thiền cảnh thiên nhiên.' },
      { name: 'Cửa khẩu Cầu Treo', shortDescription: 'Cửa khẩu quốc tế trên tuyến đường Hồ Chí Minh, nối Việt - Lào.' },
    ],
    foods: [
      { name: 'Khoai phong Hà Tĩnh', shortDescription: 'Khoai lang tím, dẻo ngọt, đặc sản vùng đất đỏ bazan.' },
      { name: 'Bánh bột lọc', shortDescription: 'Bánh tráng mỏng cuốn nhân tôm thịt, chấm nước mắm chua ngọt.' },
    ],
    cultureNotes: ['Hà Tĩnh nổi tiếng với hát ví dặm, di sản văn hóa phi vật thể đặc sắc miền Trung.'],
    suggestedLearningQuestions: ['Truyện Kiều của Nguyễn Du phản ánh điều gì về xã hội Việt Nam thời phong kiến?'],
    relatedPlaces: ['nghe-an', 'quang-binh'],
  },
]

// ─── Data: Central Region (Trung Bộ) ────────────────────────────────────────

const centralPlaces: VietnamPlace[] = [
  // ★★★ RICH ENTRY: Huế ★★★
  {
    id: '3',
    slug: 'hue',
    name: 'Huế',
    type: 'city',
    region: 'central',
    coordinates: [16.4637, 107.5909],
    shortDescription:
      'Cố đô triều Nguyễn, di sản văn hóa thế giới, nơi sông Hương mơ màng bên núi Ngự tranh.',
    icon: '🏯',
    accentColor: '#7B1FA2',
    tags: ['cố đô', 'triều Nguyễn', 'UNESCO', 'sông Hương', 'ẩm thực'],
    historyHighlights: [
      'Năm 1802, Gia Long thống nhất đất nước, chọn Phú Xuân (Huế) làm kinh đô, bắt đầu triều Nguyễn.',
      'Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993.',
      'Năm 1885, vua Hàm Nghi xuất bôn và ban chiếu Cần Vương, mở đầu phong trào chống Pháp toàn quốc.',
    ],
    notableHeroes: [
      {
        name: 'Vua Hàm Nghi',
        period: '1871–1944',
        shortDescription: 'Vua phát động phong trào Cần Vương chống Pháp, bị đày sang Algeria.',
      },
      {
        name: 'Nguyễn Trãi', period: '1380–1442',
        shortDescription: 'Tuy sinh ở Thăng Long nhưng gắn bó với đất Thừa Thiên, tác giả Bình Ngô Đại Cáo.',
      },
      {
        name: 'Tôn Thất Thuyết',
        period: '1839–1913',
        shortDescription: 'Quan đại thần triều Nguyễn, phụ chính cho vua Hàm Nghi, chủ trương chống Pháp.',
      },
    ],
    landmarks: [
      { name: 'Đại Nội (Kinh thành Huế)', shortDescription: 'Kinh thành lớn nhất Việt Nam, trung tâm quyền lực triều Nguyễn 143 năm.' },
      { name: 'Chùa Thiên Mụ', shortDescription: 'Ngôi chùa cổ nhất Huế, biểu tượng tâm linh bên sông Hương, xây năm 1601.' },
      { name: 'Lăng Tự Đức', shortDescription: 'Lăng tẩm thơ mộng nhất triều Nguyễn, phản ánh tâm hồn thi sĩ của vua Tự Đức.' },
      { name: 'Sông Hương', shortDescription: 'Dòng sông thi ca, linh hồn của xứ Huế, in bóng núi Ngự tranh bên bờ.' },
    ],
    foods: [
      { name: 'Bún bò Huế', shortDescription: 'Bún thịt bò, chả cua, huyết heo, nước dùng sả ớt cay nồng, linh hồn ẩm thực cố đô.' },
      { name: 'Chè Huế', shortDescription: 'Hàng chục loại chè đa sắc: chè hạt sen, chè bắp, chè trôi nước, chè bưởi...' },
      { name: 'Cơm hến', shortDescription: 'Cơm trắng trộn hến, tôm chua, bánh tráng, mắm, đặc sản đường phố Huế.' },
      { name: 'Bánh bèo chén', shortDescription: 'Bánh bèo trong chén sứ, rắc tôm chua, chả, đổ nước mắm ngọt.' },
    ],
    cultureNotes: [
      'Nhã nhạc cung đình Huế là di sản văn hóa phi vật thể thế giới, thể hiện đỉnh cao âm nhạc cung đình.',
      'Huế nổi tiếng với văn hóa "mưa" và áo dài truyền thống, phong cách thanh lịch riêng biệt.',
    ],
    suggestedLearningQuestions: [
      'Tại sao Gia Long chọn Phú Xuân làm kinh đô thay vì Thăng Long?',
      'Phong trào Cần Vương có ý nghĩa gì trong lịch sử chống Pháp của Việt Nam?',
      'Nhã nhạc cung đình Huế phản ánh triết lý nào của triều Nguyễn?',
    ],
    relatedPlaces: ['da-nang', 'quang-tri', 'quang-binh'],
  },

  // ★★★ RICH ENTRY: Đà Nẵng ★★★
  {
    id: '4',
    slug: 'da-nang',
    name: 'Đà Nẵng',
    type: 'city',
    region: 'central',
    coordinates: [16.0544, 108.2022],
    shortDescription:
      'Thành phố đáng sống nhất Việt Nam, cầu Rồng phun lửa, biển Mỹ Khê, di sản Chăm Pa.',
    icon: '🐉',
    accentColor: '#0277BD',
    tags: ['cầu Rồng', 'Bà Nà', 'Mỹ Khê', 'Chăm Pa', 'đáng sống'],
    historyHighlights: [
      'Đà Nẵng từng là cảng Tourane dưới thời Pháp thuộc, nơi quân Pháp đổ bộ năm 1858 mở đầu xâm lược.',
      'Bảo tàng Điêu khắc Chăm tại Đà Nẵng lưu giữ di sản văn hóa Chăm Pa rực rỡ nhất Đông Nam Á.',
      'Năm 2025, Đà Nẵng sáp nhập với tỉnh Quảng Nam theo Nghị quyết 60-NQ/TW.',
    ],
    notableHeroes: [
      {
        name: 'Nguyễn Tri Phương',
        period: '1800–1873',
        shortDescription: 'Danh tướng chỉ huy phòng tuyến Đà Nẵng chống quân Pháp năm 1858.',
      },
      {
        name: 'Hoàng Diệu',
        period: '1829–1882',
        shortDescription: 'Quan nhà Nguyễn, tuẫn tiết bảo vệ Hà Nội, gắn với tinh thần chống ngoại xâm miền Trung.',
      },
      {
        name: 'Trần Đình Triệu',
        period: 'Cận đại',
        shortDescription: 'Anh hùng LLVTND, có công trong bảo vệ thành phố Đà Nẵng năm 1975.',
      },
    ],
    landmarks: [
      { name: 'Cầu Rồng', shortDescription: 'Biểu tượng Đà Nẵng, cầu hình rồng phun lửa và nước mỗi cuối tuần.' },
      { name: 'Bà Nà Hills', shortDescription: 'Khu du lịch trên đỉnh núi, cầu vàng (Golden Bridge) nổi tiếng thế giới.' },
      { name: 'Bảo tàng Điêu khắc Chăm', shortDescription: 'Bảo tàng Chăm Pa lớn nhất, lưu giữ di sản văn hóa vương quốc Chăm.' },
      { name: 'Bãi biển Mỹ Khê', shortDescription: 'Một trong những bãi biển đẹp nhất hành tinh do Forbes bình chọn.' },
    ],
    foods: [
      { name: 'Mì Quảng', shortDescription: 'Sợi mì vàng dai, nước dùng ít, tôm thịt trứng, rau sống, đậu phộng rang.' },
      { name: 'Bánh tráng cuốn thịt heo', shortDescription: 'Bánh tráng mỏng cuốn thịt heo luộc, tôm, rau sống, chấm mắm nêm.' },
      { name: 'Bánh xèo Đà Nẵng', shortDescription: 'Bánh xèo giòn rụm, nhân tôm thịt giá đỗ, cuốn bánh tráng rau sống.' },
      { name: 'Chả cá Đà Nẵng', shortDescription: 'Chả cá chiên giòn, ăn kèm bánh tráng, rau sống và mắm nêm.' },
    ],
    cultureNotes: [
      'Đà Nẵng là thành phố của các cây cầu: cầu Rồng, cầu quay sông Hàn, cầu Thuận Phước, cầu Tiên Sơn.',
      'Văn hóa Chăm Pa tại Đà Nẵng thể hiện sự giao thoa văn hóa Ấn Độ - Đông Nam Á rực rỡ.',
    ],
    suggestedLearningQuestions: [
      'Sự kiện quân Pháp đổ bộ vào Đà Nẵng năm 1858 đã mở ra thời kỳ gì cho Việt Nam?',
      'Văn hóa Chăm Pa có ảnh hưởng như thế nào đến bản sắc miền Trung?',
      'Tại sao Đà Nẵng được mệnh danh là "thành phố đáng sống nhất Việt Nam"?',
    ],
    relatedPlaces: ['hue', 'quang-ngai', 'quang-binh'],
  },

  // ★★★ RICH ENTRY: Khánh Hòa ★★★
  {
    id: '25',
    slug: 'khanh-hoa',
    name: 'Khánh Hòa',
    type: 'province',
    region: 'central',
    coordinates: [12.24, 109.0],
    shortDescription:
      'Xứ Trầm hương, biển Nha Trang xanh ngọc, tháp Ponagar huyền thoại, quê hương của Alexandre Yersin.',
    icon: '🏝️',
    accentColor: '#0097A7',
    tags: ['Nha Trang', 'Ponagar', 'Yersin', 'yến sào', 'trầm hương'],
    historyHighlights: [
      'Tháp Ponagar xây thế kỷ 7-12, là đền tháp Chăm Pa lớn nhất miền Trung, thờ nữ thần Po Nagar.',
      'Alexandre Yersin đến Nha Trang năm 1891, lập trạm nghiên cứu và sống tại đây đến cuối đời.',
      'Khánh Hòa là thủ phủ yến sào Việt Nam, với hàng loạt đảo yến tự nhiên và nuôi trồng.',
    ],
    notableHeroes: [
      {
        name: 'Alexandre Yersin',
        period: '1863–1943',
        shortDescription: 'Nhà bác học Thụy Sĩ, phát hiện vi khuẩn dịch hạch, lập Viện Pasteur Nha Trang.',
      },
      {
        name: 'Bà Chúa Po Nagar',
        period: 'Thế kỷ 7',
        shortDescription: 'Nữ thần Chăm Pa, người sáng lập vương quốc Champa theo truyền thuyết.' },
      {
        name: 'Huỳnh Thúc Kháng',
        period: '1876–1947',
        shortDescription: 'Nhà yêu nước, nhà báo, chủ bút báo Tiếng Dân, gắn với phong trào dân chủ miền Trung.' },
    ],
    landmarks: [
      { name: 'Tháp Ponagar', shortDescription: 'Quần thể tháp Chăm Pa cổ kính, biểu tượng thiêng liêng của xứ Trầm.' },
      { name: 'Vịnh Nha Trang', shortDescription: 'Một trong 29 vịnh đẹp nhất thế giới, lặn biển ngắm san hô tuyệt vời.' },
      { name: 'Nhà thờ Núi (Nha Trang)', shortDescription: 'Nhà thờ Gothic đẹp nhất miền Trung, xây năm 1928-1933.' },
      { name: 'Viện Pasteur Nha Trang', shortDescription: 'Nơi Yersin nghiên cứu và cống hiến, bảo tồn di sản bác học.' },
    ],
    foods: [
      { name: 'Bún cá sứa', shortDescription: 'Bún với chả cá, sứa tươi giòn, nước dùng thanh ngọt, đặc sản Nha Trang.' },
      { name: 'Yến sào', shortDescription: 'Tổ chim yến, "bát trân" quý giá, bổ dưỡng bậc nhất, đặc sản Khánh Hòa.' },
      { name: 'Nem nướng Nha Trang', shortDescription: 'Nem heo nướng than hoa, ăn kèm bánh tráng, rau sống, nước mắm pha.' },
      { name: 'Chả cá Nha Trang', shortDescription: 'Chả cá thu giã nhuyễn, chiên vàng, ăn kèm bún, mắm nêm.' },
    ],
    cultureNotes: [
      'Khánh Hòa nổi tiếng với trầm hương - loại hương liệu quý giá từ cây dó bầu, được gọi là "xứ Trầm".' ,
      'Lễ hội Tháp Ponagar hàng năm là dịp người Chăm Pa và người Việt tưởng nhớ nữ thần Po Nagar.',
    ],
    suggestedLearningQuestions: [
      'Alexandre Yersin đã cống hiến gì cho Việt Nam và khoa học thế giới?',
      'Tháp Ponagar phản ánh nền văn minh nào ở miền Trung Việt Nam?',
      'Tại sao yến sào Khánh Hòa được coi là "bát trân"?',
    ],
    relatedPlaces: ['da-nang', 'ninh-thuan', 'phu-yen'],
  },

  // Basic entries: Central region
  {
    id: '20',
    slug: 'quang-binh',
    name: 'Quảng Bình',
    type: 'province',
    region: 'central',
    coordinates: [17.47, 106.6],
    shortDescription: 'Vương quốc hang động với Phong Nha - Kẻ Bàng, di sản thiên nhiên thế giới.',
    icon: '🔦',
    accentColor: '#37474F',
    tags: ['Phong Nha', 'hang động', 'UNESCO', 'Kẻ Bàng'],
    historyHighlights: [
      'Vườn quốc gia Phong Nha - Kẻ Bàng được UNESCO công nhận là Di sản Thiên nhiên Thế giới năm 2003.',
    ],
    notableHeroes: [
      { name: 'Võ Nguyên Giáp', period: '1911–2013', shortDescription: 'Danh tướng sinh tại Quảng Bình, chỉ huy nhiều chiến dịch lịch sử.' },
      { name: 'Hồ Sĩ Dân', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, có công trong bảo vệ tuyến đường Hồ Chí Minh.' },
    ],
    landmarks: [
      { name: 'Hang Sơn Đoòng', shortDescription: 'Hang động tự nhiên lớn nhất thế giới, kỳ quan địa chất.' },
      { name: 'Động Phong Nha', shortDescription: 'Hang động dài và đẹp nhất, được mệnh danh "thắng cảnh Nam Thiên".' },
    ],
    foods: [
      { name: 'Bánh lẹ', shortDescription: 'Bánh bột lọc nhân tôm thịt, đặc sản Quảng Bình.' },
      { name: 'Khoai de Quảng Bình', shortDescription: 'Khoai lang nướng, ngọt bùi, đặc sản vùng đất giới tuyến.' },
    ],
    cultureNotes: ['Quảng Bình nổi tiếng với tuyến đường Hồ Chí Minh huyền thoại trong kháng chiến chống Mỹ.'],
    suggestedLearningQuestions: ['Hang Sơn Đoòng được phát hiện như thế nào và có gì đặc biệt?'],
    relatedPlaces: ['hue', 'ha-tinh', 'quang-tri'],
  },
  {
    id: '21',
    slug: 'quang-tri',
    name: 'Quảng Trị',
    type: 'province',
    region: 'central',
    coordinates: [16.75, 107.19],
    shortDescription: 'Vùng đất giới tuyến chia cắt hai miền, chứng nhân đau thương và khát vọng hòa bình.',
    icon: '🕊️',
    accentColor: '#546E7A',
    tags: ['17 vĩ tuyến', 'Cầu Hiền Lương', 'giới tuyến'],
    historyHighlights: [
      'Sông Bến Hải và vĩ tuyến 17 chia cắt Việt Nam thành hai miền từ 1954 đến 1975.',
    ],
    notableHeroes: [
      { name: 'Lê Duẩn', period: '1907–1986', shortDescription: 'Tổng Bí thư Đảng, lãnh đạo đấu tranh giải phóng miền Nam.' },
      { name: 'Võ Chí Công', period: '1912–2011', shortDescription: 'Nguyên Chủ tịch nước, quê Quảng Trị, lãnh đạo cách mạng miền Trung.' },
    ],
    landmarks: [
      { name: 'Cầu Hiền Lương - sông Bến Hải', shortDescription: 'Biểu tượng chia cắt và khát vọng thống nhất đất nước.' },
      { name: 'Thành cổ Quảng Trị', shortDescription: 'Chứng nhân lịch sử 81 ngày đêm chiến đấu năm 1972.' },
    ],
    foods: [
      { name: 'Chè bắp Quảng Trị', shortDescription: 'Chè ngô tươi nấu với đường, thơm dẻo, đặc sản vùng giới tuyến.' },
      { name: 'Bánh ít đập', shortDescription: 'Bánh nếp nhân đậu xanh, đập dập, chấm mắm nêm.' },
    ],
    cultureNotes: ['Quảng Trị là vùng đất chịu nhiều đau thương chiến tranh, nay là biểu tượng khát vọng hòa bình.'],
    suggestedLearningQuestions: ['Vĩ tuyến 17 đã ảnh hưởng như thế nào đến đời sống người dân Quảng Trị?'],
    relatedPlaces: ['hue', 'quang-binh', 'quang-ngai'],
  },
  {
    id: '22',
    slug: 'quang-ngai',
    name: 'Quảng Ngãi',
    type: 'province',
    region: 'central',
    coordinates: [15.12, 108.8],
    shortDescription: 'Vùng đất chứng nhân thảm sát Mỹ Lai, quê hương đường sông Trà Khúc.',
    icon: '🕯️',
    accentColor: '#5D4037',
    tags: ['Mỹ Lai', 'Ba Tơ', 'Trà Khúc'],
    historyHighlights: [
      'Thảm sát Mỹ Lai (16/3/1968) là tội ác chiến tranh đau lòng, đánh thức lương tri thế giới phản chiến.',
    ],
    notableHeroes: [
      { name: 'Phạm Văn Đồng', period: '1906–2000', shortDescription: 'Thủ tướng chính phủ VNDCCH, quê Quảng Ngãi, lãnh đạo kinh tế đất nước.' },
      { name: 'Huỳnh Thúc Kháng', period: '1876–1947', shortDescription: 'Nhà yêu nước, nhà báo, chủ bút báo Tiếng Dân, quê Quảng Ngãi.' },
    ],
    landmarks: [
      { name: 'Sơn Mỹ (Mỹ Lai)', shortDescription: 'Di tích lịch sử, tưởng niệm nạn nhân thảm sát Mỹ Lai 1968.' },
      { name: 'Cù Lao Ré', shortDescription: 'Hòn đảo trước bờ biển Quảng Ngãi, cảnh quan nguyên sơ.' },
    ],
    foods: [
      { name: 'Đường phèn Quảng Ngãi', shortDescription: 'Đường phèn thủ công từ mía, đặc sản nổi tiếng cả nước.' },
      { name: 'Bánh đập', shortDescription: 'Bánh tráng nướng giòn đập vỡ, ăn với bánh ướt, chả, rau sống.' },
    ],
    cultureNotes: ['Quảng Ngãi nổi tiếng với phong trào Ba Tơ, căn cứ cách mạng trong kháng chiến chống Pháp và Mỹ.'],
    suggestedLearningQuestions: ['Sự kiện Mỹ Lai đã tác động như thế nào đến phong trào phản chiến thế giới?'],
    relatedPlaces: ['da-nang', 'quang-tri', 'binh-dinh'],
  },
  {
    id: '23',
    slug: 'binh-dinh',
    name: 'Bình Định',
    type: 'province',
    region: 'central',
    coordinates: [14.17, 108.93],
    shortDescription: 'Cố đô của vương quốc Champa, quê hương võ thuật Tây Sơn và chè dây.',
    icon: '🥋',
    accentColor: '#BF360C',
    tags: ['Tây Sơn', 'võ thuật', 'Champa', 'Quy Nhơn'],
    historyHighlights: [
      'Anh hùng Nguyễn Huệ (Quang Trung) xuất thân từ Tây Sơn, đánh tan quân Xiêm (1785) và quân Thanh (1789).',
    ],
    notableHeroes: [
      { name: 'Nguyễn Huệ', period: '1753–1792', shortDescription: 'Vua Quang Trung, anh hùng dân tộc, chiến thắng Kỷ Dậu lịch sử.' },
      { name: 'Nguyễn Nhạc', period: '?–1793', shortDescription: 'Anh trai Nguyễn Huệ, vua Thái Đức nhà Tây Sơn.' },
    ],
    landmarks: [
      { name: 'Tháp Đôi', shortDescription: 'Di tích Champa độc đáo tại Quy Nhơn, kiến trúc đôi hiếm có.' },
      { name: 'Bãi biển Quy Nhơn', shortDescription: 'Bãi biển dài cát trắng, nước trong, điểm du lịch mới nổi.' },
    ],
    foods: [
      { name: 'Bánh hồng', shortDescription: 'Bánh tráng cuốn nhân tôm thịt, chấm nước mắm pha, đặc sản Quy Nhơn.' },
      { name: 'Chả cá Quy Nhơn', shortDescription: 'Chả cá thu giã tay, chiên vàng, giòn dai thơm ngon.' },
    ],
    cultureNotes: ['Bình Định là cái nôi của võ cổ truyền Việt Nam, nổi tiếng với võ phái Tây Sơn.'],
    suggestedLearningQuestions: ['Chiến thắng Kỷ Dậu 1789 có ý nghĩa như thế nào trong lịch sử chống ngoại xâm?'],
    relatedPlaces: ['quang-ngai', 'phu-yen', 'khanh-hoa'],
  },
  {
    id: '24',
    slug: 'phu-yen',
    name: 'Phú Yên',
    type: 'province',
    region: 'central',
    coordinates: [13.09, 109.09],
    shortDescription: 'Vùng đất "Tôi thấy hoa vàng trên cỏ xanh", đầm Ô Loan thơ mộng và ghềnh Đá Đĩa kỳ lạ.',
    icon: '🌻',
    accentColor: '#F9A825',
    tags: ['hoa vàng', 'ghềnh Đá Đĩa', 'đầm Ô Loan'],
    historyHighlights: [
      'Phú Yên là vùng đất được nhắc đến trong tác phẩm "Tôi thấy hoa vàng trên cỏ xanh" của Nguyễn Nhật Ánh.',
    ],
    notableHeroes: [
      { name: 'Lê Thành Phương', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, có công trong giải phóng Phú Yên.' },
      { name: 'Nguyễn Thái Học', period: '1902–1930', shortDescription: 'Nhà cách mạng, sáng lập Việt Nam Quốc dân Đảng, hoạt động tại miền Trung.' },
    ],
    landmarks: [
      { name: 'Ghềnh Đá Đĩa', shortDescription: 'Kỳ quan địa chất với các cột đá basalt hình lục giác đều đặn.' },
      { name: 'Đầm Ô Loan', shortDescription: 'Đầm nước mênh mông, cảnh sắc thơ mộng, đặc sản hàu và sò huyết.' },
    ],
    foods: [
      { name: 'Mắt cá ngừ đại dương', shortDescription: 'Mắt cá ngừ hầm thuốc bắc, món bồi bổ đặc sản Phú Yên.' },
      { name: 'Bánh bèo Phú Yên', shortDescription: 'Bánh bèo chén, rắc tôm chua, mỡ hành, đặc sản xứ Nẫu.' },
    ],
    cultureNotes: ['Phú Yên nổi tiếng với văn hóa "xứ Nẫu" và giọng nói đặc trưng miền Trung duyên dáng.'],
    suggestedLearningQuestions: ['Ghềnh Đá Đĩa được hình thành như thế nào theo địa chất học?'],
    relatedPlaces: ['binh-dinh', 'khanh-hoa'],
  },
  {
    id: '26',
    slug: 'ninh-thuan',
    name: 'Ninh Thuận',
    type: 'province',
    region: 'central',
    coordinates: [11.58, 108.99],
    shortDescription: 'Vùng đất nắng gió, thủ phủ nho và cừu của Việt Nam, văn hóa Chăm Pa đặc sắc.',
    icon: '☀️',
    accentColor: '#E65100',
    tags: ['Chăm Pa', 'nho', 'nắng gió', 'cừu'],
    historyHighlights: [
      'Ninh Thuận là trung tâm văn hóa Chăm Pa lớn nhất Việt Nam với tháp Po Klong Garai và văn hóa Katê.',
    ],
    notableHeroes: [
      { name: 'Po Klong Garai', period: 'Thế kỷ 13', shortDescription: 'Vua Chăm Pa anh minh, xây dựng hệ thống thủy lợi và tháp mang tên mình.' },
      { name: 'Cham Bani imams', period: 'Truyền thống', shortDescription: 'Các tu sĩ Chăm bảo tồn tín ngưỡng Bani và văn hóa bản địa.' },
    ],
    landmarks: [
      { name: 'Tháp Po Klong Garai', shortDescription: 'Quần thể tháp Chăm Pa đẹp nhất Việt Nam, thờ vua Po Klong Garai.' },
      { name: 'Vườn nho Thái An', shortDescription: 'Vườn nho lớn nhất Việt Nam, sản xuất nho và rượu vang.' },
    ],
    foods: [
      { name: 'Nho Ninh Thuận', shortDescription: 'Nho tươi ngọt lịm, đặc sản vùng nắng gió, làm rượu vang ngon.' },
      { name: 'Cơm gà Ninh Thuận', shortDescription: 'Cơm gà nướng, ướp sả ớt, giòn da mềm thịt, đặc sản nắng gió.' },
    ],
    cultureNotes: ['Lễ hội Katê của người Chăm là di sản văn hóa phi vật thể, diễn ra hàng năm vào tháng 7 Chăm lịch.'],
    suggestedLearningQuestions: ['Văn hóa Chăm Pa tại Ninh Thuận có gì đặc biệt so với các dân tộc khác?'],
    relatedPlaces: ['khanh-hoa', 'binh-thuan'],
  },
  {
    id: '27',
    slug: 'binh-thuan',
    name: 'Bình Thuận',
    type: 'province',
    region: 'central',
    coordinates: [11.1, 108.48],
    shortDescription: 'Vùng đất cát trắng, đồi cát bay Mũi Né, thủ phủ thanh long và nước mắm.',
    icon: '🏖️',
    accentColor: '#F57F17',
    tags: ['Mũi Né', 'cát bay', 'thanh long', 'nước mắm'],
    historyHighlights: [
      'Bình Thuận là nơi Bảo Đại thoái vị năm 1945 tại Cung Đài Năng, chấm dứt triều Nguyễn.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Thông', period: '1827–1884', shortDescription: 'Nhà nho yêu nước, thủ khoa, lãnh đạo phong trào Cần Vương Bình Thuận.' },
      { name: 'Nguyễn Trí Phương', period: '1800–1873', shortDescription: 'Danh tướng nhà Nguyễn, chỉ huy phòng tuyến chống Pháp tại miền Trung.' },
    ],
    landmarks: [
      { name: 'Đồi cát bay Mũi Né', shortDescription: 'Kỳ quan thiên nhiên, cồn cát thay đổi hình dáng theo gió, đẹp như Sahara.' },
      { name: 'Tháp Chăm Poshakư', shortDescription: 'Tháp Chăm Pa cổ kính, kiến trúc Hindu giáo độc đáo.' },
    ],
    foods: [
      { name: 'Thanh long Bình Thuận', shortDescription: 'Trái thanh long ngọt mát, đặc sản số một, xuất khẩu đi khắp thế giới.' },
      { name: 'Nước mắm Phú Quốc/Bình Thuận', shortDescription: 'Nước mắm nhĩ thơm ngon, ủ truyền thống từ cá cơm than.' },
    ],
    cultureNotes: ['Bình Thuận là vùng đất "nắng như lửa" nhưng hải sản và trái cây lại phong phú bất ngờ.'],
    suggestedLearningQuestions: ['Đồi cát bay Mũi Né được hình thành và tồn tại như thế nào?'],
    relatedPlaces: ['ninh-thuan', 'dong-nai'],
  },
]

// ─── Data: Highlands Region (Tây Nguyên) ────────────────────────────────────

const highlandsPlaces: VietnamPlace[] = [
  {
    id: '28',
    slug: 'kon-tum',
    name: 'Kon Tum',
    type: 'province',
    region: 'highlands',
    coordinates: [14.33, 107.98],
    shortDescription: 'Cửa ngõ Tây Nguyên, nơi biên giới Việt - Lào - Campuchia gặp nhau, nhà rông cổ kính.',
    icon: '🏠',
    accentColor: '#5D4037',
    tags: ['nhà rông', 'biên giới', 'đồng bào', 'Tây Nguyên'],
    historyHighlights: [
      'Kon Tum là nơi diễn ra chiến dịch Tây Nguyên 1975, mở đầu cuộc tổng tiến công giải phóng miền Nam.',
    ],
    notableHeroes: [
      { name: 'Đặng Thùy Trâm', period: '1942–1970', shortDescription: 'Bác sĩ nữ anh hùng, hy sinh tại đường 14 Tây Nguyên, tác giả Nhật ký Đặng Thùy Trâm.' },
      { name: 'Y Điêng', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người Gia Rai, đại diện tinh thần Tây Nguyên trong kháng chiến.' },
    ],
    landmarks: [
      { name: 'Nhà rông Kon Tum', shortDescription: 'Nhà rông dài nhất Tây Nguyên, biểu tượng kiến trúc dân tộc Ba Na.' },
      { name: 'Ngã ba biên giới', shortDescription: 'Nơi gặp nhau biên giới Việt Nam - Lào - Campuchia, cảnh quan hùng vĩ.' },
    ],
    foods: [
      { name: 'Cơm lam', shortDescription: 'Cơm nếp nướng ống tre, đặc sản rừng núi Tây Nguyên.' },
      { name: 'Rượu cần', shortDescription: 'Rượu lên men trong ché, uống bằng ống cần, văn hóa Tây Nguyên.' },
    ],
    cultureNotes: ['Kon Tum là nơi sinh sống của nhiều dân tộc Ba Na, Gia Rai, Xơ Đăng với văn hóa cồng chiêng.'],
    suggestedLearningQuestions: ['Chiến dịch Tây Nguyên 1975 có vai trò gì trong cuộc giải phóng miền Nam?'],
    relatedPlaces: ['gia-lai', 'dak-lak'],
  },
  {
    id: '29',
    slug: 'gia-lai',
    name: 'Gia Lai',
    type: 'province',
    region: 'highlands',
    coordinates: [13.77, 108.0],
    shortDescription: 'Vùng đất Biển Hồ trên núi, đồng bào Gia Rai và Ba Na với cồng chiêng Tây Nguyên.',
    icon: '🥁',
    accentColor: '#3E2723',
    tags: ['Biển Hồ', 'cồng chiêng', 'Pleiku', 'Gia Rai'],
    historyHighlights: [
      'Hồ T’Nưng (Biển Hồ) là hồ nước ngọt lớn nhất Tây Nguyên, được hình thành từ miệng núi lửa cổ.',
    ],
    notableHeroes: [
      { name: 'Kpă Kloông', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người Gia Rai, lãnh đạo đồng bào kháng chiến.' },
      { name: 'Nguyễn Chánh', period: '1914–1972', shortDescription: 'Tư lệnh mặt trận Tây Nguyên, hy sinh trong kháng chiến chống Mỹ.' },
    ],
    landmarks: [
      { name: 'Hồ T\'Nưng (Biển Hồ)', shortDescription: 'Hồ miệng núi lửa tuyệt đẹp, "mắt xanh" của Tây Nguyên.' },
      { name: 'Đồng cỏ chăn nuôi Ia Grai', shortDescription: 'Thảo nguyên xanh bạt ngàn, cảnh quan đặc trưng Tây Nguyên.' },
    ],
    foods: [
      { name: 'Bún nước mắm Gia Lai', shortDescription: 'Bún cá nước mắm, vị thanh mát, đặc sản Pleiku.' },
      { name: 'Gỏi lá', shortDescription: 'Món gỏi cuốn lá rừng, đặc sản đồng bào Tây Nguyên.' },
    ],
    cultureNotes: ['Cồng chiêng Tây Nguyên được UNESCO công nhận là Kiệt tác Di sản Phi vật thể của Nhân loại.'],
    suggestedLearningQuestions: ['Vì sao cồng chiêng Tây Nguyên được UNESCO công nhận là di sản thế giới?'],
    relatedPlaces: ['kon-tum', 'dak-lak'],
  },
  {
    id: '30',
    slug: 'dak-lak',
    name: 'Đắk Lắk',
    type: 'province',
    region: 'highlands',
    coordinates: [12.71, 108.24],
    shortDescription: 'Thủ phủ cà phê Việt Nam, đất đỏ bazan, voi rừng và thác Dray Nur hùng vĩ.',
    icon: '☕',
    accentColor: '#4E342E',
    tags: ['cà phê', 'voi', 'Buôn Ma Thuột', 'bazan'],
    historyHighlights: [
      'Đắk Lắk là nơi diễn ra chiến dịch Tây Nguyên lịch sử (3/1975), đánh dấu bước ngoặt giải phóng miền Nam.',
    ],
    notableHeroes: [
      { name: 'Y Đơm', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người Ê Đê, lãnh đạo đồng bào kháng chiến.' },
      { name: 'Y Dham Ê Nuôl', period: 'Cận đại', shortDescription: 'Nhà hoạt động cách mạng, người M\'Nông, đại diện tinh thần Tây Nguyên.' },
    ],
    landmarks: [
      { name: 'Thác Dray Nur - Dray Sap', shortDescription: 'Thác nước hùng vĩ giữa rừng nguyên sinh, "thác khói" Tây Nguyên.' },
      { name: 'Buôn Đôn', shortDescription: 'Làng săn voi cổ, trung tâm văn hóa người M\'Nông và nghề săn bắt voi.' },
    ],
    foods: [
      { name: 'Cà phê Buôn Ma Thuột', shortDescription: 'Cà phê rang xay đậm đà, thủ phủ cà phê Việt Nam, hương vị đất đỏ bazan.' },
      { name: 'Bún mắm Đắk Lắk', shortDescription: 'Bún nước mắm cá, vị đậm đà, đặc sản sông Sêrêpôk.' },
    ],
    cultureNotes: ['Đắk Lắk nổi tiếng với văn hóa săn voi Buôn Đôn và không gian cồng chiêng Ê Đê, M\'Nông.'],
    suggestedLearningQuestions: ['Tại sao Buôn Ma Thuột được gọi là thủ phủ cà phê của Việt Nam?'],
    relatedPlaces: ['gia-lai', 'lam-dong', 'kon-tum'],
  },
  {
    id: '31',
    slug: 'lam-dong',
    name: 'Lâm Đồng',
    type: 'province',
    region: 'highlands',
    coordinates: [11.94, 108.47],
    shortDescription: 'Đà Lạt thành phố hoa, thiên đường du lịch, nơi người Pháp xây trạm nghỉ dưỡng châu Á.',
    icon: '🌸',
    accentColor: '#AD1457',
    tags: ['Đà Lạt', 'hoa', 'thanh lịch', 'nghỉ dưỡng'],
    historyHighlights: [
      'Đà Lạt được bác sĩ Alexandre Yersin phát hiện năm 1893, người Pháp xây thành trạm nghỉ dưỡng từ 1907.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Hữu Thọ', period: '1910–1996', shortDescription: 'Nguyên Chủ tịch nước, hoạt động cách mạng tại vùng Nam Trung Bộ - Tây Nguyên.' },
      { name: 'Yersin', period: '1863–1943', shortDescription: 'Nhà bác học, người khám phá cao nguyên Lang Biang, gợi ý xây Đà Lạt.' },
    ],
    landmarks: [
      { name: 'Hồ Xuân Hương', shortDescription: 'Trái tim Đà Lạt, hồ nước trong xanh ngay trung tâm thành phố.' },
      { name: 'Đồi chè Cầu Đất', shortDescription: 'Đồi chè xanh mướt, cảnh quan ngoạn mục, nơi sản xuất chè chất lượng.' },
    ],
    foods: [
      { name: 'Bánh căn Đà Lạt', shortDescription: 'Bánh bột gạo nướng khuôn, nhân mực tôm, chấm nước mắm pha.' },
      { name: 'Dâu tây Đà Lạt', shortDescription: 'Dâu tây tươi ngọt, đặc sản vùng lạnh, làm mứt và rượu vang.' },
    ],
    cultureNotes: ['Đà Lạt nổi tiếng với kiến trúc Pháp thuộc địa, thời tiết ôn đới và văn hóa thanh lịch.'],
    suggestedLearningQuestions: ['Tại sao Yersin đề nghị xây Đà Lạt thành trạm nghỉ dưỡng?'],
    relatedPlaces: ['dak-lak', 'binh-thuan', 'khanh-hoa'],
  },
]

// ─── Data: South Region (Nam Bộ) ─────────────────────────────────────────────

const southPlaces: VietnamPlace[] = [
  // ★★★ RICH ENTRY: TP. Hồ Chí Minh ★★★
  {
    id: '5',
    slug: 'tp-ho-chi-minh',
    name: 'TP. Hồ Chí Minh',
    type: 'city',
    region: 'south',
    coordinates: [10.8231, 106.6297],
    shortDescription:
      'Trung tâm kinh tế lớn nhất Việt Nam, thành phố năng động không ngủ, nơi hội tụ phương Đông và phương Tây.',
    icon: '🌆',
    accentColor: '#D32F2F',
    tags: ['Sài Gòn', 'kinh tế', 'đô thị', 'ẩm thực', 'đổi mới'],
    historyHighlights: [
      'Năm 1698, Nguyễn Hữu Cảnh vào kinh lược phương Nam, lập phủ Gia Định, mở đầu quá trình khai mở vùng đất.',
      '30/4/1975, xe tăng húc đổ cổng Dinh Độc Lập, chấm dứt chiến tranh, thống nhất đất nước.',
      'TP.HCM là động lực kinh tế cả nước, đóng góp khoảng 22% GDP và 27% thu ngân sách quốc gia.',
    ],
    notableHeroes: [
      {
        name: 'Nguyễn Hữu Cảnh',
        period: '1650–1700',
        shortDescription: 'Người mở cõi phương Nam, lập phủ Gia Định năm 1698, mở đường khai mở miền Nam.',
      },
      {
        name: 'Nguyễn Thái Bình',
        period: '1948–1972',
        shortDescription: 'Sinh viên đấu tranh chống chiến tranh VN, hy sinh tại Paris, tượng đài tại TP.HCM.' ,
      },
      {
        name: 'Trương Định',
        period: '1820–1864',
        shortDescription: 'Thủ lĩnh kháng chiến chống Pháp tại Gia Định, tuẫn tiết vì nước.' ,
      },
    ],
    landmarks: [
      { name: 'Dinh Độc Lập', shortDescription: 'Biểu tượng thống nhất, nơi xe tăng húc cổng ngày 30/4/1975.' },
      { name: 'Nhà thờ Đức Bà Sài Gòn', shortDescription: 'Công trình Gothic tuyệt đẹp, biểu tượng Sài Gòn hơn 140 năm.' },
      { name: 'Chợ Bến Thành', shortDescription: 'Chợ trung tâm Sài Gòn hơn 100 năm, biểu tượng thương mại đô thị.' },
      { name: 'Phố đi bộ Nguyễn Huệ', shortDescription: 'Phố đi bộ lung linh ánh đèn, trái tim thành phố về đêm.' },
    ],
    foods: [
      { name: 'Bánh mì Sài Gòn', shortDescription: 'Bánh mì giòn, pate, thịt nguội, rau thơm, nước tương - biểu tượng ẩm thực đường phố thế giới.' },
      { name: 'Cơm tấm', shortDescription: 'Cơm gãy (tấm), sườn nướng, bì, chả, trứng - bữa sáng huyền thoại Sài Gòn.' },
      { name: 'Hủ tiếu Nam Vang', shortDescription: 'Hủ tiếu nước lèo, tôm, thịt heo, gan, trứng cút - đặc sản Sài Gòn gốc Hoa.' },
      { name: 'Gỏi cuốn', shortDescription: 'Cuốn tôm thịt bún, rau sống, chấm nước mắm pha, món đường phố thanh mát.' },
    ],
    cultureNotes: [
      'TP.HCM nổi tiếng với văn hóa cà phê vỉa hè và nhịp sống không ngủ, pha trộn Đông - Tây.',
      'Sài Gòn - TP.HCM là nơi hội tụ của nhiều nền văn hóa: Việt, Hoa, Chăm, Khmer và phương Tây.',
    ],
    suggestedLearningQuestions: [
      'Nguyễn Hữu Cảnh đã đóng vai trò gì trong quá trình khai mở miền Nam?',
      'Sự kiện 30/4/1975 có ý nghĩa lịch sử như thế nào đối với dân tộc Việt Nam?',
      'Tại sao bánh mì Sài Gòn được báo chí quốc tế ca ngợi?',
    ],
    relatedPlaces: ['dong-nai', 'can-tho', 'tay-ninh'],
  },

  // ★★★ RICH ENTRY: Cần Thơ ★★★
  {
    id: '6',
    slug: 'can-tho',
    name: 'Cần Thơ',
    type: 'city',
    region: 'south',
    coordinates: [10.0371, 105.7882],
    shortDescription:
      'Thủ phủ miền Tây, chợ nổi Cái Răng, sông nước mênh mông, cơm hẩm và bánh xèo trứ danh.',
    icon: '🛶',
    accentColor: '#1B5E20',
    tags: ['chợ nổi', 'miền Tây', 'sông nước', 'cơm hẩm'],
    historyHighlights: [
      'Cần Thơ là trung tâm sông nước miền Tây từ thế kỷ 18, nơi giao thương sầm uất trên sông Mê Kông.',
      'Năm 2025, Cần Thơ sáp nhập với Hậu Giang và Sóc Trăng theo Nghị quyết 60-NQ/TW.',
      'Chợ nổi Cái Răng là di sản văn hóa phi vật thể, phản ánh lối sống sông nước đặc trưng.',
    ],
    notableHeroes: [
      {
        name: 'Nguyễn Trung Trực',
        period: '1838–1868',
        shortDescription: 'Anh hùng dân tộc, đốt tàu Esperance trên sông Vàm Cố, tử hình tại Rạch Giá.' ,
      },
      {
        name: 'Phan Văn Gião',
        period: 'Cận đại',
        shortDescription: 'Anh hùng LLVTND, lãnh đạo kháng chiến tại Cần Thơ.' },
      {
        name: 'Hồ Ngọc Cẩn',
        period: '1927–1970',
        shortDescription: 'Anh hùng LLVTND, hy sinh anh dũng tại chiến trường miền Tây.' },
    ],
    landmarks: [
      { name: 'Chợ nổi Cái Răng', shortDescription: 'Chợ nổi lớn nhất đồng bằng sông Cửu Long, văn hóa giao thương trên sông.' },
      { name: 'Chợ nổi Phong Điền', shortDescription: 'Chợ nổi sầm uất, gần trung tâm, trải nghiệm sông nước miền Tây.' },
      { name: 'Bình thủy cổ tự', shortDescription: 'Ngôi chùa cổ linh thiêng, kiến trúc kết hợp Việt - Hoa - Khmer.' },
      { name: 'Cầu Cần Thơ', shortDescription: 'Cầu dây văng dài nhất Đông Nam Á, biểu tượng đô thị miền Tây.' },
    ],
    foods: [
      { name: 'Cơm hẩm', shortDescription: 'Cơm tấm đồ hẩm, ăn với chả, trứng, thịt kho, đặc sản Cần Thơ.' },
      { name: 'Bánh xèo Cần Thơ', shortDescription: 'Bánh xèo to bản, giòn rụm, nhân tôm thịt giá đỗ, cuốn bánh tráng.' },
      { name: 'Bún mắm', shortDescription: 'Bún nước mắm cá linh, đính đính, rau muống, đậm đà sông nước.' },
      { name: 'Lẩu mắm', shortDescription: 'Lẩu mắm cá sặt, cá linh, thịt ba chỉ, rau thủy sinh, đặc sản miền Tây.' },
    ],
    cultureNotes: [
      'Văn hóa chợ nổi phản ánh lối sống gắn liền với con sông, mua bán trên thuyền từ đời này sang đời khác.',
      'Cần Thơ nổi tiếng với câu "Cần Thơ gạo trắng nước trong, ai về đó với lòng mong đợi chờ".',
    ],
    suggestedLearningQuestions: [
      'Văn hóa chợ nổi hình thành và phát triển như thế nào tại miền Tây?',
      'Nguyễn Trung Trực đã thể hiện tinh thần yêu nước như thế nào qua việc đốt tàu Esperance?',
      'Vai trò của sông Mê Kông đối với đời sống người dân đồng bằng sông Cửu Long?',
    ],
    relatedPlaces: ['an-giang', 'dong-thap', 'vinh-long'],
  },

  // ★★★ RICH ENTRY: Kiên Giang (includes Phú Quốc) ★★★
  {
    id: '38',
    slug: 'kien-giang',
    name: 'Kiên Giang',
    type: 'province',
    region: 'south',
    coordinates: [10.01, 105.08],
    shortDescription:
      'Vùng đất biên giới Tây Nam, đảo ngọc Phú Quốc, hải sản tươi sống và nước mắm danh tiếng.',
    icon: '🐚',
    accentColor: '#00695C',
    tags: ['Phú Quốc', 'nước mắm', 'hải sản', 'biên giới', 'đảo ngọc'],
    historyHighlights: [
      'Phú Quốc là đảo lớn nhất Việt Nam, được phát triển thành đặc khu kinh tế và du lịch biển quốc tế.',
      'Nước mắm Phú Quốc là sản phẩm địa lý chỉ dẫn gốc, được bảo hộ tại EU từ 2012.',
      'Kiên Giang có biên giới biển và đất liền với Campuchia, cửa khẩu quốc tế Hà Tiên.',
    ],
    notableHeroes: [
      {
        name: 'Nguyễn Trung Trực',
        period: '1838–1868',
        shortDescription: 'Anh hùng dân tộc, đốt tàu Pháp trên sông Vàm Cố, tử hình tại Rạch Giá, Kiên Giang.' ,
      },
      {
        name: 'Mạc Cửu',
        period: '1655–1735',
        shortDescription: 'Người Hoa khai phá vùng Hà Tiên, dâng đất cho chúa Nguyễn, lập nên trấn Hà Tiên.' },
      {
        name: 'Mạc Thiên Tích',
        period: '1718–1780',
        shortDescription: 'Con Mạc Cửu, tiếp tục khai phá Hà Tiên, lập Tao đàn Chiêu Anh Các.' },
    ],
    landmarks: [
      { name: 'Đảo Phú Quốc', shortDescription: 'Đảo ngọc lớn nhất VN, bãi sao, rừng nguyên sinh, nước mắm nhĩ, cá hồi.' },
      { name: 'Hà Tiên', shortDescription: 'Thị xã biên giới thơ mộng, Thạch Động, Mũi Nai, chùa Hang.' },
      { name: 'Đền Nguyễn Trung Trực', shortDescription: 'Đền thờ anh hùng dân tộc, tại Rạch Giá, nơi ông tử hình.' },
      { name: 'Vườn quốc gia Phụ Quốc', shortDescription: 'Vườn quốc gia trên đảo, bảo vệ rừng mưa nhiệt đới và san hô.' },
    ],
    foods: [
      { name: 'Nước mắm Phú Quốc', shortDescription: 'Nước mắm nhĩ ủ thùng bời gỗ, màu nâu cánh gián, vị mặn hậu, thơm dịu.' },
      { name: 'Bún quậy Phú Quốc', shortDescription: 'Bún tươi với chả tôm cá, tự pha nước mắm chua ngọt, ăn kèm rau rừng.' },
      { name: 'Gỏi cá trích Phú Quốc', shortDescription: 'Gỏi cá trích tươi, dừa nạo, hành tây, rau rừng, chấm nước mắm chua ngọt.' },
      { name: 'Hải sản Hà Tiên', shortDescription: 'Cua, ghẹ, tôm hùm, ốc hương tươi sống từ vùng biển Hà Tiên.' },
    ],
    cultureNotes: [
      'Nghề làm nước mắm Phú Quốc đã hơn 200 năm, truyền thống ủ cá cơm than trong thùng bời gỗ.',
      'Kiên Giang là vùng giao thoa văn hóa Việt - Hoa - Khmer, thể hiện qua kiến trúc và lễ hội.',
    ],
    suggestedLearningQuestions: [
      'Nghề làm nước mắm Phú Quốc có gì đặc biệt so với các vùng khác?',
      'Nguyễn Trung Trực đã thể hiện tinh thần yêu nước như thế nào?',
      'Tại sao Phú Quốc được gọi là "đảo ngọc"?',
    ],
    relatedPlaces: ['an-giang', 'ca-mau', 'can-tho'],
  },

  // Basic entries: South region
  {
    id: '32',
    slug: 'dong-nai',
    name: 'Đồng Nai',
    type: 'province',
    region: 'south',
    coordinates: [11.1, 107.06],
    shortDescription: 'Vùng đất công nghiệp năng động, vườn quốc gia Cát Tiên và hồ Trị An.',
    icon: '🏭',
    accentColor: '#558B2F',
    tags: ['công nghiệp', 'Cát Tiên', 'Biên Hòa', 'hồ Trị An'],
    historyHighlights: [
      'Đồng Nai là một trong những tỉnh công nghiệp phát triển nhất miền Nam sau Đổi Mới.',
    ],
    notableHeroes: [
      { name: 'Trần Văn Ến', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, lãnh đạo kháng chiến tại Đồng Nai.' },
      { name: 'Huỳnh Văn Nghệ', period: '1912–1977', shortDescription: 'Tư lệnh phân khu 5, lãnh đạo kháng chiến miền Đông Nam Bộ.' },
    ],
    landmarks: [
      { name: 'Vườn quốc gia Cát Tiên', shortDescription: 'Khu dự trữ thiên nhiên, bảo tồn voi châu Á và đa dạng sinh học.' },
      { name: 'Hồ Trị An', shortDescription: 'Hồ thủy điện lớn, điểm du lịch sinh thái, câu cá giải trí.' },
    ],
    foods: [
      { name: 'Bánh bèo Biên Hòa', shortDescription: 'Bánh bèo chén, rắc tôm chua mỡ hành, đặc sản Biên Hòa.' },
      { name: 'Thịt rừng Đồng Nai', shortDescription: 'Các món nướng từ thịt rừng (heo rừng, nai), đặc sản vùng đất đỏ.' },
    ],
    cultureNotes: ['Đồng Nai là vùng đất đa dạng dân tộc: Việt, Hoa, Chăm, Stiêng, Mạ với văn hóa rực rỡ.'],
    suggestedLearningQuestions: ['Vườn quốc gia Cát Tiên đóng vai trò gì trong bảo tồn đa dạng sinh học?'],
    relatedPlaces: ['tp-ho-chi-minh', 'binh-phuoc', 'lam-dong'],
  },
  {
    id: '33',
    slug: 'tay-ninh',
    name: 'Tây Ninh',
    type: 'province',
    region: 'south',
    coordinates: [11.32, 106.06],
    shortDescription: 'Quê hương đạo Cao Đài, Núi Bà Đen thiêng liêng và biên giới Việt - Campuchia.',
    icon: '🕌',
    accentColor: '#F9A825',
    tags: ['Cao Đài', 'Núi Bà Đen', 'biên giới'],
    historyHighlights: [
      'Tòa Thánh Cao Đài tại Tây Ninh là trung tâm tín ngưỡng Cao Đài, tôn giáo nội sinh Việt Nam.',
    ],
    notableHeroes: [
      { name: 'Phạm Công Tắc', period: '1890–1959', shortDescription: 'Giáo chủ đạo Cao Đài, sáng lập tôn giáo nội sinh Việt Nam.' },
      { name: 'Nguyễn Văn Rinh', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, lãnh đạo kháng chiến tại Tây Ninh.' },
    ],
    landmarks: [
      { name: 'Tòa Thánh Cao Đài', shortDescription: 'Trung tâm đạo Cao Đài, kiến trúc rực rỡ kết hợp Đông - Tây.' },
      { name: 'Núi Bà Đen', shortDescription: 'Núi thiêng Tây Ninh, đỉnh cao 986m, chùa Bà linh thiêng.' },
    ],
    foods: [
      { name: 'Muối Tây Ninh', shortDescription: 'Muối ớt xanh, muối tôm, đặc sản chấm trái cây và thịt nướng.' },
      { name: 'Bánh tráng phơi sương', shortDescription: 'Bánh tráng mỏng dẻo, chấm muối Tây Ninh, ăn vặt ngon.' },
    ],
    cultureNotes: ['Đạo Cao Đài là tôn giáo độc đáo duy nhất của Việt Nam, kết hợp Nho - Phật - Đạo - Thiên Chúa.'],
    suggestedLearningQuestions: ['Đạo Cao Đài có gì đặc biệt so với các tôn giáo khác?'],
    relatedPlaces: ['tp-ho-chi-minh', 'dong-nai', 'binh-phuoc'],
  },
  {
    id: '34',
    slug: 'binh-phuoc',
    name: 'Bình Phước',
    type: 'province',
    region: 'south',
    coordinates: [11.75, 106.9],
    shortDescription: 'Vùng đất đỏ bazan, thủ phủ điều và cao su, cửa ngõ miền Đông Nam Bộ.',
    icon: '🥜',
    accentColor: '#8D6E63',
    tags: ['điều', 'cao su', 'bazan', 'miền Đông'],
    historyHighlights: [
      'Bình Phước là nơi diễn ra nhiều trận đánh quan trọng trong chiến dịch Hồ Chí Minh 1975.',
    ],
    notableHeroes: [
      { name: 'Lý Tòng Bá', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người S\'Tiêng, lãnh đạo đồng bào kháng chiến.' },
      { name: 'Nguyễn Văn Bé', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, có công trong giải phóng miền Đông Nam Bộ.' },
    ],
    landmarks: [
      { name: 'Thác Mơ', shortDescription: 'Thác nước trên sông Bé, cảnh quan thiên nhiên hùng vĩ.' },
      { name: 'Cửa khẩu Hoa Lư', shortDescription: 'Cửa khẩu quốc tế nối Việt Nam - Campuchia, phát triển kinh tế biên giới.' },
    ],
    foods: [
      { name: 'Nhân điều Bình Phước', shortDescription: 'Nhân điều rang giòn bùi, xuất khẩu đi khắp thế giới.' },
      { name: 'Rượu cần', shortDescription: 'Rượu cần dân tộc S\'Tiêng, M\'Nông, văn hóa bản địa Tây Nguyên - Nam Bộ.' },
    ],
    cultureNotes: ['Bình Phước là vùng đất của đồng bào S\'Tiêng, M\'Nông với văn hóa cồng chiêng và nhà dài.'],
    suggestedLearningQuestions: ['Tại sao Bình Phước được gọi là thủ phủ điều của Việt Nam?'],
    relatedPlaces: ['dong-nai', 'tay-ninh', 'dak-lak'],
  },
  {
    id: '35',
    slug: 'long-an',
    name: 'Long An',
    type: 'province',
    region: 'south',
    coordinates: [10.69, 106.25],
    shortDescription: 'Vùng đất cửa ngõ miền Tây, cánh đồng lúa và vườn trái cây bạt ngàn.',
    icon: '🌾',
    accentColor: '#827717',
    tags: ['lúa', 'cửa ngõ', 'vườn cây', 'miền Tây'],
    historyHighlights: [
      'Long An là tỉnh cửa ngõ vào đồng bằng sông Cửu Long, tuyến đường chiến lược trong kháng chiến.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Hữu Thọ', period: '1910–1996', shortDescription: 'Nguyên Chủ tịch nước, sinh tại Long An, lãnh đạo Mặt trận Dân tộc Giải phóng miền Nam.' },
      { name: 'Tôn Đức Thắng', period: '1888–1980', shortDescription: 'Nguyên Chủ tịch nước, sinh tại Long An, người đứng đầu nhà nước VNDCCH.' },
    ],
    landmarks: [
      { name: 'Đồng Tháp Mười', shortDescription: 'Vùng đồng nước mùa lũ, cảnh quan sinh thái đặc trưng miền Tây.' },
      { name: 'Chùa Vĩnh Nham', shortDescription: 'Ngôi chùa cổ giữa đồng quê, linh thiêng và thanh bình.' },
    ],
    foods: [
      { name: 'Cá linh tiêu', shortDescription: 'Cá linh mùa nước nổi, chiên giòn, chấm mắm me, đặc sản Long An.' },
      { name: 'Bánh da lợn', shortDescription: 'Bánh ngọt nhiều lớp, mềm dẻo, đặc sản vùng quê Long An.' },
    ],
    cultureNotes: ['Long An nổi tiếng với văn hóa "mùa nước nổi" và sinh thái đồng Tháp Mười.'],
    suggestedLearningQuestions: ['Sinh thái mùa nước nổi tại Long An có gì đặc biệt?'],
    relatedPlaces: ['tp-ho-chi-minh', 'dong-thap', 'tien-giang'],
  },
  {
    id: '36',
    slug: 'an-giang',
    name: 'An Giang',
    type: 'province',
    region: 'south',
    coordinates: [10.68, 105.13],
    shortDescription: 'Vùng đất Núi Sam thiêng, văn hóa Chăm Pa và lúa gạo đồng bằng sông Cửu Long.',
    icon: '🏔️',
    accentColor: '#1A237E',
    tags: ['Núi Sam', 'Chăm', 'lúa gạo', 'biên giới'],
    historyHighlights: [
      'Núi Sam là ngọn núi thiêng nổi tiếng, nơi Lady Chúa Xứ linh thiêng, hàng triệu khách hành hương mỗi năm.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Trung Trực', period: '1838–1868', shortDescription: 'Anh hùng dân tộc, hoạt động tại vùng An Giang - Rạch Giá.' },
      { name: 'Thoại Ngọc Hầu', period: '1761–1829', shortDescription: 'Danh thần nhà Nguyễn, đào kênh Vĩnh Tế, khai mở vùng Tây Nam Bộ.' },
    ],
    landmarks: [
      { name: 'Núi Sam', shortDescription: 'Núi thiêng, chùa Lady Chúa Xứ, miếu Bà Chúa Xứ linh thiêng.' },
      { name: 'Kênh Vĩnh Tế', shortDescription: 'Kênh đào lịch sử nối Châu Đốc - Hà Tiên, công trình Thoại Ngọc Hầu.' },
    ],
    foods: [
      { name: 'Bò cạp Núi Sam', shortDescription: 'Bò nướng lu, đặc sản vùng núi Sam, thịt mềm thơm.' },
      { name: 'Bún mắm An Giang', shortDescription: 'Bún nước mắm cá linh, dính dính, rau ngổ, đặc sản sông nước.' },
    ],
    cultureNotes: ['An Giang có cộng đồng Chăm Pa lớn, bảo tồn văn hóa Hồi giáo và nghề dệt thổ cẩm Chăm.'],
    suggestedLearningQuestions: ['Kênh Vĩnh Tế được đào dưới thời nào và có ý nghĩa gì?'],
    relatedPlaces: ['kien-giang', 'can-tho', 'dong-thap'],
  },
  {
    id: '37',
    slug: 'dong-thap',
    name: 'Đồng Tháp',
    type: 'province',
    region: 'south',
    coordinates: [10.47, 105.67],
    shortDescription: 'Vùng đất sen hồng, đầm sen ngút ngàn, quê hương cụ Nguyễn Sinh Sắc.',
    icon: '🪷',
    accentColor: '#E91E63',
    tags: ['sen hồng', 'Ninh Kiều', 'Nguyễn Sinh Sắc', 'mùa nước nổi'],
    historyHighlights: [
      'Đồng Tháp là quê hương cụ Nguyễn Sinh Sắc, thân phụ Chủ tịch Hồ Chí Minh, an nghỉ tại Cao Lãnh.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Sinh Sắc', period: '1862–1929', shortDescription: 'Thân phụ Bác Hồ, cựu giảng sư, an nghỉ tại Đồng Tháp.' },
      { name: 'Nguyễn Hữu Thọ', period: '1910–1996', shortDescription: 'Nguyên Chủ tịch nước, lãnh đạo Mặt trận Dân tộc Giải phóng miền Nam.' },
    ],
    landmarks: [
      { name: 'Khu di tích Nguyễn Sinh Sắc', shortDescription: 'Nơi thờ cụ Nguyễn Sinh Sắc, kiến trúc đẹp bên sông Cao Lãnh.' },
      { name: 'Vườn quốc gia Tràm Chim', shortDescription: 'Vườn chim tự nhiên, bảo tồn sếu đầu đỏ và sinh thái đồng nước.' },
    ],
    foods: [
      { name: 'Cá lóc nướng trui', shortDescription: 'Cá lóc nướng nguyên con trên rơm, chấm nước mắm me, đặc sản miền Tây.' },
      { name: 'Lẩu mắm Đồng Tháp', shortDescription: 'Lẩu mắm cá sặt, cá linh, thịt ba chỉ, rau thủy sinh.' },
    ],
    cultureNotes: ['Đồng Tháp nổi tiếng với hoa sen - biểu tượng tỉnh, và sinh thái mùa nước nổi đặc trưng.'],
    suggestedLearningQuestions: ['Tại sao sen được chọn là biểu tượng của Đồng Tháp?'],
    relatedPlaces: ['an-giang', 'can-tho', 'long-an'],
  },
  {
    id: '39',
    slug: 'ca-mau',
    name: 'Cà Mau',
    type: 'province',
    region: 'south',
    coordinates: [9.18, 105.15],
    shortDescription: 'Đất Mũi cực Nam Tổ quốc, rừng ngập mặn lớn nhất và tôm cá đầy sông.',
    icon: '🦐',
    accentColor: '#004D40',
    tags: ['Đất Mũi', 'rừng ngập mặn', 'tôm', 'cực Nam'],
    historyHighlights: [
      'Mũi Cà Mau là điểm cực Nam của Việt Nam trên đất liền, nơi "đất lành chim đậu".',
    ],
    notableHeroes: [
      { name: 'Mạc Cửu', period: '1655–1735', shortDescription: 'Người Hoa khai phá vùng đất Nam Bộ, dâng đất cho chúa Nguyễn.' },
      { name: 'Phan Ngọc Hiển', period: '1910–1941', shortDescription: 'Nhà cách mạng, hy sinh tại Cà Mau, tên đặt cho trường học.' },
    ],
    landmarks: [
      { name: 'Mũi Cà Mau', shortDescription: 'Điểm cực Nam Tổ quốc, nơi đất nước vươn ra biển, du lịch sinh thái.' },
      { name: 'Vườn quốc gia Mũi Cà Mau', shortDescription: 'Rừng ngập mặn lớn nhất, sinh thái đặc thù, chim muông bầy đàn.' },
    ],
    foods: [
      { name: 'Tôm Cà Mau', shortDescription: 'Tôm sú, tôm thẻ, tôm đất tươi ngon, đặc sản số một vùng Mũi.' },
      { name: 'Cua biển Cà Mau', shortDescription: 'Cua thịt, cua gạch, đặc sản vùng rừng ngập mặn.' },
    ],
    cultureNotes: ['Cà Mau nổi tiếng với rừng ngập mặn và văn hóa "sông nước" đặc trưng miền Tây sương nước.'],
    suggestedLearningQuestions: ['Rừng ngập mặn Cà Mau có vai trò gì trong bảo vệ môi trường?'],
    relatedPlaces: ['kien-giang', 'bac-lieu'],
  },
  {
    id: '40',
    slug: 'ben-tre',
    name: 'Bến Tre',
    type: 'province',
    region: 'south',
    coordinates: [10.24, 106.38],
    shortDescription: 'Xứ dừa xanh, quê hương của phong trào Đồng Khởi, cốt cách người miền Tây.',
    icon: '🥥',
    accentColor: '#33691E',
    tags: ['dừa', 'Đồng Khởi', 'miền Tây', 'kẹo dừa'],
    historyHighlights: [
      'Phong trào Đồng Khởi (1960) bùng nổ đầu tiên tại Bến Tre, do bà Nguyễn Thị Định lãnh đạo.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Thị Định', period: '1920–1992', shortDescription: 'Nữ tướng đầu tiên Quân đội Nhân dân, lãnh đạo Đồng Khởi Bến Tre.' },
      { name: 'Võ Thị Sáu', period: '1933–1952', shortDescription: 'Nữ anh hùng, hy sinh年仅19岁 tại Côn Đảo, linh thiêng Bến Tre.' },
    ],
    landmarks: [
      { name: 'Cồn Phụng', shortDescription: 'Cồn dừa du lịch sinh thái, nơi lưu giữ di tích Đạo Dừa.' },
      { name: 'Khu lưu niệm Nguyễn Thị Định', shortDescription: 'Nơi tưởng niệm nữ tướng, biểu tượng phong trào Đồng Khởi.' },
    ],
    foods: [
      { name: 'Kẹo dừa Bến Tre', shortDescription: 'Kẹo làm từ nước cốt dừa, đậu phộng, đặc sản trứ danh xứ dừa.' },
      { name: 'Chuối đập', shortDescription: 'Chuối chín đập dập, lăn bột chiên giòn, chấm mật ong.' },
    ],
    cultureNotes: ['Bến Tre là "xứ dừa" với hàng ngàn hecta dừa, mọi thứ đều làm từ dừa.'],
    suggestedLearningQuestions: ['Phong trào Đồng Khởi đã ảnh hưởng như thế nào đến cuộc kháng chiến miền Nam?'],
    relatedPlaces: ['tra-vinh', 'vinh-long', 'tp-ho-chi-minh'],
  },
  {
    id: '41',
    slug: 'vinh-long',
    name: 'Vĩnh Long',
    type: 'province',
    region: 'south',
    coordinates: [10.25, 105.97],
    shortDescription: 'Vùng đất giữa hai dòng sông Tiền và sông Hậu, vườn trái cây bạt ngàn.',
    icon: '🍊',
    accentColor: '#EF6C00',
    tags: ['vườn cây', 'sông Tiền', 'sông Hậu', 'miền Tây'],
    historyHighlights: [
      'Vĩnh Long nằm giữa hai nhánh sông Mê Kông, là vùng đất trù phú từ thời khai mở phương Nam.',
    ],
    notableHeroes: [
      { name: 'Nguyễn Trực', period: 'Cận đại', shortDescription: 'Nhà yêu nước, lãnh đạo phong trào kháng chiến tại Vĩnh Long.' },
      { name: 'Phan Văn Đởm', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, có công trong kháng chiến tại Vĩnh Long.' },
    ],
    landmarks: [
      { name: 'Vườn trái cây Vĩnh Long', shortDescription: 'Vườn cây ăn trái đa dạng: chôm chôm, sầu riêng, bưởi, cam.' },
      { name: 'Cù lao An Bình', shortDescription: 'Cù lao giữa sông Tiền, vườn trái cây và homestay du lịch.' },
    ],
    foods: [
      { name: 'Bánh tét Vĩnh Long', shortDescription: 'Bánh tét nhân đậu xanh thịt, gói lá chuối, đặc sản miền Tây.' },
      { name: 'Chôm chôm Vĩnh Long', shortDescription: 'Chôm chôm ngọt lịm, cùi dày, đặc sản vườn cây miền Tây.' },
    ],
    cultureNotes: ['Vĩnh Long nổi tiếng với văn hóa vườn và lối sống sông nước thanh bình giữa hai dòng sông.'],
    suggestedLearningQuestions: ['Vị trí giữa hai sông Tiền - Hậu mang lại lợi thế gì cho Vĩnh Long?'],
    relatedPlaces: ['can-tho', 'ben-tre', 'dong-thap'],
  },
  {
    id: '42',
    slug: 'soc-trang',
    name: 'Sóc Trăng',
    type: 'province',
    region: 'south',
    coordinates: [9.6, 105.98],
    shortDescription: 'Vùng đất của người Khmer, chùa Dơi kỳ lạ và bánh pía trứ danh.',
    icon: '🦇',
    accentColor: '#FF6F00',
    tags: ['Khmer', 'chùa Dơi', 'bánh pía', 'đa văn hóa'],
    historyHighlights: [
      'Sóc Trăng là nơi sinh sống của cộng đồng Khmer lớn nhất miền Tây, bảo tồn văn hóa Chol Chnam Thmay.',
    ],
    notableHeroes: [
      { name: 'Son Kỳ', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người Khmer, lãnh đạo đồng bào kháng chiến.' },
      { name: 'Lâm Quang Thi', period: 'Cận đại', shortDescription: 'Nhà cách mạng, lãnh đạo phong trào tại Sóc Trăng.' },
    ],
    landmarks: [
      { name: 'Chùa Dơi (Mã Tộc)', shortDescription: 'Chùa cổ với hàng ngàn con dơi treo trên cây, cảnh quan độc đáo.' },
      { name: 'Chùa Đất Sét', shortDescription: 'Chùa với toàn bộ tượng và kiến trúc bằng đất sét, kỳ công.' },
    ],
    foods: [
      { name: 'Bánh pía Sóc Trăng', shortDescription: 'Bánh ngọt nhân sầu riêng, đậu xanh, đặc sản Khmer - Hoa.' },
      { name: 'Bún nước lèo', shortDescription: 'Bún nước mắm cá, thịt heo, chả, nghệ, đặc sản Sóc Trăng.' },
    ],
    cultureNotes: ['Sóc Trăng nổi tiếng với lễ hội Chol Chnam Thmay (Năm mới Khmer) và Ok Om Bok (cúng trăng).'],
    suggestedLearningQuestions: ['Văn hóa Khmer tại Sóc Trăng có gì đặc sắc?'],
    relatedPlaces: ['can-tho', 'bac-lieu', 'tra-vinh'],
  },
  {
    id: '43',
    slug: 'bac-lieu',
    name: 'Bạc Liêu',
    type: 'province',
    region: 'south',
    coordinates: [9.29, 105.72],
    shortDescription: 'Vùng đất của công tử Bạc Liêu, đờn ca tài tử và lúa gạo miền Tây.',
    icon: '🎵',
    accentColor: '#6A1B9A',
    tags: ['công tử', 'đờn ca', 'tài tử', 'lúa gạo'],
    historyHighlights: [
      'Công tử Bạc Liêu là nhân vật huyền thoại, đại gia phú nông, sống phóng khoáng giữa thập niên 1930.',
    ],
    notableHeroes: [
      { name: 'Cao Văn Lương', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, lãnh đạo kháng chiến tại Bạc Liêu.' },
      { name: 'Lê Quang Vinh', period: 'Cận đại', shortDescription: 'Nhà hoạt động cách mạng, lãnh đạo phong trào tại Bạc Liêu.' },
    ],
    landmarks: [
      { name: 'Nhà công tử Bạc Liêu', shortDescription: 'Biệt thự cổ Pháp thuộc địa, nhân chứng thời vàng son công tử.' },
      { name: 'Vườn chim Bạc Liêu', shortDescription: 'Vườn chim tự nhiên, bảo tồn sinh thái vùng ngập mặn.' },
    ],
    foods: [
      { name: 'Tôm khô Bạc Liêu', shortDescription: 'Tôm khô rim me, mặn ngọt, đặc sản xứ biển miền Tây.' },
      { name: 'Bánh phồng tôm', shortDescription: 'Bánh phồng chiên xôi giòn, nhân tôm, ăn kèm gỏi.' },
    ],
    cultureNotes: ['Bạc Liêu là cái nôi của đờn ca tài tử, nghệ thuật biểu diễn đặc trưng miền Tây Nam Bộ.'],
    suggestedLearningQuestions: ['Đờn ca tài tử ra đời và phát triển như thế nào tại miền Tây?'],
    relatedPlaces: ['soc-trang', 'ca-mau', 'hau-giang'],
  },
  {
    id: '44',
    slug: 'tra-vinh',
    name: 'Trà Vinh',
    type: 'province',
    region: 'south',
    coordinates: [9.83, 106.34],
    shortDescription: 'Vùng đất gió bàu, cộng đồng Khmer đông đảo và biển Ba Đông xanh mát.',
    icon: '🌊',
    accentColor: '#00796B',
    tags: ['Khmer', 'biển Ba Đông', 'gió bàu', 'dừa'],
    historyHighlights: [
      'Trà Vinh có cộng đồng Khmer đông đảo thứ hai miền Tây, bảo tồn chùa tháp và văn hóa truyền thống.',
    ],
    notableHeroes: [
      { name: 'Tà Ốt', period: 'Cận đại', shortDescription: 'Anh hùng LLVTND, người Khmer, lãnh đạo đồng bào kháng chiến.' },
      { name: 'Nguyễn Phước Lộc', period: 'Cận đại', shortDescription: 'Nhà cách mạng, lãnh đạo phong trào tại Trà Vinh.' },
    ],
    landmarks: [
      { name: 'Biển Ba Đông', shortDescription: 'Bãi biển hoang sơ, cát đen, gió mát, điểm du lịch mới.' },
      { name: 'Chùa Âng', shortDescription: 'Chùa Khmer cổ kính, kiến trúc đặc trưng và linh thiêng.' },
    ],
    foods: [
      { name: 'Bánh canh Trà Vinh', shortDescription: 'Bánh canh sợi to, nước dùng tôm thịt, đặc sản địa phương.' },
      { name: 'Dừa Trà Vinh', shortDescription: 'Dừa tươi nước ngọt lịm, đặc sản xứ dừa gió bàu.' },
    ],
    cultureNotes: ['Trà Vinh nổi tiếng với chùa Khmer và lễ hội Sene Dolta (cúng ông bà) của người Khmer.'],
    suggestedLearningQuestions: ['Cộng đồng Khmer tại Trà Vinh bảo tồn văn hóa như thế nào?'],
    relatedPlaces: ['ben-tre', 'vinh-long', 'soc-trang'],
  },
  {
    id: '45',
    slug: 'hau-giang',
    name: 'Hậu Giang',
    type: 'province',
    region: 'south',
    coordinates: [9.91, 105.73],
    shortDescription: 'Vùng đất xẻ đôi dòng Hậu, vườn cây trái và lúa gạo ven sông.',
    icon: '🌴',
    accentColor: '#2E7D32',
    tags: ['sông Hậu', 'vườn cây', 'lúa gạo'],
    historyHighlights: [
      'Hậu Giang (Cần Thơ cũ) từng là tỉnh lớn, chia tách năm 2004 thành Cần Thơ và Hậu Giang.',
    ],
    notableHeroes: [
      { name: 'Hồ Ngọc Cẩn', period: '1927–1970', shortDescription: 'Anh hùng LLVTND, hy sinh tại chiến trường Hậu Giang.' },
      { name: 'Lê Quang Vinh', period: 'Cận đại', shortDescription: 'Nhà hoạt động cách mạng, lãnh đạo phong trào tại Hậu Giang.' },
    ],
    landmarks: [
      { name: 'Chợ nổi Ngã Bảy', shortDescription: 'Ngã bảy sông, chợ nổi sầm uất, giao thương sông nước.' },
      { name: 'Vườn quốc gia Phụng Hiệp', shortDescription: 'Vườn sinh thái ngập nước, sinh thái đặc thù đồng bằng sông Cửu Long.' },
    ],
    foods: [
      { name: 'Bánh xèo Hậu Giang', shortDescription: 'Bánh xèo miền Tây, to bản giòn rụm, cuốn bánh tráng.' },
      { name: 'Lẩu mắm Hậu Giang', shortDescription: 'Lẩu mắm cá, rau thủy sinh, đặc sản ven sông Hậu.' },
    ],
    cultureNotes: ['Hậu Giang nổi tiếng với văn hóa sông nước và vườn trái cây bạt ngàn ven sông Hậu.'],
    suggestedLearningQuestions: ['Vai trò của sông Hậu đối với đời sống người dân Hậu Giang?'],
    relatedPlaces: ['can-tho', 'soc-trang', 'kien-giang'],
  },
]

// ─── Data: Islands (Quần đảo) ───────────────────────────────────────────────

const islandPlaces: VietnamPlace[] = [
  // ★★★ RICH ENTRY: Hoàng Sa ★★★
  {
    id: '46',
    slug: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    type: 'archipelago',
    region: 'islands',
    coordinates: [16.5, 111.6],
    shortDescription:
      'Quần đảo Hoàng Sa — lãnh thổ Việt Nam trên biển, chủ quyền được xác lập và bảo vệ qua nhiều thế kỷ.',
    icon: '🏝️',
    accentColor: '#0D47A1',
    tags: ['chủ quyền', 'quần đảo', 'biển đảo', 'lãnh thổ'],
    historyHighlights: [
      'Từ thế kỷ 17, các chúa Nguyễn đã lập đội Hoàng Sa để khai thác và quản lý quần đảo Hoàng Sa.',
      'Năm 1816, vua Gia Long chính thức cắm cờ chủ quyền Việt Nam tại quần đảo Hoàng Sa.',
      'Năm 1938, chính quyền Pháp thay mặt Việt Nam đặt chủ quyền tại Hoàng Sa, xây hải đăng và trạm khí tượng.',
    ],
    notableHeroes: [
      {
        name: 'Đội Hoàng Sa',
        period: 'Thế kỷ 17–19',
        shortDescription: 'Đội thủy quân do chúa Nguyễn lập ra để khai thác, khảo sát và bảo vệ quần đảo Hoàng Sa.',
      },
      {
        name: 'Phạm Quang Ảnh',
        period: 'Thế kỷ 18',
        shortDescription: 'Chỉ huy đội Hoàng Sa, dẫn đầu các chuyến hải trình khai thác quần đảo.' ,
      },
      {
        name: 'Lê Quý Đôn',
        period: '1726–1784',
        shortDescription: 'Học giả đại tài, ghi chép chi tiết về Hoàng Sa trong Phủ biên tạp lục (1776).' },
    ],
    landmarks: [
      { name: 'Đảo Phú Lâm', shortDescription: 'Đảo lớn nhất quần đảo Hoàng Sa, có rừng cây và bãi cát trắng.' },
      { name: 'Đảo Hoàng Sa (Pattle)', shortDescription: 'Đảo chính, nơi đặt trạm khí tượng và các công trình quản lý.' },
      { name: 'Bãi cạn Bắc Hoàng Sa', shortDescription: 'Vùng biển nông phong phú tài nguyên thủy sản.' },
      { name: 'Đảo Linh Côn', shortDescription: 'Đảo nhỏ trong quần đảo, hệ sinh thái biển đa dạng.' },
    ],
    foods: [
      { name: 'Hải sản Hoàng Sa', shortDescription: 'Cá ngừ, cá bò, ốc, tôm hùm — nguồn thủy sản phong phú vùng biển Hoàng Sa.' },
      { name: 'Rong biển', shortDescription: 'Rong biển tự nhiên quanh quần đảo, tài nguyên kinh tế biển.' },
      { name: 'Yến sào biển', shortDescription: 'Tổ chim yến trên các đảo đá, tài nguyên quý giá.' },
      { name: 'Cá chim biển', shortDescription: 'Cá chim trắng, cá chim đen — đặc sản vùng biển Hoàng Sa.' },
    ],
    cultureNotes: [
      'Quần đảo Hoàng Sa là chủ quyền thiêng liêng của Việt Nam, được ghi nhận trong nhiều thư tịch lịch sử và bản đồ cổ.',
      'Các tài liệu lịch sử từ thời chúa Nguyễn, triều Nguyễn và Pháp đều xác nhận chủ quyền Việt Nam tại Hoàng Sa.',
    ],
    suggestedLearningQuestions: [
      'Những bằng chứng lịch sử nào khẳng định chủ quyền Việt Nam tại quần đảo Hoàng Sa?',
      'Đội Hoàng Sa được thành lập và hoạt động như thế nào?',
      'Vai trò của Phủ biên tạp lục trong việc ghi chép về Hoàng Sa?',
    ],
    relatedPlaces: ['truong-sa', 'da-nang', 'quang-ngai'],
  },

  // ★★★ RICH ENTRY: Trường Sa ★★★
  {
    id: '47',
    slug: 'truong-sa',
    name: 'Quần đảo Trường Sa',
    type: 'archipelago',
    region: 'islands',
    coordinates: [9.0, 114.0],
    shortDescription:
      'Quần đảo Trường Sa — điểm tựa thiêng liêng trên biển Đông, chủ quyền Việt Nam được xác lập qua nhiều thế kỷ.',
    icon: '⚓',
    accentColor: '#1A237E',
    tags: ['chủ quyền', 'quần đảo', 'biển Đông', 'lãnh thổ'],
    historyHighlights: [
      'Các chúa Nguyễn đã cử đội Hoàng Sa và Bắc Hải khai thác và quản lý quần đảo Trường Sa từ thế kỷ 17.',
      'Năm 1933, chính quyền Pháp thay mặt Việt Nam khẳng định chủ quyền tại các đảo Trường Sa.',
      'Việt Nam liên tục duy trì sự hiện diện và bảo vệ chủ quyền tại quần đảo Trường Sa từ năm 1975 đến nay.',
    ],
    notableHeroes: [
      {
        name: 'Đội Bắc Hải',
        period: 'Thế kỷ 17–19',
        shortDescription: 'Đội thủy quân phụ trách khảo sát và khai thác quần đảo Trường Sa cùng Côn Đảo.',
      },
      {
        name: 'Lê Văn Thủy',
        period: 'Cận đại',
        shortDescription: 'Sĩ quan hải quân, có công trong bảo vệ chủ quyền biển đảo Trường Sa.' },
      {
        name: 'Các chiến sĩ Trường Sa',
        period: 'Đương đại',
        shortDescription: 'Các cán bộ chiến sĩ hy sinh bảo vệ chủ quyền quần đảo Trường Sa.' },
    ],
    landmarks: [
      { name: 'Đảo Trường Sa Lớn', shortDescription: 'Đảo lớn nhất, nơi đặt trạm khí tượng và công trình dân sự.' },
      { name: 'Đảo Song Tử Tây', shortDescription: 'Đảo phía bắc nhất, có ngọn hải đăng và công trình quản lý.' },
      { name: 'Đá Nam Yết', shortDescription: 'Đá san hô lớn, hệ sinh thái biển phong phú.' },
      { name: 'Đảo Sinh Tồn', shortDescription: 'Đảo có công trình dân sự và quân sự, bảo vệ chủ quyền.' },
    ],
    foods: [
      { name: 'Hải sản Trường Sa', shortDescription: 'Cá ngừ đại dương, cá bò, ốc, tôm — tài nguyên biển phong phú quanh quần đảo.' },
      { name: 'Rong biển đá', shortDescription: 'Rong biển tự nhiên quanh các rạn san hô, nguồn sinh thái quý giá.' },
      { name: 'Cá đuối', shortDescription: 'Cá đuối biển sâu, đặc sản vùng biển Trường Sa.' },
      { name: 'Ốc biển', shortDescription: 'Các loại ốc biển đa dạng quanh rạn san hô quần đảo.' },
    ],
    cultureNotes: [
      'Chủ quyền Việt Nam tại quần đảo Trường Sa được khẳng định qua nhiều thế kỷ với bằng chứng lịch sử rõ ràng.',
      '"Mỗi giọt mồ hôi, mỗi giọt máu rơi xuống Trường Sa đều là minh chứng cho ý chí bảo vệ chủ quyền dân tộc."',
    ],
    suggestedLearningQuestions: [
      'Những bằng chứng lịch sử nào khẳng định chủ quyền Việt Nam tại quần đảo Trường Sa?',
      'Đội Bắc Hải đã hoạt động như thế nào trong việc quản lý quần đảo?',
      'Ý nghĩa chiến lược của quần đảo Trường Sa đối với Việt Nam?',
    ],
    relatedPlaces: ['hoang-sa', 'khanh-hoa', 'phu-yen'],
  },

  // ★★★ NEW ENTRY: Đảo Phú Quốc ★★★
  {
    id: '48',
    slug: 'dao-phu-quoc',
    name: 'Đảo Phú Quốc',
    type: 'archipelago',
    region: 'islands',
    coordinates: [10.2275, 103.9580],
    shortDescription: 'Đảo ngọc lớn nhất Việt Nam, thiên đường du lịch biển với rừng nguyên sinh và nước mắm trứ danh.',
    icon: '🏝️',
    accentColor: '#00897B',
    tags: ['đảo ngọc', 'biển', 'rừng nguyên sinh', 'nước mắm'],
    historyHighlights: ['Phú Quốc từng là nơi giam giữ tù binh trong chiến tranh Việt Nam, di tích nhà tù Phú Quốc ghi nhớ lịch sử.'],
    notableHeroes: [],
    landmarks: [{ name: 'Nhà tù Phú Quốc', shortDescription: 'Di tích lịch sử, nơi giam giữ tù binh lớn nhất miền Nam.' }],
    foods: [{ name: 'Nước mắm Phú Quốc', shortDescription: 'Nước mắm nhĩ cá cơm, đặc sản quốc hồn của đảo ngọc.' }],
    cultureNotes: ['Phú Quốc nổi tiếng với nghề làm nước mắm truyền thống hàng trăm năm.'],
    suggestedLearningQuestions: ['Vì sao Phú Quốc được gọi là "Đảo ngọc"?'],
    relatedPlaces: ['kien-giang', 'hoang-sa', 'truong-sa'],
  },

  // ★★★ NEW ENTRY: Đảo Cát Bà ★★★
  {
    id: '49',
    slug: 'dao-cat-ba',
    name: 'Đảo Cát Bà',
    type: 'archipelago',
    region: 'islands',
    coordinates: [20.7295, 107.0447],
    shortDescription: 'Quần đảo lớn nhất Vịnh Bắc Bộ, khu dự trữ thiên nhiên thế giới với hệ sinh thái đa dạng.',
    icon: '🌴',
    accentColor: '#2E7D32',
    tags: ['quần đảo', 'sinh thái', 'UNESCO', 'Vịnh Lan Hạ'],
    historyHighlights: ['Cát Bà được UNESCO công nhận là Khu dự trữ sinh quyển thế giới năm 2004.'],
    notableHeroes: [],
    landmarks: [{ name: 'Vườn quốc gia Cát Bà', shortDescription: 'Hệ sinh thái đa dạng với rừng nhiệt đới, hang động và san hô.' }],
    foods: [{ name: 'Hải sản Cát Bà', shortDescription: 'Tôm hùm, cua, ốc tươi sống vùng biển đảo.' }],
    cultureNotes: ['Ngư dân Cát Bà có truyền thống đánh bắt và nuôi trồng thủy sản từ bao đời.'],
    suggestedLearningQuestions: ['Hệ sinh thái Cát Bà có gì đặc biệt?'],
    relatedPlaces: ['hai-phong', 'quang-ninh'],
  },

  // ★★★ NEW ENTRY: Đảo Lý Sơn ★★★
  {
    id: '50',
    slug: 'dao-ly-son',
    name: 'Đảo Lý Sơn',
    type: 'archipelago',
    region: 'islands',
    coordinates: [13.7791, 109.1148],
    shortDescription: 'Vương quốc tỏi giữa biển, hòn đảo núi lửa với phong cảnh kỳ vĩ và hải đội Hoàng Sa.',
    icon: '🧄',
    accentColor: '#BF360C',
    tags: ['tỏi', 'núi lửa', 'biển', 'hải đội'],
    historyHighlights: ['Lý Sơn là nơi xuất phát của hải đội Hoàng Sa thời nhà Nguyễn, bảo vệ chủ quyền biển đảo.'],
    notableHeroes: [{ name: 'Hải đội Hoàng Sa', period: 'Triều Nguyễn', shortDescription: 'Đoàn thủy quân xuất phát từ Lý Sơn ra khai thác và bảo vệ quần đảo Hoàng Sa.' }],
    landmarks: [{ name: 'Chùa Hang', shortDescription: 'Ngôi chùa trong hang đá núi lửa, nhìn ra biển đông.' }],
    foods: [{ name: 'Tỏi Lý Sơn', shortDescription: 'Tỏi cô đơn, củ nhỏ vị cay nồng, đặc sản chỉ có trên đảo núi lửa.' }],
    cultureNotes: ['Lễ hội cầu nguyện cho hải đội Hoàng Sa được tổ chức hàng năm tại Lý Sơn.'],
    suggestedLearningQuestions: ['Vì sao Lý Sơn được gọi là nơi xuất phát của hải đội Hoàng Sa?'],
    relatedPlaces: ['quang-ngai', 'hoang-sa'],
  },

  // ★★★ NEW ENTRY: Đảo Côn Đảo ★★★
  {
    id: '51',
    slug: 'dao-con-dao',
    name: 'Đảo Côn Đảo',
    type: 'archipelago',
    region: 'islands',
    coordinates: [8.6925, 106.6055],
    shortDescription: 'Hòn đảo lịch sử với nhà tù nổi tiếng, nay là thiên đường sinh thái và du lịch bảo tồn.',
    icon: '🐢',
    accentColor: '#1A237E',
    tags: ['nhà tù', 'sinh thái', 'rùa biển', 'bảo tồn'],
    historyHighlights: ['Côn Đảo từng là nơi giam giữ hàng chục ngàn tù nhân chính trị qua các thời kỳ Pháp và Mỹ.'],
    notableHeroes: [{ name: 'Võ Thị Sáu', period: '1933–1952', shortDescription: 'Nữ anh hùng dân tộc, bị đưa ra Côn Đảo hành quyết lúc 19 tuổi.' }],
    landmarks: [{ name: 'Nhà tù Côn Đảo', shortDescription: 'Di tích lịch sử quốc gia, chứng nhân tội ác chiến tranh và tinh thần bất khuất.' }],
    foods: [{ name: 'Cá thu một nắng Côn Đảo', shortDescription: 'Cá thu sấy một nắng, đặc sản biển đảo.' }],
    cultureNotes: ['Côn Đảo là vùng bảo tồn rùa biển quan trọng nhất Việt Nam.'],
    suggestedLearningQuestions: ['Vì sao Côn Đảo được coi là nơi thiêng liêng trong lịch sử cách mạng Việt Nam?'],
    relatedPlaces: ['ba-ria-vung-tau', 'truong-sa'],
  },
]

// ─── Combine All Data ────────────────────────────────────────────────────────

export const vietnamAtlas: VietnamPlace[] = [
  ...northPlaces,
  ...centralPlaces,
  ...highlandsPlaces,
  ...southPlaces,
  ...islandPlaces,
]
