const LockFile = require("lockfile");
const logger = require("app/lib/logger");

module.exports = async (service, lockFile, name) => {
  var id = Math.floor(new Date().getTime() / 1000)
  logger.info(`START: ${name} ${id}`);
  try {
    var isLocked = LockFile.checkSync(lockFile);
    if (isLocked) {
      logger.info(`${name} is running`);
    } else {
      LockFile.lockSync(lockFile);
      await service.execute();
      LockFile.unlockSync(lockFile);
    }
  } catch (err) {
    logger.error(`Can not start ${name}. ${err}`);
  }
  logger.info(`FINISH: ${name} ${id}`);

}