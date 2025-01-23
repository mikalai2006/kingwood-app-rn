export default {
  name: "kingwood",
  slug: "kingwoodapp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "kingwood",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#202020",
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.mikalai2006.kingwood",
    userInterfaceStyle: "automatic",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-asset",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification.png",
        color: "#ffffff",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "9efc7b1e-694e-4493-b25a-9f33352ea3dc",
    },
  },
};
