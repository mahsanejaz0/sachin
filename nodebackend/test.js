const { Qry, checkAuthorization, randomToken, findAvailableSpace, checkPasswordMatch } = require('./helpers/functions');

(async () => {
    let a = await checkPasswordMatch('1', '1122');
    console.log(a);
  })();