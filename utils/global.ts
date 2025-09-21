const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === "development";
export const timeoutMaxRequest = 10000; // in milliseconds
export const isWriteConsole = IS_DEV;

if (isWriteConsole) {
  console.log("\x1b[33m", "Start development environment", IS_DEV);
}
// export const hostAPI = "https://kingwood-apps.ru/api/v1";
// export const hostSERVER = "https://kingwood-apps.ru";
// export const wsAPI = "wss://kingwood-apps.ru/api/v1/ws/room1";

export const hostAPI = IS_DEV
  ? "http://localhost:8000/api/v1"
  : "https://kingwood-apps.ru/api/v1";
export const hostSERVER = IS_DEV
  ? "http://localhost:8000"
  : "https://kingwood-apps.ru";
export const wsAPI = IS_DEV
  ? "ws://localhost:8000/api/v1/ws/room1"
  : "wss://kingwood-apps.ru/api/v1/ws/room1";

// Emulator.
// export const hostAPI = "http://10.0.2.2:8000/api/v1";
// export const hostSERVER = "http://10.0.2.2:8000";
// export const wsAPI = "ws://10.0.2.2:8000/api/v1/ws/room1";
