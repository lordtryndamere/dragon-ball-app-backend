
const aws  = require('aws-sdk');
const Twilio = require('twilio')
const {awsConfig} = require('../config/aws')



 class AwsLib {
   config;

  constructor() {
    this.config = awsConfig;

    aws.config.update({
      region: this.config.region,
    });
  }



  getS3Instance = () =>{
  return  new  aws.S3({
    apiVersion:this.config.version
  })
  };

  uploadFile = async (file,folder)=>{
    try {
     const getS3Instance = this.getS3Instance();
      const params = {
        Bucket: `${process.env.AWS_BUCKET}/${folder}`, // pass your bucket name
        Key: `${Math.random().toString(36).slice(2)}-${file.name}`, 
        Body: file.data
    };

    const uploadFile = await getS3Instance.upload(params).promise();
    return{
      code:100,
      data:{
        nameImage:params.Key,
        location:uploadFile.Location
      }
    }

    } catch (error) {
      return {
        code:102,
        data:error
      }
    }
  }


  getSnsInstance = () => {
    return new aws.SNS({
      apiVersion: this.config.version,
    });
  };

  //#region SMS methods

  checkIfNumberExists = async (phoneNumber) => {
    try {
      const snsInstance = this.getSnsInstance();
      const phoneCheck = await snsInstance
        .checkIfPhoneNumberIsOptedOut({
          phoneNumber,
        })
        .promise();

      return {
        code: 100,
        data: phoneCheck,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in awslib', e);
      return {
        code: 102,
        data: e,
      };
    }
  };
   sendSmsTwilio = async (message,phoneNumber) =>{

  

    var client = new Twilio(`${process.env.ACCOUNT_SID}`, `${process.env.AUTH_TOKEN_TWILIO}`);
  
    await client.messages
      .create({
        body: message,
        to: ` ${phoneNumber}`, // Text this number
        from: `${process.env.TWILIO_PHONE}`, // From a valid Twilio number
      })
      .then((message) => console.log(message));
    
  }

  sendSMS = async (
    phoneNumber = this.config.phoneNumber,
    message = 'Mensaje de prueba'
  ) => {
    try {
      const params = {
        Message: message,
        PhoneNumber: phoneNumber,
      };

      console.log(params);
      const snsInstance = this.getSnsInstance();

      const messageResponse = await snsInstance.publish(params).promise();
      console.log(messageResponse);
      return {
        code: 100,
        data: messageResponse,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in awslib', e);
      return {
        code: 102,
        data: e,
      };
    }
  };

  //#endregion
}
module.exports = {AwsLib}