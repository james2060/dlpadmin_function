
// const {onCall} = require("firebase-functions/v2/https");
// const {onDocumentWritten} = require("firebase-functions/v2/firestore");
// const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");

const user = require("./restAPI/user");
const device = require("./restAPI/device");
const activity = require("./restAPI/activity");

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

// 사용자 등록
exports.register_user = user.register_user;
// Device 등록
exports.register_device = device.register_device;
// 텍스트 유출 활동 정보 기록
exports.record_textleak = activity.saveTextLeakEvent;
// 파일 유출 활동 정보 기록
exports.record_fileleak = activity.saveFileUploadEvent;

