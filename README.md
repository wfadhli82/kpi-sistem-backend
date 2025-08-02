# 📊 Sistem Pemantauan Prestasi MAIWP (i-Prestasi)

## 🎯 Overview

Sistem Pemantauan Prestasi MAIWP adalah aplikasi web yang dibangunkan untuk meningkatkan kecekapan dalam pemantauan prestasi MAIWP secara keseluruhannya. Sistem ini menyediakan platform yang user-friendly untuk pengurusan KPI dengan pelbagai kategori pengukuran dan fungsi pelaporan yang komprehensif.

## ✨ Features

### 🔐 Authentication & Security
- **Hybrid Login System** - Auto-login pada refresh, force login pada session baru
- **Role-based Access Control** - Admin, Admin Bahagian, User roles
- **Firebase Integration** - Secure user management dengan Firestore
- **Protected Routes** - Security untuk semua modul

### 📈 KPI Management
- **Multiple KPI Categories:**
  - 📊 **Bilangan** - Pengukuran berdasarkan jumlah
  - 📈 **Peratus** - Pengukuran berdasarkan peratusan
  - ⏰ **Masa** - Pengukuran berdasarkan tarikh
  - 🎯 **Tahap Kemajuan** - Pengukuran berdasarkan tahap
  - 📉 **Peratus Minimum** - Pengukuran dengan target minimum

### 📊 Data Management
- **Excel Import/Export** - Import/export data dalam format Excel
- **Real-time Calculations** - Pengiraan peratusan automatik
- **Cross-device Sync** - Data sync melalui Firebase
- **Data Persistence** - Data kekal dalam localStorage

### 🎨 User Interface
- **Modern UI/UX** - Professional design dengan MAIWP branding
- **Responsive Design** - Works pada pelbagai screen sizes
- **Right-click Navigation** - "Open in new tab" functionality
- **Clean Interface** - Simplified placeholders dan messaging

## 🚀 Technology Stack

### Frontend
- **React.js** - Modern JavaScript framework
- **Material-UI** - Professional UI components
- **React Router** - Navigation management
- **XLSX** - Excel file handling

### Backend
- **Firebase Firestore** - Cloud database
- **Firebase Authentication** - User management
- **GitHub Pages** - Hosting platform

### Development Tools
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Secure configuration
- **ESLint** - Code quality

## 📁 Project Structure

```
kpi-sistem-local/
├── src/
│   ├── App.js                 # Main application component
│   ├── AuthContext.js         # Authentication context
│   ├── Login.js              # Login page
│   ├── MainLayout.js         # Layout with navigation
│   ├── Dashboard.js          # Dashboard overview
│   ├── AdminUtama.js         # Admin main module
│   ├── UserInterface.js      # Department admin interface
│   ├── UserManagement.js     # User management
│   └── firebase.js          # Firebase configuration
├── public/
│   ├── logos/               # MAIWP logos
│   └── menara-maiwp.jpg    # Background image
├── .github/workflows/       # GitHub Actions
└── package.json            # Dependencies
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project
- GitHub account

### Local Development
```bash
# Clone repository
git clone https://github.com/wfadhli82/kpi-sistem-local.git
cd kpi-sistem-local

# Install dependencies
npm install

# Create .env file with Firebase config
echo "REACT_APP_FIREBASE_API_KEY=your_api_key" > .env
echo "REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain" >> .env
echo "REACT_APP_FIREBASE_PROJECT_ID=your_project_id" >> .env
echo "REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket" >> .env
echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id" >> .env
echo "REACT_APP_FIREBASE_APP_ID=your_app_id" >> .env
echo "REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id" >> .env

# Start development server
npm start
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🔐 User Roles & Permissions

### 👑 Admin Utama
- **Access:** Dashboard, Admin Utama, Admin Bahagian, Pengurusan Pengguna
- **Functions:** Full system access, user management, KPI management

### 🏢 Admin Bahagian
- **Access:** Dashboard, Admin Bahagian
- **Functions:** Department-specific KPI management

### 👤 User
- **Access:** Dashboard only
- **Functions:** View KPI data

## 📊 KPI Categories Explained

### 📊 Bilangan
- **Purpose:** Mengukur pencapaian berdasarkan jumlah
- **Example:** "Bilangan program zakat yang dijalankan"
- **Input:** Sasaran dan Pencapaian

### 📈 Peratus
- **Purpose:** Mengukur pencapaian berdasarkan peratusan
- **Example:** "Peratus peruntukan zakat yang dibelanjakan"
- **Input:** Nilai X dan Y dengan label

### ⏰ Masa
- **Purpose:** Mengukur pencapaian berdasarkan tarikh
- **Example:** "Tarikh siap projek pembangunan"
- **Input:** Sasaran tarikh dan tarikh capai

### 🎯 Tahap Kemajuan
- **Purpose:** Mengukur tahap kemajuan projek
- **Example:** "Tahap kelulusan projek"
- **Input:** Pilihan tahap (25%, 50%, 75%, 100%)

### 📉 Peratus Minimum
- **Purpose:** Mengukur pencapaian dengan target minimum
- **Example:** "Peratus minimum perbelanjaan"
- **Input:** Overall, Sebenar, dan Target

## 🔄 Data Flow

1. **Login** → Firebase Authentication
2. **User Data** → Firestore Database
3. **KPI Data** → localStorage + Firebase sync
4. **Excel Export** → Generated from current data
5. **Excel Import** → Parse and update KPI data

## 🚀 Deployment

### GitHub Pages
- **URL:** https://wfadhli82.github.io/kpi-sistem-local/
- **Branch:** gh-pages (auto-generated)
- **CI/CD:** GitHub Actions workflow

### Environment Variables
- **Local:** `.env` file
- **Production:** GitHub Secrets
- **Security:** Firebase config encrypted

## 🛠️ Development

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git Hooks** - Pre-commit checks

### Testing
- **Manual Testing** - User acceptance testing
- **Cross-browser** - Chrome, Firefox, Safari, Edge
- **Mobile Responsive** - Tablet and mobile testing

## 📈 Performance

### Optimization
- **Code Splitting** - Lazy loading components
- **Image Optimization** - Compressed assets
- **Bundle Size** - ~475KB gzipped
- **Load Time** - <3 seconds

### Monitoring
- **Console Logging** - Development debugging
- **Error Boundaries** - Production error handling
- **User Analytics** - Usage tracking

## 🔒 Security

### Authentication
- **Firebase Auth** - Secure user authentication
- **Role-based Access** - Permission control
- **Session Management** - Hybrid login system

### Data Protection
- **Environment Variables** - Secure API keys
- **Input Validation** - XSS prevention
- **HTTPS Only** - Secure connections

## 📞 Support

### Documentation
- **User Manual** - Complete user guide
- **API Documentation** - Firebase integration
- **Troubleshooting** - Common issues

### Contact
- **Developer:** Wan Fadhli
- **Email:** wfadhli82@gmail.com
- **Repository:** https://github.com/wfadhli82/kpi-sistem-local

## 🎉 Acknowledgments

- **MAIWP** - Project sponsor and requirements
- **Firebase** - Backend infrastructure
- **Material-UI** - UI components
- **React Community** - Framework and tools

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**License:** MIT License
