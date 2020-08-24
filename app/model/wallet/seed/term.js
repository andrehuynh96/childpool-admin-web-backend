const fs = require('fs');
const logger = require('app/lib/logger');
const path = require("path");
const Term = require('app/model/wallet').terms;
const Hashids = require('hashids/cjs');

module.exports = async () => {
    const count = await Term.count();
    const termPath = path.join(__dirname, "../../../../public/term/");
    if (count == 0) {
        const salt = `${Date.now().toString()}`;
        const hashids = new Hashids(salt, 8);
        const term_no = hashids.encode(1, 2, 3, 4).toUpperCase();
        const data = {
            is_published: true,
            content: fs.readFileSync(path.join(termPath, './html.ejs'), 'utf-8'),
            term_no: term_no,
            created_by: 0,
            updated_by: 0
        };
        await Term.create(data, { returning: true });
        logger.info('Seeding term completed');
    }
};