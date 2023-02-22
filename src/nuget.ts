import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

interface NugetPackage {
    Name: string;
    Version: string;
    Source: string;
  }


interface Source {
  name: string;
  value: string;
}

async function getDotnetSources(): Promise<string[]> {
    const dotnetConfigPath = path.join('.config', 'dotnet-tools.json');
    if (!fs.existsSync(dotnetConfigPath)) {
      return [];
    }
  
    const dotnetConfigContent = fs.readFileSync(dotnetConfigPath, 'utf-8');
    const dotnetConfig = JSON.parse(dotnetConfigContent);
  
    if (!dotnetConfig || !dotnetConfig['nuget-source']) {
      return [];
    }
  
    const nugetSources: string[] = dotnetConfig['nuget-source'];
  
    return nugetSources;
  }