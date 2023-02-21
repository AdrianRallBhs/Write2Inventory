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
    repoName: string;
    packageName: string;
    version: string;
}

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


    // Get npm packages
    const { data: packageFiles } = await octokit.rest.repos.getContent({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: branch,
        path: 'package.json',
    });

    if(Array.isArray(packageFiles) && packageFiles.length > 0 ) {
        core.info("Length über 0")
    }
    //   const packageFiles: { path: string }[] = await getPackageFiles();
    const packageFileString = packageFiles.toString();
    core.info(`Array of packageFiles ${(Array.of(packageFiles)).toString()}`);
    core.info(typeof (packageFiles))

    if (packageFiles != undefined) {
        const packageFilesArray = Object.values(packageFiles);
        if(packageFilesArray.length != 0) {
        for (const packageFile of packageFilesArray) {
            const { data: packageInfo } = await octokit.rest.repos.getContent({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: branch,
                path: packageFile.path,
            });

            const packageData = JSON.parse(Buffer.from(packageFile.path, 'base64').toString());

            const somePackage: Packages = {
                name: packageData.name,
                version: packageData.version,
                license: packageData.license || '',
                sha: commit.sha,
            };

            output.repository.packages.push(somePackage);
            output.npmPackages.push({
                repoName: repo,
                packageName: packageData.name,
                version: packageData.version,

            });
        }
    }
    else {
        core.info("Array is empty");
    }
    } else {
        core.info("packageFiles is undefined");
    }




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

function fetch(apiUrl: string) {
    throw new Error('Function not implemented.');
}




// =====================================================================
