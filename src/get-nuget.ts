import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';
import * as execute from "@actions/exec";
import * as xml2js from "xml2js";
import { promisify } from "util";
import { exec } from 'child_process';
import { DotnetCommandManager } from './dotnet-command-manager'


interface PackageReference {
    Include: string;
    Version: string;
}

interface Project {
    ProjectName: string;
    ProjectPath: string;
    RepoOwner: string;
    RepoName: string;
    NugetSources: string[];
    NugetPackages: {
        Name: string;
        Version: string;
        Source: string;
    }[];
}

// export async function getAssetFile(): Promise<string[]> {
//     try {
//         // Checkout the repository including submodules
//         await execute.exec('git', ['submodule', 'update', '--init', '--recursive']);

//         // Use the `find` command to locate all `csproj` files
//         let assertsFiles = '';
//         const options = {
//             listeners: {
//                 stdout: (data: Buffer) => {
//                     assertsFiles += data.toString();
//                 }
//             }
//         };
//         await execute.exec('find', ['.', '-name', '*.assets.json'], options);

//         // Split the list of `asserts.json` files into an array of strings
//         const assertFilesList = assertsFiles.trim().split('\n');

//         // Output the list of `csproj` files found
//         //core.info(`List of csproj files found: ${assertFilesList}`);

//         return assertFilesList;
//     } catch {
//         return [];
//     }
// }


interface CsprojData {
    repoOwner: string;
    repoName: string;
    csprojFilePath: string;
    csprojData: any;
}

interface NugetPackageData {
    nugetName: string;
    nugetVersion: string;
    nugetSource: string;
    path: string;
}

export async function FindCSProjects(rootPath: string): Promise<CsprojData[]> {
    const result: CsprojData[] = [];
    const files = await promisify(fs.readdir)(rootPath);

    for (const file of files) {
        const filePath = path.join(rootPath, file);
        const stat = await promisify(fs.stat)(filePath);

        if (stat.isDirectory()) {
            const childResults = await FindCSProjects(filePath);
            result.push(...childResults);
        } else if (path.extname(filePath).toLowerCase() === ".csproj") {
            const repoOwner = path.basename(rootPath);
            const repoName = path.basename(path.dirname(rootPath));
            const data = await promisify(fs.readFile)(filePath, "utf8");
            const csprojData = await promisify(xml2js.parseString)(data);
            result.push({
                repoOwner,
                repoName,
                csprojFilePath: filePath,
                csprojData,
            });
        }
    }

    return result;
}

export async function getNugetPackageInfoFromCsproj(
    csprojData: CsprojData
): Promise<NugetPackageData[]> {
    const result: NugetPackageData[] = [];

    const parsedData = csprojData.csprojData;
    if (parsedData.Project.ItemGroup !== undefined) {
        parsedData.Project.ItemGroup.forEach((group: any) => {
            if (group.PackageReference !== undefined) {
                group.PackageReference.forEach((reference: any) => {
                    result.push({
                        nugetName: reference.$.Include,
                        nugetVersion: reference.$.Version,
                        nugetSource: reference.$.Source || "",
                        path: `${csprojData.repoOwner}/${csprojData.repoName}`,
                    });
                });
            }
        });
    }

    return result;
}

// export async function getNugetPackagesInfo(): Promise<NugetPackageData[]> {
//   const csprojData = await FindCSProjects(".");
//   const result: NugetPackageData[] = [];

//   for (const data of csprojData) {
//     const packages = await getNugetPackageInfoFromCsproj(data);
//     result.push(...packages);
//   }

//   return result;
// }

// 

export function getNuGetSources(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        exec('dotnet nuget list source --format short', (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                //console.log(stdout);
                const sources = stdout
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.startsWith('    '))
                    .map(line => line.substring(4));
                // resolve(sources);
                return sources;
            }
        });
    });
}


export async function getNugetPackagesInfo(): Promise<Project[]> {
    const csprojData = await FindCSProjects('.');
    let nugetSources = await getNuGetSources();

   
    const result: Project[] = [];

    for (const data of csprojData) {
        const nugetPackages = await getNugetPackageInfoFromCsproj(data);

        // create a new Project object for each NuGet package
        for (const packageInfo of nugetPackages) {
            let project = result.find((p) => p.ProjectName === packageInfo.nugetName);
            if (!project) {
                    project = {
                        ProjectName: packageInfo.nugetName,
                        ProjectPath: '',
                        RepoOwner: data.repoOwner,
                        RepoName: data.repoName,
                        NugetSources: nugetSources,  
                        NugetPackages: [],
                    };
                
                
            }

            // add the NuGet package to the Project object
            //const nugetSource = nugetSources.includes(packageInfo.nugetSource) ? packageInfo.nugetSource : '';
            const nugetSource = nugetSources[0]
            console.log(nugetSource)
            project.NugetPackages.push({
                Name: packageInfo.nugetName,
                Version: packageInfo.nugetVersion,
                Source: nugetSource,
            });
        }
    }

    // write the result array to a JSON file
    const outputFilePath = './output.json';
    await fs.promises.writeFile(outputFilePath, JSON.stringify(result, null, 2));

    return result;
}







// async function main() {
//   const packages = await getNugetPackagesInfo();
//   console.log(JSON.stringify(packages, null, 2));
// }

// main().catch((err) => {
//   console.error(err);
// });

