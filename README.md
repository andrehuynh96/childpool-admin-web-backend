# Code base
 
## Coding Principle and Convention

- Group related files by directory, it's easy to focusing on small portions and
    avoid complexity
  + Organize files by feature not by function.
  + Store the test files next to the code.
- Be pragmatic modules: the node philosophy about **small modules** and **single
    purpose modules**
  + Only build modules as needed follow YANGI principle
- Place Your Test Files Next to The Implementation
- Put your long npm scripts in a scripts directory
- Reduce cross-cutting coupling with Events
- Code flow is followable -  magic directories in the filesystem. The app starts at **app/server.js** and you can see everything it loads and executes by following the code.
  + Don't do magic things
  + Don't autoload files from
  + Don't do silly metaprogramming
- Be easy to locate code
  + Name are meaningful and accurate
  + Crufty code is fully removed, not left around in a orphan file or just
      commented out
- Use simple and obvious naming
- Use lower-kebab-case filenames
  + Npm forbids uppercase in new package names.
  + This format avoids filesystem case sensitivity issues across platforms
- Variable name must be camelCase

## Source Code Structure

```
# NodeJs Project Structure
.
|-- app/
|   |-- config/
|   |   |-- index.js
|   |-- feature/
|   |   |-- register/
|   |   |   |-- register.controller.js
|   |   |   |-- register.route.js
|   |   |   |-- register.spec.js
|   |   |   |-- register.request-schema.js
|   |   |   |-- register.response-schema.js
|   |   |-- index.js
|   |-- lib/
|   |   |-- logger/
|   |-- middleware/
|   |   |-- validator.middleware.js
|   |-- model/
|   |   |-- user.js
|-- scripts
|  |-- preinstall.js                    # Run before npm install
|  |-- postinstall.js                   # Run after npm install
|-- package.json
|-- package-lock.json
|-- index.js
|-- server.js
|-- pm2.js
|-- env.default                        # Default config for all env
|-- README.md
|-- .eslintrc.js
|-- .gitignore
```
 

## Configuration

> Zero Config
> https://12factor.net/config

- Separation of config from code
- Should store config in environment variables. It's easy to change between deploy
- Without chaning any code
- Should ignore NODE_ENV variable
- Generally code modules to expect only a basic JavaScript **options** object passed in.
 
# Starting Project

### Create config file
Create `.env` file. Copy content from `.evn.default` into `.env`. Change config in `.env` corresponding to your environment 

### Install package
```
npm instal 
```

### Run
```
node index.js
```
- Default server will be started at http://127.0.0.1:3001
- Swagger link http://127.0.0.1:3001/web/api-docs/#/


### Testing
```
node run test
```

# Migration 
When you want to change DB then you have to create migration file.

## Migration config
All configs related to migration in `.sequelizerc`


## Create Migration 
- In order to create migration then you run command below
```
sequelize migration:create --name name-of-migration || npx sequelize-cli migration:create --name name-of-migration
```

- New file migration will be in `app/model/wallet/migration`

- The format of migration file
```javascript
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */ 
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */ 
  }
};
```
- More commands please look at https://sequelize.readthedocs.io/en/latest/docs/migrations/#the-cli
 jV3z2Hd8Vf8DixXu
 