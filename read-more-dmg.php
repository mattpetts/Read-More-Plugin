<?php
/**
* Plugin Name:       Read More DMG
* Description:       Adds a Read More block and CLI command to Wordpress
* Version:           0.1.0
* Requires at least: 6.7
* Requires PHP:      7.4
* Author:            The WordPress Contributors
* License:           GPL-2.0-or-later
* License URI:       https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:       read-more-dmg
*
* @package ReadMoreDmg
*/

function dmg_read_more_register_block() {
    register_block_type( __DIR__ . '/blocks/read-more' );
}
add_action( 'init', 'dmg_read_more_register_block' );