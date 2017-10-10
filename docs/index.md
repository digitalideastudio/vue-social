### Vue Social Components

##### About
Vue Social Components is a VueJS package which consists of various [SFC](https://vuejs.org/v2/guide/single-file-components.html) components which could be used on social-network-like websites.
We build it for our use inside our company but wanted to share with others.
Please don't hesitate to file any bug/feature requests related to the package.  
 
##### Install
To install the package, you can run the following command:
###### Npm
`npm i -S vue-social-components`
###### Yarn
`yarn vue-social-components`

##### Use
In order to use any component all you need is just refer to the component you want, for example:
```
<template>
    <cover-image></cover-image>
</template>

<script>
import CoverImage from `vue-social-components/src/components/cover-image`;

export default {
    components: {
        CoverImage,
    },
};
</script>
``` 

##### Contribute
Any PRs are welcome! Feel free to submit any issues and suggest your creative ideas to make this package even better!

##### License
The packages is running under `MIT License`. See LICENSE file for details.