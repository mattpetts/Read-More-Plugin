<?php

namespace ReadMoreCLI;

use WP_CLI;
use WP_CLI_Command;
use WP_Query;

class CLI_Command extends WP_CLI_Command {
    private array $date_range;

    public function __construct() {
        $this->date_range = [
            'date_from' => date( 'Y-m-d', strtotime( '-30 days' ) ),
            'date_to'   => date( 'Y-m-d' ),
        ];
    }

    /**
     * @param $date
     * @return string|null
     */
    private function validate_date_inputs( $date ): string|null {
        if ( $date === null ) {
            return null;
        }

        if ( ! strtotime( $date ) ) {
            WP_CLI::error( "{$date} is not a valid date (YYYY-MM-DD)" );
        }

        return date( 'Y-m-d', strtotime( $date ) );
    }

    /**
     * @param $args
     * @param $assoc_args
     * @return void
     */
    public function __invoke( $args, $assoc_args ) {
        $from = $this->validate_date_inputs( $assoc_args['from'] );
        $to   = $this->validate_date_inputs( $assoc_args['to'] );

        if ( $from && $to ) {
            $this->date_range['date_from'] = $from;
            $this->date_range['date_to']   = $to;
        }

        $query_args = [
            'post_status'    => 'publish',
            's'              => "wp:dmg/read-more",
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'date_query'     => [
                'before'    => $this->date_range['date_to'],
                'after'     => $this->date_range['date_from'],
                'inclusive' => true,
            ]
        ];

        $query = new WP_Query( $query_args );

        if ( $query->have_posts() ) {
            foreach ( $query->posts as $post ) {
                WP_CLI::log( $post );
            }
        } else {
            WP_CLI::error( 'No posts found' );
        }
    }
}
