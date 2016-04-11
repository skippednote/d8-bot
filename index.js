import { intersection } from 'lodash';
import request from 'request';

import axelerant from './contributors.json';
const iconUrl = 'https://www.drupal.org/files/drupal%208%20logo%20isolated%20CMYK%2072.png';
const slackUrl = process.env.SLACK_URL;

export const getContributors = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        const { contributors } = JSON.parse(body);
        resolve(contributors);
      }
    });
  });
};

export const getAxelerantContributors = (contributors) => {
  return intersection(Object.keys(contributors), axelerant)
    .reduce((acc, username) => {
      acc[username] = contributors[username];
      return acc;
    }, {});
};

export const getTotalContributions = (axelerantContributors) => {
  return Object.keys(axelerantContributors).reduce((acc, i) => {
    return acc + axelerantContributors[i];
  }, 0);
};

export const convertToMessage = (axelerantContributors, totalContributions) => {
  const axelerantContributorsStat = Object.keys(axelerantContributors).map(username => {
    return `<http://drupal.org/u/${username}|${username}> : ${axelerantContributors[username]}`
  }).join('\n');
  return `:drupal8:  ​_*${totalContributions}* Drupal 8 commits by Axelerant_  :drupal8:​\n${axelerantContributorsStat}`;
};

export const convertToPayload = (message) => {
  return {
    text: message,
    username: 'D8-Bot',
    icon_url: iconUrl
  }
};

export const postPayload = (payload) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: slackUrl,
      body: JSON.stringify(payload)
    }, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
