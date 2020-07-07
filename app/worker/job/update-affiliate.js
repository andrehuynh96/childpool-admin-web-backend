const AccountContributionAPI = require("../../lib/staking-api/account-contribution")
module.exports = {
    start: async ()=>{
        let coins = ["ATOM", "IRIS", "ONT"]
        coins.forEach(element => {
            // call account distribution
            let contributions = await AccountContributionAPI.get(element, 20, 0)
            let ids = []
            contributions.forEach(async (contribution) =>{
                let address = contribution.address                
                let amount = contribution.amount
                // find user of address

                // update affiliate

                ids.push(contribution.id)
            })
            // update account contribution
            await AccountContributionAPI.set(element, {ids: ids})
        });
    }
}