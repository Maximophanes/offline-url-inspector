# Maintenance guidance

Read these instructions after context compaction. Check the branch, working tree and requested scope; preserve existing work.

These project rules supplement the global guidance. [README.md](README.md) provides the project overview and reference index; use its linked contracts as needed rather than maintaining another project-reference file.

Make the smallest clear, maintainable change. Avoid unrelated refactoring, new infrastructure, release candidates, repeated audits and new reports unless requested or justified by a concrete problem.

Preserve the approved single combined Blackberry & Amethyst design, typography, native interactions, accessibility and collapsed disclosures; there are no separate themes or theme switch. Follow [AUTOMATIC_FINDINGS.md](AUTOMATIC_FINDINGS.md): the strongest meaningful supported finding leads, and every independent security finding retains caution treatment. Distinguish unsupported eligibility and interrupted component checks; preserve comparison sources and verified evidence without serialized engineering state in ordinary results. Never infer safety from popularity or absent resemblance.

Preserve offline operation, no inspected-destination requests, safe text rendering, sensitive-value controls, Reference Domains, storage compatibility and backup import/export. Preserve pinned data, provenance, licenses and Deno 2.9.7 reproduction.

Test according to risk. Systematic Result & Messaging Validation means checking meaningful cross-feature priority, coverage and privacy combinations when results change. Use focused regressions for changed behavior and native Firefox for meaningful visual changes.

Keep previews and temporary outputs outside the repository. Do not rewrite historical assertions merely to obtain passing results; historical suites are not mandatory maintenance gates.

Keep changes local, unstaged and uncommitted. Obtain explicit authorization before commits, pushes, destructive changes or production deployments.
