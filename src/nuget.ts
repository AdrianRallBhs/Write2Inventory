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

import { exec } from 'child_process';

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
      const sources = stdout
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.split(' ')[0]);

      resolve(sources);
    });
  });
}