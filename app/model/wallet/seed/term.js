const fs = require('fs');
const logger = require('app/lib/logger');
const path = require("path");
const moment = require('moment');
const Term = require('app/model/wallet').terms;

module.exports = async () => {
    const count = await Term.count();
    const termPath = path.join(__dirname, "../../../../public/term/");
    if (count == 0) {
        const lastReleaseDate = "2020-08-19T00:00:00.000Z";
        const data = {
            is_published: true,
            content: fs.readFileSync(path.join(termPath, './html.ejs'), 'utf-8'),
            ja_content: fs.readFileSync(path.join(termPath, './html.ejs'), 'utf-8'),
            applied_date: moment(lastReleaseDate).toDate(),
            term_no: 'TERM200819',
            created_by: 0,
            updated_by: 0
        };
        await Term.create(data, { returning: true });
        logger.info('Seeding term completed');
    }
};
