import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';
import MainSidebar from '../../components/ui/MainSidebar';
import MobileNavigationBar from '../../components/ui/MobileNavigationBar';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import SoilMetricsCard from './components/SoilMetricsCard';
import SoilTrendChart from './components/SoilTrendChart';
import SoilTestingCard from './components/SoilTestingCard';
import SoilRecommendationCard from './components/SoilRecommendationCard';
import SoilMetricsInputForm from './components/SoilMetricsInputForm';
import FertilizerPredictionForm from '../../components/FertilizerPredictionForm';
import FertilizerPredictionResults from '../../components/FertilizerPredictionResults';
import { Leaf } from 'lucide-react';

const SoilHealthMonitor = () => {
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
  const [selectedField, setSelectedField] = useState('field_1');
  const [filters, setFilters] = useState({
    crop: 'all',
    field: 'all',
    timeRange: '30d',
    fertilizer: 'all',
    startDate: '',
    endDate: ''
  });

  // User input soil metrics state
  const [userSoilMetrics, setUserSoilMetrics] = useState({
    nitrogen: 45,
    phosphorus: 28,
    potassium: 35,
    ph: 6.8,
    organic_matter: 3.2,
    moisture: 32,
    temperature: 25,      // Will be updated from weather API
    soilType: "loam",     // Added soil type field
    humidity: 50          // Will be updated from weather API
  });

  const [soilAnalysisResults, setSoilAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Fertilizer prediction state
  const [showFertilizerForm, setShowFertilizerForm] = useState(false);
  const [fertilizerResults, setFertilizerResults] = useState(null);

  // Function to fetch weather data from backend API
  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/weather/current?location=Nadiad, IN');
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        
        // Update soil metrics with weather data
        setUserSoilMetrics(prev => ({
          ...prev,
          temperature: data.current.temperature,
          humidity: data.current.humidity
        }));
        
        console.log('Weather data fetched and integrated:', data);
      } else {
        console.error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Function to analyze soil health using backend API
  const analyzeSoilHealth = async (soilData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/soil-health/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soilData)
      });

      if (response.ok) {
        const results = await response.json();
        setSoilAnalysisResults(results);
      } else {
        console.error('Failed to analyze soil health');
        // Use mock data as fallback
        setSoilAnalysisResults(getMockSoilAnalysis(soilData));
      }
    } catch (error) {
      console.error('Error analyzing soil:', error);
      // Use mock data as fallback
      setSoilAnalysisResults(getMockSoilAnalysis(soilData));
    } finally {
      setLoading(false);
    }
  };

  // Mock soil analysis for fallback
  const getMockSoilAnalysis = (soilData) => {
    return {
      soil_health_score: 72.5,
      classification: "Good",
      nutrient_levels: {
        nitrogen: { value: `${soilData.nitrogen} kg/ha`, status: "Optimal", recommendation: "Maintain current levels" },
        phosphorus: { value: `${soilData.phosphorus} kg/ha`, status: "Good", recommendation: "Good levels" },
        potassium: { value: `${soilData.potassium} kg/ha`, status: "Optimal", recommendation: "Adequate levels" },
        ph: { value: `${soilData.ph}`, status: "Optimal", recommendation: "Good pH balance" }
      },
      recommendations: [
        "Maintain current soil management practices",
        "Regular monitoring every 6 months recommended"
      ],
      deficiencies: ["No major nutrient deficiencies detected"],
      improvements: [
        "Use cover crops during fallow periods",
        "Implement drip irrigation for water efficiency"
      ]
    };
  };

  // Auto-analyze on component mount
  useEffect(() => {
    analyzeSoilHealth(userSoilMetrics);
  }, []);

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Re-analyze soil health when weather data updates soil metrics
  useEffect(() => {
    if (weatherData) {
      analyzeSoilHealth(userSoilMetrics);
    }
  }, [weatherData]);

  // Function to determine status based on values
  const getMetricStatus = (type, value) => {
    switch (type) {
      case 'nitrogen':
        if (value < 30) return 'critical';
        if (value < 50) return 'warning';
        return 'good';
      case 'phosphorus':
        if (value < 15) return 'critical';
        if (value < 25) return 'warning';
        return 'good';
      case 'temperature':
        if (value < 10 || value > 35) return 'critical';
        if (value < 15 || value > 30) return 'warning';
        return 'good';
      case 'humidity':
        if (value < 20 || value > 80) return 'critical';
        if (value < 30 || value > 70) return 'warning';
        return 'good';
      default:
        return 'good';
    }
  };

  // Function to get recommendations based on values
  const getRecommendation = (type, value, status) => {
    switch (type) {
      case 'nitrogen':
        if (status === 'critical') return 'Urgent: Apply nitrogen fertilizer immediately. Current levels are critically low.';
        if (status === 'warning') return 'Consider nitrogen fertilizer application. Current levels are below optimal range.';
        return 'Nitrogen levels are optimal. Continue current management practices.';
      case 'phosphorus':
        if (status === 'critical') return 'Critical: Apply phosphorus fertilizer urgently to prevent crop deficiency.';
        if (status === 'warning') return 'Apply phosphorus fertilizer to reach optimal levels for better crop growth.';
        return 'Phosphorus levels are within optimal range. Continue current management.';
      case 'temperature':
        if (status === 'critical') return 'Temperature is outside optimal range. Consider protective measures or timing adjustments.';
        if (status === 'warning') return 'Temperature is suboptimal. Monitor closely and adjust practices if needed.';
        return 'Soil temperature is optimal for current crop growth.';
      case 'humidity':
        if (status === 'critical') return value > 80 ? 'Humidity too high. Improve drainage and ventilation.' : 'Humidity too low. Increase irrigation frequency.';
        if (status === 'warning') return value > 70 ? 'Humidity slightly high. Monitor for fungal issues.' : 'Humidity low. Consider increasing irrigation.';
        return 'Humidity levels are optimal for crop growth.';
      default:
        return 'Levels are within acceptable range.';
    }
  };

  // Dynamic soil metrics based on user input
  const soilMetrics = [
    {
      title: 'Nitrogen (N)',
      value: userSoilMetrics.nitrogen.toString(),
      unit: 'kg/ha',
      status: getMetricStatus('nitrogen', userSoilMetrics.nitrogen),
      icon: 'Leaf',
      recommendation: getRecommendation('nitrogen', userSoilMetrics.nitrogen, getMetricStatus('nitrogen', userSoilMetrics.nitrogen)),
      trend: 'stable'
    },
    {
      title: 'Phosphorus (P)',
      value: userSoilMetrics.phosphorus.toString(),
      unit: 'kg/ha',
      status: getMetricStatus('phosphorus', userSoilMetrics.phosphorus),
      icon: 'Sprout',
      recommendation: getRecommendation('phosphorus', userSoilMetrics.phosphorus, getMetricStatus('phosphorus', userSoilMetrics.phosphorus)),
      trend: 'stable'
    },
    {
      title: 'Temperature',
      value: userSoilMetrics.temperature.toString(),
      unit: '°C',
      status: getMetricStatus('temperature', userSoilMetrics.temperature),
      icon: 'Thermometer',
      recommendation: getRecommendation('temperature', userSoilMetrics.temperature, getMetricStatus('temperature', userSoilMetrics.temperature)),
      trend: 'stable',
      source: weatherData ? 'Weather API' : 'Manual Input',
      lastUpdated: weatherData ? new Date(weatherData.timestamp).toLocaleTimeString() : 'Not updated'
    },
    {
      title: 'Soil Type',
      value: userSoilMetrics.soilType.charAt(0).toUpperCase() + userSoilMetrics.soilType.slice(1),
      unit: '',
      status: 'good',
      icon: 'Mountain',
      recommendation: `Current soil type is ${userSoilMetrics.soilType}. Adjust farming practices accordingly.`,
      trend: 'stable'
    },
    {
      title: 'Humidity',
      value: userSoilMetrics.humidity.toString(),
      unit: '%',
      status: getMetricStatus('humidity', userSoilMetrics.humidity),
      icon: 'Droplets',
      recommendation: getRecommendation('humidity', userSoilMetrics.humidity, getMetricStatus('humidity', userSoilMetrics.humidity)),
      trend: 'stable',
      source: weatherData ? 'Weather API' : 'Manual Input',
      lastUpdated: weatherData ? new Date(weatherData.timestamp).toLocaleTimeString() : 'Not updated'
    },
    {
      title: 'Organic Matter',
      value: '3.2',
      unit: '%',
      status: 'good',
      icon: 'TreePine',
      recommendation: 'Organic matter content is healthy. Continue composting practices.',
      trend: 'stable'
    }
  ];

  // Mock trend data
  const trendData = [
    { date: '2024-08-10', nitrogen: 52, phosphorus: 25, potassium: 58, ph: 6.2, moisture: 45 },
    { date: '2024-08-17', nitrogen: 50, phosphorus: 26, potassium: 60, ph: 6.0, moisture: 42 },
    { date: '2024-08-24', nitrogen: 48, phosphorus: 27, potassium: 61, ph: 5.9, moisture: 38 },
    { date: '2024-08-31', nitrogen: 46, phosphorus: 28, potassium: 62, ph: 5.8, moisture: 35 },
    { date: '2024-09-07', nitrogen: 45, phosphorus: 28, potassium: 62, ph: 5.8, moisture: 32 }
  ];

  // Mock testing facilities
  const testingFacilities = [
    {
      id: 1,
      name: 'AgriLab Testing Center',
      address: '123 Farm Road, Agricultural District',
      distance: 3.2,
      rating: 4.8,
      turnaroundTime: '3-5 days',
      price: 1500,
      availableTests: ['NPK Analysis', 'pH Testing', 'Micronutrients', 'Organic Matter']
    },
    {
      id: 2,
      name: 'Soil Science Institute',
      address: '456 Research Avenue, University Campus',
      distance: 8.7,
      rating: 4.9,
      turnaroundTime: '5-7 days',
      price: 2200,
      availableTests: ['Complete Analysis', 'Heavy Metals', 'Salinity', 'Biological Activity']
    },
    {
      id: 3,
      name: 'FarmTech Diagnostics',
      address: '789 Technology Park, Innovation Hub',
      distance: 12.5,
      rating: 4.6,
      turnaroundTime: '2-3 days',
      price: 1800,
      availableTests: ['Quick NPK', 'pH & EC', 'Moisture Analysis', 'Texture Analysis']
    }
  ];

  // Mock recommendations
  const recommendations = [
    {
      id: 1,
      title: 'Apply Lime for pH Correction',
      category: 'pH Management',
      type: 'ph_adjustment',
      priority: 'high',
      description: 'Your soil pH is 5.8, which is too acidic for optimal crop growth. Apply agricultural lime to raise pH to 6.0-7.0 range.',
      details: [
        'Apply 2-3 tons of agricultural lime per hectare',
        'Incorporate lime into top 15cm of soil',
        'Allow 2-3 months for pH adjustment',
        'Retest soil pH after application'
      ],
      expectedOutcome: 'Improved nutrient availability and better crop yields by 15-20%',
      cost: 8500,
      timeframe: '2-3 months'
    },
    {
      id: 2,
      title: 'Nitrogen Fertilizer Application',
      category: 'Nutrient Management',
      type: 'fertilizer',
      priority: 'medium',
      description: 'Nitrogen levels are below optimal. Apply nitrogen-rich fertilizer to support crop growth.',
      details: [
        'Apply 60-80 kg/ha of nitrogen fertilizer',
        'Split application: 50% at planting, 50% at flowering',
        'Use urea or ammonium sulfate',
        'Monitor crop response after 2-3 weeks'
      ],
      expectedOutcome: 'Enhanced vegetative growth and improved crop yield',
      cost: 4200,
      timeframe: '2-4 weeks'
    },
    {
      id: 3,
      title: 'Increase Irrigation Frequency',
      category: 'Water Management',
      type: 'irrigation',
      priority: 'medium',
      description: 'Soil moisture content is low at 32%. Increase irrigation to maintain optimal moisture levels.',
      details: [
        'Increase irrigation frequency to every 2-3 days',
        'Apply 25-30mm of water per irrigation',
        'Monitor soil moisture at 15cm depth',
        'Adjust based on weather conditions'
      ],
      expectedOutcome: 'Better water stress management and consistent crop growth',
      cost: 2800,
      timeframe: 'Immediate'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleScheduleTest = (facility) => {
    console.log('Scheduling test with:', facility?.name);
    // Mock scheduling functionality
    alert(`Test scheduled with ${facility?.name}. You will receive a confirmation email shortly.`);
  };

  const handleApplyRecommendation = (recommendation) => {
    console.log('Applying recommendation:', recommendation?.title);
    // Mock apply functionality
    alert(`Recommendation "${recommendation?.title}" has been added to your action plan.`);
  };

  const handleSoilMetricsSubmit = (newMetrics) => {
    setUserSoilMetrics(newMetrics);
    setShowInputForm(false);
    // You could also save to localStorage or send to API here
    localStorage.setItem('userSoilMetrics', JSON.stringify(newMetrics));
  };

  // Load saved metrics on component mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem('userSoilMetrics');
    if (savedMetrics) {
      setUserSoilMetrics(JSON.parse(savedMetrics));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('soil.title')} - AgriSmart</title>
        <meta name="description" content="Monitor and analyze critical soil parameters for optimal crop management decisions with real-time metrics and recommendations." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <MainSidebar isCollapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        
        <main className={`transition-agricultural ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pb-16 lg:pb-0`}>
          {/* Header */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="px-4 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{t('soil.title')}</h1>
                  <p className="text-muted-foreground">{t('soil.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showInputForm ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setShowInputForm(!showInputForm)}
                    iconName={showInputForm ? "X" : "Edit"}
                    iconPosition="left"
                  >
                    {showInputForm ? 'Cancel' : 'Update Metrics'}
                  </Button>
                  <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                    {t('soil.export')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 lg:px-8 py-6 space-y-6">
            {/* Soil Metrics Input Form */}
            {showInputForm && (
              <SoilMetricsInputForm
                onSubmit={handleSoilMetricsSubmit}
                initialValues={userSoilMetrics}
              />
            )}

            {/* Current Soil Metrics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">{t('soil.currentMetrics')}</h2>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soilMetrics?.map((metric, index) => (
                  <SoilMetricsCard
                    key={index}
                    title={metric?.title}
                    value={metric?.value}
                    unit={metric?.unit}
                    status={metric?.status}
                    icon={metric?.icon}
                    recommendation={metric?.recommendation}
                    trend={metric?.trend}
                    source={metric?.source}
                    lastUpdated={metric?.lastUpdated}
                  />
                ))}
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SoilTrendChart
                data={trendData}
                title={t('soil.trendNpk')}
                parameters={['nitrogen', 'phosphorus', 'potassium']}
              />
              <SoilTrendChart
                data={trendData}
                title={t('soil.trendPhMoist')}
                parameters={['ph', 'moisture']}
              />
            </div>

            {/* Fertilizer Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">AI Fertilizer Recommendations</h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-muted-foreground">
                    Get personalized fertilizer recommendations
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="Leaf" 
                    iconPosition="left"
                    onClick={() => {
                      console.log('Get Recommendation button clicked');
                      setShowFertilizerForm(true);
                    }}
                  >
                    Get Recommendation
                  </Button>
                </div>
              </div>
              
              {/* Show results if available */}
              {fertilizerResults ? (
                <FertilizerPredictionResults 
                  results={fertilizerResults} 
                  onClose={() => setFertilizerResults(null)}
                />
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Get AI-Powered Fertilizer Recommendations
                    </h3>
                    <p className="text-green-600 mb-4">
                      Enter your soil and environmental parameters to receive personalized fertilizer recommendations based on machine learning analysis.
                    </p>
                    <Button 
                      variant="default" 
                      iconName="Leaf" 
                      iconPosition="left"
                      onClick={() => {
                        console.log('Start Analysis button clicked');
                        setShowFertilizerForm(true);
                      }}
                    >
                      Start Analysis
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">{t('soil.recommendations')}</h2>
                <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
                  {t('soil.customize')}
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations?.map((recommendation) => (
                  <SoilRecommendationCard
                    key={recommendation?.id}
                    recommendation={recommendation}
                    onApplyRecommendation={handleApplyRecommendation}
                  />
                ))}
              </div>
            </div>

            {/* Soil Testing Facilities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">{t('soil.testingFacilities')}</h2>
                <Button variant="outline" size="sm" iconName="MapPin" iconPosition="left">
                  {t('soil.viewMap')}
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {testingFacilities?.map((facility) => (
                  <SoilTestingCard
                    key={facility?.id}
                    facility={facility}
                    onScheduleTest={handleScheduleTest}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{t('soil.quickActions')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" fullWidth iconName="Calendar" iconPosition="left">
                  {t('soil.scheduleTest')}
                </Button>
                <Button variant="outline" fullWidth iconName="FileText" iconPosition="left">
                  {t('soil.viewHistory')}
                </Button>
                <Button variant="outline" fullWidth iconName="Bell" iconPosition="left">
                  {t('soil.setAlerts')}
                </Button>
                <Button variant="outline" fullWidth iconName="Share2" iconPosition="left">
                  {t('soil.shareReport')}
                </Button>
              </div>
            </div>
          </div>
        </main>

        <MobileNavigationBar />

        {/* Fertilizer Prediction Form Modal */}
        {showFertilizerForm && (
          <FertilizerPredictionForm
            isOpen={showFertilizerForm}
            onClose={() => setShowFertilizerForm(false)}
            onPredict={(results) => {
              setFertilizerResults(results);
              setShowFertilizerForm(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default SoilHealthMonitor;