// Helper functions for unit tests.  Put utilities here that will be available globally
// in specs.
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export const getGenericNestMock = (token) => {
  const moduleMocker = new ModuleMocker(global);

  // if (token == WINSTON_MODULE_PROVIDER) {
  //   return {
  //     info: jest.fn(),
  //     notice: jest.fn(),
  //     warn: jest.fn(),
  //     warning: jest.fn(),
  //     error: jest.fn(),
  //     alert: jest.fn(),
  //     emerg: jest.fn(),
  //     debug: jest.fn(),
  //   };
  // }
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  return new Mock();
};

// So technically this is all that's required to make this function globally available in tests without
// having to import it specifically, however typescript in IDEs will complain it's not defined.
// For now, we do both - export the function AND define it in globals.  If there's a
// better way to deal with this, please do modify.
global.getGenericNestMock = getGenericNestMock;
