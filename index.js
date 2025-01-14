/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onCall} = require("firebase-functions/v2/https");
// const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


// 디바이스 등록 (2세대)
exports.registerDevice = onCall(async (request) => {
  try {
    const {
      user_id,
      org_id,
      os_name,
      cpu,
      mac_addr,
      id_addr,
      os_version,
      computer_name,
    } = request.data;

    if (!user_id || !org_id || !os_name || !cpu ||
        !mac_addr || !id_addr || !os_version || !computer_name) {
      throw new Error("Missing required fields");
    }

    // console.log(admin.firestore.FieldValue);
    // const last_login_time = admin.firestore.FieldValue.serverTimestamp();
    // const install_time = admin.firestore.FieldValue.serverTimestamp();
    // 디바이스 정보 등록
    const deviceRef = await db.collection("devices").add({
      user_id,
      org_id,
      install_date: "2025-02-25T10:30:00.000Z",
      last_login_time: "2025-03-25T10:30:00.000Z",
    });

    // 디바이스 상세 정보 등록
    await db.collection("device_info").add({
      device_id: deviceRef.id,
      os_name,
      cpu,
      mac_addr,
      id_addr,
      os_version,
      computer_name,
    });

    console.log("Device registered successfully: ${deviceRef.id}");

    return {success: true, deviceId: deviceRef.id};
  } catch (error) {
    console.error("Device registration failed:", error.message);
    throw new Error(`Device registration failed: ${error.message}`);
  }
});
