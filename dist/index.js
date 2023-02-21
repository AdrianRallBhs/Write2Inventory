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
exports.findALLCSPROJmodules = void 0;
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
const xml2js = __importStar(require("xml2js"));
const exec = __importStar(require("@actions/exec"));
async function run() {
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
            packages: [],
            currentReleaseTag: '',
            license: '',
            sha: commit.sha,
        },
        npmPackages: [],
        // npmPackages: '',
        nugetPackages: [],
        //nugetPackages: '',
        //submodules: [],
        //   submodules: '',
    };
    // Get repository info
    const { data: repository } = await octokit.rest.repos.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
    });
    output.repository.currentReleaseTag = repository.default_branch;
    output.repository.license = ((_b = repository.license) === null || _b === void 0 ? void 0 : _b.name) || '';
    //output.repository.packages.push(nugetFiles.toString()) || [];
    //Get NuGet packages
    // const { data: nugetFiles } = await octokit.rest.repos.getContent({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     ref: branch,
    //     path: '*.csproj',
    // });
    // // output.nugetPackages = nugetFiles.toLocaleString();
    // const nugetFileString = nugetFiles.toString();
    // core.info((Array.of(nugetFiles)).toString());
    // core.info(typeof (nugetFiles))
    // if (nugetFiles != undefined) {
    //     const packageFilesArray = Object.values(nugetFiles);
    //     if(packageFilesArray.length != 0) {
    //     for (const file of packageFilesArray) {
    //         const { data: nugetInfo } = await octokit.rest.repos.getContent({
    //             owner: context.repo.owner,
    //             repo: context.repo.repo,
    //             ref: branch,
    //             path: file.path,
    //         });
    //         const nugetContent = JSON.parse(Buffer.from(file.content, 'base64').toString());
    //         const packageNameRegex = /<PackageReference\s+Include="(.+)"\s+Version="(.+)"\s+\/>/g;
    //         let match;
    //         while ((match = packageNameRegex.exec(nugetContent))) {
    //             const [, packageName, version] = match;
    //             //original: output.nugetPackages.push({
    //             output.nugetPackages.push({
    //                 repoName: repo,
    //                 packageName,
    //                 version
    //             })
    //         }
    //     }
    // } else {
    //     core.info("Array2 leer");
    // }
    // } else {
    //     core.info("NugetFile is undefined")
    // }
    //   // Get submodules
    //   const { data: submodules } = await octokit.rest.repos.listSubmodules({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     ref: branch,
    //   });
    //   for (const submodule of submodules) {
    //     const { data: submoduleCommit } = await octokit.rest.repos.getCommit({
    //       owner: context.repo.owner,
    //       repo: submodule.name,
    //       ref: submodule.sha,
    //     });
    //     output.submodules.push({
    //       repoName: submodule.name,
    //       packageName: submodule.path,
    //       tag: submoduleCommit.sha,
    //     });
    //   }
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
run();
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
        console.log(JSON.stringify(packageList, null, 2));
    }
    catch (error) {
        core.setFailed("Fehler in runNPM");
    }
}
runNPM();
async function findALLCSPROJmodules() {
    try {
        // Checkout the repository including submodules
        await exec.exec('git', ['submodule', 'update', '--init', '--recursive']);
        // Use the `find` command to locate all `csproj` files
        let csprojFiles = '';
        const options = {
            listeners: {
                stdout: (data) => {
                    csprojFiles += data.toString();
                }
            }
        };
        await exec.exec('find', ['.', '-name', '*.csproj'], options);
        // Split the list of `csproj` files into an array of strings
        const csprojFileList = csprojFiles.trim().split('\n');
        // Output the list of `csproj` files found
        //core.info(`List of csproj files found: ${csprojFileList}`);
        return csprojFileList;
    }
    catch (_a) {
        return [];
    }
}
exports.findALLCSPROJmodules = findALLCSPROJmodules;
findALLCSPROJmodules();
async function getCsprojData(csprojPath) {
    const data = await fs.promises.readFile(csprojPath, 'utf-8');
    const parser = new xml2js.Parser();
    const parsedData = await parser.parseStringPromise(data);
    const projectName = parsedData.Project.PropertyGroup[0].AssemblyName[0];
    const projectGuid = parsedData.Project.PropertyGroup[0].ProjectGuid[0];
    const rootNamespace = parsedData.Project.PropertyGroup[0].RootNamespace[0];
    const targetFramework = parsedData.Project.PropertyGroup[0].TargetFramework[0];
    const packageReferences = parsedData.Project.ItemGroup[0].PackageReference;
    const nugetPackages = [];
    for (const packageReference of packageReferences) {
        const packageName = packageReference.$.Include;
        const packageVersion = packageReference.$.Version;
        const packageSource = packageReference.$.Source;
        const nugetPackage = {
            name: packageName,
            version: packageVersion,
            source: packageSource,
            repoName: process.env.GITHUB_REPOSITORY,
            owner: process.env.GITHUB_ACTOR
        };
        nugetPackages.push(nugetPackage);
    }
    const csprojData = {
        projectGuid,
        assemblyName: projectName,
        rootNamespace,
        targetFramework,
        nugetPackages
    };
    return csprojData;
}
const csprojPaths = await findALLCSPROJmodules();
const csprojData = [];
for (const csprojPath of csprojPaths) {
    const data = await getCsprojData(csprojPath);
    csprojData.push(data);
}
console.log(csprojData);
//   function findNetProjectDirectories(rootPath: string): string[] {
//     const csprojFiles = glob.sync('**/*.csproj', { cwd: rootPath, absolute: true });
//     const projectDirs = csprojFiles.map((csprojFile: string) => path.dirname(csprojFile));
//     return projectDirs;
//   }
//   function getCsprojFiles(dirPath: string): string[] {
//     const files = fs.readdirSync(dirPath);
//     const csprojFiles = files.filter(file => path.extname(file) === '.csproj');
//     return csprojFiles.map(file => path.join(dirPath, file));
//   }
//   function getSources(csprojPath: string): string[] {
//     const data = fs.readFileSync(csprojPath, 'utf-8');
//     const parser = new xml2js.Parser();
//     let sources: string[] = [];
//     parser.parseString(data, (err: any, result: any) => {
//       if (err) {
//         throw new Error(`Error parsing XML: ${err}`);
//       }
//       const project = result.Project;
//       sources = project.ItemGroup[0].Compile.map((file: any) => file.$.Include);
//     });
//     return sources;
//   }
//   function getNugetPackages(csprojPath: string): NugetPackage[] {
//     const data = fs.readFileSync(csprojPath, 'utf-8');
//     const parser = new xml2js.Parser();
//     let packages: NugetPackage[] = [];
//     parser.parseString(data, (err: any, result: any) => {
//       if (err) {
//         throw new Error(`Error parsing XML: ${err}`);
//       }
//       const project = result.Project;
//       if (project.ItemGroup && project.ItemGroup[0].PackageReference) {
//         packages = project.ItemGroup[0].PackageReference.map((pkg: any) => ({
//           name: pkg.$.Include,
//           version: pkg.$.Version,
//           source: pkg.$.Source,
//         }));
//       }
//     });
//     return packages;
//   }
//   function getProjectsInfo(dirPath: string): NugetProject[] {
//     const csprojFiles = getCsprojFiles(dirPath);
//     const projects = csprojFiles.map(csprojPath => {
//       const projectName = path.basename(csprojPath, '.csproj');
//       const sources = getSources(csprojPath);
//       const packages = getNugetPackages(csprojPath);
//       return { name: projectName, sources, packages };
//     });
//     return projects;
//   }
//   let paths = findNetProjectDirectories('../')
//   paths.forEach(element => {
//     getProjectsInfo(element)
//   });
// =====================================================================
