// const {onCall} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const verifytoken = require("./middleware/verifytoken");
// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * 텍스트 유출 이벤트 저장 함수
 * @param {json}res
 */
// exports.saveTextLeakEvent = onCall(async (request) => {
exports.saveTextLeakEvent = onRequest(async (req, res) => {
  try {
    // Authorization 헤더 확인
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).json({success: false, message: "Authorization header is required"});
    }
    console.log("Authorization Header:", authorizationHeader);
    // Access Token 검증
    const decodedToken = await verifytoken.verifyAccessToken(authorizationHeader);
    if (!decodedToken) {
      return res.status(403).json({success: false, message: "Invalid or expired token"});
    }

    if (!decodedToken) {
      throw new Error(decodedToken);
    }

    const {user_id,
      org_id,
      leaked_text,
      input_type,
      application_name} = req.body.data;

    if (!user_id ||
      !org_id ||
      !leaked_text ||
      !input_type ||
      !application_name) {
      throw new Error("Missing required fields for text leak event");
    }
    await db.collection("text_leak_events").add({
      user_id,
      org_id,
      leaked_text,
      input_type,
      application_name,
      timestamp: new Date().toISOString(),
    });
    console.log("Text leak event saved successfully.");
    return res.status(200).json({success: true, message: "Text leak event saved successfully."});
  } catch (error) {
    console.error("Failed to save text leak event:", error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to save text leak event: ${error.message}`,
    });
  }
});
/**
 * 파일 업로드 이벤트 저장 함수
 * @param {json}request data
 */
// exports.saveFileUploadEvent = onCall(async (request) => {
exports.saveFileUploadEvent = onRequest(async (req, res) => {
  try {
    // Authorization 헤더 확인
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).json({success: false, message: "Authorization header is required"});
    }

    console.log("Authorization Header:", authorizationHeader);
    // Access Token 검증
    const decodedToken = await verifytoken.verifyAccessToken(authorizationHeader);
    if (!decodedToken) {
      return res.status(403).json({success: false, message: "Invalid or expired token"});
    }

    if (!decodedToken) {
      throw new Error(decodedToken);
    }

    const {user_id,
      org_id,
      file_name,
      file_size,
      file_type,
      application_name,
      upload_destination} = req.body.data;

    if (!user_id || !org_id ||
      !file_name || !file_size ||
      !file_type || !application_name || !upload_destination) {
      throw new Error("Missing required fields for file upload event");
    }

    await db.collection("file_upload_events").add({
      user_id,
      org_id,
      file_name,
      file_size,
      file_type,
      application_name,
      upload_destination,
      timestamp: new Date().toISOString(),
    });
    console.log("File upload event saved successfully.");
    return res.status(200).json({success: true, message: "File upload leak event saved successfully."});
  } catch (error) {
    console.error("Failed to save file upload event:",
        error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to save file upload leak event: ${error.message}`,
    });
  }
});
