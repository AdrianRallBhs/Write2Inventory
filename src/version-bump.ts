// import { getDotnetSources, getNugetPackageListFromCsprojDoc, getDotnetSubmodules, findALLCSPROJmodules, getAllNugetPackages, getOutdatedPackages } from './nuget'
// import { runNPM, runRepoInfo } from './index'
// import * as core from '@actions/core';

// enum VersionBump {
//     MAJOR = 'major',
//     MINOR = 'minor',
//     PATCH = 'patch'
// }

// function getVersionBump(): VersionBump {
//     const versionBumpInput = core.getInput('versionBump', { required: false });
//     switch (versionBumpInput) {
//         case 'major':
//             return VersionBump.MAJOR;
//         case 'patch':
//             return VersionBump.PATCH;
//         default:
//             return VersionBump.MINOR;
//     }
// }

// export function getBumpType(versionBump: VersionBump, currentVersion: string, latestVersion: string): VersionBump | null {
//     const majorRegex = /^(\d+)\.(\d+)\.(\d+)$/;
//     const minorRegex = /^(\d+)\.(\d+)$/;
//     const patchRegex = /^(\d+)$/;
//     const currentMatch = currentVersion.match(majorRegex) || currentVersion.match(minorRegex) || currentVersion.match(patchRegex);
//     const latestMatch = latestVersion.match(majorRegex) || latestVersion.match(minorRegex) || latestVersion.match(patchRegex);
//     if (currentMatch && latestMatch) {
//         const currentNumbers = currentMatch.slice(1).map(Number);
//         const latestNumbers = latestMatch.slice(1).map(Number);
//         switch (versionBump) {
//             case VersionBump.MAJOR:
//                 if (latestNumbers[0] > currentNumbers[0]) {
//                     return VersionBump.MAJOR;
//                 }
//                 break;
//             case VersionBump.MINOR:
//                 if (latestNumbers[0] > currentNumbers[0] || (latestNumbers[0] === currentNumbers[0] && latestNumbers[1] > currentNumbers[1])) {
//                     return VersionBump.MINOR;
//                 }
//                 break;
//             case VersionBump.PATCH:
//                 if (latestNumbers[0] > currentNumbers[0] || (latestNumbers[0] === currentNumbers[0] && latestNumbers[1] > currentNumbers[1]) || (latestNumbers[0] === currentNumbers[0] && latestNumbers[1] === currentNumbers[1] && latestNumbers[2] > currentNumbers[2])) {
//                     return VersionBump.PATCH;
//                 }
//                 break;
//         }
//     }
//     return null;
// }


// // code for getting outdated packages
// //getOutdatedPackages()


// // code for getting repository info}
// runRepoInfo()


// // code for getting submodule info
// getDotnetSubmodules()


// // code for getting npm packages
// // runNPM()


// export async function getVersionBumpForRepository(versionBump?: VersionBump): Promise<VersionBump> {
//     return versionBump || getVersionBump();
// }
