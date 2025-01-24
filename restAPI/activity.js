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

    if ( event_type == 0){
      saveTextLeakEvent(request.data);
    }
    else if ( event_type == 1) {
      saveFileUploadEvent(request.data);
    }
    else {
        console.log("undefined event_type requested");
    }

    const activityRef = await db.collection("user_activities").add({
      user_id,
      event_type,
      file_id,
      text_id,
      event_time: new Date().toISOString(),
    });
    return {success: true, fileId: activityRef.id};
  } catch (error) {
    console.error("Activity recording failed:", error.message);
    throw new Error("Device registration failed: ${error.message}");
  }
});
// 텍스트 유출 이벤트 저장 함수
async function saveTextLeakEvent(eventData) {
  try {
    const { user_id, org_id, leaked_text, application_name } = eventData;

    if (!user_id || !org_id || !leaked_text || !application_name) {
      throw new Error("Missing required fields for text leak event");
    }

    await db.collection("text_leak_events").add({
      user_id,
      org_id,
      leaked_text,
      application_name,
      timestamp: new Date().toISOString(),
    });

    console.log("Text leak event saved successfully.");
    return { success: true, message: "Text leak event saved successfully." };
  } catch (error) {
    console.error("Failed to save text leak event:", error.message);
    return { success: false, message: `Failed to save text leak event: ${error.message}` };
  }
}
// 파일 업로드 이벤트 저장 함수
async function saveFileUploadEvent(eventData) {
  try {
    const { user_id, org_id, file_name, file_size, upload_destination } = eventData;

    if (!user_id || !org_id || !file_name || !file_size || !upload_destination) {
      throw new Error("Missing required fields for file upload event");
    }

    await db.collection("file_upload_events").add({
      user_id,
      org_id,
      file_name,
      file_size,
      upload_destination,
      timestamp: new Date().toISOString(),
    });

    console.log("File upload event saved successfully.");
    return { success: true, message: "File upload event saved successfully." };
  } catch (error) {
    console.error("Failed to save file upload event:", error.message);
    return { success: false, message: `Failed to save file upload event: ${error.message}` };
  }
}
