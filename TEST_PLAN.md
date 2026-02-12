# Test Plan

## Overview
This test plan covers the verification of the Workout Timer functionality and the data integrity of the workout plan. The goal is to ensure that the timer correctly interprets workout steps, handles interval logic, and defaults gracefully when data is missing.

## Scope
*   **WorkoutTimer Component**: Unit tests for rendering, timer logic, segment navigation, and interval expansion.
*   **Workout Plan Data**: Validation tests to ensure all workout days have valid structures and explicit durations where expected.

## Test Strategy

### 1. WorkoutTimer Component Tests (`components/WorkoutTimer.test.tsx`)
We will use `vitest` and `@testing-library/react` to test the component in isolation.

*   **Default Behavior**: Verify that a step without a duration defaults to 5 minutes (300 seconds).
*   **Explicit Duration Parsing**: Verify that strings like "10 min", "45 mins", "90 sec" are parsed correctly.
*   **Interval Expansion**:
    *   Verify that a step with an `intervals` object expands into multiple segments (Sets x 2: Work + Rest).
    *   Verify the segment titles indicate the current rep/set (e.g., "Rep 1/4", "Rest 1/4").
    *   Verify the durations for work and rest segments are correct.
*   **Navigation**:
    *   Verify "Skip Next" moves to the next segment.
    *   Verify "Skip Previous" moves to the previous segment.
    *   Verify boundary conditions (cannot skip prev on start, cannot skip next on end).
*   **Completion**: Verify `onComplete` is called at the end of the last segment.

### 2. Data Integrity Tests (`data/plan.test.ts`)
We will write a test file that iterates over the `planData` exported from `data/plan.ts`.

*   **Structure Validation**: Ensure every day has a valid `id`, `type`, and `title`.
*   **Step Validation**:
    *   Ensure days that are not Rest days have at least one step (or verify the logic for those that don't).
    *   **Crucial**: Ensure every defined step has a `duration` field or a valid fallback description that the parser can handle (though explicit `duration` is preferred).
*   **Interval Validation**:
    *   For steps with `intervals`, ensure `sets`, `workDuration`, and `recoveryDuration` are positive integers.

## Execution
Run the tests using `npm test` or `npx vitest`.
