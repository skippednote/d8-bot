<?php

require_once "./vendor/autoload.php";

use GuzzleHttp\Client;
use Silex\Application;
use Skippednote\DrupalContributions\Contributions;

$app = new Application();
$app->post("/", function() use ($app) {
    $client = new Client();
    $response = $client->get('http://www.drupalcores.com/data.json');
    $employees = json_decode(file_get_contents("./contributors.json"), true);
    $contributions = new Contributions($response, $employees);
    $contribution_data = $contributions->contribution_data();
    $client->request('POST', 'http://httpbin.org/post', [
        'json' => $contribution_data
    ]);

    return $app->json("ok", 200);
});

$app->run();