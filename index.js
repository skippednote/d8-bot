require("babel-polyfill");

const _ = require('lodash');
const request = require('request');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const axelerant = require('./axelerant.json');
const url = 'http://www.drupalcores.com/data.json';
const iconUrl = 'https://www.drupal.org/files/drupal%208%20logo%20isolated%20CMYK%2072.png';
const slackUrl = process.env.SLACK_URL;

const getContributors = (url) => {
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

const getAxelerantContributors = (contributors) => {
  return _.intersection(Object.keys(contributors), axelerant)
    .reduce((acc, username) => {
      acc[username] = contributors[username];
      return acc;
    }, {});
};

const getTotalContributions = (axelerantContributors) => {
  return Object.keys(axelerantContributors).reduce((acc, i) => {
    return acc + axelerantContributors[i];
  }, 0)
};

const convertToMessage = (axelerantContributors, totalContributions) => {
  const axelerantContributorsStat = Object.keys(axelerantContributors).map(username => {
    return `<http://drupal.org/u/${username}|${username}> : ${axelerantContributors[username]}`
  }).join('\n');
  return `:drupal8:  ​_*${totalContributions}* Drupal 8 commits by Axelerant_  :drupal8:​\n${axelerantContributorsStat}`;
};

const convertToPayload = (message) => {
  return {
    text: message,
    username: 'D8-Bot',
    icon_url: iconUrl
  }
};

const postPayload = (payload) => {
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

async function main(res) {
  try {
    const contributors = await getContributors(url);
    const axelerantContributors = getAxelerantContributors(contributors);
    const totalContributions = getTotalContributions(axelerantContributors);
    const message = convertToMessage(axelerantContributors, totalContributions);
    const payload = convertToPayload(message);
    postPayload(payload);
    res.send({success: true});
  } catch(e) {
    console.log(e);
  }
}

app.post('/d8', (req, res) => {
  main(res);
});

app.listen(port, () => {
  console.log(`Listening on ${port}.`);
})
