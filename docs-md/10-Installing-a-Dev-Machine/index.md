These are the softwares we'll use for the local development environment

## Node js
Node.js is an open-source, cross-platform JavaScript runtime environment for executing JavaScript code server-side.

Install it from: https://nodejs.org/en/

(For this demo we've used version 10.16.3 LTS)

## Postgres database   
We'll use the great and free database called Postgres

Download and install it from:
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

In this demo we've used Windows x86-64 version, 11.5

1. Download and run the setup.
2. Click next, next
4. In the `Select Components` screen, uncheck the `Stack Builder` we don't need it.

![](2019-09-22_18h11_31.png)

5. Next, next
7. You are prompted for a password, give it a password, and remember it (we'll need it later)
> (when creating this demo we used the password: MASTERKEY)

![enter password](2019-09-22_18h06_08.png)

From here on, just click next next next, till the setup is complete.

## Visual Studio Code 
A source code editor which we use to develop application.

Install it from: https://code.visualstudio.com/

#### Visual Studio Extentions
To install the following recommended extentions, open a command prompt and run the following commands:
```
code --install-extension Angular.ng-template
code --install-extension infinity1207.angular2-switcher
code --install-extension CoenraadS.bracket-pair-colorizer
code --install-extension eamodio.gitlens
code --install-extension sibiraj-s.vscode-scss-formatter
```

## Angular Cli
From the command prompt, run the following command to install angular cli with the specific version we used for this demo
```
npm install -g @angular/cli@7.3.5
```