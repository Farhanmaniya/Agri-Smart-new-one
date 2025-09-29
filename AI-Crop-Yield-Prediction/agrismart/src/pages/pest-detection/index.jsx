import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext';
import MainSidebar from '../../components/ui/MainSidebar';
import MobileNavigationBar from '../../components/ui/MobileNavigationBar';
import Icon from '../../components/AppIcon';
import ImageUploadArea from './components/ImageUploadArea';
import AnalysisResults from './components/AnalysisResults';
import TreatmentRecommendations from './components/TreatmentRecommendations';
import PestGallery from './components/PestGallery';
import WeatherRiskForecast from './components/WeatherRiskForecast';
import CommunityReports from './components/CommunityReports';

const PestDetection = () => {
  const { t } = useTranslation();
  const { isAuthenticated, makeAuthenticatedRequest, logout } = useAuthContext();
  
  // Redirect if not authenticated (additional check)
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      return;
    }
  }, [isAuthenticated, logout]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedPest, setSelectedPest] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisError, setAnalysisError] = useState(null);

  // Mock data for pest gallery
  const pestGalleryData = [
    {
      id: 1,
      name: "Aphids",
      scientificName: "Aphis gossypii",
      category: "insects",
      severity: "medium",
      image: "/assets/images/aphids-new.jpg",
      affectedCrops: ["Tomato", "Pepper", "Cucumber", "Cotton"],
      symptoms: ["Yellowing leaves", "Sticky honeydew", "Curled leaves"],
      season: "Spring-Summer",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Aphid"
    },
    {
      id: 2,
      name: "Late Blight",
      scientificName: "Phytophthora infestans",
      category: "diseases",
      severity: "high",
      image: "/assets/images/late-blight-new.jpg",
      affectedCrops: ["Tomato", "Potato"],
      symptoms: ["Dark lesions on leaves", "White fungal growth", "Fruit rot"],
      season: "Monsoon",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Phytophthora_infestans"
    },
    {
      id: 3,
      name: "Whitefly",
      scientificName: "Bemisia tabaci",
      category: "insects",
      severity: "medium",
      image: "/assets/images/whitefly-new.jpg",
      affectedCrops: ["Cotton", "Tomato", "Brinjal"],
      symptoms: ["Yellow sticky traps", "Sooty mold", "Leaf yellowing"],
      season: "Year-round",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Whitefly"
    },
    {
      id: 4,
      name: "Nitrogen Deficiency",
      scientificName: "Nutrient deficiency",
      category: "deficiencies",
      severity: "low",
      image: "/assets/images/Nitrogen_deficiency.jpeg",
      affectedCrops: ["Rice", "Wheat", "Corn"],
      symptoms: ["Yellowing of older leaves", "Stunted growth", "Poor yield"],
      season: "Growing season",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Nitrogen_deficiency"
    },
    {
      id: 5,
      name: "Thrips",
      scientificName: "Thrips tabaci",
      category: "insects",
      severity: "medium",
      image: "/assets/images/thrips-new.jpg",
      affectedCrops: ["Onion", "Garlic", "Tomato"],
      symptoms: ["Silver streaks on leaves", "Black spots", "Leaf curling"],
      season: "Summer",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Thrips"
    },
    {
      id: 6,
      name: "Powdery Mildew",
      scientificName: "Erysiphe cichoracearum",
      category: "diseases",
      severity: "medium",
      image: "/assets/images/powdery-mildew-new.jpeg",
      affectedCrops: ["Cucumber", "Pumpkin", "Grapes"],
      symptoms: ["White powdery coating", "Leaf distortion", "Reduced photosynthesis"],
      season: "Cool humid weather",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Powdery_mildew"
    }
  ];


  // Mock data for weather forecast
  const weatherForecastData = {
    location: "Pune, Maharashtra",
    currentAlert: {
      level: "medium",
      message: "Moderate risk for fungal diseases due to high humidity and moderate temperatures.",
      threatenedPests: ["Late Blight", "Powdery Mildew", "Downy Mildew"]
    },
    dailyForecast: [
      {
        date: "2025-01-10",
        weather: { condition: "cloudy", temperature: 28, humidity: 75, rainfall: 2 },
        riskLevel: "medium",
        threatenedPests: ["Late Blight", "Aphids"]
      },
      {
        date: "2025-01-11",
        weather: { condition: "rainy", temperature: 25, humidity: 85, rainfall: 15 },
        riskLevel: "high",
        threatenedPests: ["Late Blight", "Powdery Mildew", "Thrips"]
      },
      {
        date: "2025-01-12",
        weather: { condition: "sunny", temperature: 32, humidity: 60, rainfall: 0 },
        riskLevel: "low",
        threatenedPests: ["Whitefly"]
      },
      {
        date: "2025-01-13",
        weather: { condition: "cloudy", temperature: 29, humidity: 70, rainfall: 5 },
        riskLevel: "medium",
        threatenedPests: ["Aphids", "Thrips"]
      },
      {
        date: "2025-01-14",
        weather: { condition: "sunny", temperature: 31, humidity: 65, rainfall: 0 },
        riskLevel: "low",
        threatenedPests: ["Whitefly"]
      },
      {
        date: "2025-01-15",
        weather: { condition: "stormy", temperature: 24, humidity: 90, rainfall: 25 },
        riskLevel: "high",
        threatenedPests: ["Late Blight", "Downy Mildew"]
      },
      {
        date: "2025-01-16",
        weather: { condition: "cloudy", temperature: 27, humidity: 80, rainfall: 8 },
        riskLevel: "medium",
        threatenedPests: ["Powdery Mildew", "Aphids"]
      }
    ],
    riskFactors: [
      {
        name: "High Humidity",
        description: "Humidity levels above 75% favor fungal disease development",
        impact: "high",
        icon: "Droplets"
      },
      {
        name: "Temperature Range",
        description: "Moderate temperatures (20-30°C) ideal for pest reproduction",
        impact: "medium",
        icon: "Thermometer"
      },
      {
        name: "Rainfall Pattern",
        description: "Intermittent rainfall creates favorable conditions for diseases",
        impact: "high",
        icon: "CloudRain"
      },
      {
        name: "Wind Speed",
        description: "Low wind speeds reduce natural pest dispersal",
        impact: "low",
        icon: "Wind"
      }
    ],
    recommendations: [
      {
        title: "Apply Preventive Fungicide",
        description: "Apply copper-based fungicide before expected rainfall to prevent late blight",
        priority: "High",
        timing: "Within 24 hours"
      },
      {
        title: "Improve Field Drainage",
        description: "Ensure proper drainage to reduce waterlogging and humidity",
        priority: "Medium",
        timing: "This week"
      },
      {
        title: "Monitor Pest Traps",
        description: "Check yellow sticky traps daily for early pest detection",
        priority: "Medium",
        timing: "Daily"
      }
    ]
  };

  // Mock data for community reports
  const [communityReportsData, setCommunityReportsData] = useState([
    {
      id: 1,
      pestName: "Aphids",
      cropType: "Tomato",
      location: "Baramati Village",
      severity: "medium",
      author: "Ramesh Patil",
      date: "2025-01-09T08:30:00Z",
      distance: 3.2,
      verified: true,
      helpfulCount: 12,
      description: "Heavy infestation on tomato plants. Leaves are curling and yellowing. Applied neem oil but need stronger treatment.",
      image: "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg",
      treatmentApplied: "Neem oil spray (3 applications)",
      treatmentEffectiveness: 3,
      contactInfo: true
    },
    {
      id: 2,
      pestName: "Late Blight",
      cropType: "Potato",
      location: "Shirur Taluka",
      severity: "high",
      author: "Sunita Deshmukh",
      date: "2025-01-08T16:45:00Z",
      distance: 8.7,
      verified: true,
      helpfulCount: 18,
      description: "Dark lesions appearing on potato leaves with white fungal growth underneath. Spreading rapidly in humid conditions.",
      image: "https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg",
      treatmentApplied: "Copper fungicide spray",
      treatmentEffectiveness: 4,
      contactInfo: true
    },
    {
      id: 3,
      pestName: "Whitefly",
      cropType: "Cotton",
      location: "Indapur Area",
      severity: "low",
      author: "Vijay Jadhav",
      date: "2025-01-07T11:20:00Z",
      distance: 12.5,
      verified: false,
      helpfulCount: 5,
      description: "Small population of whiteflies observed on cotton plants. Using yellow sticky traps for monitoring.",
      contactInfo: false
    }
  ]);

  // TODO: Treatment recommendations - To be implemented in future update
  // Mock treatment recommendations (commented out for now)
  // const treatmentRecommendationsData = {
  //   urgency: "Within 24 hours",
  //   organic: [
  //     {
  //       name: "Neem Oil Spray",
  //       description: "Natural insecticide effective against soft-bodied insects like aphids",
  //       effectiveness: 75,
  //       ingredients: ["Neem oil - 2ml per liter", "Liquid soap - 1ml per liter", "Water - 1 liter"],
  //       steps: [
  //         "Mix neem oil with liquid soap in a small container",
  //         "Add the mixture to water and stir well",
  //         "Spray on affected plants during early morning or evening",
  //         "Ensure coverage of undersides of leaves",
  //         "Repeat every 7-10 days until infestation reduces"
  //       ],
  //       cost: "₹50-80 per acre",
  //       applicationTime: "15-20 minutes per acre"
  //     },
  //     {
  //       name: "Garlic-Chili Spray",
  //       description: "Homemade organic repellent effective against various pests",
  //       effectiveness: 65,
  //       ingredients: ["Garlic cloves - 10-12", "Green chilies - 5-6", "Water - 1 liter", "Liquid soap - 1ml"],
  //       steps: [
  //         "Blend garlic and chilies with small amount of water",
  //         "Strain the mixture and add to remaining water",
  //         "Add liquid soap and mix well",
  //         "Spray on affected areas avoiding flowers",
  //         "Apply weekly for best results"
  //       ],
  //       cost: "₹20-30 per acre",
  //       applicationTime: "10-15 minutes per acre"
  //     }
  //   ],
  //   chemical: [
  //     {
  //       name: "Imidacloprid 17.8% SL",
  //       activeIngredient: "Imidacloprid",
  //       effectiveness: 90,
  //       dosage: "0.5ml per liter of water",
  //       method: "Foliar spray",
  //       frequency: "Once every 15 days",
  //       phi: "7 days",
  //       cost: "₹200-300 per acre"
  //     },
  //     {
  //       name: "Thiamethoxam 25% WG",
  //       activeIngredient: "Thiamethoxam",
  //       effectiveness: 85,
  //       dosage: "0.2g per liter of water",
  //       method: "Foliar spray or soil application",
  //       frequency: "Once every 20 days",
  //       phi: "14 days",
  //       cost: "₹250-350 per acre"
  //     }
  //   ],
  //   prevention: [
  //     {
  //       title: "Crop Rotation",
  //       description: "Rotate with non-host crops to break pest life cycles",
  //       icon: "RotateCcw",
  //       practices: [
  //         "Avoid continuous monoculture",
  //         "Include legumes in rotation",
  //         "Plan 3-4 year rotation cycles",
  //         "Keep detailed crop history records"
  //       ]
  //     },
  //     {
  //       title: "Beneficial Insects",
  //       description: "Encourage natural predators and parasites",
  //       icon: "Bug",
  //       practices: [
  //         "Plant flowering borders for beneficial insects",
  //         "Avoid broad-spectrum insecticides",
  //         "Release ladybugs and lacewings",
  //         "Maintain habitat diversity"
  //       ]
  //     },
  //     {
  //       title: "Cultural Practices",
  //       description: "Implement good agricultural practices",
  //       icon: "Sprout",
  //       practices: [
  //         "Remove infected plant debris",
  //         "Maintain proper plant spacing",
  //         "Ensure adequate nutrition",
  //         "Regular field monitoring"
  //       ]
  //     },
  //     {
  //       title: "Physical Barriers",
  //       description: "Use physical methods to prevent pest entry",
  //       icon: "Shield",
  //       practices: [
  //         "Install insect-proof nets",
  //         "Use reflective mulches",
  //         "Set up pheromone traps",
  //         "Apply sticky traps strategically"
  //       ]
  //     }
  //   ]
  // };

  const tabs = [
    { id: 'upload', label: 'Image Analysis', icon: 'Camera' },
    { id: 'gallery', label: 'Pest Gallery', icon: 'BookOpen' },
    { id: 'weather', label: 'Weather Risk', icon: 'CloudRain' },
    { id: 'community', label: 'Community', icon: 'Users' }
  ];

  const handleImageUpload = (file) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults(null);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setAnalysisError(null);
  };

  const handleAnalysisError = (error) => {
    setAnalysisError(error);
    setIsAnalyzing(false);
    setAnalysisResults(null);
  };

  const handlePestSelect = (pest) => {
    setSelectedPest(pest);
    // Redirect to Wikipedia page for the selected pest
    if (pest.wikipediaUrl) {
      window.open(pest.wikipediaUrl, '_blank');
    }
  };

  const handleReportSubmit = (report) => {
    setCommunityReportsData(prev => [report, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={setSidebarCollapsed} 
      />
      <div className={`transition-agricultural ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{t('pest.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('pest.subtitle')}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Zap" size={16} color="var(--color-success)" />
                <span>{t('pest.aiReady')}</span>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-agricultural">
                <Icon name="Settings" size={20} color="var(--color-muted-foreground)" />
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-card border-b border-border px-4 lg:px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-agricultural whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} color="currentColor" />
                <span>{
                  tab?.id === 'upload' ? t('pest.tabImage') :
                  tab?.id === 'gallery' ? t('pest.tabGallery') :
                  tab?.id === 'weather' ? t('pest.tabWeather') :
                  t('pest.tabCommunity')
                }</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <ImageUploadArea 
                  onImageUpload={handleImageUpload}
                  isAnalyzing={isAnalyzing}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisError={handleAnalysisError}
                />
                
                {analysisError && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                      <div>
                        <h3 className="font-medium text-error">Analysis Failed</h3>
                        <p className="text-sm text-error/80 mt-1">{analysisError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {analysisResults && (
                  <>
                    <AnalysisResults results={analysisResults} />
                    {/* TODO: Treatment recommendations - To be implemented in future update */}
                    {/* <TreatmentRecommendations treatments={treatmentRecommendationsData} /> */}
                  </>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <PestGallery 
                pests={pestGalleryData}
                onPestSelect={handlePestSelect}
              />
            )}


            {activeTab === 'weather' && (
              <WeatherRiskForecast forecast={weatherForecastData} />
            )}

            {activeTab === 'community' && (
              <CommunityReports 
                reports={communityReportsData}
                onReportSubmit={handleReportSubmit}
              />
            )}
          </div>
        </main>
      </div>
      <MobileNavigationBar />
    </div>
  );
};

export default PestDetection;