import * as exec from "@actions/exec";
import * as fs from 'fs';

interface PackageDependency {
    name: string;
    version: string;
}

interface Package {
    name: string;
    version: string;
    description?: string;
    authors?: string;
    projectUrl?: string;
    licenseUrl?: string;
    iconUrl?: string;
    dependencies?: PackageDependency[];
}

interface ProjectAsset {
    version: number;
    targets: {
        [target: string]: {
            [packageId: string]: {
                [version: string]: {
                    iconUrl: any;
                    licenseUrl: any;
                    projectUrl: any;
                    authors: any;
                    description: any;
                    type: string;
                    dependencies: {
                        [dependencyId: string]: string;
                    };
                };
            };
        };
    };
    libraries: {
        [libraryName: string]: {
            type: string;
            serviceable: boolean;
            sha512: string;
            path: string;
            hashPath: string;
            runtimeStoreManifestName: string;
            files: {
                [filePath: string]: {
                    assemblyVersion: string;
                    fileVersion: string;
                    hashPath: string;
                };
            };
        };
    };
    project: {
        restore: {
            projectUniqueName: string;
        };
    };
    packageFolders: {
        [path: string]: {};
    };
}

export async function getNugetPackageInfoFromAssets(assetFilePath: string): Promise<Package[]> {
    const assetFile = await fs.promises.readFile(assetFilePath, 'utf-8');
    const assets = JSON.parse(assetFile) as ProjectAsset;

    const packages: Package[] = [];

    for (const target in assets.targets) {
        for (const packageId in assets.targets[target]) {
            for (const version in assets.targets[target][packageId]) {
                const packageInfo = assets.targets[target][packageId][version];

                const packageName = packageId.substr(0, packageId.lastIndexOf('/'));

                const description = packageInfo?.description;
                const authors = packageInfo?.authors;
                const projectUrl = packageInfo?.projectUrl;
                const licenseUrl = packageInfo?.licenseUrl;
                const iconUrl = packageInfo?.iconUrl;

                const dependencies: PackageDependency[] = [];
                if (packageInfo.dependencies) {
                    for (const dependencyId in packageInfo.dependencies) {
                        const dependencyVersion = packageInfo.dependencies[dependencyId];
                        const dependencyName = dependencyId.substr(0, dependencyId.lastIndexOf('/'));

                        const dependency: PackageDependency = {
                            name: dependencyName,
                            version: dependencyVersion
                        };

                        dependencies.push(dependency);
                    }
                }

                const nugetPackage: Package = {
                    name: packageName,
                    version: version,
                    description: description,
                    authors: authors,
                    projectUrl: projectUrl,
                    licenseUrl: licenseUrl,
                    iconUrl: iconUrl,
                    dependencies: dependencies
                };

                packages.push(nugetPackage);
            }
        }
    }

    return packages;
}






export async function getAssetFile(): Promise<string[]> {
    try {
        // Checkout the repository including submodules
        await exec.exec('git', ['submodule', 'update', '--init', '--recursive']);

        // Use the `find` command to locate all `csproj` files
        let assertsFiles = '';
        const options = {
            listeners: {
                stdout: (data: Buffer) => {
                    assertsFiles += data.toString();
                }
            }
        };
        await exec.exec('find', ['.', '-name', '*.assets.json'], options);

        // Split the list of `asserts.json` files into an array of strings
        const assertFilesList = assertsFiles.trim().split('\n');

        // Output the list of `csproj` files found
        //core.info(`List of csproj files found: ${assertFilesList}`);

        return assertFilesList;
    } catch {
        return [];
    }
}