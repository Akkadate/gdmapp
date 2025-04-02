#!/bin/bash

# ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์ - Setup Script
# -------------------------------------------------------------------------
# สคริปต์นี้ใช้สำหรับตั้งค่าระบบเมื่อติดตั้งเริ่มต้น
# โดยจะดำเนินการดังนี้:
# 1. ติดตั้ง dependencies
# 2. ตั้งค่าฐานข้อมูล
# 3. สร้างข้อมูลตัวอย่าง
# 4. Build React application
# -------------------------------------------------------------------------

# สีสำหรับเอาท์พุต
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# แสดงข้อความเมื่อเริ่มต้น
echo -e "${GREEN}----------------------------------------${NC}"
echo -e "${GREEN}ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์${NC}"
echo -e "${GREEN}      สคริปต์ตั้งค่าระบบเริ่มต้น${NC}"
echo -e "${GREEN}----------------------------------------${NC}"

# ตรวจสอบว่ามี Node.js และ npm ติดตั้งแล้ว
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js และ npm จำเป็นต้องติดตั้งก่อน${NC}"
    echo "กรุณาติดตั้ง Node.js และ npm แล้วลองอีกครั้ง"
    exit 1
fi

# ตรวจสอบว่ามี PostgreSQL ติดตั้งแล้ว
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL จำเป็นต้องติดตั้งก่อน${NC}"
    echo "กรุณาติดตั้ง PostgreSQL แล้วลองอีกครั้ง"
    exit 1
fi

# 1. ติดตั้ง dependencies สำหรับ Backend
echo -e "\n${YELLOW}1. กำลังติดตั้ง Backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: การติดตั้ง backend dependencies ล้มเหลว${NC}"
    exit 1
fi

# 2. ติดตั้ง dependencies สำหรับ Frontend
echo -e "\n${YELLOW}2. กำลังติดตั้ง Frontend dependencies...${NC}"
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: การติดตั้ง frontend dependencies ล้มเหลว${NC}"
    exit 1
fi

# 3. ตั้งค่าฐานข้อมูล PostgreSQL
echo -e "\n${YELLOW}3. กำลังตั้งค่าฐานข้อมูล...${NC}"
echo -e "${YELLOW}   กรุณาป้อนข้อมูลสำหรับเชื่อมต่อ PostgreSQL${NC}"

read -p "ชื่อฐานข้อมูล (default: gdm): " DB_NAME
DB_NAME=${DB_NAME:-gdm}

read -p "ชื่อผู้ใช้ PostgreSQL (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "รหัสผ่าน PostgreSQL: " DB_PASSWORD
echo ""

read -p "โฮสต์ PostgreSQL (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "พอร์ต PostgreSQL (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# ตรวจสอบการเชื่อมต่อ PostgreSQL
echo -e "\n${YELLOW}  ทดสอบการเชื่อมต่อฐานข้อมูล...${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "\q" 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: ไม่สามารถเชื่อมต่อกับฐานข้อมูล PostgreSQL ได้${NC}"
    echo "กรุณาตรวจสอบข้อมูลเชื่อมต่อและลองอีกครั้ง"
    exit 1
fi

# สร้างฐานข้อมูล
echo -e "${YELLOW}  กำลังสร้างฐานข้อมูล ${DB_NAME}...${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

# อัปเดตไฟล์ .env ใน Backend
cd ../backend
cat > .env << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Server Configuration
PORT=3010
NODE_ENV=development

# JWT Configuration
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=1d
EOF

echo -e "${GREEN}  สร้างไฟล์ .env สำหรับ Backend เรียบร้อยแล้ว${NC}"

# อัปเดตไฟล์ .env ใน Frontend
cd ../frontend
cat > .env << EOF
VITE_API_URL=http://localhost:3010/api
VITE_PORT=5010
EOF

echo -e "${GREEN}  สร้างไฟล์ .env สำหรับ Frontend เรียบร้อยแล้ว${NC}"

# 4. สร้างตาราง Database
echo -e "\n${YELLOW}4. กำลังสร้างโครงสร้างฐานข้อมูล...${NC}"
cd ../backend
node -e "const sequelize = require('./src/config/database'); const models = require('./src/models'); sequelize.sync({ force: true }).then(() => console.log('Database synchronized')).catch(err => console.error('Error syncing database:', err)).finally(() => process.exit());"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: การสร้างโครงสร้างฐานข้อมูลล้มเหลว${NC}"
    exit 1
fi

# 5. สร้างข้อมูลผู้ใช้เริ่มต้น (Admin)
echo -e "\n${YELLOW}5. กำลังสร้างบัญชีผู้ดูแลระบบเริ่มต้น...${NC}"
NODE_PATH=. node << EOF
const { User } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      fullName: 'ผู้ดูแลระบบ',
      role: 'admin',
      isActive: true
    });
    
    console.log('สร้างบัญชีผู้ดูแลระบบเรียบร้อยแล้ว');
    console.log('ชื่อผู้ใช้: admin');
    console.log('รหัสผ่าน: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างบัญชีผู้ดูแลระบบ:', error);
    process.exit(1);
  }
}

createAdminUser();
EOF

# 6. Build Frontend
echo -e "\n${YELLOW}6. กำลัง Build Frontend...${NC}"
cd ../frontend
# Create postcss.config.js if it doesn't exist
cat > postcss.config.js << EOF
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
# Build the frontend
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: การ Build Frontend ล้มเหลว${NC}"
    exit 1
fi

# แสดงคำแนะนำเมื่อเสร็จสิ้น
echo -e "\n${GREEN}----------------------------------------${NC}"
echo -e "${GREEN}   การตั้งค่าเริ่มต้นเสร็จสมบูรณ์!${NC}"
echo -e "${GREEN}----------------------------------------${NC}"
echo -e "\nวิธีเริ่มต้นระบบ:"
echo -e "${YELLOW}1. รัน Backend:${NC}"
echo "   cd backend"
echo "   npm run dev"
echo -e "${YELLOW}2. รัน Frontend:${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo -e "\n${YELLOW}การเข้าสู่ระบบ:${NC}"
echo "   URL: http://localhost:5010"
echo "   ชื่อผู้ใช้: admin"
echo "   รหัสผ่าน: admin123"
echo -e "\n${GREEN}ขอบคุณที่ใช้ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์${NC}"