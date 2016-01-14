'use strict';

require("babel-polyfill");

var _ = require('lodash');
var request = require('request');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

var axelerant = require('./axelerant.json');
var url = 'http://www.drupalcores.com/data.json';
var iconUrl = 'https://www.drupal.org/files/drupal%208%20logo%20isolated%20CMYK%2072.png';
var slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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';

var getContributors = function getContributors(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        var _JSON$parse = JSON.parse(body);

        var contributors = _JSON$parse.contributors;

        resolve(contributors);
      }
    });
  });
};

var getAxelerantContributors = function getAxelerantContributors(contributors) {
  return _.intersection(Object.keys(contributors), axelerant).reduce(function (acc, username) {
    acc[username] = contributors[username];
    return acc;
  }, {});
};

var getTotalContributions = function getTotalContributions(axelerantContributors) {
  return Object.keys(axelerantContributors).reduce(function (acc, i) {
    return acc + axelerantContributors[i];
  }, 0);
};

var convertToMessage = function convertToMessage(axelerantContributors, totalContributions) {
  var axelerantContributorsStat = Object.keys(axelerantContributors).map(function (username) {
    return '<http://drupal.org/u/' + username + '|' + username + '> : ' + axelerantContributors[username];
  }).join('\n');
  return ':drupal8:  ​_*' + totalContributions + '* Drupal 8 commits by Axelerant_  :drupal8:​\n' + axelerantContributorsStat;
};

var convertToPayload = function convertToPayload(message) {
  return {
    text: message,
    username: 'D8-Bot',
    icon_url: iconUrl
  };
};

var postPayload = function postPayload(payload) {
  return new Promise(function (resolve, reject) {
    request.post({
      url: slackUrl,
      body: JSON.stringify(payload)
    }, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

function main() {
  var contributors, axelerantContributors, totalContributions, message, payload;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getContributors(url));

        case 3:
          contributors = _context.sent;
          axelerantContributors = getAxelerantContributors(contributors);
          totalContributions = getTotalContributions(axelerantContributors);
          message = convertToMessage(axelerantContributors, totalContributions);
          payload = convertToPayload(message);

          postPayload(payload);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context['catch'](0);

          console.log(_context.t0);

        case 14:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 11]]);
}

app.post('/d8', function (req, res) {
  main();
});

app.listen(port, function () {
  console.log('Listening on ' + port + '.');
});
