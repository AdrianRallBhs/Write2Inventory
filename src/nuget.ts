import { Sources } from './dotnet-command-manager';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { exec, spawn } from 'child_process';
import * as execute from '@actions/exec'
import * as core from '@actions/core';
import * as child_process from 'child_process';
import * as semver from 'semver';

interface NugetPackage {
    Name: string;
    Version: string;
    Source: string;
}

interface NugetPackageInfo {
    project: string;
    source: string;
    packageName: string;
    currentVersion: string;
    resolvedVersion: string;
    latestVersion: string;
  };

interface PackageInfo {
    nugetName: string;
    nugetVersion: string;
    nugetSource: string
}

interface Source {
    name: string;
    value: string;
}

interface Submodule {
    sha: string;
    submoduleName: string;
    referenceBranch: string;

}

const FilterSources = core.getMultilineInput("nuget-sourcee").filter(s => s.trim() !== "")

export async function getDotnetSources(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        exec('dotnet nuget list source --format short', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }

            // Parse the output and extract the source URLs
            const sources = stdout.split('\r\n')
                .map(source => source.trim())
                .filter(source => source && !source.startsWith('---') && !source.startsWith('Source'));


            resolve(sources);
        });
    });
}

// =====================================================


export async function findALLCSPROJmodules(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      // Checkout the repository including submodules
      const submoduleUpdate = spawn('git', ['submodule', 'update', '--init', '--recursive']);
      submoduleUpdate.on('close', (code) => {
        if (code !== 0) {
          reject(`git submodule update exited with code ${code}`);
          return;
        }
  
        // Find all csproj files
        const find = spawn('find', ['.', '-name', '*.csproj']);
        let csprojFiles = '';
        find.stdout.on('data', (data) => {
          csprojFiles += data;
        });
        find.on('close', (code) => {
          if (code !== 0) {
            reject(`find exited with code ${code}`);
            return;
          }
  
          // Split the list of `csproj` files into an array of strings
          const csprojFileList = csprojFiles.trim().split('\n');
  
          // Output the list of `csproj` files found
          //core.info(`List of csproj files found: ${csprojFileList}`);
  
          resolve(csprojFileList);
        });
      });
    });
  }

// ===================================================================


  
// export async function getAllNugetPackages(projectList: string[], sourceList: string[]): Promise<NugetPackageInfo[][]> {
//     const packageInfoList: NugetPackageInfo[][] = [];
//     for (const project of projectList) {
//       const projectPackageInfoList: NugetPackageInfo[] = [];
//       for (const source of sourceList) {
//         try {
//           const output = child_process.execSync(`dotnet list ${project} package --outdated --source ${source}`);
//           const packageInfoRegex = /(?<packageName>\S+)\s+(?<currentVersion>\S+)\s+(?<latestVersion>\S+)/g;
//           let packageInfoMatch: RegExpExecArray | null;
//           while ((packageInfoMatch = packageInfoRegex.exec(output.toString())) !== null) {
//             const { packageName, currentVersion, latestVersion } = packageInfoMatch.groups!;
//             projectPackageInfoList.push({
//               project,
//               source,
//               packageName,
//               currentVersion,
//               latestVersion,
//             });
//           }
//         } catch (error) {
//           console.log(`Error listing packages for project "${project}" and source "${source}": ${error}`);
//         }
//       }
//       packageInfoList.push(projectPackageInfoList);
//     }
//     return packageInfoList;
//   }


export async function getAllNugetPackages(projectList: string[], sourceList: string[]): Promise<NugetPackageInfo[][]> {
    const packageInfoList: NugetPackageInfo[][] = [];
    for (const project of projectList) {
      const projectPackageInfoList: NugetPackageInfo[] = [];
      for (const source of sourceList) {
        try {
          const output = child_process.execSync(`dotnet list ${project} package --highest-minor --outdated --source ${source}`);
          const lines = output.toString().split("\n");
          let packageName = "";
          let currentVersion = "";
          let resolvedVersion = "";
          let latestVersion = "";
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith(">")) {
              const fields = line.trim().split(/\s+/);
              packageName = fields[1];
              currentVersion = fields[2];
              resolvedVersion = fields[3];
              latestVersion = fields[4];
              projectPackageInfoList.push({
                project,
                source,
                packageName,
                currentVersion,
                resolvedVersion,
                latestVersion,
              });
            }
          }
        } catch (error) {
          console.log(`Error listing packages for project "${project}" and source "${source}": ${error}`);
        }
      }
      packageInfoList.push(projectPackageInfoList);
    }
    return packageInfoList;
  }
  
  
  export async function getOutdatedPackages(projectList: string[], sourceList: string[]): Promise<NugetPackageInfo[]> {
    const outdatedPackages: NugetPackageInfo[] = [];
  
    for (const project of projectList) {
      for (const source of sourceList) {
        const output = child_process.execSync(`dotnet list ${project} package --highest-minor --outdated --source ${source}`);
        const lines = output.toString().split('\n');
        let packageName: string = '';
        let currentVersion: string = '';
        let latestVersion: string = '';
        let resolvedVersion: string = '';
        for (const line of lines) {
          if (line.includes('Project') && line.includes('has the following updates')) {
          } else if (line.includes('>')) {
            const parts = line.split(/ +/);
            packageName = parts[1];
            packageName = parts[2];
            currentVersion = parts[3];
            resolvedVersion = parts[4];
            latestVersion = parts[5];
          }
        }
        if (packageName && currentVersion && latestVersion) {
          outdatedPackages.push({ project, source, packageName, currentVersion, resolvedVersion, latestVersion });
        }
      }
    }
  
    return outdatedPackages;
  }
  

  

// =====================================================

export async function getNugetPackageListFromCsprojDoc(csprojPath: string): Promise<PackageInfo[]> {
    const csprojXml = fs.readFileSync(csprojPath, 'utf-8');
    const xmlParser = new xml2js.Parser();
    let packageInfoList: PackageInfo[] = [];

    const sources = await getDotnetSources();

    try {
        const csprojDoc = await xmlParser.parseStringPromise(csprojXml);

        FilterSources.forEach(source => {
            for (const packageRef of csprojDoc.Project.ItemGroup[0].PackageReference) {
                const packageName = packageRef.$.Include;
                const packageVersion = packageRef.$.Version;
                packageInfoList.push({
                    nugetName: packageName,
                    nugetVersion: packageVersion,
                    nugetSource: source,
                });
            }
        })

    } catch (e) {
        console.log(`Could not parse .csproj file at ${csprojPath}. Error: ${e}`);
    }

    return packageInfoList;
}

// =====================================================

export async function getNugetPackagesForSource(directoryPath: string, source?: string): Promise<NugetPackage[]> {
    const csprojPaths = await findALLCSPROJmodules();
    const packages: NugetPackage[] = [];

    for (const csprojPath of csprojPaths) {
        const packageInfoList = await getNugetPackageListFromCsprojDoc(csprojPath);

        for (const packageInfo of packageInfoList) {
            if (!source || packageInfo.nugetSource === source) {
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


// =========================================================

// export async function getSubmodulesList(): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//         exec('git submodule init');
//         exec('git submodule update');
//       exec('git submodule', (error, stdout) => {
//         if (error) {
//           reject(error);
//         } else {
//           const submodules: string[] = [];
//           const lines = stdout.split('\n');
//           for (const line of lines) {
//             const match = line.match(/^.*\/(.*) \((.*)\)$/);
//             if (match) {
//               const submodulePath = match[1];
//               submodules.push(submodulePath);
//             }
//           }
//           resolve(submodules);
//         }
//       });
//     });
//   }


export async function getDotnetSubmodules(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      exec('git submodule', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
  
        const submodules = stdout
          .split('\n')
          .map(submodule => submodule.trim())
          .filter(submodule => submodule !== '');
  
        const submoduleStrings = submodules.join(',').split(',');
  
        resolve(submoduleStrings);
      });
    });
  }


     function fetch(apiUrl: string) {
         throw new Error('Function not implemented.');
     }