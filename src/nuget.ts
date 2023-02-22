import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { exec } from 'child_process';
import * as execute from '@actions/exec'

interface NugetPackage {
    Name: string;
    Version: string;
    Source: string;
}

interface PackageInfo {
    nugetName: string;
    nugetVersion: string;
    nugetSource: string
}

interface Source {
    name: string;
    value: string;
}



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
    try {
        // Checkout the repository including submodules
        await execute.exec('git', ['submodule', 'update', '--init', '--recursive']);

        // Use the `find` command to locate all `csproj` files
        let csprojFiles = '';
        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    csprojFiles += data.toString();
                }
            }
        };
        await execute.exec('find', ['.', '-name', '*.csproj'], options);

        // Split the list of `csproj` files into an array of strings
        const csprojFileList = csprojFiles.trim().split('\n');

        // Output the list of `csproj` files found
        //core.info(`List of csproj files found: ${csprojFileList}`);

        return csprojFileList;
    } catch {
        return [];
    }
}

// =====================================================

export async function getNugetPackageListFromCsprojDoc(csprojPath: string): Promise<PackageInfo[]> {
    const csprojXml = fs.readFileSync(csprojPath, 'utf-8');
    const xmlParser = new xml2js.Parser();
    let packageInfoList: PackageInfo[] = [];

    try {
        const csprojDoc = await xmlParser.parseStringPromise(csprojXml);

        for (const packageRef of csprojDoc.Project.ItemGroup[0].PackageReference) {
            const packageName = packageRef.$.Include;
            const packageVersion = packageRef.$.Version;
            packageInfoList.push({
                nugetName: packageName,
                nugetVersion: packageVersion,
                nugetSource: packageRef,
            });
        }
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

