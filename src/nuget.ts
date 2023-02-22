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

export function getDotnetSources(): string[] {
  const dotnetConfigPath = path.join('.config', 'dotnet-tools.json');
  if (!fs.existsSync(dotnetConfigPath)) {
    return [];
  }

  const dotnetConfig = JSON.parse(fs.readFileSync(dotnetConfigPath, 'utf-8'));

  const sources: string[] = [];
  const sourcesConfig = dotnetConfig["v3-sources"];
  if (sourcesConfig) {
    Object.keys(sourcesConfig).forEach((key) => {
      sources.push(sourcesConfig[key].source);
    });
  }

  return sources;
}