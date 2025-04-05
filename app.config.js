export default {
  name: "Кингвуд",
  slug: "kingwood-app-rn",
  version: "1.0.5",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "kingwood",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#202020",
  },
  // updates: {
  //   url: "http://localhost:8000/api/v1/updates/manifest",
  //   enabled: true,
  //   fallbackToCacheTimeout: 30000,
  //   codeSigningCertificate: "./code-signing/certificate.pem",
  //   codeSigningMetadata: {
  //     keyid: "main",
  //     alg: "rsa-v1_5-sha256",
  //   },
  // },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
    // codeSigningCertificate: "./certs/certificate.pem",
    // codeSigningMetadata: {
    //   keyid: "main",
    //   alg: "rsa-v1_5-sha256",
    // },
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic",
  },
  android: {
    permissions: ["android.permission.SCHEDULE_EXACT_ALARM"],
    adaptiveIcon: {
      // foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffdb4d",
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
      projectId: "ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
    },
  },
  owner: "mikalai2006",
};
