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
  //packages: Packages[];
  currentReleaseTag: string;
  license: string;
  sha: string;
}

// interface NpmPackage {
//   repoName: string;
//   packageName: string;
//   version: string;
//   license: string;
//   sha: string;
// }

// interface NugetPackage {
//   repoName: string;
//   packageName: string;
//   version: string;
//   license: string;
//   sha: string;
// }

// interface Submodule {
//   repoName: string;
//   packageName: string;
//   tag: string;
// }

interface Output {
  repository: Repository;
//   npmPackages: NpmPackage[];
//   nugetPackages: NugetPackage[];
  //submodules: Submodule[];
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
        //packages: [],
        currentReleaseTag: '',
        license: '',
        sha: commit.sha,
      },
    //   npmPackages: [],
    //   nugetPackages: [],
      //submodules: [],
    };
    
    
        // Get repository info
    const { data: repository } = await octokit.rest.repos.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
      });
    
    

    output.repository.currentReleaseTag = repository.default_branch;
    output.repository.license = repository.license?.name || '';

  
        // Get npm packages
    // const { data: packageFiles } = await octokit.rest.repos.getContent({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     ref: branch,
    //     path: 'package-lock.json',
    //   });
    
    
// try {
    // for (const file of packageFiles as any[]) {
    //     const { data: packageInfo } = await octokit.rest.repos.getContent({
    //       owner: context.repo.owner.toString(),
    //       repo: context.repo.repo.toString(),
    //       ref: branch.toString(),
    //       path: file.path.ToString(),
    //     });
  
    //     const packageData = JSON.parse(Buffer.from(packageInfo.toString(), 'base64').toString());
        
  
        // const somePackage: Packages = {
        //   name: packageData.name,
        //   version: packageData.version,
        //   license: packageData.license || '',
        //   sha: commit.sha,
        // };
  
        // output.repository.packages.push(somePackage);
        // output.npmPackages.push({
        //   repoName: repo,
        //   packageName: packageData.name,
        //   version: packageData.version,
        //   license: packageData.license || '',
        //   sha: commit.sha,
        // });
    //   }
// } catch (error) {
//     core.setFailed("Erste For-schleife hat einen Fehler")
// }
    

    // Get NuGet packages
    // const { data: nugetFiles } = await octokit.rest.repos.getContent({
    //   owner: context.repo.owner,
    //   repo: context.repo.repo,
    //   ref: branch,
    //   path: '*.csproj',
    // });

    // try {
    //     for (const file of nugetFiles as any[]) {
    //         const { data: nugetInfo } = await octokit.rest.repos.getContent({
    //           owner: context.repo.owner,
    //           repo: context.repo.repo,
    //           ref: branch,
    //           path: file.path,
    //         });
          
    //         const nugetContent = Buffer.from(nugetInfo.toString(), 'base64').toString();
    //         const packageNameRegex = /<PackageReference\s+Include="(.+)"\s+Version="(.+)"\s+\/>/g;
    //         let match;
          
    //         while ((match = packageNameRegex.exec(nugetContent))) {
    //           const [, packageName, version] = match;
    //           output.nugetPackages.push({
    //             repoName: repo,
    //             packageName,
    //             version,
    //             license: '',
    //             sha: commit.sha,
    //           });
    //         }
    //       }
    // } catch (error) {
    //     core.setFailed("for schleife hat fehler")
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
  