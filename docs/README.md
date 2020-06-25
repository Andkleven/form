# Digital Coating Report 2.0 <!-- omit in toc -->

WIP...

## 📑 Table of Contents <!-- omit in toc -->
- [🎓 Prerequisites](#-prerequisites)
  - [General](#general)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [🚀 Quick start](#-quick-start)
- [🧪 Cross platform and user testing](#-cross-platform-and-user-testing)
  - [Local manual testing](#local-manual-testing)
  - [Remote manual testing](#remote-manual-testing)
  - [E2E](#e2e)

## 🎓 Prerequisites

### General

- Terminal ([Windows](https://www.youtube.com/watch?v=jbvqCqb-HJk), [Linux](https://www.suse.com/c/working-command-line-basic-linux-commands/), [Mac](https://www.youtube.com/watch?v=5XgBd6rjuDQ))
- [Node](https://nodejs.org/en/download/)

### Frontend

- [HTML and CSS](https://www.youtube.com/watch?v=vQWlgd7hV4A)
- [Sass](https://www.youtube.com/watch?v=Zz6eOVaaelI)
- [Javascript](https://www.youtube.com/playlist?list=PLDyQo7g0_nsX8_gZAB8KD1lL4j4halQBJ)
- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [React](https://www.youtube.com/watch?v=dGcsHMXbSOA)
  - [Router](https://www.youtube.com/watch?v=Law7wfdg_ls&t=1037s)
  - [State](https://www.youtube.com/watch?v=35lXWvCuM8o)

### Backend

- [Python](https://www.python.org/)
- [Django](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [GraphQL](https://graphql.org/)

## 🚀 Quick start

1. Install [VSCode](https://code.visualstudio.com/)
2. Install [Node](https://nodejs.org/en/download/)
3. Install [Git](https://git-scm.com/)
4. [Create a GitHub user](https://github.com/join)
5. Get access to the [repository](https://github.com/Andkleven/digital-coating-report-2.0) (will show 404 error if you do not have permission)
6. Open VSCode
7. Clone the repository

   1. Open the command palette (Windows shortcuts are <kbd>F1</kbd> or <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd>)
   2. Enter

      ```console
      Git: Clone
      ```

   3. Paste

      ```console
      https://github.com/Andkleven/digital-coating-report-2.0.git
      ```

   4. Select a place to store the project
   5. Follow instructions
   6. Press "yes" to open repository, or open manually

8. Open the [integrated terminal in VSCode](https://code.visualstudio.com/docs/editor/integrated-terminal)
   - Tip: The norwegian keyboard shortcut is <kbd>CTRL</kbd> + <kbd>Ø</kbd>
9. Install extensions:

      Windows

     1. Preferably, uninstall current extensions first:

        ```console
        code --list-extensions | % { code --uninstall-extension $_ }
        ```

     2. Then install extensions:

        ```console
        get-content extensions.txt | % { code --install-extension $_ }
        ```

     3. Close and reopen VSCode.

      Linux

     1. Preferably, uninstall current extensions first:

        ```console
        code --list-extensions | xargs -n 1 code --uninstall-extension
        ```

     2. Then install all extensions:

         ```console
         cat extensions.txt | xargs -n 1 code --install-extension
         ```

     3. Close and reopen VSCode.

      Other (or failed installation)
         
      All extensions used in the project are listed in `.vscode/extensions.txt`, so you can try [another method](https://stackoverflow.com/questions/35773299/how-can-you-export-the-visual-studio-code-extension-list) or install them manually.
      
      Optional
      
     1. Open the command palette (Windows shortcuts are <kbd>F1</kbd> or <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd>)

     2. Enter `Material Icons: Activate Icons`
     
     3. Open the command palette
     
     4. Enter `Preferences: Color Theme`
     
     5. Choose your Community Material Theme of choice (we recommend using a high contrast variant)

10.  Create a a file named `.env.development` at root, and add the following (feel free to use other tokens or backends):

```
FONTAWESOME_NPM_AUTH_TOKEN=CEFBEF8A-62EA-4EC8-A23C-890E68C06F65
REACT_APP_BACKEND=https://versjon2.herokuapp.com
```

11.  Install all node packages:

   ```console
   npm install
   ```

12. Start app:

   ```console
   npm start
   ```

12. To commit, push and pull you need to [enter your username and email for git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).

## 🧪 Cross platform and user testing

### Local manual testing

Live server is already installed if the [quick start](#-quick-tart) guide is followed, which enables devices on the same network to connect to the app.

_Warning: This may not work on public networks (e.g. school and work)!_

1. Start the server

   ```console
   npm start
   ```

2. Find your computer's local IP address

   The terminal should give you the local address like so:

   ```
   On Your Network:  http://IPADDRESS:PORT/
   ```

   If not, try the following:

   - Windows

     ```console
     ipconfig
     ```

   - Linux and Mac

     ```console
     ifconfig
     ```
   
   Copy paste the IPv4 address of your computer.

   Follow this [guide](https://lifehacker.com/how-to-find-your-local-and-external-ip-address-5833108) from the section *How to find your internal IP address* if you are having trouble.

3. Open a browser on a device to connect and enter the following address (make sure it's connected to the same network as the host):

   ```console
   http://IPADDRESS:PORT/
   ```

   For example:

   ```console
   http://192.168.0.36:5500/
   ```

### Remote manual testing

We have two alternatives for remote testing:

1. <a name="devServer"></a>TODO: Development server

2. [CodeSandbox](https://codesandbox.io/)   
   Warning: As of 19.06.2020, this doesn't work anymore  
   Note: You will need [CodeSandbox Pro](https://codesandbox.io/pricing) for this, because of privacy settings.  
   
   1. Open the repository in CodeSandbox  
      We recommend using chrome with this [extension](https://chrome.google.com/webstore/detail/open-in-codesandbox/jkhbnhagngalpojoeijaleemepfpefmp?hl=en).  
      Press <kbd>Open in CodeSandbox</kbd> on [GitHub](https://github.com/Andkleven/digital-coating-report-2.0)
   2. Press <kbd>Fork</kbd>
   3. Login to CodeSandbox on the device to test
   4. Enter the preview address in a browser
   5. Test away!
   
   If you want to share the link with someone who does not have access (e.g. a lead engineer for testing a feature) you may disable privacy and the preview link will be shareable:

   _Warning: The sandbox will be available for everyone with the link and the source code is accessible._

   1. Open `Template info`
   2. Change Privacy from `Private` to `Unlisted`  
      _Important: Never set this to `Public`!_
   3. Send link to recipient
   4. Test away!

   If you want the source code to be kept secret, you can deploy directly from CodeSandbox to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/), but we do not recommend using CodeSandbox for this (see [Development server](#devServer)). 

### E2E

[Taiko](https://docs.taiko.dev/) is used to perform end-to-end testing.

Windows:

To enable scripts on your system, you first have to ease up on some security.
[Open up PowerShell as an administrator](https://www.howtoedge.com/open-powershell-as-administrator-in-windows-10/), and run the following:

```console
Set-ExecutionPolicy RemoteSigned
```

Feel free to tighten up your security settings when done:

```console
Set-ExecutionPolicy Restricted
```

