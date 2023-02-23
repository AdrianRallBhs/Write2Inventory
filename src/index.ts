// import * as core from '@actions/core';
// import * as github from '@actions/github';
// import * as fs from 'fs';
// import {  libraries } from './find-npm-packages';

// interface Packages {
//     name: string;
//     version: string;
//     license: string;
//     sha: string;
// }

// interface Repository {
//     name: string;
//     packages: Packages[];
//     currentReleaseTag: string;
//     license: string;
//     sha: string;
// }

// interface NpmPackage {
//     repoName: string;
//     packageName: string;
//     version: string;
//     license: string;
//     sha: string;
// }

// // interface NpmPackage extends Array<NpmPackage>{}

// interface NugetPackage {
//     repoName: string;
//     packageName: string;
//     version: string;
//     license: string;
//     sha: string;
// }
// interface NugetPackage extends Array<NugetPackage>{}

// // interface Submodule {
// //   repoName: string;
// //   packageName: string;
// //   tag: string;
// // }

// interface Output {
//     repository: Repository;
//     // npmPackages: NpmPackage[];
//      npmPackages: string;
//     // nugetPackages: NugetPackage[];
//      nugetPackages: string;
//     //submodules: Submodule[];
// }


// async function run() {
//     const token = core.getInput('github-token');
//     const octokit = github.getOctokit(token);

//     const context = github.context;
//     const repo = context.payload.repository?.full_name || '';
//     const pathOfPackageLock: string = './package.json';

//     const branch = core.getInput('branch-name');
//     const { data: commit } = await octokit.rest.repos.getCommit({
//         owner: context.repo.owner,
//         repo: context.repo.repo,
//         ref: branch,
//     });

//     const output: Output = {
//         repository: {
//             name: repo,
//             packages: [],
//             currentReleaseTag: '',
//             license: '',
//             sha: commit.sha,
//         },
//         //    npmPackages: [],
//         npmPackages: '',
//         //   nugetPackages: [],
//         nugetPackages: '',
//         //submodules: [],
//     };


//     // Get repository info
//     const { data: repository } = await octokit.rest.repos.get({
//         owner: context.repo.owner,
//         repo: context.repo.repo,
//     });



//     output.repository.currentReleaseTag = repository.default_branch;
//     output.repository.license = repository.license?.name || '';


//     // Get npm packages
//     const { data: packageFiles } = await octokit.rest.repos.getContent({
//         owner: context.repo.owner,
//         repo: context.repo.repo,
//         ref: branch,
//         path: pathOfPackageLock,
//     });


//     for (const file of packageFiles as any[]) {
//             const { data: packageInfo } = await octokit.rest.repos.getContent({
//                 owner: context.repo.owner,
//                 repo: context.repo.repo,
//                 ref: branch,
//               //   path: file.path,
//               path: pathOfPackageLock,
//               }); 


//         const packageData = JSON.parse(Buffer.from(packageInfo.toString(), 'base64').toString());
//         core.info(packageData);

//         const somePackage: Packages = {
//           name: packageData.name,
//           version: packageData.version,
//           license: packageData.license || '',
//           sha: commit.sha,
//         };

//         output.repository.packages.push(somePackage);
//         output.npmPackages.push({
//           repoName: repo,
//           packageName: packageData.name,
//           version: packageData.version,
//           license: packageData.license,
//           sha: commit.sha,
//         });
//     // });
//       }

//     // Get NuGet packages
//     const { data: nugetFiles } = await octokit.rest.repos.getContent({
//         owner: context.repo.owner,
//         repo: context.repo.repo,
//         ref: branch,
//         path: 'README.md',
//     });

//     //   core.info(nugetFiles.toString());
//     //   output.nugetPackages = nugetFiles.toLocaleString();

//     // for (const file of nugetFiles as any[]) {
//         // const { data: nugetInfo } = await octokit.rest.repos.getContent({
//         //     owner: context.repo.owner,
//         //     repo: context.repo.repo,
//         //     ref: branch,
//         //     path: file.path,
//         // });

//         // const nugetContent = Buffer.from(nugetInfo, 'base64').toString();

//         // const packageNameRegex = /<PackageReference\s+Include="(.+)"\s+Version="(.+)"\s+\/>/g;
//         // let match;

//         // while ((match = packageNameRegex.exec(nugetContent))) {
//         //   const [, packageName, version] = match;
//         //original: output.nugetPackages.push({
//         // output.nugetPackages.push({
//         //     repoName: repo,
//         //     packageName,
//         //     version,
//         //     license: '',
//         //     sha: commit.sha,
//         // })
//     // }
//     //   }


//     //   // Get submodules
//     //   const { data: submodules } = await octokit.rest.repos.listSubmodules({
//     //     owner: context.repo.owner,
//     //     repo: context.repo.repo,
//     //     ref: branch,
//     //   });

//     //   for (const submodule of submodules) {
//     //     const { data: submoduleCommit } = await octokit.rest.repos.getCommit({
//     //       owner: context.repo.owner,
//     //       repo: submodule.name,
//     //       ref: submodule.sha,
//     //     });

//     //     output.submodules.push({
//     //       repoName: submodule.name,
//     //       packageName: submodule.path,
//     //       tag: submoduleCommit.sha,
//     //     });
//     //   }

//     // Write output to file
//     const outputPath = core.getInput('output-path');
//     try {
//         fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
//         core.info(JSON.stringify(output, null, 2))
//     } catch (error) {
//         core.setFailed("WriteFileSync ist falsch")
//     }
// }

// run();

















// ===========================================================







import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import { promises as fsprom } from 'fs';
const packageJson = require('../package.json');
import { OctokitResponse } from '@octokit/types';
import glob from 'glob';
import path from 'path';
import * as xml2js from 'xml2js';
import * as exec from '@actions/exec'
import {getNugetPackageInfoFromAssets, getAssetFile} from './get-assets-nuget'
import { getDotnetSources, getNugetPackageListFromCsprojDoc, getDotnetSubmodules, findALLCSPROJmodules, getAllNugetPackages, getOutdatedPackages} from './nuget'
import semver from 'semver/classes/semver';
import * as child_process from 'child_process';


// ======================geht nicht wie gewünscht==================================

//   export async function findALLCSPROJmodules(): Promise<string[]> {
//     try {
//       // Checkout the repository including submodules
//       await exec.exec('git', ['submodule', 'update', '--init', '--recursive']);
  
//       // Use the `find` command to locate all `csproj` files
//       let csprojFiles = '';
//       const options = {
//         listeners: {
//           stdout: (data: Buffer) => {
//             csprojFiles += data.toString();
//           }
//         }
//       };
//       await exec.exec('find', ['.', '-name', '*.csproj'], options);
  
//       // Split the list of `csproj` files into an array of strings
//       const csprojFileList = csprojFiles.trim().split('\n');  
//       return csprojFileList;
//     } catch {
//       return [];
//     }
//   }

//   (async () => {
//   console.log(findALLCSPROJmodules());
// })();

// ===========================================================


// (async () => {
//     const ListOfModules = await findALLCSPROJmodules();
//     if (ListOfModules.length < 1) {
//         console.log("ListOfModules is empty");
//     }
//     else {
//         for (const element of ListOfModules) {
//             const packageList = await getNugetPackageListFromCsprojDoc(element.substring(2));
//             console.log(`PackageList: ${packageList}`);
//         }
//     }
// })();

// ============================works for submodules too===========================================
const dotNetProjects: string[] = [];
(async () => {
    const dotNetProjects: string[] = await findALLCSPROJmodules();
    if (dotNetProjects.length < 1) {
        console.log("dotNetProjects is empty")
    }
    else {
        dotNetProjects.forEach(project => {
            console.log(`${project}`)
        })
    }
})();

// ========================funktioniert===================================

let ListOfSources: string[] = [];


(async () => {
    ListOfSources = await getDotnetSources();
    if(ListOfSources.length < 1) {
        console.log("ListOfsources is empty")
    }
    else {
        ListOfSources.forEach(source => {
            console.log(`${ListOfSources}`)
        })
            
        }
})();

// ===========================works ===========================================
type NugetPackageInfo = {
    project: string;
    source: string;
    packageName: string;
    currentVersion: string;
    resolvedVersion: string;
    latestVersion: string;
  }

const NugetPackageInfos: NugetPackageInfo[][] = [];
let ListOfSourcesPlain: string[] = [];
ListOfSourcesPlain.push("https://api.nuget.org/v3/index.json");
let potNetProjectsPlain: string[] = [];
potNetProjectsPlain.push("./Blazor4/BlazorApp4/BlazorApp4/BlazorApp4.csproj");

(async () => {
//     const projectList = ['./Blazor4/BlazorApp4/BlazorApp4/BlazorApp4.csproj'];
// const sourceList = ['https://api.nuget.org/v3/index.json'];

// const allPackages = await getAllNugetPackages(projectList, sourceList);
// const outdatedPackages: NugetPackageInfo[] = [];

const projectList = ['./Blazor4/BlazorApp4/BlazorApp4/BlazorApp4.csproj', './submarine/BlazorSubmarine/BlazorSubmarine/BlazorSubmarine.csproj'];
const sourceList = ['https://api.nuget.org/v3/index.json'];

const results = await getAllNugetPackages(projectList, sourceList);


const output = child_process.execSync(`dotnet list ${projectList[0]} package --highest-minor --outdated --source ${sourceList[0]}`);

const NugetPackageInfos = await getOutdatedPackages(projectList, sourceList);
console.log(JSON.stringify(NugetPackageInfos, null, 2));

        // NugetPackageInfos.forEach(packageInfo => {
        //     console.log(`Results for project: ${packageInfo[0].project}`);
        //     packageInfo.forEach(DetailedpackageInfo => {
        //         console.log(`Package: ${DetailedpackageInfo.packageName}, Current Version: ${DetailedpackageInfo.currentVersion}`);
        //       });
        // })
})();



// // ========================does work==============================================
let ListOfSubmodules: string[] = [];
(async () => {
    ListOfSubmodules = await getDotnetSubmodules();
    if(ListOfSubmodules.length < 1) {
        console.log("ListOfSubmodules is empty")
    }
    else {
        ListOfSubmodules.forEach(submodule => {
            console.log(`${submodule}`)
        })
           
        }
    }
)();




//========================works fine=======================================


// async function runNPM() {
//     try {
//       const token = core.getInput('github-token');
//       const octokit = github.getOctokit(token);
  
//       const { data: contents } = await octokit.rest.repos.getContent({
//         owner: github.context.repo.owner,
//         repo: github.context.repo.repo,
//         path: 'package.json',
//       });
  
//       const packages = packageJson.dependencies;
  
//       const packageList = Object.keys(packages).map((name) => ({
//         name,
//         version: packages[name],
//         repoName: github.context.repo.repo,
//         owner: github.context.repo.owner,
//       }));
  
//       console.log(JSON.stringify(packageList, null, 2));
//     } catch (error) {
//       core.setFailed("Fehler in runNPM");
//     }
//   }
  
//   runNPM();


