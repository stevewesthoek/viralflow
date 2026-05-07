"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
jest.spyOn(console, 'log').mockImplementation(() => { });
jest.spyOn(console, 'error').mockImplementation(() => { });
afterAll(() => {
    jest.restoreAllMocks();
});
//# sourceMappingURL=setup.js.map