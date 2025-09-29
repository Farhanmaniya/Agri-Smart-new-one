# 🌾 AgriSmart - AI-Powered Crop Yield Prediction Platform

## 📋 Project Overview

AgriSmart is a comprehensive agricultural intelligence platform that leverages artificial intelligence and machine learning to provide farmers with data-driven insights for optimal crop management. The platform combines real-time weather data, soil analysis, pest detection, and market analytics to deliver actionable recommendations for maximizing crop yield and profitability.

## 🎯 Key Features

### 🌱 Core Modules
- **Profitable Crops Predictor** - AI-powered crop recommendations based on soil nutrients and market profitability
- **Soil Health Monitor** - Real-time soil analysis with NPK levels and pH monitoring
- **Pest Detection System** - AI-based pest identification using computer vision
- **Weather Integration** - Real-time weather data and forecasting
- **Reports & Analytics** - Comprehensive data visualization and insights
- **Multi-language Support** - English, Hindi, and Gujarati localization

### 🤖 AI/ML Capabilities
- **Crop Yield Prediction** - Machine learning models for yield forecasting
- **Soil Quality Assessment** - Automated soil health scoring
- **Pest Classification** - Deep learning-based pest identification
- **Market Analysis** - Profit optimization algorithms
- **Weather Pattern Analysis** - Climate-based recommendations

## 🏗️ Technical Architecture

### Frontend (React Application)
```
📁 Frontend Stack
├── React 18 - Modern UI framework
├── Vite - Lightning-fast build tool
├── TailwindCSS - Utility-first styling
├── Redux Toolkit - State management
├── React Router v6 - Navigation
├── i18next - Internationalization
├── Framer Motion - Animations
├── Lucide React - Icon library
└── D3.js & Recharts - Data visualization
```

### Backend (FastAPI Application)
```
📁 Backend Stack
├── FastAPI - High-performance Python API
├── Uvicorn - ASGI server
├── Pydantic - Data validation
├── Scikit-learn - ML models
├── TensorFlow/Keras - Deep learning
├── OpenWeatherMap API - Weather data
├── CORS middleware - Cross-origin support
└── JWT Authentication - Security
```

## 📁 Project Structure

```
AI-Crop-Yield-Prediction/
├── agrismart/                    # Main application directory
│   ├── src/                      # Frontend source code
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── profitable-crops/ # Crop prediction
│   │   │   ├── soil-health-monitor/ # Soil analysis
│   │   │   ├── pest-detection/  # Pest identification
│   │   │   └── reports-analytics/ # Data insights
│   │   ├── lib/                 # Utility libraries
│   │   ├── i18n/               # Internationalization
│   │   └── styles/             # Global styles
│   ├── app/                     # Backend API
│   │   ├── routers/            # API endpoints
│   │   ├── models/             # Data schemas
│   │   ├── services/           # Business logic
│   │   └── ml_models/          # Machine learning models
│   └── public/                 # Static assets
└── docs/                       # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- Python 3.8+
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Crop-Yield-Prediction/agrismart
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm start
   # Runs on http://localhost:3000
   ```

3. **Backend Setup**
   ```bash
   cd app
   pip install -r requirements.txt
   python main.py
   # Runs on http://localhost:8000
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file with:
   REACT_APP_WEATHER_API_KEY=your_openweather_api_key
   VITE_BACKEND_URL=http://localhost:8000
   ```

## 🔌 API Endpoints

### Weather Services
- `GET /api/weather/current` - Current weather data
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/health` - Service health check

### Crop Prediction
- `POST /api/predictions/crop` - Crop yield prediction
- `POST /api/predictions/multicrop` - Multiple crop analysis
- `GET /api/predictions/history` - Prediction history

### Profitable Crops
- `POST /api/profitable-crops/predict` - Profit analysis
- `GET /api/profitable-crops/market-data` - Market insights

### Pest Detection
- `POST /api/pest-detection/analyze` - Image-based pest detection
- `GET /api/pest-detection/gallery` - Pest information database

## 🌐 Supported Languages

- **English** (en) - Default
- **Hindi** (hi) - हिंदी
- **Gujarati** (gu) - ગુજરાતી

## 📊 Data Sources

- **Weather Data** - OpenWeatherMap API
- **Soil Data** - User input + ML analysis
- **Market Data** - Integrated market analysis service
- **Pest Database** - Curated agricultural pest information

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Input validation with Pydantic
- Environment variable protection
- Secure API endpoints

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Progressive Web App (PWA) ready

## 🧪 Testing & Quality

- Jest and React Testing Library
- Python unit tests
- Integration testing
- Model validation tests
- API endpoint testing

## 🚀 Deployment

### Frontend Deployment
- Netlify configuration included
- Vercel deployment ready
- Static build optimization

### Backend Deployment
- Docker containerization ready
- Cloud platform compatible
- Environment-based configuration

## 📈 Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- API response caching
- Bundle size optimization
- Hot Module Replacement (HMR)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Documentation

- **API Documentation** - `/app/API_DOCUMENTATION.md`
- **Backend Architecture** - `/agrismart/BACKEND_ARCHITECTURE.md`
- **Demo Scenarios** - `/agrismart/DEMO_SCENARIOS.md`

## 🔮 Future Roadmap

- [ ] Advanced ML model integration
- [ ] Real-time IoT sensor integration
- [ ] Satellite imagery analysis
- [ ] Blockchain-based supply chain tracking
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Community features and forums

---

**Built with ❤️ for sustainable agriculture and smart farming**