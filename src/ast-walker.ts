import { messages } from '@cucumber/messages';

type GherkinDocument = messages.IGherkinDocument;
type Feature = messages.GherkinDocument.Feature;
type Rule = messages.GherkinDocument.Feature.FeatureChild.IRule;
type Scenario = messages.GherkinDocument.Feature.IScenario;
type Background = messages.GherkinDocument.Feature.IBackground;
type Step = messages.GherkinDocument.Feature.IStep;

export class Walker {
  constructor(public readonly visitors: any) {}

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
    const steps = (scenario.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitScenario(scenario, steps);
  }

  private walkBackground(background: Background) {
    const steps = (background.steps || []).map((step, index, _steps) => this.walkStep(step, index, _steps));
    return this.visitors.visitBackground(background, steps);
  }

  private walkStep(step: Step, index: number, steps: Step[]) {
    return this.visitors.visitStep(step, index, steps);
  }
}