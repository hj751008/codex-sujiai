export const referenceRoots = [
  { label: "중1", path: "C:\\MathFile\\중1" },
  { label: "중2", path: "C:\\MathFile\\중2" },
  { label: "중3", path: "C:\\MathFile\\중3" },
];

export const ingestPolicy = {
  referenceOnly: true,
  copyProblemsIntoApp: false,
  copyExplanationsIntoApp: false,
  allowConceptExtraction: true,
};

console.log(JSON.stringify({ referenceRoots, ingestPolicy }, null, 2));
