import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';
import { ContactTab } from './contact';
import { ConsistencyTab } from './consistency';
import { ImpactTab } from './impact';
import { ProgressTab } from './progress';
import { CarouselDots } from './CarouselDots';

interface PerformanceTabProps {
  data: {
    contact: {
      sweetSpotPercentage: number;
      sweetSpotTrend: string;
      barrelPercentage: number;
      barrelTrend: string;
      hardHitPercentage: number;
      hardHitTrend: string;
      sweetSpotHistory: {
        date: string;
        percentage: number;
      }[];
    };
    consistency: {
      sweetSpotPercentage: number;
      sweetSpotTrend: string;
      barrelPercentage: number;
      barrelTrend: string;
      hardHitPercentage: number;
      hardHitTrend: string;
      sweetSpotHistory: {
        date: string;
        percentage: number;
      }[];
    };
    impact: {
      avgExitVelocity: number;
      exitVelocityTrend: string;
      maxExitVelocity: number;
      maxExitVelocityTrend: string;
      xwOBA: number;
      xwOBATrend: string;
      sprayData: {
        x: number;
        y: number;
        ev: number;
        type: 'pull' | 'center' | 'oppo';
      }[];
    };
    progress: {
      sweetSpotProgress: number;
      sweetSpotProgressTrend: string;
      exitVelocityProgress: number;
      exitVelocityProgressTrend: string;
      barrelProgress: number;
      barrelProgressTrend: string;
      evLaunchAngleData: {
        ev: number;
        launchAngle: number;
        xwOBA: number;
      }[];
    };
  };
}

export function PerformanceTab({ data }: PerformanceTabProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 'contact', component: <ContactTab data={data.contact} /> },
    { id: 'consistency', component: <ConsistencyTab data={data.consistency} /> },
    { id: 'impact', component: <ImpactTab data={data.impact} /> },
    { id: 'progress', component: <ProgressTab data={data.progress} /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tabs[activeTab].component}
      </View>
      <CarouselDots
        count={tabs.length}
        activeIndex={activeTab}
        onDotPress={setActiveTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
}); 