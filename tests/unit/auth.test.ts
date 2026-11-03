import * as authService from '../../src/services/authService';

describe('authService.verifyToken', () => {
  it('returns null for invalid token', () => {
    expect(authService.verifyToken('not-a-token')).toBeNull();
  });
});
