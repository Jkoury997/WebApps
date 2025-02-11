require('dotenv').config();
const { Heartbeat, CountData } = require('../database/models');  // Importa los modelos de MongoDB


// 心跳数据 字段对应下标
// The index corresponding to the heartbeat data field
const heartbeatDataToObjectFields = [
  ['sn', 0],
  ['timeStamp', 1],
  ['receivingPower', 2],
  ['transmissionPower', 3],
  ['codeStatus', 4],
  ['version', 5],
]
/**
 * @description: Guardar datos de Heartbeat en MongoDB
 * @param {Array} params Datos de latido del sensor
 */
function saveHeartbeatData(params) {
  const dataObj = {
    sn: params[0],
    receivingPower: Number(params[2]),
    transmissionPower: Number(params[3]),
    codeStatus: Number(params[4]),
    version: params[5],
  };

  new Heartbeat(dataObj).save()
    .then(() => console.log('✅ Heartbeat guardado en MongoDB:', dataObj))
    .catch(err => console.error('❌ Error guardando Heartbeat:', err));
}


// 计数数据 字段对应下标
// Counting data field corresponding index
const countDataToObjectFields = [
  ['sn', 0],
  ['timeStamp', 1],
  ['inCount', 2],
  ['outCount', 3],
  ['receivingPower', 4],
  ['transmissionPower', 5],
  ['codeStatus', 6],
  ['version', 7],
]
/**
 * @description: Guardar datos de conteo de pasajeros en MongoDB
 * @param {Array} params Datos de conteo de pasajeros
 */
function saveCountData(params) {
  const dataObj = {
    sn: params[0],
    inCount: Number(params[2]),
    outCount: Number(params[3]),
    receivingPower: Number(params[4]),
    transmissionPower: Number(params[5]),
    codeStatus: Number(params[6]),
    version: params[7],
  };

  new CountData(dataObj).save()
    .then(() => console.log('✅ Conteo guardado en MongoDB:', dataObj))
    .catch(err => console.error('❌ Error guardando conteo:', err));
}

/**
 * @description: 获取营业时间---Obtain business hours
 * @return {[string,string]} [开始时间,结束时间]([start time, end time])
 */
function getBusinessHours() {
  // 开始时间
  // start time
  const startTime = '0000'
  // 结束时间
  // End time
  const endTime = '2359'

  // Your code

  return [startTime, endTime]
}

/**
 * 获取记录周期与上传周期---Obtain record cycle and upload cycle
 * @param {Boolean} hasRecord [hasRecord = false] 是否包含记录周期---Does it include a recording cycle
 * @return {[number,number]} [上传周期,记录周期]([Upload cycle, record cycle])
 */
function getCycle(hasRecord = false) {
  // 记录周期 单位(min)
  // Record cycle Unit (min)
  let recordCycle = hasRecord ? 1 : 0
  // 上传周期 单位(min)
  // Upload cycle Unit (min)
  let uploadCycle = 0

  // Your code

  return [uploadCycle, recordCycle]
}

/**
 * @description: 获取统计方向---Obtain statistical direction
 * @return {number} direct 0-双向、1-只进、2-只出(0:bi-directional, 1:only in, 2:only out)
 */
function getDirection() {
  // Your code

  return 0
}

module.exports = {
  saveHeartbeatData,
  saveCountData,
  getBusinessHours,
  getCycle,
  getDirection,
}
