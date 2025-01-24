
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// SCRET_KEY (환경 변수로 관리 권장)
const SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";


// Access Token 검증 미들웨어
const verifyAccessToken = (req, res, next) => {
  try {
    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header.",
      });
    }

    // Access Token 추출
    const token = authHeader.split(" ")[1];

    // Access Token 검증
    const decoded = jwt.verify(token, SECRET_KEY);

    // 유효한 토큰일 경우 사용자 정보 저장
    req.user = decoded;

    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    console.error("Access Token verification failed:", error.message);
    return res.status(403).json({
      success: false,
      message: `Access Token verification failed: ${error.message}`,
    });
  }
};

// Access Token 검증 예제
verifyAccessToken(accessToken);
