import { messages } from '@cucumber/messages';

type GherkinDocument = messages.IGherkinDocument;
type Feature = messages.GherkinDocument.Feature;
type Rule = messages.GherkinDocument.Feature.FeatureChild.IRule;
type Scenario = messages.GherkinDocument.Feature.IScenario;
type Background = messages.GherkinDocument.Feature.IBackground;
type Step = messages.GherkinDocument.Feature.IStep;
type Examples = messages.GherkinDocument.Feature.Scenario.IExamples;
type TableRow = messages.GherkinDocument.Feature.ITableRow;

type NextFunction = () => any;
type Visitor<U, P> = (
  node: U,
  index: number,
  parent: P,
  next: NextFunction
) => any;

interface Visitors {
  visitFeature: Visitor<Feature, GherkinDocument>;
  visitStep: Visitor<Step, Scenario | Background>;
  visitBackground: Visitor<Background, Feature | Rule>;
  visitExample: Visitor<TableRow, Scenario>;
  visitExamples: Visitor<Examples, Scenario>;
  visitScenarioOutline: Visitor<Scenario, Feature | Rule>;
  visitScenario: Visitor<Scenario, Feature | Rule>;
  visitRule: Visitor<Rule, Feature>;
}

const DEFAULT_VISITORS: Visitors = {
  visitFeature: () => null,
  visitStep: () => null,
  visitBackground: () => null,
  visitExample: () => null,
  visitExamples: () => null,
  visitScenarioOutline: () => null,
  visitScenario: () => null,
  visitRule: () => null,
};

const DEFAULT_OPTIONS = {
  skip: false,
  only: false,
};

export class Walker {
  public options = DEFAULT_OPTIONS;

  protected readonly baseOptions = DEFAULT_OPTIONS;
  protected readonly visitors: Visitors;

  constructor(
    visitors: Partial<Visitors>,
    options?: Partial<typeof DEFAULT_OPTIONS>
  ) {
    this.visitors = {
      ...DEFAULT_VISITORS,
      ...visitors,
    };

    this.baseOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  walk(ast: GherkinDocument, options?: Partial<typeof DEFAULT_OPTIONS>) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...this.baseOptions,
      ...options,
    };

    return this.walkFeature(ast.feature as Feature, 0, ast);
  }

  private walkFeature(
    feature: Feature,
    index: number,
    parent: GherkinDocument
  ) {
    const next = () => {
      return feature.children.map((child, i) => {
        if (child.rule) {
          return this.walkRule(child.rule, i, feature);
        }
        if (child.scenario) {
          return this.walkScenario(child.scenario, i, feature);
        }
        if (child.background) {
          return this.walkBackground(child.background, i, feature);
        }
        return null;
      });
    };

    return this.visitors.visitFeature(feature, index, parent, next);
  }

  private walkRule(rule: Rule, index: number, parent: Feature) {
    const next = () => {
      return (rule.children || []).map((child, i) => {
        if (child.scenario) {
          return this.walkScenario(child.scenario, i, rule);
        }
        if (child.background) {
          return this.walkBackground(child.background, i, rule);
        }
        return null;
      });
    };

    return this.visitors.visitRule(rule, index, parent, next);
  }

  private walkScenario(
    scenario: Scenario,
    index: number,
    parent: Feature | Rule
  ) {
    if (scenario.examples && scenario.examples.length) {
      const examples = () =>
        (scenario.examples || []).map((e, i) =>
          this.walkExamples(e, i, scenario)
        );
      return this.visitors.visitScenarioOutline(
        scenario,
        index,
        parent,
        examples
      );
    }

    const steps = () =>
      (scenario.steps || []).map((s, i) => this.walkStep(s, i, scenario));
    return this.visitors.visitScenario(scenario, index, parent, steps);
  }

  private walkExamples(examples: Examples, index: number, parent: Scenario) {
    const tableHeaderRegex = (examples.tableHeader?.cells || []).map(
      (cell: any) => new RegExp(`<${cell.value}>`, 'g')
    );

    const next = () => {
      return (examples.tableBody || []).map((tableRow) => {
        const values = (tableRow.cells || []).map((cell: any) => cell.value);
        const steps = (parent.steps || []).map((step) => {
          let { text } = step;
          tableHeaderRegex.forEach((re: RegExp, i: number) => {
            text = (text || '').replace(re, values[i]);
          });
          return {
            ...step,
            text,
          };
        });

        const _next = () =>
          (steps || []).map((s, i) => this.walkStep(s, i, parent));
        return this.visitors.visitExample(tableRow, index, examples, _next);
      });
    };

    return this.visitors.visitExamples(examples, index, parent, next);
  }

  private walkBackground(
    background: Background,
    index: number,
    parent: Feature | Rule
  ) {
    const next = () => {
      return (background.steps || []).map((step, i, _steps) =>
        this.walkStep(step, i, background)
      );
    };

    return this.visitors.visitBackground(background, index, parent, next);
  }

  private walkStep(step: Step, index: number, parent: Scenario | Background) {
    return this.visitors.visitStep(step, index, parent, () => null);
  }
}
