#! /bin/bash -x

set -ex

VERSION="develop-"`date '+%Y%m%d-%H%M'`

# Create new Elastic Beanstalk version
BUCKET=gushry-spa

aws --version
aws configure set aws_access_key_id $AWSKEY
aws configure set aws_secret_access_key $AWSSECRETKEY
#aws configure set default.region ap-northeast-1
#aws configure set default.output json

aws s3 sync content s3://$BUCKET/ 
aws s3 ls s3://$BUCKET

