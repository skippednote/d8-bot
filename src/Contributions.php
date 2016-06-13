<?php

namespace Skippednote\DrupalContributions;

use Psr\Http\Message\ResponseInterface;

class Contributions
{

    private $response;
    private $employees;

    public function __construct(ResponseInterface $response, Array $employees)
    {
        $this->response = $response;
        $this->employees = $employees;
    }

    private function get_contributors()
    {
        if($this->response->getStatusCode() == 200) {
            $company_contributors = [];

            $body = $this->response->getBody();
            $contributors = json_decode($body, true)['contributors'];

            foreach($contributors as $contributor => $commits) {
                foreach($this->employees as $employee) {
                    if($contributor == $employee) {
                        $company_contributors[$contributor] = $commits;
                    }
                }
            }

            return $company_contributors;
        }
    }

    private function get_total_contributions(Array $company_contributors)
    {
        $total_commits = array_reduce(array_values($company_contributors), function($accumulator, $commits) {
            $accumulator += $commits;
            return $accumulator;
        }, 0);

        return $total_commits;
    }

    private function convert_to_message(Array $company_contributors, $total_commits)
    {
        $message = ":drupal8:  ​_*$total_commits* Drupal 8 commits by Axelerant_  :drupal8:​\n";
        foreach($company_contributors as $employee => $commits) {
            $message .= "<http://drupal.org/u/$employee|$employee> : $commits\n";
        }

        return $message;
    }

    private function convert_to_payload($message)
    {
        $icon_url = 'https://www.drupal.org/files/drupal%208%20logo%20isolated%20CMYK%2072.png';
        $payload = [
            "text" => $message,
            "username" => "D8 Bot",
            "icon_url" => $icon_url
        ];

        return $payload;
    }

    public function contribution_data()
    {
        $contributors = $this->get_contributors();
        $total_commits = $this->get_total_contributions($contributors);
        $message = $this->convert_to_message($contributors, $total_commits);
        $payload = $this->convert_to_payload($message);
        
        return $payload;
    }
}