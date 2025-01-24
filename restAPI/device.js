
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const verifytoken = require("./middleware/verifytoken");

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * 에이전트가 설치된 디바이스 정보 등록
 * @param {json}request data
 */
exports.register_device = onRequest(async (req, res) => {
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
    const {
      user_id,
      org_id,
      os_name,
      cpu,
      mac_addr,
      id_addr,
      os_version,
      computer_name,
    } = req.body.data;

    if (!user_id || !org_id || !os_name || !cpu ||
        !mac_addr || !id_addr || !os_version || !computer_name) {
      throw new Error("Missing required fields");
    }
    // 중복 체크 쿼리
    const existingFilesQuery = await db.collection("devices")
        .where("user_id", "==", user_id)
        .where("org_id", "==", org_id)
        .get();

    // 중복 데이터가 존재하지 않는 경우
    if (existingFilesQuery.empty) {
      // 디바이스 정보 등록
      const deviceRef = await db.collection("devices").add({
        user_id,
        org_id,
        install_date: new Date().toISOString(),
        last_login_time: new Date().toISOString(),
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
        update_date: new Date().toISOString(),
      });

      console.log("Device registered successfully:");
      return res.status(200).json({
        success: true,
        message: "Device registered successfully"});
    } else {
      // 중복 데이터가 존재하는 경우
      // 디바이스 상세 정보 업데이트

      existingFilesQuery.forEach(async (deviceDoc) => {
        const deviceId = deviceDoc.id;
        // device_info collection 에서 해당 device_id를 가진 문서를 찾음
        const deviceInfoQuery = await db.collection("device_info")
            .where("device_id", "==", deviceId)
            .get();

        if (!deviceInfoQuery.empty) {
          // device_info document update
          deviceInfoQuery.forEach(async (infoDoc) => {
            await db.collection("device_info").doc(infoDoc.id).update({
              os_name: os_name,
              cpu: cpu,
              mac_addr: mac_addr,
              id_addr: id_addr,
              os_version: os_version,
              computer_name: computer_name,
              update_date: new Date().toISOString(),
            });
          });
        }
      });
      console.log("device_info updated successfully:");
      return res.status(200).json({
        success: true,
        message: "Device Info registered successfully"});
    }
  } catch (error) {
    console.error("Device registration failed", error.message);
    return res.status(500).json({
      success: false,
      message: `Device registration failed: ${error.message}`});
  }
});
