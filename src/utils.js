"use strict";

const {pool: db} = require("./db");

const getRandomTest = (tests) => {
  const max = tests.length;
  const id = Math.floor(Math.random() * max);
  console.log(tests, max, id);
  return tests[id];
};

const getSubjects = async () => {
  try {
    const result = [];
    const req = await db.query("SELECT * FROM subjects");
    for (const item of req.rows) {
      result.push(item.subject);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
};

const getTestTypesById = async (subjectId) => {
  try {
    const testTypes = (
      await db.query("SELECT test_type FROM test_types WHERE subject_id = $1", [
        subjectId,
      ])
    ).rows;
    return testTypes;
  } catch (e) {
    console.error(e);
  }
};

const getTestTypes = async () => {
  try {
    const result = [];
    const testTypes = (await db.query("SELECT test_type FROM test_types")).rows;
    for (const item of testTypes) {
      result.push(item.subject);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getRandomTest, getSubjects, getTestTypesById, getTestTypes };
