import { messages } from '@cucumber/messages';

type GherkinDocument = messages.IGherkinDocument;
type Feature = messages.GherkinDocument.Feature;
type Rule = messages.GherkinDocument.Feature.FeatureChild.IRule;
type Scenario = messages.GherkinDocument.Feature.IScenario;
type Background = messages.GherkinDocument.Feature.IBackground;
type Step = messages.GherkinDocument.Feature.IStep;
type Examples = messages.GherkinDocument.Feature.Scenario.IExamples;

interface Visitors {
  visitFeature: (feature: Feature, children: any[]) => any,
  visitStep: (step: Step, index: number, steps: Step[]) => any,
  visitBackground: (background: Background, steps: any[]) => any,
  visitExample: (steps: any[]) => any,
  visitExamples: (examples: Examples, children: any[]) => any,
  visitScenarioOutline: (scenario: Scenario, examples: any[]) => any,
  visitScenario: (scenario: Scenario, steps: any[]) => any,
  visitRule: (rule: Rule, children: any[]) => any,
}

const DEFAULT_VISITORS: Visitors = {
  visitFeature: (_feature: Feature, _children: any[]) => null,
  visitStep: (_step: Step, _index: number, _steps: Step[]) => null,
  visitBackground: (_background: Background, _steps: any[]) => null,
  visitExample: (_steps: any[]) => null,
  visitExamples: (_examples: Examples, _children: any[]) => null,
  visitScenarioOutline: (_scenario: Scenario, _examples: any[]) => null,
  visitScenario: (_scenario: Scenario, _steps: any[]) => null,
  visitRule: (_rule: Rule, _children: any[]) => null,
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
    const children = feature.children.map(child => {
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

    return this.visitors.visitFeature(feature, children);
  }

  private walkRule(rule: Rule) {
    const children = (rule.children || []).map(child => {
      if (child.scenario) {
        return this.walkScenario(child.scenario);
      }
      if (child.background) {
        return this.walkBackground(child.background);
      }
      return null;
    });

    return this.visitors.visitRule(rule, children);
  }

  private walkScenario(scenario: Scenario) {
    if (scenario.examples && scenario.examples.length) {
      const examples = (scenario.examples || []).map(_examples => {
        return this.walkExamples(_examples, scenario);
      });

      return this.visitors.visitScenarioOutline(scenario, examples);
    }
    const steps = (scenario.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitScenario(scenario, steps);
  }

  private walkExamples(examples: Examples, scenario: Scenario) {
    const tableHeaderRegex = (examples.tableHeader?.cells || []).map((cell: any) => new RegExp(`<${cell.value}>`, 'g'));

    const children = (examples.tableBody || []).map(tableRow => {
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

      const steps = (_steps || []).map((step, index) => this.walkStep(step, index, _steps));
      return this.visitors.visitExample(steps);
    });

    return this.visitors.visitExamples(examples, children);
  }

  private walkBackground(background: Background) {
    const steps = (background.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitBackground(background, steps);
  }

  private walkStep(step: Step, index: number, steps: Step[]) {
    return this.visitors.visitStep(step, index, steps);
  }
}
