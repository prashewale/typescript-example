export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

type Identity = {
  id: number;
};

export function createUniqueId(arr: Identity[]) {
  let maxId = 1;
  arr
    .sort((a, b) => a.id - b.id)
    .forEach((user) => {
      if (maxId == user.id) {
        maxId++;
      }
    });

  return maxId;
}
