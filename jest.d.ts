import type { Jest } from '@jest/environment';
import type { JestExpect } from '@jest/expect';
import type { Global } from '@jest/types';

declare global {
  const describe: Global.GlobalAdditions['describe'];
  const it: Global.GlobalAdditions['it'];
  const test: Global.GlobalAdditions['test'];
  const fit: Global.GlobalAdditions['fit'];
  const xit: Global.GlobalAdditions['xit'];
  const xtest: Global.GlobalAdditions['xtest'];
  const xdescribe: Global.GlobalAdditions['xdescribe'];
  const fdescribe: Global.GlobalAdditions['fdescribe'];
  const beforeAll: Global.GlobalAdditions['beforeAll'];
  const beforeEach: Global.GlobalAdditions['beforeEach'];
  const afterEach: Global.GlobalAdditions['afterEach'];
  const afterAll: Global.GlobalAdditions['afterAll'];
  const expect: JestExpect;
  namespace jest {
    type Mock<T extends (...args: any[]) => any = (...args: any[]) => any> = any;
  }
}

export {};
