# Contributing

Thanks for considering contributing to Calify! Together, we can make a super-useful, super-convienient tool for all University of Melbourne students to use to organise their semester.

You will need a [*GitHub account*](https://github.com/signup/free) to contribute to this repository. 

## Contents
  - [Submitting an issue](#submitting-an-issue)
  - [Contributing directly (submitting a pull request)](#contributing-directly-submitting-a-pull-request)
    - [**Step 1:** Fork this repository to your own account.](#step-1-fork-this-repository-to-your-own-account)
    - [**Step 2:** Make your changes in your fork.](#step-2-make-your-changes-in-your-fork)
    - [**Step 3**: *(important!)* Test your changes locally!](#step-3-important-test-your-changes-locally)
    - [**Step 4:** Submit a pull request.](#step-4-submit-a-pull-request)

## Submitting an issue
We welcome people to contribute by submitting issues.

It is appropriate to submit an issue if:

- you have found a bug or discrepancy somewhere, or
- you have a suggestion for a new feature, or
- you have some other idea about Calify.

Before you submit an issue, please double-check to make sure that you aren't duplicating another issue that has already been submitted. If the issue you want to file is similar to one that already exists, please leave a comment with more information in the existing one.

If you have found a new issue, or have a new suggestion, please be as detailed as possible when you are describing it.

This includes (but is not limited to)  
- [ ] Having an informative issue title  
- [ ] Describing the issue in detail in the body  
- [ ] Tag your issue appropriately (e.g. `bug` or `enhancement`)
- [ ] Detailing your OS, browser, browser version, etc.  
- [ ] If the issue occurs with specific classes or lectures, detailing the classes they are (e.g. subject name, lecture time, class code, etc.)  
- [ ] For feature suggestions, detailing how the feature might work.

## Contributing directly (submitting a pull request)
We also welcome pull requests! 

If you have an idea or a bug fix and want to contribute by implementing yourself, you can do so through the magic of PRs. (If you're trying to contribute a new feature, I would prefer it if you submitted an issue first before putting in the effort to write a PR.)

You can't directly push commits to this repository. Instead, you have to fork this repo, push your commits to the fork and then ask nicely (submit a detailed PR) for me to merge it in.

### **Step 1:** Fork this repository to your own account.
You can do this by pressing the 'Fork' button in the top right corner of the page.

### **Step 2:** Make your changes in your fork.
This is probably going to mean cloning the repo to your machine and making changes there, but if you've come up with a new, novel way to write code then go for it.

**Please make your commit messages useful.** Each commit should be one logical unit or change. 

Please also make your code high quality. This means using descriptive variable names, adding comments in hard-to-decipher areas, and so on. This makes it easier for me to understand your code when I'm looking over your PR, and eventually makes it easier for you to get your PR merged into the main branch.

### **Step 3**: *(important!)* Test your changes locally!
Please **test your changes on your machine** before submitting a pull request. This includes testing different options, making sure options reset works, and so on.

Non-working pull requests (or ones that break stuff) will not get merged in.

If you have Python 3 installed, you can easily spin up a http server locally by using the command `python -m http.server` which serves the current directory on `localhost:8000` by default. 

### **Step 4:** Submit a pull request.
Once you have committed and pushed your changes to your fork, tested them, and are happy with how everything looks, you may submit a pull request. GitHub themselves have a useful guide on [how to submit a PR from your fork](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork).

Similarly to issues, make your pull requests high quality.

This includes (but is not limited to)  
- [ ] Having an informative PR title  
- [ ] Describing the issue that you are solving in detail in the body  
- [ ] Describing what caused the issue and what you did to fix it
- [ ] In the case of new features, outlining what the feature is, how it works, and why it is be useful.

Once you submit a pull request, please wait for me to look over it and test it myself before merging it in.