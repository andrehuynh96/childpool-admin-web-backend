require('dotenv').config();
require('rootpath')();
const database = require('app/lib/database')
const cron = require("node-cron");

let start = async () =>{
    cron.schedule("*/5 * * * *", async function() {
        const worker = require('./job/update-affiliate')
        await worker.start()
    });
}

database.init(async err => {
    if (err) {
        logger.error(`database start fail:`, err);
        return;
    }

    setTimeout(async ()=>{
        await start()
    }, 10000)  
})   