import { searchObjList } from "utils";

const objList = [
  {
    title: "zztest",
    description: "description www numero uno",
  },
  {
    title: "WWW",
    description: "NUmero dos",
  },
];

test("test case-sensitive + all", () => {
  const options = {};
  const searchStr = "numero";
  const expectedLength = 1;
  expect(searchObjList(objList, searchStr, options)).toHaveLength(
    expectedLength
  );
});

test("test case-insensitive + all", () => {
  const options = {
    caseInsensitive: true,
  };
  const searchStr = "numero";
  const expectedLength = 2;
  expect(searchObjList(objList, searchStr, options)).toHaveLength(
    expectedLength
  );
});

test("test case-insensitive + include", () => {
  const options = {
    caseInsensitive: true,
    include: ["title"],
  };
  const searchStr = "www";
  const expectedLength = 1;
  expect(searchObjList(objList, searchStr, options)).toHaveLength(
    expectedLength
  );
});

test("test case-insensitive + exclude", () => {
  const options = {
    caseInsensitive: true,
    exclude: ["description"],
  };
  const searchStr = "www";
  const expectedLength = 1;
  expect(searchObjList(objList, searchStr, options)).toHaveLength(
    expectedLength
  );
});
