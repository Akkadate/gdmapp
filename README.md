# ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์ (Gestational Diabetes Management System)

ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์ สำหรับโรงพยาบาลและคลินิก ช่วยในการจัดการข้อมูลผู้ป่วย การติดตามระดับน้ำตาล และการนัดหมาย

## คุณสมบัติหลัก

1. **การจัดการผู้ป่วย**: ลงทะเบียนผู้ป่วย, ดูและแก้ไขข้อมูลผู้ป่วย, ประเมินความเสี่ยง
2. **การติดตามระดับน้ำตาล**: บันทึกและติดตามค่าระดับน้ำตาลในเลือด, การแจ้งเตือนระดับน้ำตาลที่ผิดปกติ
3. **การนัดหมาย**: จัดการตารางนัดหมาย, การแจ้งเตือนการนัดหมาย
4. **แดชบอร์ด**: ภาพรวมของผู้ป่วย, แนวโน้มระดับน้ำตาล, สถิติต่างๆ
5. **การแจ้งเตือน**: การแจ้งเตือนอัตโนมัติสำหรับค่าน้ำตาลที่ผิดปกติและการนัดหมาย

## เทคโนโลยีที่ใช้

1. **Backend**:
   - Node.js และ Express
   - PostgreSQL สำหรับฐานข้อมูล
   - Sequelize สำหรับ ORM
   - JSON Web Tokens (JWT) สำหรับระบบยืนยันตัวตน

2. **Frontend**:
   - React
   - React Router สำหรับการจัดการเส้นทาง
   - React Query สำหรับการจัดการข้อมูล
   - Tailwind CSS สำหรับการจัดรูปแบบ
   - Formik และ Yup สำหรับการจัดการฟอร์ม

## โครงสร้างโปรเจค

```
gdmapp/
├── backend/                 # โค้ดฝั่ง Server
│   ├── src/
│   │   ├── config/          # การตั้งค่าต่างๆ (Database, JWT)
│   │   ├── controllers/     # ตัวควบคุมสำหรับจัดการคำขอ API
│   │   ├── middlewares/     # Middleware functions
│   │   ├── models/          # โมเดลฐานข้อมูล Sequelize
│   │   ├── routes/          # การกำหนดเส้นทาง API
│   │   ├── services/        # บริการทางธุรกิจ
│   │   └── utils/           # ฟังก์ชันและเครื่องมืออรรถประโยชน์
│   ├── .env                 # ตัวแปรสภาพแวดล้อม
│   └── package.json         # รายการขึ้นต่อและสคริปต์
│
├── frontend/                # โค้ดฝั่ง Client
│   ├── src/
│   │   ├── assets/          # ไฟล์สินทรัพย์ (รูปภาพ, ฟอนต์)
│   │   ├── components/      # คอมโพเนนต์ React ที่ใช้ซ้ำได้
│   │   ├── context/         # Context API สำหรับการจัดการสถานะ
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # หน้าของแอปพลิเคชัน
│   │   ├── services/        # ลอจิกสำหรับเรียกใช้ API
│   │   └── utils/           # ฟังก์ชันและเครื่องมืออรรถประโยชน์
│   ├── .env                 # ตัวแปรสภาพแวดล้อม
│   └── package.json         # รายการขึ้นต่อและสคริปต์
│
└── docs/                    # เอกสารโปรเจค
    └── readme.md            # รายละเอียดโปรเจค
```

## การติดตั้ง

### ข้อกำหนด

- Node.js (v14+)
- PostgreSQL (v12+)
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **โคลนโปรเจค**

   ```bash
   git clone https://github.com/yourusername/gdmapp.git
   cd gdmapp
   ```

2. **ติดตั้ง Backend**

   ```bash
   cd backend
   npm install
   
   # สร้างไฟล์ .env จากไฟล์ตัวอย่าง
   cp .env.example .env
   
   # แก้ไขไฟล์ .env เพื่อตั้งค่าการเชื่อมต่อฐานข้อมูล
   ```

3. **ติดตั้ง Frontend**

   ```bash
   cd ../frontend
   npm install
   
   # สร้างไฟล์ .env จากไฟล์ตัวอย่าง
   cp .env.example .env
   ```

4. **สร้างฐานข้อมูล**

   ```bash
   # สร้างฐานข้อมูล PostgreSQL ใหม่
   createdb gdm
   
   # รันการ migrate และ seed ข้อมูลตัวอย่าง
   cd ../backend
   npm run db:setup
   ```

## การเริ่มต้นใช้งาน

1. **เริ่ม Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Server จะทำงานที่ `http://localhost:3010`

2. **เริ่ม Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend จะทำงานที่ `http://localhost:5010`

3. **เข้าถึงแอปพลิเคชัน**

   เปิดเบราว์เซอร์และเข้าไปที่ `http://localhost:5010`

   บัญชีผู้ใช้เริ่มต้น:
   - **ผู้ดูแลระบบ**: username: admin, password: admin123
   - **แพทย์**: username: doctor, password: doctor123
   - **พยาบาล**: username: nurse, password: nurse123

## การพัฒนา

- **การจัดรูปแบบโค้ด**: โปรเจคนี้ใช้ ESLint และ Prettier สำหรับการจัดรูปแบบโค้ด
- **การทดสอบ**: Jest ใช้สำหรับการทดสอบทั้งฝั่ง Backend และ Frontend
- **การแก้ไขบัค**: โปรดรายงานบัคที่พบโดยเปิด issue ใหม่ในโปรเจค GitHub

## ผู้ร่วมพัฒนาโปรเจค

- [ชื่อของคุณ] - [ตำแหน่ง/บทบาท]

## การอนุญาต

โปรเจคนี้ได้รับอนุญาตภายใต้ลิขสิทธิ์ MIT - ดูรายละเอียดเพิ่มเติมในไฟล์ [LICENSE](LICENSE)