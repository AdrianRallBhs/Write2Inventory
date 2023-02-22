import * as path from 'path';
import * as fs from 'fs';

import * as xml2js from "xml2js";
import * as cheerio from 'cheerio';


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

interface NugetPackage {
  Name: string;
  Version: string;
  Source: string;
}

interface NugetPackageInfo {
  nugetName: string;
  nugetVersion: string;
  nugetSource: string;
}

interface CsprojProject {
  FilePath: string;
  NugetPackages: NugetPackage[];
}


function getNugetPackageListFromCsprojDoc(csprojDoc: string): NugetPackageInfo[] {
    const packageReferences = select(csprojDoc, '//ItemGroup/PackageReference');
  
    return packageReferences.map((pkg: any) => ({
      nugetName: pkg.$.Include,
      nugetVersion: pkg.$.Version,
      nugetSource: pkg.$.Source,
    }));
  }




async function getNugetPackagesForAllSources(directoryPath: string): Promise<NugetPackage[]> {
  const sources = getNugetSources();
  const packages: NugetPackage[] = [];

  for (const source of sources) {
    const sourcePackages = await getNugetPackagesForSource(source, directoryPath);
    packages.push(...sourcePackages);
  }

  return packages;
}



function findCsprojProjects(directoryPath: string): CsprojProject[] {
  const csprojPaths: string[] = [];
  const files = fs.readdirSync(directoryPath);
  const csprojProjects: CsprojProject[] = [];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      const subdirectoryCsprojProjects = findCsprojProjects(filePath);
      csprojProjects.push(...subdirectoryCsprojProjects);
    } else if (stat.isFile() && filePath.endsWith('.csproj')) {
      const csprojXml = fs.readFileSync(filePath, 'utf-8');
      const xmlParser = new xml2js.Parser();
      xmlParser.parseString(csprojXml, (err, csprojDoc) => {
        if (err) {
          console.log(err);
          return;
        }

        csprojProjects.push({
          FilePath: filePath,
          NugetPackages: getNugetPackageListFromCsprojDoc(csprojDoc),
        });
      });
    }
  }

  return csprojProjects;
}

async function getNugetPackagesForSource(source: string, directoryPath: string): Promise<NugetPackage[]> {
    const csprojPaths = findCsprojProjects(directoryPath);
    const packages: NugetPackage[] = [];
  
    for (const csprojPath of csprojPaths) {
        const packageInfoList = await getNugetPackageListFromCsprojDoc(fs.readFileSync(csprojPath, 'utf-8'));
      
        for (const packageInfo of packageInfoList) {
          if (packageInfo.nugetSource === source) {
            packages.push({
              Name: packageInfo.nugetName,
              Version: packageInfo.nugetVersion,
              Source: packageInfo.nugetSource,
            });
          }
        }
      }
    return packages;
  }


function getNugetSources(): string[] {
    const nugetConfigPath = path.join('.nuget', 'NuGet.config');
    if (!fs.existsSync(nugetConfigPath)) {
      return [];
    }
  
    const nugetConfigXml = fs.readFileSync(nugetConfigPath, 'utf-8');
    const xmlParser = new xml2js.Parser();
    let packageSources;
    const nugetSources: string[] = [];
    try {
      xmlParser.parseString(nugetConfigXml, function (err, result) {
        packageSources = result.configuration.packageSources[0].add;
        // const nugetSources: string[] = [];
  
    for (let i = 0; i < packageSources.length; i++) {
      const packageSource = packageSources[i];
      if (packageSource.$.value) {
        nugetSources.push(packageSource.$.value);
      }
    }
    return nugetSources;
      });
    } catch (e) {
    // const nugetSources: string[] = [];
      console.log(`Could not parse NuGet.config file. Error: ${e}`);
      return nugetSources;
    }
    // const nugetSources: string[] = [];
  
    // for (let i = 0; i < packageSources.length; i++) {
    //   const packageSource = packageSources[i];
    //   if (packageSource.$.value) {
    //     nugetSources.push(packageSource.$.value);
    //   }
    // }
    return nugetSources;
  }



// export async function FindCSProjects(rootPath: string): Promise<CsprojData[]> {
//     const result: CsprojData[] = [];
//     const files = await promisify(fs.readdir)(rootPath);

//     for (const file of files) {
//         const filePath = path.join(rootPath, file);
//         const stat = await promisify(fs.stat)(filePath);

//         if (stat.isDirectory()) {
//             const childResults = await FindCSProjects(filePath);
//             result.push(...childResults);
//         } else if (path.extname(filePath).toLowerCase() === ".csproj") {
//             const repoOwner = path.basename(rootPath);
//             const repoName = path.basename(path.dirname(rootPath));
//             const data = await promisify(fs.readFile)(filePath, "utf8");
//             const csprojData = await promisify(xml2js.parseString)(data);
//             result.push({
//                 repoOwner,
//                 repoName,
//                 csprojFilePath: filePath,
//                 csprojData,
//             });
//         }
//     }

//     return result;
// }

// export async function getNugetPackageInfoFromCsproj(
//     csprojData: CsprojData
// ): Promise<NugetPackage[]> {
//     const result: NugetPackage[] = [];

//     const parsedData = csprojData.csprojData;
//     if (parsedData.Project.ItemGroup !== undefined) {
//         parsedData.Project.ItemGroup.forEach((group: any) => {
//             if (group.PackageReference !== undefined) {
//                 group.PackageReference.forEach((reference: any) => {
//                     result.push({
//                         Name: reference.$.Include,
//                         Version: reference.$.Version,
//                         Source: reference.$.Source || "",
//                     });
//                 });
//             }
//         });
//     }

//     return result;
// }

// // export async function getNugetPackagesInfo(): Promise<NugetPackageData[]> {
// //   const csprojData = await FindCSProjects(".");
// //   const result: NugetPackageData[] = [];

// //   for (const data of csprojData) {
// //     const packages = await getNugetPackageInfoFromCsproj(data);
// //     result.push(...packages);
// //   }

// //   return result;
// // }

// // 

// export function getNuGetSources(): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//         exec('dotnet nuget list source --format short', (err, stdout, stderr) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 //console.log(stdout);
//                 const sources = stdout
//                     .split('\n')
//                     .map(line => line.trim())
//                     .filter(line => line.startsWith('    '))
//                     .map(line => line.substring(4));
//                 resolve(sources);
//             }
//         });
//     });
// }

// async function getNugetPackagesForSource(source: string): Promise<NugetPackage[]> {
//     const csprojProjects = await FindCSProjects('/path/to/repo');
//     const packages: NugetPackage[] = [];
  
//     for (const project of csprojProjects) {
//       const packageInfoList = await getNugetPackageInfoFromCsproj(project.FilePath);
  
//       for (const packageInfo of packageInfoList) {
//         if (packageInfo.nugetSource === source) {
//           const nugetSource = packageInfo.nugetSource;
//           project.NugetPackages.push({
//             Name: packageInfo.nugetName,
//             Version: packageInfo.nugetVersion,
//             Source: nugetSource,
//           });
//         }
//       }
//     }
  
//     for (const project of csprojProjects) {
//       packages.push(...project.NugetPackages);
//     }
  
//     return packages;
//   }
  
//   async function getNugetPackagesForAllSources(): Promise<NugetPackage[]> {
//     const sources = await getNuGetSources();
//     const packages: NugetPackage[] = [];
  
//     for (const source of sources) {
//       const sourcePackages = await getNugetPackagesForSource(source);
//       packages.push(...sourcePackages);
//     }
  
//     return packages;
//   }

//=====================================================================
// export async function getNugetPackagesInfo(): Promise<Project[]> {
//     const csprojData = await FindCSProjects('.');
//     const nugetSources = await getNuGetSources();
//     const result: Project[] = [];
  
//     for (const data of csprojData) {
//       const nugetPackages = await getNugetPackageInfoFromCsproj(data);
  
//       // create a new Project object for each NuGet package
//       for (const packageInfo of nugetPackages) {
//         let project = result.find((p) => p.ProjectName === packageInfo.nugetName);
//         if (!project) {
//           project = {
//             ProjectName: packageInfo.nugetName,
//             ProjectPath: '',
//             RepoOwner: data.repoOwner,
//             RepoName: data.repoName,
//             NugetSources: nugetSources.filter(s => s !== 'nuget.org'),
//             NugetPackages: [],
//           };
//           result.push(project);
//         }
  
//         // add the NuGet package to the Project object
//         const nugetSource = nugetSources.includes(packageInfo.nugetSource) ? packageInfo.nugetSource : '';
//         project.NugetPackages.push({
//           Name: packageInfo.nugetName,
//           Version: packageInfo.nugetVersion,
//           Source: nugetSource,
//         });
//       }
//     }
  
//     // write the result array to a JSON file
//     const outputFilePath = './output.json';
//     await fs.promises.writeFile(outputFilePath, JSON.stringify(result, null, 2));
  
//     return result;
//   }

//================================================================================

// async function main() {
//   const packages = await getNugetPackagesInfo();
//   console.log(JSON.stringify(packages, null, 2));
// }

// main().catch((err) => {
//   console.error(err);
// });

