const AccountContributionAPI = require("../../lib/staking-api/account-contribution")
const Wallet = require('../../model/wallet').wallets
const Member = require('../../model/wallet').members
const WalletPrivateKey = require('../../model/wallet').wallet_priv_keys
const { affiliateApi } = require('app/lib/affiliate-api');

module.exports = {
    start: async ()=>{
        let coins = ["ATOM", "IRIS", "ONT"]
        coins.forEach(element => {
            // call account distribution
            let offset = 0
            let limit = 20
            while(true){
                let qr = await AccountContributionAPI.get(element, limit, offset++)
                let contributions = qr.items
                if(qr.items.length <= 0)
                    break;
                let ids = []
                let affiliatePayload = {
                    currency_symbol: element,
                    from_date: contributions[0].created_at,
                    to_date: contributions[contributions.length - 1].created_at,
                    details: []
                }
                let addresses = contributions.map(x => x.address)
                // find wallet_id 
                let walletIds = await WalletPrivateKey.findAll({
                    where: {
                        attributes: ['id'],
                        address: {
                            [Op.in]: addresses
                        },
                        deleted_flg: false
                    }
                })
                // find user of address
                let wallets = await Wallet.findAll({
                    include: [
                        {
                            attributes: ['email'],
                            model: Member,
                            where: {
                                deleted_flg: false
                            },
                            required: true
                        },
                    ],
                    where:{
                        id:{
                            [Op.in]: walletIds
                        }
                    }
                })
                contributions.forEach(async (contribution) =>{
                    let address = contribution.address                
                    let amount = contribution.amount
                    let email = wallets.find(x => x.privKeys.address == address).Member.email
                    affiliatePayload.details.push({
                        ext_client_id: email,
                        amount: amount
                    })
                    ids.push(contribution.id)
                })
                // update affiliate
                const result = await affiliateApi.getAllPolicies(affiliatePayload);
                if (result.httpCode !== 200) {
                    // update account contribution
                    await AccountContributionAPI.set(element, {ids: ids})
                }     
                if(qr.limit * (qr.offset + 1) >= qr.totals)
                    break;
            }      
        });
    }
}