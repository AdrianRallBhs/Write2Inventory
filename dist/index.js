"use strict";
// import * as core from '@actions/core';
// import * as github from '@actions/github';
// import * as fs from 'fs';
// import {  libraries } from './find-npm-packages';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRepoInfo = exports.runNPM = void 0;
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
const packageJson = require('../package.json');
const nuget_1 = require("./nuget");
// const NugetPackageInfos: NugetPackageInfo[][] = [];
// // let ListOfSourcesPlain: string[] = [];
// // ListOfSourcesPlain.push("https://api.nuget.org/v3/index.json");
// // let potNetProjectsPlain: string[] = [];
// // potNetProjectsPlain.push("./Blazor4/BlazorApp4/BlazorApp4/BlazorApp4.csproj");
// (async () => {
//     const dotNetProjects: string[] =  await findALLCSPROJmodules();
//     const ListOfSources: string[] = await getDotnetSources();
// const projectList = ['./Blazor4/BlazorApp4/BlazorApp4/BlazorApp4.csproj', './submarine/BlazorSubmarine/BlazorSubmarine/BlazorSubmarine.csproj'];
// const sourceList = ['https://api.nuget.org/v3/index.json'];
// //const results = await getAllNugetPackages(projectList, sourceList);
// const NugetPackageInfos = await getOutdatedPackages(dotNetProjects, ListOfSources);
// // const NugetPackageInfos = await getAllNugetPackages(projectList, sourceList);
// console.log(ListOfSources)
// console.log(JSON.stringify(NugetPackageInfos, null, 2));
// })();
// // // ========================does work==============================================
// let ListOfSubmodules: string[] = [];
// (async () => {
//     ListOfSubmodules = await getDotnetSubmodules();
//     if(ListOfSubmodules.length < 1) {
//         console.log("ListOfSubmodules is empty")
//     }
//     else {
//         ListOfSubmodules.forEach(submodule => {
//             console.log(`${submodule}`)
//         })
//         }
//     }
// )();
// //========================works fine=======================================
async function runNPM() {
    try {
        const token = core.getInput('github-token');
        const octokit = github.getOctokit(token);
        const { data: contents } = await octokit.rest.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: 'package.json',
        });
        const packages = packageJson.dependencies;
        const packageList = Object.keys(packages).map((name) => ({
            name,
            version: packages[name],
            repoName: github.context.repo.repo,
            owner: github.context.repo.owner,
        }));
        return packageList;
    }
    catch (error) {
        core.setFailed("Fehler in runNPM");
        return [];
    }
}
exports.runNPM = runNPM;
//   runNPM();
// ======================================================
async function runRepoInfo() {
    var _a, _b;
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);
    const context = github.context;
    const repo = ((_a = context.payload.repository) === null || _a === void 0 ? void 0 : _a.full_name) || '';
    const branch = core.getInput('branch-name');
    const { data: commit } = await octokit.rest.repos.getCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: branch,
    });
    const output = {
        repository: {
            name: repo,
            currentReleaseTag: '',
            license: '',
            sha: commit.sha,
        },
        npmPackages: [],
        nugetPackages: [],
        submodules: []
    };
    // Get repository info
    const { data: repository } = await octokit.rest.repos.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
    });
    const dotNetProjects = await (0, nuget_1.findALLCSPROJmodules)();
    const ListOfSources = await (0, nuget_1.getDotnetSources)();
    output.repository.currentReleaseTag = repository.default_branch;
    output.repository.license = ((_b = repository.license) === null || _b === void 0 ? void 0 : _b.name) || '';
    output.npmPackages = await runNPM();
    output.nugetPackages = await (0, nuget_1.getOutdatedPackages)(dotNetProjects, ListOfSources);
    output.submodules = await (0, nuget_1.getDotnetSubmodules)();
    // Write output to file
    const outputPath = core.getInput('output-path');
    try {
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        core.info(JSON.stringify(output, null, 2));
    }
    catch (error) {
        core.setFailed("WriteFileSync ist falsch");
    }
}
exports.runRepoInfo = runRepoInfo;
runRepoInfo();
