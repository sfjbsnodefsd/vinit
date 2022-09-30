# Repo for Vinit Sharma
## This repository contains all the sections covered during AWS-FSD September training.

### code used in postman to set Global JWT token variable
` pm.test("Set global JWT token variable", function () {
    var jsonData = pm.response.json();
    pm.globals.set('jwt', jsonData.token);
    pm.expect(jsonData.token).to.eql(pm.globals.get('jwt'));
});`
