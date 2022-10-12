module.exports = {
  validatePensionerDetailObject: (PensionerDetail) => {
    const requiredKeys = [
      "classification",
      "salary_earned",
      "allowances",
      "bank_detail",
    ];
    let isValid = true;

    try {
      for (let key of requiredKeys) {
        const { key } = PensionerDetail;
      }
    } catch (err) {
        isValid = false;
    }

    return isValid;
  },
};
