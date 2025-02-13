# Development

Pull requests and contributions are very welcome!

## Set up
Clone the repository into your `.obsidian\plugins\` folder.

It is also recommended that you install [Hot Reload](https://github.com/pjeby/hot-reload) for Obsidian. This will reload the Obsidian plugin every time changes are made and save you from having to restart Obsidian every time.

## Debugging
Run `npm run dev` to begin development and rebuild whenever code changes are made.

To see SCSS changes run `npm run sass` in a seperate terminal.

## Release
The following is for maintainers.

Make sure to commit and push all changes first. After creating and pushing to a tag, go to GitHub.com and edit the draft version.

### Updating Versions
1. Update [manifest.json](../manifest.json) version 
2. Update both versions in [package-lock.json](../package-lock.json)
3. Update currentVersion in [src/data-editor](../src/data-editor)
4. Add version option to [.github/ISSUE_TEMPLATE/bug_report.yaml](../.github/ISSUE_TEMPLATE/bug_report.yaml)

### Create new tag
 ```bash
git tag -a <version> -m "<version>"
```

### Push to tag
```bash
git push origin <version>
```

### Delete pushed tag to retry action
```
git push --delete origin <version>
git tag -d <version>
```