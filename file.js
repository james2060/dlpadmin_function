
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");
// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
// 파일 업로드 및 분석 결과 기록
exports.regcord_fileinfo = onCall(async (request) => {
  try {
    const {
      user_id,
      salted_hash,
      size,
      type,
      file_logging_path,
      is_watermarked,
      is_llm_detected,
    }= request.data;

    // 파일 정보 저장
    const fileRef = await db.collection("files").add({
      user_id,
      salted_hash,
      size,
      type,
      file_logging_path,
      is_watermarked,
      is_llm_detected,
      upload_time: "2025-03-25T10:30:00.000Z",
    });

    return {success: true, fileId: fileRef.id};
  } catch (error) {
    console.error("uploadfileinfo failed:", error.message);
    throw new Error(`upload file info failed: ${error.message}`);
  }
});
