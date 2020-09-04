import { ParameterType } from '../../../src/index';

ParameterType({
  name: 'should',
  regexp: /(should|should not)/,
  transformer(s: string) {
    return s === 'should';
  }
});

ParameterType({
  name: '_subject_',
  regexp: /(title|url|hash)/,
});

ParameterType({
  name: '_click_',
  regexp: /(click|doubleclick|rightclick)/,
});

// checks/unchecks

ParameterType({
  name: '_position_',
  regexp: /(top|bottom)/,
});

ParameterType({
  name: '_data_',
  regexp: /(attr|prop|css|data)/,
});

ParameterType({
  name: '_value_',
  regexp: /(class|id|html|text|value)/,
});

ParameterType({
  name: '_state_',
  regexp: /(visible|enabled|disabled|selected|checked|empty)/,
});

// keys (enter|tab|backspace|del|downarrow|end|enter|esc|home|insert|leftarrow|pagedown|pageup|rightarrow|selectall|uparrow)