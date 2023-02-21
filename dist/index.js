"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput('github-token');
        const octokit = github.getOctokit(token);
        const context = github.context;
        const repo = ((_a = context.payload.repository) === null || _a === void 0 ? void 0 : _a.full_name) || '';
        const branch = core.getInput('branch-name');
        const { data: commit } = yield octokit.rest.repos.getCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: branch,
        });
        const output = {
            repository: {
                name: repo,
                packages: [],
                currentReleaseTag: '',
                license: '',
                sha: commit.sha,
            },
            npmPackages: [],
            //npmPackages: '',
            nugetPackages: [],
            //nugetPackages: '',
            //submodules: [],
        };
        // Get repository info
        const { data: repository } = yield octokit.rest.repos.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
        });
        output.repository.currentReleaseTag = repository.default_branch;
        output.repository.license = ((_b = repository.license) === null || _b === void 0 ? void 0 : _b.name) || '';
        // Get npm packages
        const { data: packageFiles } = yield octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: branch,
            path: 'package-lock.json',
        });
        // try {
        //core.info(packageFiles.toString());
        //for (const file of packageFiles as any[]) {
        let file = packageFiles;
        file = file;
        file.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            const { data: packageInfo } = yield octokit.rest.repos.getContent({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: branch,
                //   path: file.path,
                path: element.path,
            });
            const packageData = JSON.parse(Buffer.from(packageInfo.toString(), 'base64').toString());
            core.info(packageInfo.toString());
            core.info(packageData);
            const somePackage = {
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
                license: packageData.license,
                sha: commit.sha,
            });
        }));
        //   }
        // } catch (error) {
        //     core.setFailed("Erste For-schleife hat einen Fehler")
        // }
        //output.repository.packages.push(nugetFiles.toString()) || [];
        // Get NuGet packages
        const { data: nugetFiles } = yield octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: branch,
            path: 'README.md',
        });
        //   core.info(nugetFiles.toString());
        //   output.nugetPackages = nugetFiles.toLocaleString();
        // for (const file of nugetFiles as any[]) {
        // const { data: nugetInfo } = await octokit.rest.repos.getContent({
        //     owner: context.repo.owner,
        //     repo: context.repo.repo,
        //     ref: branch,
        //     path: 'README.md'
        //     // path: file.path,
        // });
        // const nugetContent = Buffer.from(nugetInfo, 'base64').toString();
        // const packageNameRegex = /<PackageReference\s+Include="(.+)"\s+Version="(.+)"\s+\/>/g;
        // let match;
        // while ((match = packageNameRegex.exec(nugetContent))) {
        //   const [, packageName, version] = match;
        //original: output.nugetPackages.push({
        // output.nugetPackages.push({
        //     repoName: repo,
        //     packageName,
        //     version,
        //     license: '',
        //     sha: commit.sha,
        // })
        // }
        //   }
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
            core.info(JSON.stringify(output, null, 2));
        }
        catch (error) {
            core.setFailed("WriteFileSync ist falsch");
        }
    });
}
run();
