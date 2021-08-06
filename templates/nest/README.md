<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

VMO C3's [Nest](https://github.com/nestjs/nest) framework TypeScript starter template.

This template use REST API concept. The flow of simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (Create, Read, Update and Delete) applications can be described using the following steps:

1.  The **controllers** layer handles HTTP requests and delegates tasks to the services layer.
2.  The **services layer** is where most of the business logic lives.
3.  Services use **repositories / DAOs** to change / persist entities.
4.  Entities act as containers for the values, with setters and getters.

## Folder structure

```js
+-- config // Environment config files.
+-- src // Sources files
|   +-- auth
|   |   +-- guards // Guards.
|   |   +-- strategies // Authentication stratergies.
|   +-- common // Common files.
|   |   +-- constants // Common constants.
|   |   +-- decorators // Common decorators.
|   |   +-- interceptors // Common interceptors.
|   |   +-- response // General response definition.
|   |   +-- serializers // Common serializers.
|   +-- configs // Configurations folder.
|   |   +-- app // Application config.
|   |   +-- database // Database config.
|   +-- modules // Bussiness Modules.
|   |   +-- users // Example user module.
|   |   |   +-- dto // DTO (Data Transfer Object) Schema, Validation.
|   |   |   +-- user.entity.ts // TypeORM Entities.
|   |   |   +-- users.constants.ts // Example constants file.
|   |   |   +-- users.controller.ts // Example controller.
|   |   |   +-- users.module.ts // Example module file.
|   |   |   +-- users.repository.ts // Example repository.
|   |   |   +-- users.service.ts // Example service.
|   |   +-- ... // Other business modules.
+-- test // Jest testing.
+-- app.controller.ts // App controller.
+-- app.module.ts // App module file.
+-- app.service.ts // App service.
+-- main.ts // Main.
```

### File Naming for Class

```ts
export class PascalCaseSuffix {} //= pascal-case.suffix.ts
// Except for suffix, PascalCase to hyphen-case
class FooBarNaming {} //= foo-bar.naming.ts
class FooController {} //= foo.controller.ts
class BarQueryDto {} //= bar-query.dto.ts
```

### Interface Naming

```ts
// https://stackoverflow.com/questions/541912
// https://stackoverflow.com/questions/2814805
interface User {}
interface CustomeUser extends User {}
interface ThirdCustomeUser extends CustomeUser {}
```


## Setting up

### IDE/Editor

- IntelliJ WebStorm
- Any editor: Visual Studio Code, Sublime, Atom,...

### Environment variable
1. Create `.env` based on `config/sample.env`.
2. Modify `src/configs/configs.constants.ts` to import these environment values to the project.

### Database

- This template use <a href="https://typeorm.io/#/">TypeORM</a> as Object–relational mapping library. 
- TypeORM supports many database programs. 
- Detail configuration can be done in `src/configs/database/typeorm.config.ts`.
- By default, the project is configured to use PostgreSQL relational database management system.

### Intantiate a module

See <a href='https://docs.nestjs.com/recipes/crud-generator'>NestJS CRUD generator.</a>

- Default:

```bash
$ nest g resource modules/<module-name>
```

Select `REST API`. NestJS CLI will generate a boilerplate for the module.

- If the structure is more complex:
``` bash
$ nest g resource <module-name>
```
Copy the generated module to `src/modules/<your desired folder>`.

### Logging
- See <a href='https://docs.nestjs.com/techniques/logger'>NestJS Logger</a>.
- Internal Error Exceptions are automatically record in log files. Log file is saved daily, maximum 14 files with max size of each file is 20MB.

## Installation

### Install npm packages
```bash
$ npm install
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

### Swagger

```bash
# API, Swagger - src/swagger.ts
npm run doc:api #> http://localhost:3000/api
```
- This project ultilize <a href='https://docs.nestjs.com/openapi/cli-plugin'> NestJS's CLI Plugin </a>.
- Please aware that there is no need to put `@ApiProperty` decorator for every DTOs properties. For more information, please visit the link above.

## Dependency
```json
"dependencies": {
    "@nestjs/common": "^7.0.0",
    "@nestjs/config": "^0.5.0",
    "@nestjs/core": "^7.0.0",
    "@nestjs/jwt": "^7.2.0",
    "@nestjs/passport": "^7.1.0",
    "@nestjs/platform-express": "^7.0.0",
    "@nestjs/swagger": "^4.7.4",
    "@nestjs/typeorm": "^7.1.4",
    "@types/bcrypt": "^3.0.0",
    "@types/passport-facebook": "^2.1.10",
    "bcrypt": "^5.0.0",
    "class-transformer": "^0.3.1",
    "class-validator": "^0.12.2",
    "dotenv": "^8.2.0",
    "passport": "^0.4.1",
    "passport-facebook": "^3.0.0",
    "passport-google-oauth": "^2.0.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.0",
    "pg": "^8.5.0",
    "reflect-metadata": "^0.1.13",
    "rimraf": "^3.0.2",
    "rxjs": "^6.5.4",
    "swagger-ui-express": "^4.1.4",
    "tslint": "^6.1.3",
    "typeorm": "^0.2.29",
    "uuid": "^8.3.1"
  },
```

## License

  Nest is [MIT licensed](LICENSE).
