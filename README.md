# Purpose
Improve the mobile user experience (UX) of GCdocs by creating ActiveViews designed for small screens.

# Folders
* **/demo:** proof-of-concept that ActiveViews could successfully create mobile friendly screens for GCdocs.
* **/deploy:** iMacro script used to deploy ActiveViews to GCdocs servers.
* **/src:** ActiveView source files to deploy to Content Server.
* **/template:** static HTML, CSS, JS and images.  The ActiveViews depend on the `/dist` folder this project's `npm run build` creates.
    * **/template/features:** behavioural, visual regression and accessibility tests.

# Instructions
You can read more about how to setup and configure the ActiveViews in the [instructions doc](/GCDOCSASP/Mobile/Mobility-ActiveView/blob/master/demo/GCDocs_ActiveView%20Instructions.docx).

# CI / CD
The pipeline creates a zip file that contains the:

* Static CSS/JS/image assets,
* ActiveViews, and
* iMacro deploy scripts.

That being said, download of the artifact is blocked on corporate notebooks (JavaScript files are identified as viruses).  To get around this, you can use `curl` or PowerShell:
```powershell
Invoke-WebRequest -Headers @{"PRIVATE-TOKEN" = "<GITLAB_PRIVATE_TOKEN>"} -Method GET -Uri https://gccode.ssc-spc.gc.ca/api/v4/projects/6648/jobs/artifacts/<BRANCH_NAME>/download?job=dist-default -o mobile.zip

```