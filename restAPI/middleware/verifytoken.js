

const jwt = require("jsonwebtoken");


// SCRET_KEY (환경 변수로 관리 권장)
const SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

/**
 * Access Token 검증 미들웨어
 * @param {json}req_authHeader
 * @return {json}
 */
function verifyAccessToken(req_authHeader) {
  try {
    // Authorization 헤더 확인
    const authHeader = req_authHeader;
    console.log("param:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("authHeader error", authHeader);
      return {success: false,
        message: "Missing or invalid Authorization header."};
    }
    // Access Token 추출
    const token = authHeader.split(" ")[1];
    // Access Token 검증
    const decoded = jwt.verify(token, SECRET_KEY);
    return {success: true, accesstoken: decoded};
  } catch (error) {
    console.error("Access Token verification failed:", error.message);
    return {success: false, message: `Access Token verification failed: ${error.message}`};
  }
}

module.exports = {verifyAccessToken};
