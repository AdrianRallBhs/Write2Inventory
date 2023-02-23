import { Sources } from './dotnet-command-manager';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { exec, spawn } from 'child_process';
import * as execute from '@actions/exec'
import * as core from '@actions/core';
import * as child_process from 'child_process';
import * as semver from 'semver';
import latestVersion from 'latest-version';

interface NugetPackage {
    Name: string;
    Version: string;
    Source: string;
}

type NugetPackageInfo = {
    project: string;
    source: string;
    packageName: string;
    currentVersion: string;
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


  
export async function getAllNugetPackages(projectList: string[], sourceList: string[]): Promise<NugetPackageInfo[][]> {
    const packageInfoList: NugetPackageInfo[][] = [];
    for (const project of projectList) {
      const projectPackageInfoList: NugetPackageInfo[] = [];
      for (const source of sourceList) {
        try {
          const output = child_process.execSync(`dotnet list ${project} package --outdated --source ${source}`);
          const packageInfoRegex = /(?<packageName>\S+)\s+(?<currentVersion>\S+)\s+(?<latestVersion>\S+)/g;
          let packageInfoMatch: RegExpExecArray | null;
          while ((packageInfoMatch = packageInfoRegex.exec(output.toString())) !== null) {
            const { packageName, currentVersion, latestVersion } = packageInfoMatch.groups!;
            projectPackageInfoList.push({
              project,
              source,
              packageName,
              currentVersion,
              latestVersion,
            });
          }
        } catch (error) {
          console.log(`Error listing packages for project "${project}" and source "${source}": ${error}`);
        }
      }
      packageInfoList.push(projectPackageInfoList);
    }
    return packageInfoList;
  }


 export async function getLatestNugetVersion(packageName: string, source: string): Promise<string> {
    try {
      const latestVersionString: string = await latestVersion(`${packageName}@${source}`);
      return latestVersionString;
    } catch (error) {
      console.error(`Error getting latest version of package ${packageName} from source ${source}: ${error}`);
      throw error;
    }
  }

 export async function getOutdatedPackages(projectList: string[], sourceList: string[]): Promise<NugetPackageInfo[]> {
    const allPackages = await getAllNugetPackages(projectList, sourceList);
    const outdatedPackages: NugetPackageInfo[] = [];
  
    for (const projectPackages of allPackages) {
      for (const packageInfo of projectPackages) {
        if (packageInfo.currentVersion.includes(">")) {
          const packageName = packageInfo.packageName;
          const source = packageInfo.source;
          const latestVersion = await getLatestNugetVersion(packageName, source);
  
          if (semver.lt(packageInfo.currentVersion, latestVersion)) {
            outdatedPackages.push({
              ...packageInfo,
              latestVersion,
            });
          }
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

  //'list', this.projectfile, 'package', versionFlag, '--outdated', '--source', sources[0]