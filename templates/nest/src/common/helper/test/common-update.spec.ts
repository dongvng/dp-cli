import { commonUpdate } from '../common-update';

describe('CommonUpdate', () => {
  it('should update the correct field', async () => {
    let oldObj = {
      name: 'test',
      email: 'test@gmail.com',
    };
    const newObj = {
      name: 'new test',
      email: 'new_test@gmail.com',
    };
    oldObj = commonUpdate(oldObj, newObj);
    expect(oldObj).toHaveProperty('name');
    expect(oldObj.name).toEqual(newObj.name);
    expect(oldObj.email).toEqual(newObj.email);
  });

  it('should not add redundant fields', async () => {
    let oldObj = {
      name: 'test',
      email: 'test@gmail.com',
    };
    const newObj = {
      hello: 'world',
    };
    oldObj = commonUpdate(oldObj, newObj);
    expect(oldObj).toHaveProperty('name');
    expect(oldObj.name).toEqual(oldObj.name);
    expect(oldObj.email).toEqual(oldObj.email);
    expect(oldObj).not.toHaveProperty('hello');
  });
});
