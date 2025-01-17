
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");
// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// 디바이스 등록 (2세대)
exports.register_device = onCall(async (request) => {
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
    // 중복 체크 쿼리
    const existingFilesQuery = await db.collection("devices")
        .where("user_id", "==", user_id)
        .where("org_id", "==", org_id)
        .get();

    // 중복 데이터가 존재할 경우
    if (!existingFilesQuery.empty) {
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
      return {success: true, deviceId: deviceRef.id};
    } else {
     // 디바이스 상세 정보 업데이트
     // 업데이트 함수 찾아볼 것

      /*
      await db.collecction("device_info").update({
        os_name,
        cpu,
        mac_addr,
        id_addr,
        os_version,
        computer_name,
        update_date: new Date().toISOString(),
      });
      */
      console.log("device_info updated successfully:");
      return {success: true, user_id: user_id};
    }
  } catch (error) {
    console.error("Device registration failed");
    throw new Error("Device registration failed");
  }
});
