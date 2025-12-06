import React from "react";
import { SafeAreaView, ViewStyle, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

type ScreenContainerProps = {
  children: React.ReactNode;
  /** Center contents vertically – good for auth / single-form screens */
  centerContent?: boolean;
  /** Optional extra style overrides */
  style?: ViewStyle | ViewStyle[];
};

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  centerContent = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.content,
          centerContent && styles.centered,
          style,
        ]}
      >
        <View style={styles.maxWidth}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  maxWidth: {
    width: "100%",
    maxWidth: 480,
  },
  centered: {
    justifyContent: "center",
  },
});
