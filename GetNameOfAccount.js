const getnameofaccount =(bin,accountNumber)=>{
    var axios = require('axios');
    var data = JSON.stringify({
      "bin": bin,
      "accountNumber": accountNumber
    });
    
    var config = {
      method: 'post',
      url: 'https://api.vietqr.io/v2/lookup',
      headers: { 
        'x-client-id': '26973b61-8bf0-423d-909b-b84dd823b96b',
        'x-api-key': 'b8225057-ff8f-4ef2-82db-7bb1661be308',
        'Content-Type': 'application/json',
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
export default getnameofaccount;