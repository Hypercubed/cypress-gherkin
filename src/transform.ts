import { Parser, AstBuilder } from '@cucumber/gherkin';

import {
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ParameterType
} from '@cucumber/cucumber-expressions';

import { Incrementing } from './utils';
import { Walker } from './ast-walker';

const parameterTypeRegistry = new ParameterTypeRegistry();
const cucumberExpressionGenerator = new CucumberExpressionGenerator(parameterTypeRegistry);

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
  const name = String.fromCharCode(97+i);
  // @ts-ignore
  const type = parameterType.type.name.toLowerCase();
  return `${name}: ${type}`;
}

const printDefintion = (def: Definition) => {
  return `${def.type}('${def.source}', (${def.parameterTypes.map(printParameterName).join(', ')}) => {\n\n});\n`;
}

const addDefinition = (type: string, text: string) => {
  const examples = cucumberExpressionGenerator.generateExpressions(text);
  imports.add(type);

  const def = printDefintion({
    type,
    source: examples[0].source,
    parameterNames: examples[0].parameterNames,
    parameterTypes: examples[0].parameterTypes
  });

  definitions.add(def);
};

const printDefintions = () => {
  return Array.from(definitions).join('\n');
}

const printImports = () => {
  return `import { ${Array.from(imports).join(', ')} } from '@hypercubed/cypress-gherkin';\n`
}

function indent(s: string) {
  return '  ' + s.trim().split('\n').join('\n  ') + '\n';
}

const printFunction = (name: string | null | undefined, type: string, body: string) => {
  let s = name ? `${type}('${name}', () => {\n` : `${type}(() => {\n`;
  s += indent(body);
  s += `});\n`;
  return s;
}

const walker = new Walker({
  visitFeature(feature, next) {
    imports.add('feature');
    return printFunction(feature.name, 'feature', next().join('\n'));
  },
  visitBackground(background, next) {
    imports.add('background');
    return printFunction(background.name, 'background', next().join('\n'));
  },
  visitScenario(scenario, next) {
    imports.add('scenario');
    return printFunction(scenario.name, 'scenario', next().join('\n'));
  },
  visitRule(rule, next) {
    imports.add('rule');
    return printFunction(rule.name, 'rule', next().join('\n'));
  },
  visitScenarioOutline(scenario, next) {
    imports.add('scenarioOutline');
    return printFunction(scenario.name, 'scenarioOutline', next().join('\n'));
  },
  visitExamples(examples, next) {
    imports.add('scenarioOutline');
    return printFunction(examples.name, 'scenarioOutline', next().join('\n'));
  },
  visitExample(_example, next) {
    imports.add('scenario');
    return printFunction('example', 'scenario', next().join('\n'));
  },
  visitStep(step, index: number, steps) {
    let type = (step.keyword || 'Given').trim();

    let _type = type;
    let i = index;  // find previous step that's not an "and" or "but"
    while (i > 0 && (_type === 'And' || _type === 'But')) {
      _type = (steps[--i].keyword || 'Given').trim();
    }
    
    addDefinition(_type, (step.text || ''));
  
    type = type.toLowerCase();
    imports.add(type);
    return `${type}('${step.text}');`;
  }
});

export function transform(data: string) {
  data = data.split('\n').map(s => {
    return s.replace(/^\/\//, '').replace(/'/g, '"');
  }).join('\n');

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
