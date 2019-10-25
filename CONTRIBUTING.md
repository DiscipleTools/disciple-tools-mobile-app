## Contributing to DiscipleTools Mobile App

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to DiscipleTools Mobile App and its associated files, which are hosted in the [DiscipleTools](https://github.com/DiscipleTools) on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

- [Code of Conduct](#code-of-conduct)
- How Can I Contribute?
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- Styleguides
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)
  - [Semantic Versioning](#semantic-versioning)
- [License](#license)

### Code of Conduct

This project and everyone participating in it is governed by the [DiscipleTools Mobile App Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [info@disciple.tools](mailto:info@disciple.tools).

### Reporting Bugs :bug::beetle::ant:

#### _Where to Find Known Issues_

We are using [GitHub Issues](https://github.com/DiscipleTools/disciple-tools-mobile-app/issues) for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.

#### _Reporting New Issues_

The best way to get your bug fixed is to follow our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). This template will help to speed up the process of reproducing and resolving the bug.

#### _Security Bugs_

DiscipleTools is a non-profit and does not have a bounty program for the safe disclosure of security bugs. That said, please do not file public issues for security bugs. Please report security issues to [info@disciple.tools](mailto:info@disciple.tools).

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/), including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :memo: and find related suggestions :mag_right:.

Please perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Aatom) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.  Otherwise, please proceed to create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of DiscipleTools Mobile App which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be useful** to most DiscipleTools Mobile App users.
* **List some other popular mobile applications where this enhancement exists.**
* **Specify which version of DiscipleTools Mobile App you're using.** You can find the exact version on either the splash screen or under the Settings Tab
* **Specify the name and version of the OS you're using.**

### Your First Code Contribution

Unsure where to begin contributing to DiscipleTools Mobile App? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner](https://github.com/DiscipleTools/disciple-tools-mobile-app/issues?q=is%3Aissue+is%3Aopen+label%3A%22beginner%22) - issues which should only require a few lines of code, and a test or two.
- [Help wanted](https://github.com/DiscipleTools/disciple-tools-mobile-app/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) - issues which should be a bit more involved than `beginner` issues.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

### Pull Requests

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We'll do our best to provide updates and feedback throughout the process.

Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from `development` (this is IMPORTANT! Many open source projects will ask you to fork from the `master` branch.  Please notice that we are specifying the `development` branch).
1. Run `yarn` in the repository root.
1. If you've fixed a bug or added code that should be tested, add tests!
1. Ensure the test suite passes (yarn test). Tip: `yarn test --watch TestName` is helpful in development.
1. If you need a debugger, run `yarn debug-test --watch TestName`, open `chrome://inspect`, and press “Inspect”.
1. Format your code with prettier (`yarn prettier`).
1. Make sure your code lints (`yarn lint`). Tip: `yarn linc` to only check changed files.
1. If you haven’t already, please take the time to read and understand the [LICENSE](#license)

### Git Commit Messages

- Use keywords to close issues automatically on commit (ref: https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords).
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

All JavaScript should adhere to [JavaScript Standard Style](https://standardjs.com/).

### Semantic Versioning

DiscipleTools Mobile App follows [semantic versioning](https://semver.org) (i.e., X.Y.Z). We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes.

### License

By contributing to DiscipleTools Mobile App, you agree that your contributions will be licensed under its [GNU General Public License v3.0](LICENSE).

Thanks! :heart::heart::heart:

[DiscipleTools](https://disciple.tools) Mobile App Team
