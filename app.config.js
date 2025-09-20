const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "КингВуд(DEV)" : "КингВуд",
  slug: "kingwood-app-rn",
  version: "1.0.10",
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
    permissions: ["SCHEDULE_EXACT_ALARM"],
  },
  android: {
    permissions: ["SCHEDULE_EXACT_ALARM"],
    adaptiveIcon: {
      // foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffdb4d",
    },
    package: IS_DEV
      ? "com.mikalai2006.kingwood.dev"
      : "com.mikalai2006.kingwood",
    userInterfaceStyle: "automatic",
    googleServicesFile: IS_DEV
      ? process.env.GOOGLE_SERVICES_DEV_JSON
      : process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
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

// export default ({ config }) => {
//   const variant = process.env.APP_VARIANT || "development"; // Default to development

//   const commonConfig = {
//     ...config,
//     // name: `My App (${variant})`, // Customize app name
//     // icon: `./assets/icon-${variant}.png`, // Use variant-specific icon
//     // // ... other common configurations
//     name: "КингВуд",
//     slug: "kingwood-app-rn",
//     version: "1.0.10",
//     orientation: "portrait",
//     icon: "./assets/images/icon.png",
//     scheme: "kingwood",
//     userInterfaceStyle: "automatic",
//     splash: {
//       image: "./assets/images/splash.png",
//       resizeMode: "contain",
//       backgroundColor: "#202020",
//     },
//     // updates: {
//     //   url: "http://localhost:8000/api/v1/updates/manifest",
//     //   enabled: true,
//     //   fallbackToCacheTimeout: 30000,
//     //   codeSigningCertificate: "./code-signing/certificate.pem",
//     //   codeSigningMetadata: {
//     //     keyid: "main",
//     //     alg: "rsa-v1_5-sha256",
//     //   },
//     // },
//     runtimeVersion: {
//       policy: "appVersion",
//     },
//     updates: {
//       url: "https://u.expo.dev/ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
//       // codeSigningCertificate: "./certs/certificate.pem",
//       // codeSigningMetadata: {
//       //   keyid: "main",
//       //   alg: "rsa-v1_5-sha256",
//       // },
//     },
//     ios: {
//       supportsTablet: true,
//       userInterfaceStyle: "automatic",
//       permissions: ["SCHEDULE_EXACT_ALARM"],
//     },
//     android: {
//       permissions: ["SCHEDULE_EXACT_ALARM"],
//       adaptiveIcon: {
//         // foregroundImage: "./assets/images/adaptive-icon.png",
//         backgroundColor: "#ffdb4d",
//       },
//       package: "com.mikalai2006.kingwood",
//       userInterfaceStyle: "automatic",
//       googleServicesFile:
//         process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
//     },
//     web: {
//       bundler: "metro",
//       output: "static",
//       favicon: "./assets/images/favicon.png",
//     },
//     plugins: [
//       "expo-router",
//       "expo-asset",
//       [
//         "expo-notifications",
//         {
//           icon: "./assets/images/notification.png",
//           color: "#ffffff",
//           defaultChannel: "default",
//           enableBackgroundRemoteNotifications: true,
//         },
//       ],
//     ],
//     experiments: {
//       typedRoutes: true,
//     },
//     extra: {
//       eas: {
//         projectId: "ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
//       },
//     },
//     owner: "mikalai2006",
//   };

//   if (variant === "development") {
//     return {
//       ...commonConfig,
//       name: "KWDev",
//       ios: {
//         ...commonConfig.ios,
//         bundleIdentifier: "com.mikalai2006.kingwood.dev",
//       },
//       android: {
//         ...commonConfig.android,
//         package: "com.mikalai2006.kingwood.dev",
//       },
//     };
//   }
//   // else if (variant === "preview") {
//   //   return {
//   //     ...commonConfig,
//   //     ios: {
//   //       bundleIdentifier: "com.yourcompany.myapp.preview",
//   //     },
//   //     android: {
//   //       package: "com.yourcompany.myapp.preview",
//   //     },
//   //   };
//   // }
//   else if (variant === "production") {
//     return {
//       ...commonConfig,
//       ios: {
//         ...commonConfig.ios,
//         bundleIdentifier: "com.mikalai2006.kingwood",
//       },
//       android: {
//         ...commonConfig.android,
//         package: "com.mikalai2006.kingwood",
//       },
//     };
//   }

//   return commonConfig;
// };

// export default {
//   name: "КингВуд",
//   slug: "kingwood-app-rn",
//   version: "1.0.10",
//   orientation: "portrait",
//   icon: "./assets/images/icon.png",
//   scheme: "kingwood",
//   userInterfaceStyle: "automatic",
//   splash: {
//     image: "./assets/images/splash.png",
//     resizeMode: "contain",
//     backgroundColor: "#202020",
//   },
//   // updates: {
//   //   url: "http://localhost:8000/api/v1/updates/manifest",
//   //   enabled: true,
//   //   fallbackToCacheTimeout: 30000,
//   //   codeSigningCertificate: "./code-signing/certificate.pem",
//   //   codeSigningMetadata: {
//   //     keyid: "main",
//   //     alg: "rsa-v1_5-sha256",
//   //   },
//   // },
//   runtimeVersion: {
//     policy: "appVersion",
//   },
//   updates: {
//     url: "https://u.expo.dev/ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
//     // codeSigningCertificate: "./certs/certificate.pem",
//     // codeSigningMetadata: {
//     //   keyid: "main",
//     //   alg: "rsa-v1_5-sha256",
//     // },
//   },
//   ios: {
//     supportsTablet: true,
//     userInterfaceStyle: "automatic",
//     permissions: ["SCHEDULE_EXACT_ALARM"],
//   },
//   android: {
//     permissions: ["SCHEDULE_EXACT_ALARM"],
//     adaptiveIcon: {
//       // foregroundImage: "./assets/images/adaptive-icon.png",
//       backgroundColor: "#ffdb4d",
//     },
//     package: "com.mikalai2006.kingwood",
//     userInterfaceStyle: "automatic",
//     googleServicesFile:
//       process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
//   },
//   web: {
//     bundler: "metro",
//     output: "static",
//     favicon: "./assets/images/favicon.png",
//   },
//   plugins: [
//     "expo-router",
//     "expo-asset",
//     [
//       "expo-notifications",
//       {
//         icon: "./assets/images/notification.png",
//         color: "#ffffff",
//         defaultChannel: "default",
//         enableBackgroundRemoteNotifications: true,
//       },
//     ],
//   ],
//   experiments: {
//     typedRoutes: true,
//   },
//   extra: {
//     eas: {
//       projectId: "ee1c0c54-2ded-4af3-9dfb-a273f41f1ba0",
//     },
//   },
//   owner: "mikalai2006",
// };
