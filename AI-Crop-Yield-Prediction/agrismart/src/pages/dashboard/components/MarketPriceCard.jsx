import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { apiGet } from '../../../lib/api';


const MarketPriceCard = () => {
  const [marketData, setMarketData] = useState([]);
  const [profitableCrops, setProfitableCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMarket() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet('/dashboard/analytics');
        setMarketData(data?.marketData || []);
        setProfitableCrops(data?.profitableCrops || []);
      } catch (e) {
        console.error('Error fetching market data:', e);
        // Fallback to mock data
        setMarketData([
          {
            id: "1",
            crop: "Wheat",
            market: "Local Market",
            currentPrice: "2200",
            change: 5.2,
            icon: "Wheat"
          },
          {
            id: "2",
            crop: "Rice",
            market: "Local Market",
            currentPrice: "1800",
            change: -2.1,
            icon: "Wheat"
          },
          {
            id: "3",
            crop: "Corn",
            market: "Local Market",
            currentPrice: "1600",
            change: 8.5,
            icon: "Wheat"
          }
        ]);
        setProfitableCrops([
          { name: "Wheat", profit: "₹15,000/acre", season: "Rabi" },
          { name: "Rice", profit: "₹12,000/acre", season: "Kharif" },
          { name: "Corn", profit: "₹18,000/acre", season: "Kharif" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
  }, []);

  const getChangeColor = (change) => {
    return change >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'very high': return 'var(--color-success)';
      case 'high': return 'var(--color-success)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-error)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  if (loading) {
    return <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural">Loading market data...</div>;
  }
  if (error) {
    return <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural text-red-500">{error}</div>;
  }
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="TrendingUp" size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Market Prices</h3>
            <p className="text-sm text-muted-foreground">Real-time crop pricing</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {marketData?.slice(0, 3)?.map((item) => (
          <div key={item?.id || item?.crop} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon || 'Wheat'} size={20} color="var(--color-primary)" />
              <div>
                <div className="font-medium text-card-foreground">{item?.crop}</div>
                <div className="text-xs text-muted-foreground">{item?.market}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-card-foreground">₹{item?.currentPrice}/quintal</div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon(item?.change)} 
                  size={12} 
                  color={getChangeColor(item?.change)} 
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: getChangeColor(item?.change) }}
                >
                  {item?.change > 0 ? '+' : ''}{item?.change}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Profitable Crop Suggestions</h4>
        <div className="space-y-2">
          {profitableCrops?.map((crop, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-success/5 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="Leaf" size={14} color="var(--color-success)" />
                <span className="text-sm font-medium text-card-foreground">{crop?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-success font-medium">{crop?.profit}</span>
                <span className="text-xs text-muted-foreground">({crop?.season})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="BarChart3" iconPosition="left">
          View Market Analysis
        </Button>
      </div>
    </div>
  );
};

export default MarketPriceCard;