import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { apiGet } from '../../../lib/api';


const ScheduleCard = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet('/api/irrigation/schedule');
        setScheduleItems(data?.schedule || []);
      } catch (e) {
        console.error('Error fetching schedule:', e);
        // Fallback to mock data
        setScheduleItems([
          {
            id: "1",
            title: "Morning Irrigation - Zone A",
            description: "Water wheat and rice fields in Zone A",
            zone: "Zone A",
            time: "06:00 AM",
            duration: "30 minutes",
            status: "scheduled",
            priority: "high",
            date: "Today",
            icon: "Droplets"
          },
          {
            id: "2",
            title: "Afternoon Irrigation - Zone B",
            description: "Water corn fields in Zone B",
            zone: "Zone B",
            time: "02:00 PM",
            duration: "45 minutes",
            status: "pending",
            priority: "medium",
            date: "Today",
            icon: "Droplets"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--color-success)';
      case 'pending': return 'var(--color-warning)';
      case 'scheduled': return 'var(--color-primary)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10';
      case 'pending': return 'bg-warning/10';
      case 'scheduled': return 'bg-primary/10';
      default: return 'bg-muted/10';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle';
      case 'medium': return 'Clock';
      case 'low': return 'Info';
      default: return 'Clock';
    }
  };

  if (loading) {
    return <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural">Loading schedule...</div>;
  }
  if (error) {
    return <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural text-red-500">{error}</div>;
  }
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-agricultural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="Calendar" size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Farm Schedule</h3>
            <p className="text-sm text-muted-foreground">Irrigation & fertilizer planning</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {scheduleItems?.slice(0, 2)?.map((item) => (
          <div 
            key={item?.id || item?.title} 
            className={`p-4 rounded-lg border ${getStatusBg(item?.status)}`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-md" style={{ backgroundColor: getStatusColor(item?.status) + '20' }}>
                <Icon 
                  name={item?.icon || 'Calendar'} 
                  size={16} 
                  color={getStatusColor(item?.status)} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-card-foreground truncate">{item?.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getPriorityIcon(item?.priority)} 
                      size={12} 
                      color="var(--color-muted-foreground)" 
                    />
                    <span className="text-xs text-muted-foreground">{item?.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item?.description}</p>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ 
                      color: getStatusColor(item?.status),
                      backgroundColor: getStatusColor(item?.status) + '20'
                    }}
                  >
                    {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">{item?.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {scheduleItems?.filter(item => item?.status === 'pending')?.length} pending tasks
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;