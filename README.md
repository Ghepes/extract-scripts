# extract-scripts
 extract scripts js end css from your proiects with composer


### Execute a composer.json, with the following script https://github.com/Ghepes/extract-scripts   To extract scripts we will use for test a wordpress file project. We will add to the project the wordpress location from where js and css are extracted

TREE project format
````
Generate files end copy wordpress-all -
name_project/
├── composer.json
├── wordpress/   # folder extract js css
├── copy-assets.php
├── post-install-cmd.php

````
### if the extraction folder is called something other than wordpress, you must change the wordpress name in the entire scripts project


## Command to extract js and css scripts
````
composer install
````

## composer update is used for re-extraction
````
composer update
````

### You want to quickly extract js and css files from a large project, copy this project locally. Delete everything from the 'wordpress' folder and from the 'assets' folder and add your own project to the 'wordpress' folder and if you are using windows you must have composer installed.
### After you have entered your personal project in the wordpress folder, you can enter the 'composer install' command. It will take a few moments until it executes, it depends on the size of the extraction project.
