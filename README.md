# MCPR [![Greenkeeper badge](https://badges.greenkeeper.io/mcpr/mcpr.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/mcpr/mcpr.svg?branch=master)](https://travis-ci.org/mcpr/mcpr) [![Known Vulnerabilities](https://snyk.io/test/github/mcpr/mcpr/badge.svg)](https://snyk.io/test/github/mcpr/mcpr) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://mcpr.github.io/mcpr/tests/eslint-report) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/df5536c69d6d4e2fa54a9c874eb430d3)](https://www.codacy.com/app/nprail/mcpr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mcpr/mcpr&amp;utm_campaign=Badge_Grade)

The ultimate Minecraft plugin registry. 

## Project Status
|Stage              |Status     |
|-------------------|-----------|
|[Alpha Development](https://github.com/mcpr/mcpr/milestone/1)  |Current    |
|Public Alpha       |Current|
|[Beta Development](https://github.com/mcpr/mcpr/milestone/2)   |Not Started|
|Public Beta        |Not Started|

## Getting Started
### Run Localy
_This requires MongoDB to be installed._

First, clone the repository. 
```bash
$ git clone https://github.com/mcpr/mcpr.git
```
Then change to the directory of the repo and install the dependencies. 

```bash
$ cd mcpr
$ yarn install
```

Set configuration.
```bash
$ cp example.env .env
$ vi .env
```

Finally, run the Node server. 

```bash
$ yarn start
```

- Web App: [http://localhost:3000](http://localhost:3000)
- Web API: [http://localhost:3000/api](http://localhost:3000/api)


### Hosted Registry

- Web App: [https://registry.hexagonminecraft.com](https://registry.hexagonminecraft.com)
- Web API: [https://registry.hexagonminecraft.com/api](https://registry.hexagonminecraft.com/api)

## Documentation
You can find MCPR's documentation here:

[MCPR Docs](https://mcpr.github.io/mcpr)
## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our [code of conduct](CODE_OF_CONDUCT.md), and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/mcpr/mcpr/tags). 

## Authors

* **Noah Prail** - *Project Lead* - [@nprail](https://github.com/nprail)

See also the list of [contributors](https://github.com/mcpr/mcpr/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details