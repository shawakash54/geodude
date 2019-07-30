'use strict';
var ip2loc = require("ip2location-nodejs");

ip2loc.IP2Location_init("./dataset/dataset.BIN");

module.exports.getGEOData = async event => {
  try {
    var params = event.queryStringParameters
    console.log(`Params: `, [params])
    var IPs = JSON.parse(params['ip'])
    console.log(`IPS: `, [IPs, typeof IPs, Array.isArray(IPs)])
    if( typeof IPs != 'object' || !Array.isArray(IPs) ) {
      console.error('Validation Failed');
      throw 'invalid params'
    }
    var res = []
    for (var x = 0; x < IPs.length; x++) {
      var result = ip2loc.IP2Location_get_all(IPs[x]);
      res.push(result)
      console.log(`Result for IP ${IPs[x]}:`, result)
      console.log(`------------------------------------`)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          data: res
        }
      ),
    };
  } catch(e) {
    console.log(`error: `, e)
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: `Please pass an array of IPs in query param ip, example: \n/geo?ip=["2409:4071:221f:6223:e16d:3518:45e7:8d43","106.51.245.254"]`,
    };
  }
};
