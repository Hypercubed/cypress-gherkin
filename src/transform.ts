import { Parser, AstBuilder } from '@cucumber/gherkin';

import {
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ParameterType,
} from '@cucumber/cucumber-expressions';

import { Incrementing } from './utils';
import { Walker } from './ast-walker';

const parameterTypeRegistry = new ParameterTypeRegistry();
const cucumberExpressionGenerator = new CucumberExpressionGenerator(
  parameterTypeRegistry
);

const nextId = Incrementing();

const parser = new Parser(new AstBuilder(nextId));

interface Definition {
  type: string;
  source: string;
  parameterNames: readonly string[];
  parameterTypes: readonly ParameterType<any>[];
}

const definitions = new Set();
const imports = new Set();

const printParameterName = (parameterType: ParameterType<any>, i: number) => {
  const name = String.fromCharCode(97 + i);
  // @ts-ignore
  const type = parameterType.type.name.toLowerCase();
  return `${name}: ${type}`;
};

const printDefintion = (def: Definition) => {
  return `${def.type}('${def.source}', (${def.parameterTypes
    .map(printParameterName)
    .join(', ')}) => {\n\n});\n`;
};

const addDefinition = (type: string, text: string) => {
  const examples = cucumberExpressionGenerator.generateExpressions(text);
  imports.add(type);

  const def = printDefintion({
    type,
    source: examples[0].source,
    parameterNames: examples[0].parameterNames,
    parameterTypes: examples[0].parameterTypes,
  });

  definitions.add(def);
};

const printDefintions = () => {
  return Array.from(definitions).join('\n');
};

const printImports = () => {
  return `import { ${Array.from(imports).join(
    ', '
  )} } from '@hypercubed/cypress-gherkin';\n`;
};

function indent(s: string) {
  return '  ' + s.trim().split('\n').join('\n  ') + '\n';
}

const printFunction = (
  name: string | null | undefined,
  type: string,
  body: string
) => {
  let s = name ? `${type}('${name}', () => {\n` : `${type}(() => {\n`;
  s += indent(body);
  s += `});\n`;
  return s;
};

const printExample = (
  name: string | null | undefined,
  type: string,
  body: string
) => {
  let s = name ? `${type}('${name}', [\n` : `${type}([\n`;
  s += indent(body);
  s += `]);\n`;
  return s;
};

const walker = new Walker({
  visitFeature(feature, _index, _parent, next) {
    imports.add('feature');
    return printFunction(feature.name, 'feature', next().join('\n'));
  },
  visitBackground(background, _index, _parent, next) {
    imports.add('background');
    return printFunction(background.name, 'background', next().join('\n'));
  },
  visitScenario(scenario, _index, _parent, next) {
    imports.add('scenario');
    console.log(next());
    return printFunction(scenario.name, 'scenario', next().join('\n'));
  },
  visitRule(rule, _index, _parent, next) {
    imports.add('rule');
    return printFunction(rule.name, 'rule', next().join('\n'));
  },
  visitScenarioOutline(scenario, _index, _parent, next) {
    imports.add('scenarioOutline');
    imports.add('outline');
    const steps = (scenario.steps || []).map((step) => {
      const type = (step.keyword || 'Given').trim().toLowerCase();
      imports.add(type);
      return `${type}('${step.text}');`;
    });
    const outline = printFunction(null, 'outline', steps.join('\n'));
    return printFunction(
      scenario.name,
      'scenarioOutline',
      [outline, ...next()].join('\n')
    );
  },
  visitExamples(examples, _index, _parent, next) {
    imports.add('examples');
    const header = examples.tableHeader?.cells?.map(
      (cell: any) => `'${cell.value}'`
    );
    return printExample(
      examples.name,
      'examples',
      `[${header?.join(', ')}],\n` + next().join(',\n')
    );
  },
  visitExample(tableRow, _index, _parent, next) {
    const row = tableRow.cells?.map((cell: any) => cell.value);
    next();
    return `[${(row || []).join(', ')}]`;
  },
  visitStep(step, index, parent) {
    let type = (step.keyword || 'Given').trim();
    const steps = parent.steps || null;

    let i = index; // find previous step that's not an "and" or "but"
    while (steps && i > 0 && (type === 'And' || type === 'But')) {
      type = (steps[--i].keyword || 'Given').trim();
    }

    addDefinition(type, step.text || '');

    type = type.toLowerCase();	
    imports.add(type);
    return `${type}('${step.text}');`;
  },
});

export function transform(data: string) {
  data = data
    .split('\n')
    .map((s) => {
      return s.replace(/^\/\//, '').replace(/'/g, '"');
    })
    .join('\n');

  const ast = parser.parse(data);
  if (!ast.feature) {
    return '';
  }

  definitions.clear();
  imports.clear();

  const feature = walker.walk(ast);

  let out = printImports();
  out += '\n';
  out += printDefintions();
  out += '\n';
  out += feature;

  definitions.clear();
  imports.clear();

  return out;
}
