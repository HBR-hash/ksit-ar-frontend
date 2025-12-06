import React from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Card, useTheme } from "react-native-paper";

type KSITCardProps = React.ComponentProps<typeof Card> & {
  style?: StyleProp<ViewStyle>;
};

export const KSITCard: React.FC<KSITCardProps> = ({
  children,
  style,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Card
      mode="elevated"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: (theme.colors as any).shadowSoft ?? theme.colors.primary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 18,
    elevation: 2,
  },
});
