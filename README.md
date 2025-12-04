# Read-More-Plugin
Wordpress plugin that adds a Read More block and CLI command for searching block usage. Scaffolded using @wordpress/create-block. 

## Block
### Usage

The block can be added in the editor by searching for `DMG Read More`. Once the block has been added you can pick a post from the list of options, or search for a specific post by either the post title or post id.

`npm run build` to generate build files.  
`npm run test` to run unit tests. Test should be added in the `/tests` directory.

## CLI

The plugin provides a CLI command to identify all posts that contain an instance of the Read More block. 

### Usage

The CLI command will be default show posts published in the past 30 days.

`wp dmg-read-more-search`

To search a custom date range, use the `--to` and `--from` flags.

`wp dmg-read-more-search --from=2025-01-01 --to=2025-12-01`