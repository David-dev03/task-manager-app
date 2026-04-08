const { expect } = require('chai');
const { getTasks } = require('../../src/api/handler'); // Adjust path if your structure differs

describe('GET /tasks Handler (Security & Functionality)', () => {
  
  // Helper function to mock the Express 'res' object and capture outputs
  const mockResponse = () => {
    const res = {};
    res.status = function(code) {
      this.statusCode = code;
      return this; // Allows chaining like res.status(200).json(...)
    };
    res.json = function(data) {
      this.body = data;
      return this;
    };
    return res;
  };

  it('should return a list of tasks for valid requests (Happy Path)', async () => {
    // Arrange: Setup a basic request with no specific query filters
    const req = { query: {} };
    const res = mockResponse();

    // Act: Call the handler
    await getTasks(req, res);

    // Assert: Verify the HTTP status, response format, and data integrity
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.error).to.be.null;
    expect(res.body.data).to.be.an('array');
    expect(res.body.data.length).to.be.greaterThan(0);
  });

  it('should return a 400 error when an invalid status parameter is injected (Error Case)', async () => {
    // Arrange: Provide an illegal input to trigger the validation logic
    const req = { query: { status: 'SELECT * FROM users' } }; // Simulating a bad input attempt
    const res = mockResponse();

    // Act: Call the handler
    await getTasks(req, res);

    // Assert: Verify the security mechanism caught the bad input and handled it safely
    expect(res.statusCode).to.equal(400);
    expect(res.body.success).to.be.false;
    expect(res.body.data).to.be.null;
    expect(res.body.error).to.equal("Invalid status parameter. Must be strictly 'pending' or 'completed'.");
  });
});