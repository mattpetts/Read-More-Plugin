<?php

namespace DMGReadMoreCLI;

use WP_CLI;

class Read_More_CLI {
    private array $date_range;

    public function __construct() {
        $this->date_range = [
            "date_from" => date("Y-m-d", strtotime("-30 days")),
            "date_to"   => date("Y-m-d"),
        ];
    }

    /**
     * @param string $message
     * @param string $type
     * @return void
     */
    private function create_cli_message(string $message, string $type = "log"): void {
        if (empty($message)) {
            return;
        }

        $allowed_types = ["log", "error", "success"];

        if (!in_array($type, $allowed_types)) {
            $type = "log";
        }

        WP_CLI::{$type}($message);
    }

    /**
     * @param $date
     * @return string|null
     */
    private function validate_and_normalise_date_inputs($date): ?string {
        if ($date === null) {
            return null;
        }

        if (!strtotime($date)) {
            $this->create_cli_message("{$date} is not a valid date. Date should be formatted as (YYYY-MM-DD)", "error");
        }

        return date("Y-m-d", strtotime($date));
    }

    /**
     * @param $args
     * @param $assoc_args
     * @return void
     */
    public function __invoke($args, $assoc_args): void {
        global $wpdb;

        $has_to   = isset($assoc_args["to"]);
        $has_from = isset($assoc_args["from"]);

        if ((!$has_to && $has_from) || ($has_to && !$has_from)) {
            $this->create_cli_message("--from and --to must be supplied together", "error");
        }

        if ($has_to && $has_from) {
            $from = $this->validate_and_normalise_date_inputs($assoc_args["from"]);
            $to   = $this->validate_and_normalise_date_inputs($assoc_args["to"]);

            $this->date_range["date_from"] = $from;
            $this->date_range["date_to"]   = $to;
        }

        $sql = $wpdb->prepare("
            SELECT ID 
            FROM $wpdb->posts
            WHERE post_status = 'publish'
            AND post_date >= %s
            AND post_date <= %s
            AND post_content LIKE '%<!-- wp:dmg/read-more%'
        ", $this->date_range["date_from"], $this->date_range["date_to"]);

        $post_ids = $wpdb->get_col($sql);

        if (count($post_ids) > 0) {
            $this->create_cli_message(count($post_ids) . " post(s) found!", "success");
            foreach ($post_ids as $id) {
                $this->create_cli_message($id, "log");
            }
        } else {
            $this->create_cli_message("No Posts Found", "log");
        }
    }
}
