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
const packageJson = require('../package.json');
import { OctokitResponse } from '@octokit/types';

interface Packages {
    name: string;
    version: string;
    license: string;
    sha: string;
}

interface Repository {
    name: string;
    packages: Packages[];
    currentReleaseTag: string;
    license: string;
    sha: string;
}

interface NpmPackage {
    repoName: string;
    packageName: string;
    version: string;
}

interface NugetPackage {
    name: string;
    version: string;
    source: string;
    repoName: string;
    owner: string;
  }
  

// interface NugetPackage {
//     repoName: string;
//     packageName: string;
//     version: string;
// }

// interface Submodule {
//   repoName: string;
//   packageName: string;
//   tag: string;
// }

interface Output {
    repository: Repository;
    npmPackages: NpmPackage[];
    //npmPackages: string;
    nugetPackages: NugetPackage[];
    //nugetPackages: string;
    //submodules: Submodule[];
    //   submodules: string;
}


async function run() {
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);

    const context = github.context;
    const repo = context.payload.repository?.full_name || '';

    const branch = core.getInput('branch-name');
    const { data: commit } = await octokit.rest.repos.getCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: branch,
    });

    const output: Output = {
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
    output.repository.license = repository.license?.name || '';


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
        core.info(JSON.stringify(output, null, 2))
    } catch (error) {
        core.setFailed("WriteFileSync ist falsch")
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
    } catch (error) {
      core.setFailed("Fehler in runNPM");
    }
  }
  
  runNPM();


  async function runNuget() {
    
      // Get inputs
      const token = core.getInput('token', { required: true });
      const owner = github.context.repo.owner;
      const repo = github.context.repo.repo;
  
      // Initialize Octokit with authentication token
      const octokit = github.getOctokit(token);
  
      // Get contents of the repository's project file
      const contents: OctokitResponse<Record<string, any>> = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'project-file.csproj'
      });
  
      // Parse the project file contents to find all Nuget packages
      const projectFileContents = Buffer.from(contents.data.content, 'base64').toString();
      const packageRegex = /<PackageReference Include="(.*)" Version="(.*)" \/>\n/g;
      let match: any;
      const nugetPackages: NugetPackage[] = [];
      while ((match = packageRegex.exec(projectFileContents)) !== null) {
        nugetPackages.push({
          name: match[1],
          version: match[2],
          source: '',
          repoName: repo,
          owner: owner
        });
      }
  
      // Get Nuget package sources from nuget.config file
      const nugetConfig: OctokitResponse<Record<string, any>> = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'nuget.config'
      });
      const nugetConfigContents = Buffer.from(nugetConfig.data.content, 'base64').toString();
      const sourceRegex = /<add key="(.*)" value="(.*)" \/>/g;
      while ((match = sourceRegex.exec(nugetConfigContents)) !== null) {
        nugetPackages.forEach(pkg => {
          if (pkg.source === '' && match[1] === 'packageSource' && match[2].indexOf('nuget.org') === -1) {
            pkg.source = match[2];
          }
        });
      }
  
      // Print the Nuget packages in JSON format
      core.setOutput('nuget-packages', JSON.stringify(nugetPackages));
    } 
  
  
  runNuget();


// =====================================================================
