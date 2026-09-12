import { test } from "node:test";
import assert from "node:assert/strict";
import { template, topics, validInput, validWeeks } from "../lib/planner.ts";
test("every supported preference produces a usable template", () => {
  for (const topic of topics)
    for (const level of ["Beginner", "Intermediate"] as const)
      for (const hours of [2, 5, 10]) {
        const input = { topic, level, hours };
        assert.ok(validWeeks(template(input).weeks, input));
      }
});
test("invalid preferences are rejected", () => {
  for (const value of [
    null,
    {},
    { topic: "Python", level: "Beginner", hours: 5 },
    { topic: "React", level: "Beginner", hours: 0 },
    { topic: "React", level: "Beginner", hours: 3.5 },
  ])
    assert.equal(validInput(value), false);
});
test("invented resources, missing weeks and excessive hours are rejected", () => {
  const input = {
    topic: "React" as const,
    level: "Beginner" as const,
    hours: 5,
  };
  const plan = template(input);
  assert.equal(validWeeks(plan.weeks.slice(1), input), false);
  plan.weeks[0].resourceIds = ["fake"];
  assert.equal(validWeeks(plan.weeks, input), false);
  const other = template(input);
  other.weeks[0].estimatedHours = 10;
  assert.equal(validWeeks(other.weeks, input), false);
});
