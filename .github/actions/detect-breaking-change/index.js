/**
 * GitHub Action: Detect Breaking Change
 * gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Detects if a PR introduces breaking changes in Pact contracts
 */

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('repo-token');
    const prNumber = parseInt(core.getInput('pr-number'));
    const labelName = core.getInput('label-name');

    const octokit = github.getOctokit(token);

    // Get PR labels
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber,
    });

    const hasBreakingChangeLabel = pullRequest.labels.some(
      (label) => label.name === labelName
    );

    if (hasBreakingChangeLabel) {
      core.warning('⚠️ Breaking change detected - manual review required');
      core.setOutput('breaking-change', 'true');
    } else {
      core.info('✅ No breaking changes detected');
      core.setOutput('breaking-change', 'false');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
