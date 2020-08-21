import { Parser, AstBuilder } from '@cucumber/gherkin';

import {
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ParameterType
} from '@cucumber/cucumber-expressions';

import { messages } from '@cucumber/messages';

import { Incrementing } from './utils';
import { Walker } from './ast-walker';

// type GherkinDocument = messages.IGherkinDocument;
type Feature = messages.GherkinDocument.Feature;
type Rule = messages.GherkinDocument.Feature.FeatureChild.IRule;
type Scenario = messages.GherkinDocument.Feature.IScenario;
type Background = messages.GherkinDocument.Feature.IBackground;
type Step = messages.GherkinDocument.Feature.IStep;

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

const printFunctionOpen = (type: string, name?: string | null): string => {
  return name ? `${type}('${name}', () => {\n` : `${type}(() => {\n`;
}

const walker = new Walker({
  visitFeature: (feature: Feature, children: any[]) => {
    imports.add('feature');

    let s = printFunctionOpen('feature', feature.name);
    s += indent(children.join('\n'));
    s += `});\n`;
    return s;
  },
  visitBackground(background: Background, steps: any[]) {
    imports.add('background');

    let s = printFunctionOpen('background', background.name);
    s += indent(steps.join('\n'));
    s += `});\n`;
    return s;
  },
  visitScenario(scenario: Scenario, steps: any[]) {
    imports.add('scenario');

    let s = printFunctionOpen('scenario', scenario.name);
    s += indent(steps.join('\n'));
    s += `});\n`;
    return s;
  },
  visitRule(rule: Rule, children: any[]) {
    imports.add('rule');
    
    let s = printFunctionOpen('rule', rule.name);
    s += indent(children.join('\n'));
    s += `});\n`;
    return s;
  },
  visitStep(step: Step, index: number, steps: Step[]) {
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
