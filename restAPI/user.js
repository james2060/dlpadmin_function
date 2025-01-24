
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
exports.register_user = onCall(async (request) => {
  try {
    const {org_id, email, user_name, password, status} = request.data;

    if (!org_id || !email || !user_name || !password || !status) {
      throw new Error("Missing required fields");
    }
    // 중복 체크 쿼리
    const existingFilesQuery = await db.collection("users")
        .where("user_name", "==", user_name)
        .where("org_id", "==", org_id)
        .get();

    // 중복 데이터가 존재할 경우 에러 반환
    if (!existingFilesQuery.empty) {
      console.log("Duplicate entry detected for user_name");
      return {success: false,
        message: "Duplicate entry detected for user_name"};
    }
    db.collection("users").add({
      org_id,
      email,
      user_name,
      password,
      status,
      created_at: new Date().toISOString(),
    });

    console.log("User registered successfully: ${userRef.id}");
    return {success: true};
  } catch (error) {
    throw new Error("User registration failed: ${error.message}");
  }
});
