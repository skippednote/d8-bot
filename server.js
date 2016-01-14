const url = 'http://www.drupalcores.com/data.json';

import express from 'express';
import {
  getContributors,
  getAxelerantContributors,
  getTotalContributions,
  convertToMessage,
  convertToPayload,
  postPayload
} from './index';

const app = express();
const port = process.env.PORT || 3000;

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
};

app.post('/d8', (req, res) => {
  main(res);
});

app.listen(port, () => {
  console.log(`Listening on ${port}.`);
});
