import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import { info } from 'console'

const packageToUpdate = core.getInput(" packageToUpdate")


export class DotnetCommandManager {
    private dotnetPath: string
    private projectfile: string

    constructor(projectfile: string, dotnetPath: string) {
        this.projectfile = projectfile
        this.dotnetPath = dotnetPath
    }

    static async create(projectfile: string): Promise<DotnetCommandManager> {
        const dotnetPath = await io.which('dotnet', true)
        return new DotnetCommandManager(projectfile, dotnetPath)
    }

    async restore(): Promise<void> {
        const result = await this.exec(['restore', this.projectfile])
        if (result.exitCode !== 0) {
            core.error(`dotnet restore returned non-zero exitcode: ${result.exitCode}`)
            throw new Error(`dotnet restore returned non-zero exitcode: ${result.exitCode}`)
        }
    }

   async listSources(): Promise<DotnetOutput> {
        const result = await this.exec(['nuget', 'list', 'source', '--format', 'Short'])
        //const sources = this.listSources(result.stdout)
        if (result.exitCode !== 0) {
            core.error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
            throw new Error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
        }
        return result
    }


    // async filterSource(): Promise<string[]> {
    //     // let source: any
    //     const newArray: string[] = []
    //     for(let source in this.listSource()) {
    //         if(source.startsWith("E https://nuget.github.bhs-world.com")) {
    //             newArray.push(source.toString())
    //         }
    //         //newArray = await source.name.startsWith("E https://nuget.github.bhs-world.com")
    //         }

    //     // }
    //     //const result = (await this.listSource()).filter()
    //     //const sources = this.listSources(result.stdout)
    //     // if (result.exitCode !== 0) {
    //     //     error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
    //     //     throw new Error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
    //     // }
    //     return newArray
    // }

    async listPackages(): Promise<void> {
        const result = await this.exec(['list', this.projectfile, 'package'])
        if (result.exitCode !== 0) {
            core.error(`dotnet list package returned non-zero exitcode: ${result.exitCode}`)
            throw new Error(`dotnet list package returned non-zero exitcode: ${result.exitCode}`)
        }
    }

  

    async exec(args: string[]): Promise<DotnetOutput> {
        args = args.filter(x => x !== "")
        let env: any = {}
        for (const key of Object.keys(process.env)) {
            env[key] = process.env[key]
        }
        const stdout: string[] = []
        const stderr: string[] = []

        const options = {
            cwd: '.',
            env,
            ignoreReturnCode: true,
            listeners: {
                stdout: (data: Buffer) => stdout.push(data.toString()),
                stderr: (data: Buffer) => stderr.push(data.toString())
            }
        }
        const resultcode = await exec.exec(`"${this.dotnetPath}"`, args, options)
        const result = new DotnetOutput(resultcode)
        result.stdout = stdout.join('')
        result.stderr = stderr.join('')
        return result
    }

 
    async filterSource(result: DotnetOutput) {
        // let source: any
        const newArray: string[] = []
        let outputSource: string
        let source: any
        let bla = result
        outputSource = bla.stdout
        
        //for (let blabla in outputSource) {
            if (outputSource.includes("E https://api.nuget")) {
                outputSource = outputSource.slice(2)
                outputSource = outputSource.trim()
                newArray.push(outputSource)
            //}
               info(`Blatrim: ${outputSource} \n newArray: ${newArray}`)
            //newArray = await source.name.startsWith("E https://nuget.github.bhs-world.com")
            } else {
                info(`nichts in filterSource (.net command manager):  ${outputSource}`)
            }
       // info(`List of other sources: ${newArray}`)
        // }
        //const result = (await this.listSource()).filter()
        //const sources = this.listSources(result.stdout)
        // if (result.exitCode !== 0) {
        //     error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
        //     throw new Error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
        // }
        return newArray
    }



    async filterPackages(result: DotnetOutput) {
        // let source: any
        const newArray: string[] = []
        let outputSource: string
        let source: any
        let bla = result
        outputSource = bla.stdout
        
        //for (let blabla in outputSource) {
            if (outputSource.includes("Neverenough")) {
                outputSource = outputSource.trim()
                newArray.push(outputSource)
            //}
               info(`Blatrim: ${outputSource}`)
            //newArray = await source.name.startsWith("E https://nuget.github.bhs-world.com")
            } else {
                info(`nichts in filterSource (.net command manager):  ${outputSource}`)
            }
       // info(`List of other sources: ${newArray}`)
        // }
        //const result = (await this.listSource()).filter()
        //const sources = this.listSources(result.stdout)
        // if (result.exitCode !== 0) {
        //     error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
        //     throw new Error(`dotnet nuget list source --format Short returned non-zero exitcode: ${result.exitCode}`)
        // }
        return newArray
    }
    
}


export class DotnetOutput {
    stdout = ''
    stderr = ''
    exitCode = 0

    constructor(exitCode: number) {
        this.exitCode = exitCode
    }

}

export class Sources {
    name: string

    constructor(name: string) {
        this.name = name
    }
}

