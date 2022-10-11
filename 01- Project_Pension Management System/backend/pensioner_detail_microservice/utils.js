module.exports = {
    validatePensionerDetailObject : (PensionerDetail) => {
        const requiredKeys = ["classification", "salary_earned", "allowances", "bank_detail"];
        let isValid = true;

        const recievedKeys = PensionerDetail.keys();

        for (let key of requiredKeys) {
            if(!recievedKeys.includes(key)) {
                isValid = false;
                break;
            }
        }

        return isValid;
    },
};