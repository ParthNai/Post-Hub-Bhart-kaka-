# Project Rules & Workflow

## Automated GitHub Push Workflow
Whenever any code change, feature, fix, or update is implemented:
1. Validate the changes (run `flutter analyze` and `flutter test`).
2. Automatically sync all updated files to `c:\Users\AE\Desktop\Post Hub\mobile_app`.
3. In `c:\Users\AE\Desktop\Post Hub`, stage the changes, create a clean semantic commit, and push directly to GitHub (`origin main`) without waiting for the user to request it.
4. Report the commit hash and push confirmation in the final response.
