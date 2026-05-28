const fs = require('fs');

const replacements = {
  "vi phân": "phân tích thật tỉ mỉ",
  "móc nối": "liên kết",
  "sát na": "khoảnh khắc",
  "độc bản": "độc đáo",
  "diệu kỹ": "kỹ năng tuyệt diệu",
  "kỳ thư": "sách quý",
  "huyền vi": "huyền bí",
  "cổ sùng": "cổ đại",
  "lạc quả": "lạc điệu",
  "ngân tệ": "tiền tệ",
  "linh khố": "kho tàng",
  "dầu mỡ": "ủy mị cẩu huyết", 
  "cơ tử": "máy móc",
  "dã quan cương quyen": "quy định chức quan",
  "dã quan cương": "quy định",
  "thủ tàng vạn vật bảo khố": "người nắm giữ kho tàng",
  "thần khẩu chấp phép": "người nắm giữ ngôn từ",
  "não tàn": "thiếu tư duy",
  "Mary-Sue": "hoàn hảo vô lý (Mary-Sue)",
  "chuunibyou": "ảo tưởng sức mạnh",
  "Hưu Tưởng": "Kỳ Ảo",
  "Tây Phương Hưu Tưởng": "Kỳ Ảo Phương Tây",
  "mĩ diệu": "tuyệt đẹp",
  "dội vang": "âm vang",
  "thần cổ": "tối cổ",
  "dã sử phản thực tế": "lịch sử giả tưởng",
  "đại tràng": "quy mô lớn",
  "râu ông nọ cắm cằm bà kia": "lộn xộn không logic",
  "khí phẩm thần thoại": "bảo vật thần thoại",
  "phong văn hoang vu": "phong cách hoang tàn",
  "hậu tận thế đột biến gắt gao": "hậu tận thế đột biến khốc liệt",
  "diệu pháp": "pháp thuật tuyệt diệu",
  "bàn tay vàng": "đặc quyền gian lận (bàn tay vàng)",
  "buff bẩn": "tăng sức mạnh vô lý (buff bẩn)",
  "Đan điền khí hải": "sức mạnh Đan điền",
  "ngân tệ giao thông đại lục": "hệ thống tiền tệ toàn lục địa",
  "mậu dịch ngân tệ": "hệ thống giao thương tiền tệ",
  "tản phát ra không khí": "tỏa ra khí chất",
  "tình trạng lâm thời": "trạng thái tạm thời",
  "Thần bổ": "người quản lý",
  "đan dược mật thực": "thuốc quý",
  "đan dược mật dược": "thuốc quý",
  "ma dược ma thuật": "thuốc tiên",
  "cổ phong bí thuật": "bí thuật cổ",
  "hoang hoang": "hoang tàn",
  "dã dạn": "dạn dĩ",
  "Wall of Text": "Đoạn Văn Quá Dài",
  "Pacing": "Nhịp Độ",
  "faction": "phe phái",
  "inventory": "túi đồ",
  "Hanja": "Hán/Hàn"
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    // Preserve case where possible is tricky with regex, simpler is fine here
    // Let's do exact match or case insensitive match.
    // Replace all using regex with ignore case. Wait, replacing with lowercase value might break capitalization.
    // A simple function to preserve case for first letter:
    const regex = new RegExp(key, 'gi');
    content = content.replace(regex, (match) => {
      if (match === match.toUpperCase()) return value.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return value.charAt(0).toUpperCase() + value.slice(1);
      return value;
    });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Processed ${filePath}`);
}

processFile('./src/utils/worldCreationSystemInstruction.ts');
processFile('./src/utils/gameplaySystemInstruction.ts');
