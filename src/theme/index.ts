import { MD3LightTheme, configureFonts } from "react-native-paper";

// ===== KSIT PREMIUM LIGHT COLOR SYSTEM =====
const KSITColors = {
  background: "#EFF2F7",
  surface: "#FFFFFF",

  primary: "#0057B8",
  primaryDark: "#003E82",
  primaryLight: "#6BC0FF",

  secondary: "#1C7ADE",

  textPrimary: "#0A1120",
  textSecondary: "#374151",

  outline: "#D2D6DD",

  shadowSoft: "rgba(0, 87, 184, 0.18)",
};

// ===== FONT CONFIG =====
const baseFontConfig = {
  regular: { fontFamily: "Inter-Regular", fontWeight: "400" },
  medium: { fontFamily: "Inter-Medium", fontWeight: "500" },
  light: { fontFamily: "Inter-Light", fontWeight: "300" },
  thin: { fontFamily: "Inter-Thin", fontWeight: "200" },
} as const;

// ===== MAIN THEME GENERATOR (FORCED LIGHT) =====
export const getTheme = () => {
  const base = MD3LightTheme;

  return {
    ...base,
    roundness: 14,

    colors: {
      ...base.colors,

      // Primary KSIT brand colours
      primary: KSITColors.primary,
      primaryContainer: KSITColors.primaryLight,
      secondary: KSITColors.secondary,

      // Backgrounds
      background: KSITColors.background,
      surface: KSITColors.surface,

      // Text Colors
      onSurface: KSITColors.textPrimary,
      onBackground: KSITColors.textPrimary,
      onPrimary: "#FFFFFF",

      // Extended text tokens for secondary copy
      textPrimary: KSITColors.textPrimary,
      textSecondary: KSITColors.textSecondary,

      // Borders & Outlines
      outline: KSITColors.outline,

      // Buttons
      surfaceVariant: "#F5F8FF",

      // Soft brand shadow
      shadowSoft: KSITColors.shadowSoft,

      // Error
      error: "#EF4444",
    },

    // Cast to any to satisfy MD3 font typing while keeping a simple config.
    fonts: configureFonts({ config: baseFontConfig as any }),
  };
};

export const useAppTheme = () => {
  // Force KSIT Premium Light theme (no dark mode switching)
  return getTheme();
};
