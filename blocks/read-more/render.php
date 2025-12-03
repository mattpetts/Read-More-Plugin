<?php

if ( empty( $attributes['selectedPost'] ) ) {
    return;
}

$post = get_post( $attributes['selectedPost'] );

if ( ! $post ) {
    return;
}

$url = get_permalink( $post );
$title = esc_html( get_the_title( $post ) );

?>

<p class="dmg-read-more">Read more: <a href="<?php echo esc_url( $url ) ?>"><?php echo $title ?></a></p>