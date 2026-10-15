# Claude Code in GitHub (OAuth) – setup for one repo

Lets you mention `@claude` in an issue or PR comment and have Claude Code act on it through GitHub Actions. This guide uses an OAuth token from a Claude Pro/Max subscription instead of an API key.

## One-time prerequisites

- Claude Pro or Max subscription, with Claude Code installed locally.
- `gh` CLI authenticated (`gh auth status`), with admin rights on the repo.
- The Claude GitHub App installed on the repo: <https://github.com/apps/claude> → Configure → select the repo.

## Setup per repo (about 3 minutes)

### 1. Create the workflow

Save as `.github/workflows/claude.yml`:

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          additional_permissions: |
            actions: read
```

### 2. Generate the OAuth token

```
claude setup-token
```

Sign in at the browser prompt and copy the `sk-ant-oat01-...` token.

### 3. Store it as a repo secret

```
gh secret set CLAUDE_CODE_OAUTH_TOKEN
```

Paste the token at the prompt. Don't use `--body`, so the token stays out of your shell history and out of any chat.

### 4. Commit and push to the default branch

Issue-triggered workflows only run from the default branch.

```
git add .github/workflows/claude.yml
git commit -m "Add Claude Code workflow"
git push
```

### 5. Test

Create an issue containing `@claude` plus a task, then watch it:

```
gh run watch
```

## Demo tips

- Before a demo, check that the secret exists: `gh secret list` should show `CLAUDE_CODE_OAUTH_TOKEN`.
- Don't use `/install-github-app` for this. It writes an `ANTHROPIC_API_KEY` secret and API-key workflows. If you do use it, replace `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}` with the OAuth line above.
- A `skipped` run is normal. It means the comment didn't contain `@claude`.
- Usage counts against your subscription limits, not API credit.
- If the token is revoked or expires, regenerate it with `claude setup-token` and run `gh secret set CLAUDE_CODE_OAUTH_TOKEN` again.

## Troubleshooting

The default output only says `Claude result reported subtype success with is_error:true`. To see the real error, add this under `with:` in the workflow:

```yaml
          show_full_output: true
```

Then read the failed run's log:

```
gh run list --workflow claude.yml --limit 3
gh run view <run-id> --log-failed
```

Remove `show_full_output` afterwards, because it prints full output to the Actions log.

Known cause seen before: with an API key, the run failed with `"error": "billing_error"` and `"result": "Credit balance is too low"` even though the key worked outside GitHub. Switching to the OAuth token fixed it.

## Security

- Never paste tokens or keys into chat or commit them.
- If one leaks, revoke it right away. API keys are revoked in the Anthropic Console. Delete a leaked secret with `gh secret delete <NAME>`.
- If you demo on someone else's machine, revoke the OAuth token afterwards.
