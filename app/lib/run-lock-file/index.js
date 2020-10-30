const LockFile = require("lockfile");
const logger = require("app/lib/logger");
const logHangout = require("app/lib/logger/hangout");

module.exports = async (service, lockFile, name, logAlert = false) => {
  var id = Math.floor(new Date().getTime() / 1000)
  logger.info(`START: ${name} ${id}`);
  if (logAlert) {
    logHangout.write(`START: ${name} ${id}`);
  }
  try {
    var isLocked = LockFile.checkSync(lockFile);
    if (isLocked) {
      logger.info(`${name} is running`);
      if (logAlert) {
        logHangout.write("<font color=\"#ff0000\">" + name + " is running or lock file not remove</font>");
      }
    } else {
      LockFile.lockSync(lockFile);
      await service.execute();
      LockFile.unlockSync(lockFile);
    }
  } catch (err) {
    logger.error(`Can not start ${name}. ${err}`);
  }
  logger.info(`FINISH: ${name} ${id}`);
  if (logAlert) {
    logHangout.write(`FINISH: ${name} ${id}`);
  }
}