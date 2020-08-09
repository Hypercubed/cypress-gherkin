import { Step, ParameterType } from './definitions';
import { setupCommon } from './common';
import { execute, gherkin } from './runner';

export const Given = Step.bind(null, 'Given');
export const When = Step.bind(null, 'When');
export const Then = Step.bind(null, 'Then');
export const And = Step.bind(null, 'And');
export const But = Step.bind(null, 'But');

export const feature = describe;
export const scenario = it;
export const background = beforeEach;

export const given = execute.bind(null, 'Given');
export const when = execute.bind(null, 'When');
export const then = execute.bind(null, 'Then');
export const and = execute.bind(null, 'And');
export const but = execute.bind(null, 'But');

export const outline = (method: any, examples: any[]) => {
  const heading = examples.splice(0, 1)[0];
  const props: any = {};

  examples.forEach((row) => {
    heading.forEach((key: string, i: number) => {
      props[key] = row[i];
    });
    method(props);
  });
};

export { ParameterType, setupCommon, gherkin };
