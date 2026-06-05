export const MockMongooseModel = () => {
  const mock = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    save: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    insertMany: jest.fn(),
  };

  const MockModelClass = function (data: any) {
    Object.assign(this, data);
    this._id = 'mocked-id';
    this.save = jest.fn().mockResolvedValue(this);
  };
  Object.assign(MockModelClass, mock);

  return MockModelClass;
};
