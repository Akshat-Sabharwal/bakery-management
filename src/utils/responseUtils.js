class Response {
  constructor(response) {
    this.res = response;
  }

  status(statusCode) {
    this.res.status(statusCode);

    return this;
  }

  send(status, message, data = {}) {
    this.res.send({
      status: status,
      message: message,
      results: data.length,
      data: data,
    });
  }
}

module.exports = Response;
