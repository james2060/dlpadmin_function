const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// SCRET_KEY (환경 변수로 관리 권장)
const SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Access Token 생성
 * @param {json}request data
 * @return {json}request
 */
function generateAccessToken(request) {
  const {email, org_id} = request.body.data;
  return jwt.sign({email, org_id}, SECRET_KEY, {expiresIn: "1h"});
}
/**
 * Refresh Token 생성
 * @param {json}request data
 * @return {json}response
 */
function generateRefreshToken(request) {
  const {email, org_id} = request.body.data;
  return jwt.sign({email, org_id}, SECRET_KEY, {expiresIn: "7d"});
}
/**
 * 사용자 정보 등록
 * @param {json}request data
 * @return {json}response
 */
exports.register_user = onRequest(async (req, res) => {
  try {
    console.log(req.body.data);
    const {org_id, email, user_name, password, status} = req.body.data;

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
      return res.status(200).json({success: true, message: "Duplicate entry detected for user_name"});
    }

    // Access Token 생성 (1시간 유효)
    const accessToken = generateAccessToken(req);
    console.log("Generated Access Token:", accessToken);
    // Refresh Token 생성 (7일 유효)
    const refreshToken = generateRefreshToken(req);
    console.log("Generated Refresh Token:", refreshToken);

    // 사용자 정보 등록
    const userRef = await db.collection("users").add({
      org_id,
      email,
      user_name,
      password,
      status,
      accessToken,
      refreshToken,
      created_at: new Date().toISOString(),
    });
    return res.status(200).json({
      success: false,
      message: `User registration successfully: ${userRef.id}`,
      accesstoken: `${accessToken}`,
      refreshtoken: `${accessToken}`,
    });
  } catch (error) {
    console.error("User registration failed:", error.message);
    return res.status(500).json({success: false, message: `User registration failed: ${error.message}`});
  }
});
