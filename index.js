
// const {onCall} = require("firebase-functions/v2/https");
// const {onDocumentWritten} = require("firebase-functions/v2/firestore");
// const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");

const user = require("./user");
const file = require("./file");
const device = require("./device");
const activity = require("./activity");

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

// 사용자 등록
exports.register_user = user.register_user;
// Device 등록
exports.register_device = device.register_device;
// 파일 정보 등록
exports.record_fileinfo = file.regcord_fileinfo;
// 활동 정보 등록
exports.record_activity = activity.record_activity;

