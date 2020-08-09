import { Step, ParameterType } from './definitions';
import { setupCommon } from './common';
import { execute, gherkin } from './runner';

export const Given = Step.bind(null, 'Given');
export const When = Step.bind(null, 'When');
export const Then = Step.bind(null, 'Then');
export const And = Step.bind(null, 'And');
export const But = Step.bind(null, 'But');

export const feature = describe;
export const rule = describe;
export const scenario = it;
export const example = it;
export const background = beforeEach;

export const given = execute.bind(null, 'Given');
export const when = execute.bind(null, 'When');
export const then = execute.bind(null, 'Then');
export const and = execute.bind(null, 'And');
export const but = execute.bind(null, 'But');

export const outline = (name: string, method: any, _example: any[]) => {
  const heading = _example.splice(0, 1)[0];
  const props: any = {};

  it(name || '', () => {
    _example.forEach((row: any) => {
      heading.forEach((key: string, i: number) => {
        props[key] = row[i];
      });
      method(props);
    });
  });
};

export const scenarioOutline = (name: string, method: any, ...examples: any[]) => {
  describe(name || '', () => {
    examples.forEach((_example, i) => {
      let _name = '' + i;
      if (typeof _example[0] === 'string') {
        _name = _example[0];
        _example = _example.slice(1);
      }
      outline(_name, method, _example);
    });
  });
};

export { ParameterType, setupCommon, gherkin };
