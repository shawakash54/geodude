# Geodude

## Get the geographical description of the IPs passed

### Deployment steps:
- npm install
- npm run build
- serverless config credentials --provider aws --key <IAM_USER_KEY> --secret <IAM_USER_SECRET>
- serverless deploy


### Running it locally
- npm install
- npm run build
- npm run start

#### Request params
##### geo?ip=["2409:4071:221f:6223:e16d:3518:45e7:8d43","106.51.245.254"]