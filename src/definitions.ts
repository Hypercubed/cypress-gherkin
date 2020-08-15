import {
  Expression,
  ParameterTypeRegistry,
  CucumberExpressionGenerator,
  ExpressionFactory,
  ParameterType as _ParameterType,
} from '@cucumber/cucumber-expressions';

type Matcher = string | RegExp;

type AnyFunction = (...args: any[]) => any;

interface StepOptions {
  log: boolean;
}

interface Definition {
  type: string;
  matcher: Matcher;
  expression: Expression;
  implementation: AnyFunction;
  options: any;
}

const definitions: Definition[] = [];

const parameterTypeRegistry = new ParameterTypeRegistry();
const cucumberExpressionGenerator = new CucumberExpressionGenerator(
  parameterTypeRegistry
);
const expressionFactory = new ExpressionFactory(parameterTypeRegistry);

function noop() {
  // noop
}

export const Step = (
  type: string,
  matcher: Matcher,
  implementation: AnyFunction = noop,
  options: StepOptions = { log: true }
) => {
  definitions.push({
    type: type.trim(),
    matcher,
    expression: expressionFactory.createExpression(matcher),
    implementation,
    options,
  });
};

export const resolve = (_type: string, text: string) => {
  return definitions.find(({ expression }) => {
    return expression.match(text);
  });
};

export const generateHint = (type: string, text: string) => {
  const examples = cucumberExpressionGenerator.generateExpressions(text);
  const suggestions = examples
    .map(
      (example) =>
        `${type}('${example.source}', (${example.parameterNames}) => {});`
    )
    .join('\n');
  return `Missing Gherkin statement: ${type} ${text}

Suggestion(s):

${suggestions}

  `;
};

export const ParameterType = ({
  name,
  typeName,
  regexp,
  transformer,
  useForSnippets,
  preferForRegexpMatch,
}: any) => {
  const parameterType = new _ParameterType(
    name,
    regexp,
    typeName,
    transformer,
    useForSnippets,
    preferForRegexpMatch
  );
  parameterTypeRegistry.defineParameterType(parameterType);
};
