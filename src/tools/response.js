
 const createResponse = (apiResponse) => {
  const defaultResponse = {
    code: 100,
    httpStatusCode: 200,
    message: '',
    status: true,
  };

  return { ...defaultResponse, ...apiResponse };
};

 const createErrorResponse = (apiResponse) => {
  const defaultResponse = {
    code: 102,
    httpStatusCode: 500,
    message: '',
    status: false,
  };

  return { ...defaultResponse, ...apiResponse };
};

 const controllerResponse = (apiResponse,res) => {
  const exceptHttpStatusCodeResponse = { ...apiResponse };
  delete exceptHttpStatusCodeResponse.httpStatusCode;
  return res
    .status(apiResponse.httpStatusCode)
    .json(exceptHttpStatusCodeResponse);
};
module.exports = {
    createResponse,
    createErrorResponse,
    controllerResponse

}