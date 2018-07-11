# gutenberg-js

We made [Gutenberg](https://github.com/Wordpress/gutenberg) editor a little more **customizable**!

Gutenberg editor can **be easly included in your apps** with this [package](https://github.com/front/gutenberg). Also you can customize blocks menu panels, blocks categories, document panels and more!

This package is based on [Gutenberg v3.2.0](https://github.com/WordPress/gutenberg/releases/tag/v3.2.0).

## Table of contents
* [Installation](#installation)
    * [Dependencies](#dependencies)
* [Global variables](#global-variables)
    * [apiRequest](#apirequest)
        * [Post Types](#post-types)
        * [Posts and Pages](#posts-and-pages)
        * [Categories](#categories)
        * [Index](#index)
        * [Media](#media)
    * [url](#url)
* [Usage](#usage)
    * [Gutenberg Stores](#gutenberg-stores)
    * [Registering Custom Blocks](#registering-custom-blocks)
* [Customize your Gutenberg](#customize-your-gutenberg)
    * [Events](#events)
* [Gutenberg-js Lib](#gutenberg-js-lib)
    * [Post block](#post-block)
    * [Row block](#row-block)
    * [Section block](#section-block)
    * [PostsPanel component](#postspanel-component)

## Installation

**gutenberg-js** is available through npm.

```sh
npm install @frontkom/gutenberg-js
```

[↑ Go up to Table of contents](#table-of-contents)

### Dependencies

Some of the Gutenberg features depend of the [TinyMCE](https://www.tinymce.com/) text editor and Gutenberg editor expects to find tinymce *plugins*, *themes* and *skins* on the project root. Assuming that you added tinymce to your *node_modules*, we suggest to use webpack and [CopyWebpackPlugin](https://github.com/webpack-contrib/copy-webpack-plugin) to handle with that.

```js
// webpack.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   ...
    plugins: [
        new CopyWebpackPlugin([
            { from: 'node_modules/tinymce/plugins', to: `${ your_root_path }/plugins` },
            { from: 'node_modules/tinymce/themes', to: `${ your_root_path }/themes` },
            { from: 'node_modules/tinymce/skins', to: `${ your_root_path }/skins` },
        ], {}),
    ],
   ...
}
```

[↑ Go up to Table of contents](#table-of-contents)

## Global variables

Gutenberg depends on several global variables: `wp`, `userSettings`, `wpEditorL10n`, `wpApiSettings`, etc and probably during your Gutenberg experiencie you will discover other required variables, please share with us if you feel they are important to Gutenberg execution.

Here we're only presenting those variables which - by our experience - we belive are crucial to Gutenberg and already set to them default values. If you don't set them up, you'll see that Gutenberg editor won't run.

So we recommend you to set up them all in one file called `globals.js` or `settings.js` for example and import them **before** Gutenberg call. Feel free to override Gutenberg global variables if you need.

```js
// globals.js

window.wp = {
    apiRequest,
    url: { addQueryArgs },
    ...,
};

window.userSettings = {
    uid: 2, // Among other things, this uid is used to identify and store editor user preferences in localStorage
};

// set your root path
window.wpApiSettings = {
    root: 'YOUR_ROOT_PATH',
    ...,
};
```

We are working to include on **gutenberg-js** all settings that shouldn't be part of your apps, but you always can override them if you need.

[↑ Go up to Table of contents](#table-of-contents)

### apiRequest

Those two are very important for comunication between the editor and remaining app, so you should set them up according your needs.

***apiRequest*** is the method that will handle with data operations on Gutenberg, like getting resources (categories for example), saving page changes or deleting pages, etc. It receives an object with `path`, `method`, `data`, etc, so you can treat it as you want.

```js
function apiRequest(options) {
    // Do something with those options like calling an API
    // or actions from your store...
}
```

Next, we will show some commons API requests Gutenberg does and the respective response it expects. For more information, you can check the [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/reference/post-revisions/).

[↑ Go up to Table of contents](#table-of-contents)

#### Post Types

The Gutenberg editor will ask for available **Post Types** through `/wp/v2/types/?context=edit` request. The _type_ properties that can be checked in [WordPress documentation](https://developer.wordpress.org/rest-api/reference/post-types/).

[↑ Go up to Table of contents](#table-of-contents)

#### Posts and Pages

Check the WordPress API documentation for [Posts](https://developer.wordpress.org/rest-api/reference/posts/) and [Pages](https://developer.wordpress.org/rest-api/reference/pages/) requests.

[↑ Go up to Table of contents](#table-of-contents)

#### Categories

Check the WordPress API documentation for [Categories](https://developer.wordpress.org/rest-api/reference/categories/).

[↑ Go up to Table of contents](#table-of-contents)

#### Index

Gutenberg will ask for the [theme features](https://codex.wordpress.org/Theme_Features) through the index request (`/`). The response should be the following object.

```js
{
    ...,
    theme_supports: {
        formats: [ 'standard', 'aside', 'image', 'video', 'quote', 'link', 'gallery', 'audio' ],
        'post-thumbnails': true,
    },
    ...,
}
```

[↑ Go up to Table of contents](#table-of-contents)

#### Media

Here is the WordPress API documentation for [Media](https://developer.wordpress.org/rest-api/reference/media/). The **gutenberg-js** introduces the `data` property which is an object with all data attributes you want to add to image/media DOM element.

```js
{
    ...,
    id: 1527069591355,
    link: MEDIA_LINK_HERE,
    source_url: MEDIA_URL_HERE,
    // Additionaly, you can add some data attributes for images for example
    data: { entity_type: 'file', entity_uuid: 'e94e9d8d-4cf4-43c1-b95e-1527069591355' }
    ...,
}
```

[↑ Go up to Table of contents](#table-of-contents)

### url

***url*** should has a function called `addQueryArgs( url, args )` that handles with `url` and `args` and returns the final url to different actions. The original implementation is the following, feel free to keep it or change it according to your needs.

```js
/**
 * External dependencies
 */
import { parse, format } from 'url';
import { parse as parseQueryString, stringify } from 'querystring';

/**
 * Appends arguments to the query string of the url
 *
 * @param  {String} url   URL
 * @param  {Object} args  Query Args
 *
 * @return {String}       Updated URL
 */
export function addQueryArgs(url, args) {
    const parsedURL = parse( url, true );
    const query = { ...parsedURL.query, ...args };
    delete parsedURL.search;

    return format( { ...parsedURL, query } );
}
```

[↑ Go up to Table of contents](#table-of-contents)

## Usage

We've tried to make it easy to import **gutenberg-js** modules to your apps.

```js
// Importing global variables that Gutenberg requires
import './globals';

// Importing editPost module
import { editPost } from '@frontkom/gutenberg-js';

// Don't forget to import the style
import '@frontkom/gutenberg-js/build/css/core-blocks/style.css';
import '@frontkom/gutenberg-js/build/css/style.css';
import '@frontkom/gutenberg-js/build/css/core-blocks/edit-blocks.css';
import '@frontkom/gutenberg-js/build/css/core-blocks/theme.css';

// DOM element id where editor will be displayed
const target = 'editor';

// Post properties
const postType = 'post'; // or 'page'
const postId = 123;

// Some editor settings
const settings = {
    alignWide: true,
    availableTemplates: [],
    allowedBlockTypes: true,
    disableCustomColors: false,
    disablePostFormats: false,
    titlePlaceholder: "Add title",
    bodyPlaceholder: "Write your story",
    isRTL: false,
    autosaveInterval: 10,
    ...
    // @frontkom/gutenberg-js settings
    canAutosave: false, // to disable Editor Autosave featured (default: true)
    canPublish: false,  // to disable Editor Publish featured (default: true)
    canSave: false,     // to disable Editor Save featured (default: true)
};

// Post properties to override
const overridePost = {};

// Et voilá... Initializing the editor!
editPost.initializeEditor(target, postType, postId, settings, overridePost);
```

**Note**: Gutenberg requires utf-8 encoding, so don't forget to add `<meta charset="utf-8">` tag to your html `<head>`.

[↑ Go up to Table of contents](#table-of-contents)

### Gutenberg Stores

Additionally, after initializing the editor, you can have access to Gutenberg stores (`core`, `core/blocks`, `core/data`, `core/edit-post`, `core/editor`, `core/viewport`) through the `data` module and its `select` and `dispatch` methods:

```js
// Importing select and dispatch methods from @frontkom/gutenberg-js package
import { data } from '@frontkom/gutenberg-js';

// Use dispatch to change the state of something
data.dispatch('core/edit-post').openGeneralSidebar('edit-post/block');
data.dispatch('core/edit-post').closeGeneralSidebar();

// Use select to get the state of something
data.select( 'core/editor' ).getEditedPostContent();
// <!-- wp:paragraph -->
// <p>Hello</p>
// <!-- /wp:paragraph -->

```

[↑ Go up to Table of contents](#table-of-contents)

### Registering Custom Blocks

You can create your custom blocks using the `registerBlockType` method from `blocks` module. Check out the example below and the Wordpress [documentation](https://wordpress.org/gutenberg/handbook/blocks/) to read more about it.

```js
import { blocks, editor } from '@frontkom/gutenberg-js';

const {
    AlignmentToolbar,
    BlockControls,
    RichText,
} = editor;

blocks.registerBlockType('custom/my-block', {
    title: 'My first block',
    icon: 'universal-access-alt',
    category: 'common',
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },
        alignment: {
            type: 'string',
        },
    },
    edit({ attributes, className, setAttributes }) {
        const { content, alignment } = attributes;

        function onChangeContent( newContent ) {
            setAttributes( { content: newContent } );
        }

        function onChangeAlignment( newAlignment ) {
            setAttributes( { alignment: newAlignment } );
        }

        return [
            <BlockControls>
                <AlignmentToolbar
                    value={ alignment }
                    onChange={ onChangeAlignment }
                />
            </BlockControls>,
            <RichText
                tagName="p"
                className={ className }
                style={ { textAlign: alignment } }
                onChange={ onChangeContent }
                value={ content }
            />
        ];
    },
    save({ attributes, className }) {
        const { content, alignment } = attributes;

        return (
            <RichText.Content
                className={ className }
                style={ { textAlign: alignment } }
                value={ content }
            />
        );
    },
});

```

[↑ Go up to Table of contents](#table-of-contents)

## Customize your Gutenberg

Following the same logic, we've created the `customGutenberg` global object where you can set eveything that we made customizable on Gutenberg.

```js
window.customGutenberg = { ... };
```

As the other global variables, `customGutenberg` should be defined **before** Gutenberg import.

Important to say that Gutenberg works perfectly without the settings of this object :)

[↑ Go up to Table of contents](#table-of-contents)

### Events

**gutenberg-js** makes possible to define callbacks (or effects) for Gutenberg actions. Since it is an experimental feature, we are only providing this for 'OPEN_GENERAL_SIDEBAR' and 'CLOSE_GENERAL_SIDEBAR' actions.

```js
window.customGutenberg = {
    ...,
    events: {
        'OPEN_GENERAL_SIDEBAR': function(action, store) {
            console.log( 'OPEN_GENERAL_SIDEBAR', action, store );
        },
        'CLOSE_GENERAL_SIDEBAR': function(action, store) {
            console.log( 'CLOSE_GENERAL_SIDEBAR', action, store );
        },
    },
    ...,
};
```

[↑ Go up to Table of contents](#table-of-contents)

## Gutenberg-js Lib

The Gutenberg JS library contains a bunch of blocks and components to complement and simplify your Gutenberg experience.

```js
import { lib } from '@frontkom/gutenberg-js';

console.log('blocks', lib.blocks);
console.log('components', lib.components);
```

[↑ Go up to Table of contents](#table-of-contents)

### Post block

The **Post Block** is another kind of blocks created by **gutenberg-js** which is composed by a cover image and a title.

```js
import {
    blocks,
    lib,
} from '@frontkom/gutenberg-js';

const postBlock = lib.blocks.post;

blocks.registerBlockType(postBlock.name, postBlock.settings);
```

We are trying to provide new types of blocks: **auto posts** and **hand-picked posts** which are experimental for now. Theose blocks are dynamic and the render must be implemented server-side.

[↑ Go up to Table of contents](#table-of-contents)

### Row block

Rows work like columns but they could be slipt in spots with different widths.

```js
import {
    blocks,
    lib,
} from '@frontkom/gutenberg-js';

const rowBlock = lib.blocks.row;

blocks.registerBlockType(rowBlock.name, rowBlock.settings);
```

[↑ Go up to Table of contents](#table-of-contents)

### Section block

**Section** is a row with just one column. You can add blocks inside and add classes to style that section.

```js
import {
    blocks,
    lib,
} from '@frontkom/gutenberg-js';

const sectionBlock = lib.blocks.section;

blocks.registerBlockType(sectionBlock.name, sectionBlock.settings);
```

After register the block and initialize the editor, you can set **Section** as default block:

```
import {
    data,
    lib,
} from '@frontkom/gutenberg-js';

data.dispatch('core/blocks').setDefaultBlockName(lib.blocks.section.name);
```

[↑ Go up to Table of contents](#table-of-contents)

### PostsPanel component

The **Posts Panel** contains a list of posts which could be filtered by category and/or searched be name. Posts can be added to your page as (Post block)[#post-block] by drag and drop.

```js
import {
    editPost,
    plugins,
    lib,
} from '@frontkom/gutenberg-js';

const { PluginDocumentSidebarPanel } = editPost;
const { PostsPanel } = lib.components;

const MyPluginDocumentSidebarPanel = () => (
    <PluginDocumentSidebarPanel
        className="my-plugin-post-publish-panel"
        title={ 'My Stories' }
        initialOpen={ true }
    >
        <PostsPanel />
    </PluginDocumentSidebarPanel>
);

plugins.registerPlugin('plugin-document-sidebar', {
    render: MyPluginDocumentSidebarPanel,
});
```

[↑ Go up to Table of contents](#table-of-contents)
