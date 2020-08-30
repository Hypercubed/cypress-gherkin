import { Parser, AstBuilder } from '@cucumber/gherkin';
import { messages } from '@cucumber/messages';

import {
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ParameterType,
} from '@cucumber/cucumber-expressions';

import { Incrementing, includesSome } from './utils';
import { Walker } from './ast-walker';
import { ONLY, SKIP, TAGS } from './constants';

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

type ITag = messages.GherkinDocument.Feature.ITag;

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

const printComment = (text: string) => {
  if (!text) {
    return '';
  }
  return (
    '// ' +
    text
      .trim()
      .split('\n')
      .map((s) => s.trim())
      .join('\n// ') +
    '\n'
  );
};

const printFunctionName = (type: string, tags: string[]) => {
  if (includesSome(tags, ONLY)) {
    type += '.only';
  } else if (includesSome(tags, SKIP)) {
    type += '.skip';
  }
  return type;
};

const printName = (name: string, tags: string[]) => {
  tags = (tags || []).filter((t) => !TAGS.includes(t || ''));
  return [name || '', ...tags].join(' ');
};

const printFunction = (
  name: string | null | undefined,
  type: string,
  body: string,
  itags: ITag[] = []
) => {
  const tags = (itags || []).map((t) => t.name).filter(Boolean) as string[];
  name = printName(name || '', tags);
  type = printFunctionName(type, tags);
  let s = name ? `${type}('${name}', () => {\n` : `${type}(() => {\n`;
  s += indent(body);
  s += `});\n`;
  return s;
};

const printExample = (
  name: string | null | undefined,
  type: string,
  body: string,
  itags: ITag[] = []
) => {
  const tags = (itags || []).map((t) => t.name).filter(Boolean) as string[];
  type = printFunctionName(type, tags);
  let s = name ? `${type}('${name}', [\n` : `${type}([\n`;
  s += indent(body);
  s += `]);\n`;
  return s;
};

const walker = new Walker({
  visitFeature(feature, _index, _parent, next) {
    imports.add('feature');

    const content = [printComment(feature.description), ...next()].join('\n');
    return printFunction(feature.name, 'feature', content, feature.tags || []);
  },
  visitBackground(background, _index, _parent, next) {
    imports.add('background');
    const content = [
      printComment(background.description || ''),
      ...next(),
    ].join('\n');
    return printFunction(background.name, 'background', content);
  },
  visitScenario(scenario, _index, _parent, next) {
    const type = (scenario.keyword || 'scenario')?.trim().toLowerCase();
    imports.add(type);
    const content = [printComment(scenario.description || ''), ...next()].join(
      '\n'
    );
    return printFunction(scenario.name, type, content, scenario.tags || []);
  },
  visitRule(rule, _index, _parent, next) {
    imports.add('rule');
    const content = [printComment(rule.description || ''), ...next()].join(
      '\n'
    );
    return printFunction(rule.name, 'rule', content);
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
    const content = [
      printComment(scenario.description || ''),
      outline,
      ...next(),
    ].join('\n');
    return printFunction(
      scenario.name,
      'scenarioOutline',
      content,
      scenario.tags || []
    );
  },
  visitExamples(examples, _index, _parent, next) {
    imports.add('examples');
    const header = examples.tableHeader?.cells?.map(
      (cell: any) => `'${cell.value}'`
    );
    const content = `[${header?.join(', ')}],\n` + next().join(',\n');
    return printExample(
      examples.name,
      'examples',
      content,
      examples.tags || []
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

    if (type === '*') type = 'And';

    let _type = type;
    let i = index; // find previous step that's not an "and" or "but"
    while (
      steps &&
      i > 0 &&
      (_type === 'And' || _type === 'But' || _type === '*')
    ) {
      _type = (steps[--i].keyword || 'Given').trim();
    }
    addDefinition(_type, step.text || '');

    type = type.toLowerCase();
    imports.add(type);
    if (type === 'and' || type === 'but') {
      type = '  ' + type;
    }
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
