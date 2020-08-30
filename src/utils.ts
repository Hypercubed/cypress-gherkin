export function Incrementing() {
  let next = 0;
  return () => (next++).toString();
}

export const isJquery = (obj: any) =>
  !!(obj && obj.jquery && Cypress._.isFunction(obj.constructor));

export const getElements = ($el: any) => {
  if (!$el && !$el.length) {
    return;
  }

  $el = $el.toArray();

  if ($el.length === 1) {
    return $el[0];
  } else {
    return $el;
  }
};

export const includesSome = (a: string[], b: string[]) => {
  return a.some((_) => b.includes(_));
};
