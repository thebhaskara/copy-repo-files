# copy-repo-files
Just to copy files from specified repo to destination folder

This script will help you to copy the files from the specified repo to the destination folder.

Nowadays, there are times when you need to have the source code with you rather than depend on the package manager to install the version for you.


## Installation

you can install as global dependency and use it from anywhere in the terminal.

```bash
$ npm install -g copy-repo-files
$ copy-repo-files git:lodash/lodash main dist/lodash.js ./src/lib/
```

or you could use npx to run the script without installing it globally.

```bash
$ npx copy-repo-files git:lodash/lodash main dist/lodash.js ./src/lib/
```

## Usage

```bash
$ copy-repo-files <repo> <branch> <file> <destination>
```

### repo:

The repository from which you want to copy the files. It should be in the format of `https://github.com/<username>/<repo>.git`

For github repos shortcut is `git:<username>/<repo>`

For bitbucket repos shortcut is `bitbucket:<username>/<repo>`


### branch: 
The branch from which you want to copy the files. This can be commit number or tag number that you can pass to the `git checkout` command.

### file: 
The file path you want to copy from the repo.

### destination: 
The destination folder where you want to copy the file. By default, it will copy the file to the current directory.


Note: 
- This copies only one file at a time. If you want to copy multiple files, you need to run the command multiple times.
- This does not copy all the dependencies of the file. You need to copy them manually if you need them.
- This does not copy the folder. You need to copy the folder manually if you need them.

## Usage - install

Above command copies the command information to package.json file. You can re-install the files using the below command.

```bash
$ npx copy-repo-files install
```


## Example

```bash
$ copy-repo-files git:lodash/lodash main dist/lodash.js ./src/lib/
```

## Show support by giving a ⭐️

If you like the project, please consider giving a star to this project. Thanks!

Create bugs and feature requests to improve the project. Thanks!

## License

BSD 3-Clause License

Copyright (c) 2024, Bhaskara Rama Sai Busam

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
