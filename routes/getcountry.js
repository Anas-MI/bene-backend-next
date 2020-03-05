const express           = require('express');
const router            = express.Router();
var request               = require('request');
var SalesTax = require("sales-tax");

SalesTax.setTaxOriginCountry("US");

router.get('/gettax/:id', function(req, res){
  let code = req.params.id;
  SalesTax.getSalesTax(String(code))
  .then((tax) => {
  res.json(tax);
  });
});



router.get('/', function(req, res){
    
    // code to fetch the details of user by his ip address
var ip = req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
// '122.168.144.110';
console.log({ip: req.ip});

const api_access_key = '6bde83b6cecd2cc3ac218ff6bb2afe4d';
const baseurl = 'http://api.ipstack.com/'; 
function create_url(baseurl, key, ip){
    var url = baseurl + ip + '?access_key=' + key + '&output=json';
    return url;
}
console.log(create_url(baseurl, api_access_key, ip));
const req_ip = create_url(baseurl, api_access_key, ip)
request(req_ip,
  (err, response, body) => {
    const result = JSON.parse(body);
    console.log(result);
    res.json({success: true, info: result});
  }
);
    
});


module.exports = router;