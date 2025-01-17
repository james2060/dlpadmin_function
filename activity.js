const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");
// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
// 사용자 활동 기록 함수
exports.record_activity = onCall(async (request) => {
  try {
    const {user_id, event_type, file_id, text_id} =request.data;

    const activityRef = await db.collection("user_activities").add({
      user_id,
      event_type,
      file_id,
      text_id,
      event_time: "2025-03-25T10:30:00.000Z",
    });
    return {success: true, fileId: activityRef.id};
  } catch (error) {
    console.error("Activity recording failed:", error.message);
    throw new Error("Device registration failed: ${error.message}");
  }
});
