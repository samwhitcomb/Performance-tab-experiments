import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { EVLaunchAngleChart } from './EVLaunchAngleChart';
import { SprayChart } from '@/components/performance/SprayChart';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';

interface ContactQualityTabProps {
  data: {
    avgEV: {
      value: number;
      trend: number;
      description: string;
    };
    peakEV: {
      value: number;
      trend: number;
      description: string;
    };
    hardHitPercent: {
      value: number;
      trend: number;
      description: string;
    };
    barrelPercent: {
      value: number;
      trend: number;
      description: string;
    };
    sweetSpotPercent: {
      value: number;
      trend: number;
      description: string;
    };
    groundBallFlyBall: {
      gb: number;
      fb: number;
      trend: number;
      description: string;
    };
    ropesStreak: number;
    bombCounter: number;
    evLaunchAngleData: {
      launchAngle: number;
      ev: number;
      xwOBA: number;
      teeHeight?: string;
      tossLocation?: string;
    }[];
    sprayData: {
      x: number;
      y: number;
      type: 'pull' | 'center' | 'oppo';
      ev: number;
      launchAngle: number;
    }[];
    keyInsight: string;
  };
}

export function ContactTab({ data }: ContactQualityTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);
  const [teeHeightFilter, setTeeHeightFilter] = useState<string | null>(null);
  const [tossLocationFilter, setTossLocationFilter] = useState<string | null>(null);

  const charts = [
    {
      title: 'EV vs. Launch Angle',
      description: 'Color: xwOBA (🟢≥.400 = Great, 🔴<.300 = Weak)',
      component: (
        <EVLaunchAngleChart 
          data={data.evLaunchAngleData || []}
        />
      ),
    },
    {
      title: 'Spray Chart',
      description: 'Dot size = EV, color = LA (🔵GB, 🟢LD, 🔴FB)',
      component: (
        <SprayChart 
          data={data.sprayData || []}
          showLaunchAngle
        />
      ),
    },
  ];

  const handleSwipeLeft = () => {
    if (activeChart < charts.length - 1) {
      setActiveChart(activeChart + 1);
    }
  };

  const handleSwipeRight = () => {
    if (activeChart > 0) {
      setActiveChart(activeChart - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.metricsSection}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Power & Trajectory
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Avg / Peak EV"
            value={`${data.avgEV.value}/${data.peakEV.value}`}
            trend={data.avgEV.trend.toString()}
            description="Exit velocity in mph"
            compact
          />
          <MetricCard
            title="Hard-Hit %"
            value={`${data.hardHitPercent.value}%`}
            trend={data.hardHitPercent.trend.toString()}
            description={data.hardHitPercent.description}
            compact
          />
          <MetricCard
            title="Barrel %"
            value={`${data.barrelPercent.value}%`}
            trend={data.barrelPercent.trend.toString()}
            description="EV ≥ 98 mph + LA 10°–30°"
            compact
          />
        </View>
        
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Sweet Spot %"
            value={`${data.sweetSpotPercent.value}%`}
            trend={data.sweetSpotPercent.trend.toString()}
            description="Launch angle 10°–30°"
            compact
          />
          <MetricCard
            title="GB/FB %"
            value={`${data.groundBallFlyBall.gb}/${data.groundBallFlyBall.fb}`}
            trend={data.groundBallFlyBall.trend.toString()}
            description={data.groundBallFlyBall.description}
            compact
          />
          <MetricCard
            title="Gamification"
            value={`${data.ropesStreak}/${data.bombCounter}`}
            trend="+3"
            description="Ropes streak / HR counter"
            compact
          />
        </View>
      </View>

      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[styles.chartTitle, { color: colors.grey[600] }]}>
              {charts[activeChart].title}
            </Text>
            <Text style={[styles.chartDescription, { color: colors.grey[400] }]}>
              {charts[activeChart].description}
            </Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <SwipeableChartView
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          >
            {charts[activeChart].component}
          </SwipeableChartView>
        </View>
        <CarouselDots
          count={charts.length}
          activeIndex={activeChart}
          onDotPress={setActiveChart}
        />
      </View>
      
      <View style={styles.insightContainer}>
        <Text style={[styles.insightText, { color: colors.grey[600] }]}>
          Key Insight: {data.keyInsight}
        </Text>
      </View>
    </View>
  );
}

export default ContactTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsSection: {
    height: '40%',
  },
  chartSection: {
    height: '45%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  metricsContainer: {
    padding: 16,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
  },
  chartDescription: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContainer: {
    padding: 16,
    marginTop: 8,
  },
  insightText: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 