import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button, useTheme } from "react-native-paper";

type KSITButtonProps = React.ComponentProps<typeof Button> & {
  fullWidth?: boolean;
};

export const KSITButton: React.FC<KSITButtonProps> = ({
  mode = "contained",
  fullWidth = true,
  style,
  contentStyle,
  labelStyle,
  children,
  ...rest
}) => {
  const theme = useTheme();

  const resolvedStyle: StyleProp<ViewStyle> = [
    styles.base,
    fullWidth ? styles.fullWidth : styles.autoWidth,
    mode === "contained"
      ? { backgroundColor: theme.colors.primary }
      : {
          backgroundColor: "transparent",
          borderColor: theme.colors.outline,
          borderWidth: mode === "outlined" ? StyleSheet.hairlineWidth * 1.5 : 0,
        },
    style,
  ];

  return (
    <Button
      mode={mode}
      style={resolvedStyle}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={[styles.label, labelStyle]}
      {...rest}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    elevation: 0,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  autoWidth: {
    alignSelf: "flex-start",
  },
  content: {
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

