# TDD Process

All development MUST follow Test-Driven Development:

1. **Red**: Write a failing test first that describes the expected behavior
2. **Green**: Write the minimum code necessary to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

## Before writing any implementation code:
- Create test file if it doesn't exist
- Write test cases that define expected behavior
- Run tests to confirm they fail
- Only then write implementation

## Test file naming:
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- Place tests alongside source files or in `__tests__/` directory

## Never skip tests for:
- Utility functions
- React components
- Hooks
- API/data fetching logic
- Business logic (time zone calculations, date line crossing)
