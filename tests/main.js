import tape from 'tape';
import {
  getContributors,
  getAxelerantContributors,
  getTotalContributions,
  convertToMessage,
  convertToPayload
} from '../index';

import axelerant from '../axelerant.json';
import { contributors } from './data.json';

tape('get contributors', (t) => {
  t.end();
});

tape('get axelerant contributors', (t) => {
  t.end();
});

tape('get total contributions', (t) => {
  const fixture = {
    "a": 10,
    "b": 9,
    "c": 8,
    "d": 7,
  };
  const expected = 34;
  const actual = getTotalContributions(fixture);
  t.equal(expected, actual);
  t.end();
})

tape('convert to message', (t) => {
  const fixture = {
    "a": 10,
    "b": 9,
    "c": 8,
    "d": 7,
  };
  const expected = ":drupal8:  ​_*10* Drupal 8 commits by Axelerant_  :drupal8:​\n<http://drupal.org/u/a|a> : 10\n<http://drupal.org/u/b|b> : 9\n<http://drupal.org/u/c|c> : 8\n<http://drupal.org/u/d|d> : 7";
  const actual = convertToMessage(fixture, 10);
  t.equal(expected, actual);
  t.end();
})

tape('convert to payload', (t) => {
  const expected = convertToPayload('bassam');
  const actual = {
    text: 'bassam',
    username: 'D8-Bot',
    icon_url: 'https://www.drupal.org/files/drupal%208%20logo%20isolated%20CMYK%2072.png'
  };
  t.deepEqual(expected, actual);
  t.end();
});
