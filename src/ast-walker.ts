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

interface Visitors {
  visitFeature: (feature: Feature, next: NextFunction) => any,
  visitStep: (step: Step, index: number, steps: Step[]) => any,
  visitBackground: (background: Background, next: NextFunction) => any,
  visitExample: (row: TableRow, next: NextFunction) => any,
  visitExamples: (examples: Examples, next: NextFunction) => any,
  visitScenarioOutline: (scenario: Scenario, next: NextFunction) => any,
  visitScenario: (scenario: Scenario, next: NextFunction) => any,
  visitRule: (rule: Rule, next: NextFunction) => any,
}

const DEFAULT_VISITORS: Visitors = {
  visitFeature: (_feature, _next) => null,
  visitStep: (_step, _index, _steps) => null,
  visitBackground: (_background, _next) => null,
  visitExample: (_row, _next) => null,
  visitExamples: (_examples: Examples, _next) => null,
  visitScenarioOutline: (_scenario: Scenario, _next) => null,
  visitScenario: (_scenario: Scenario, _next) => null,
  visitRule: (_rule: Rule, _next) => null,
};

export class Walker {
  protected readonly visitors: Visitors;

  constructor(visitors: Partial<Visitors>) {
    this.visitors = {
      ...DEFAULT_VISITORS,
      ...visitors
    };
  }

  walk(ast: GherkinDocument) {
    return this.walkFeature(ast.feature as Feature);
  }

  private walkFeature(feature: Feature) {
    const next = () => feature.children.map(child => {
      if (child.rule) {
        return this.walkRule(child.rule);
      }
      if (child.scenario) {
        return this.walkScenario(child.scenario);
      }
      if (child.background) {
        return this.walkBackground(child.background);
      }
      return null;
    });

    return this.visitors.visitFeature(feature, next);
  }

  private walkRule(rule: Rule) {
    const next = () => (rule.children || []).map(child => {
      if (child.scenario) {
        return this.walkScenario(child.scenario);
      }
      if (child.background) {
        return this.walkBackground(child.background);
      }
      return null;
    });

    return this.visitors.visitRule(rule, next);
  }

  private walkScenario(scenario: Scenario) {
    if (scenario.examples && scenario.examples.length) {
      const _next = () => (scenario.examples || []).map(_examples => {
        return this.walkExamples(_examples, scenario);
      });

      return this.visitors.visitScenarioOutline(scenario, _next);
    }

    const next = () => (scenario.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitScenario(scenario, next);
  }

  private walkExamples(examples: Examples, scenario: Scenario) {
    const tableHeaderRegex = (examples.tableHeader?.cells || []).map((cell: any) => new RegExp(`<${cell.value}>`, 'g'));

    const next = () => (examples.tableBody || []).map(tableRow => {
      const values = (tableRow.cells || []).map((cell: any) => cell.value);
      const _steps = (scenario.steps || []).map(step => {
        let { text } = step;
        tableHeaderRegex.forEach((re: RegExp, i: number) => {
          text = (text || '').replace(re, values[i]);
        });
        return {
          ...step,
          text
        };
      });

      const _next = () => (_steps || []).map((step, index) => this.walkStep(step, index, _steps));
      return this.visitors.visitExample(tableRow, _next);
    });

    return this.visitors.visitExamples(examples, next);
  }

  private walkBackground(background: Background) {
    const next = () => (background.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitBackground(background, next);
  }

  private walkStep(step: Step, index: number, steps: Step[]) {
    return this.visitors.visitStep(step, index, steps);
  }
}
