## Delivery Variability Hub
This chart shows how long each item took to be done.

###Environment configuration
>####Node
  https://nodejs.org
####Babel
	npm install --save-dev babel-cli
	npm install --save-dev babel-preset-es2015
####CharJS
	npm install --save-dev chart.json
	npm install --save-dev Chart.Annotation.js

###Package, Publish and Share
> Ref: https://www.visualstudio.com/en-us/docs/integrate/extensions/develop/add-dashboard-widget#step-6--package-publish-and-share
####Update the manifest file
	vss-extension.json
####Package the extension
	npm i -g tfx-cli
	cd <pasta da extensão onde o vss-extension.json está>
	tfx extension create
####Upload and Install
https://www.visualstudio.com/en-us/docs/marketplace/get-tfs-extensions#upload-to-team-foundation-server
	