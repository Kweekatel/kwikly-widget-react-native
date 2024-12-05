import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const AnimatedSkeleton = ({
  skeletonHeight,
  skeletonWidth,
  borderRadius,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D3D3D3', '#EAEAEA'],
  });

  return (
    <Animated.View
      style={[
        {
          height: skeletonHeight,
          width: skeletonWidth,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

const KwiklyChatSkeleton = () => {
  return (
    <View style={styles.skeletonView}>
      <View style={styles.header}>
        <AnimatedSkeleton
          skeletonHeight={50}
          skeletonWidth={50}
          borderRadius={25}
        />
        <View style={{ marginTop: 70 }} />
        <AnimatedSkeleton
          skeletonHeight={45}
          skeletonWidth={'70%'}
          borderRadius={10}
        />
        <View style={{ marginTop: 9 }} />
        <AnimatedSkeleton
          skeletonHeight={25}
          skeletonWidth={'55%'}
          borderRadius={5}
        />
        <View style={{ position: 'relative', top: 45, marginTop: -15 }}>
          <AnimatedSkeleton
            skeletonHeight={60}
            skeletonWidth={'100%'}
            borderRadius={10}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <AnimatedSkeleton
          skeletonHeight={60}
          skeletonWidth={'100%'}
          borderRadius={10}
        />
        <View style={{ marginTop: 5 }}>
          <AnimatedSkeleton
            skeletonHeight={25}
            skeletonWidth={'100%'}
            borderRadius={5}
          />
        </View>
      </View>
    </View>
  );
};

export default KwiklyChatSkeleton;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  skeletonView: {
    width: width,
    height: height,
    backgroundColor: 'white',
    position: 'relative',
  },
  header: {
    backgroundColor: '#40A758',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
});
