<p align="center">
  <br>
  <a href="https://yownes.com">
    <img src="https://raw.githubusercontent.com/yownes/yownes-docs/master/.vuepress/public/img/github/yownes-prestashop.jpg" width="400"/>
  </a>
</p>
<h1 align="center">Yownes</h1>
<h3 align="center">CMS Connect App for PrestaShop
</h3>

<p align="center">
  <a href="https://github.com/yownes/yownes"><img src="https://img.shields.io/badge/price-FREE-0098f7.svg" alt="Version"></a>
  <a href="https://discord.gg/C9vcTCQ"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Chat"></a>
</p>

<p align="center">
Show your :heart: - give us a :star: <br/> 
Help us grow this project to be the best it can be!
  </p>

**Yownes** is a <a href="//vuejs.org">VueJS powered</a> CMS agnostic SPA & PWA frontend for your old-fashioned Blog and E-commerce site.

**PrestaShop** is an efficient and innovative e-commerce solution with all the features you need to create an online store and grow your business.

**CMS Connect App** - adds the connection between the PrestaShop CMS and Yownes Web App via a GraphQL API.

## What does it do?

This is a PrestaShop module that connects the PrestaShop CMS with the Yownes Web App via a GraphQL API. When installed, you will be provided with a CMS Connect URL that you will add to your Yownes Web App during [setup](https://yownes.com/guide/setup.html).

## DEMO

[Yownes on PrestaShop](https://prestashop.yownes.com/)

![Yownes for PrestaShop admin panel](http://joxi.net/E2p1aYlS7JP05A.jpg)

### PrestaShop Blog (PrestaBlog)

Since PrestaShop does not have a built-in Blog, we use [PrestaBlog](https://addons.prestashop.com/en/blog-forum-new/4731-professional-blog.html) to add blog support. If PrestaBlog is not avalible, Yownes will ignore it.

## How to install?

Php version required >= 5.5, <= 7.2 (this limitation will be removed in the future)

### Quick Install

1. The quickest way to install is via PrestaShop Module Manager or manually [Download](https://github.com/yownes/prestashop/releases) the **compiled** module and upload it through the 'Modules > Module Manager > Upload a module' menu in PrestaShop
2. Activate the Module after installation is complete
3. Visit modules's configurations to get the CMS Connect URL

You will need the CMS Connect URL to complete the [Yownes Web App installation](https://yownes.com/guide/setup.html)

## Deploy Yownes Web App to hosting (static website)

### via Yownes Deploy service (recommended)

1. Install the Yownes CMS Connect App from this repo.
2. Log in or register an account with yownes.com
3. Build your first Web App
4. Activate the new Frontend Web App (only avalible for Apache servers)
   > For Nginx you need to add this code to your `nginx.config` file right after the `index` directive

```
location ~ ^((?!image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/).)*$ {
   try_files /yownes/$uri /yownes/$uri "/yownes${uri}index.html" /yownes$uri.html /yownes/200.html;
}
```

### via ftp manually

1. Install the Yownes CMS Connect App from this repo.
2. Log in or register an account with yownes.com
3. Copy the CMS Connect URL
4. Via Ftp create a new folder `yownes` in the root of your PrestaShop site on your hosting.
5. Via command line build your Yownes Web App ([read more](https://yownes.com/guide/setup.html))

```
yarn create yownes-app
# When promote, provide the CMS Connect URL, which you coppied at step 3.
yarn generate
```

6. Copy all files from folder `dist` to the newly created `yownes` folder
7. modify you `.htaccess` file by adding after `RewriteBase` rule the following rules:

```htaccess
# Yownes scripts, styles and images
RewriteCond %{REQUEST_URI} .*(_nuxt)
RewriteCond %{REQUEST_URI} !.*/yownes/_nuxt
RewriteRule ^([^?]*) yownes/$1
# Yownes sw.js
RewriteCond %{REQUEST_URI} .*(sw.js)
RewriteCond %{REQUEST_URI} !.*/yownes/sw.js
RewriteRule ^([^?]*) yownes/$1
# Yownes favicon.ico
RewriteCond %{REQUEST_URI} .*(favicon.ico)
RewriteCond %{REQUEST_URI} !.*/yownes/favicon.ico
RewriteRule ^([^?]*) yownes/$1
# Yownes pages
# Yownes home page
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/index.html -f
RewriteRule ^$ yownes/index.html [L]
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/index.html !-f
RewriteRule ^$ yownes/200.html [L]
# Yownes page if exists html file
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/$1.html -f
RewriteRule ^([^?]*) yownes/$1.html [L,QSA]
# Yownes page if not exists html file
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/$1.html !-f
RewriteRule ^([^?]*) yownes/200.html [L,QSA]
```

> For Nginx you need to add this code to your nginx.config file right after the index rule

```
location ~ ^((?!image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/).)*$ {
   try_files /yownes/$uri /yownes/$uri "/yownes${uri}index.html" /yownes$uri.html /yownes/200.html;
}
```

## Support

For support please contact us at [Discord](https://discord.gg/C9vcTCQ)

## Submit an issue

For submitting an issue, please create one in the [issues tab](https://github.com/yownes/yownes/issues). Remember to provide a detailed explanation of your case and a way to reproduce it.

Enjoy!
