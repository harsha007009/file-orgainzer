#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import { parseArgs } from 'util';

const program = new Command();

program
  .name('forganize')
  .description('Organizes files in the current directory')
  .option('--clear', 'Clears the organized file before running')
  .option('--stats', 'Shows statistics of files')
  .options('--preview', 'Preview what will be organized without moving files')
  .options('--search <term>', 'Search files by name before orgainizing')
  .option('--verbose', 'Enables detailed logging')
  .parse(process.argv);

const options = process.opts();
const args = process.args();

const SOURCE_DIR = process.cwd();
const DEST_DIR = path.join(SOURCE_DIR, 'organzied');
const categories = [
  'images',
  'documents',
  'audio',
  'video',
  'archives',
  'codes',
  'others',
];

function getCategory(filename) {
  const ext = path.extname(filename);

  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', 'webp'].includes(ext))
    return 'images';
  if (['.mp4', '.mkv', '.avi', '.mov'].includes(ext)) return 'videos';
  if (['.mp3', '.wav', '.aac', '.flac'].includes(ext)) return 'audio';
  if (['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.xls', '.ppt'].includes(ext))
    return 'docs';
  if (['.zip', '.rar', '.7c', '.tar', '.gz'].includes(ext)) return 'archives';
  if (
    [
      '.cpp',
      '.c',
      '.js',
      '.py',
      '.java',
      '.css',
      '.html',
      '.json',
      '.go',
      '.ts',
    ].includes(ext)
  )
    return 'codes';

  return 'others';
}

function parseRules(args) {
  return args.map((arg) => {
    const splits = arg.split('::');
    if (splits.length !== 2) throw new Error(`Invalid rule format '${args}'`);
    return { pattern: splits[0].toLowerCase(), folder: splits[1] };
  });
}

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`Aleardy exits at ${dirPath}`);
    } else {
      throw err;
    }
  }
}

async function moveFileToFolder(file, targetFolder) {
  const soureFilePath = path.join(SOURCE_DIR, file);
  const destFilePth = path.join(DEST_DIR, targetFolder, file);
  await ensureDir(path.join(DEST_DIR, targetFolder));
  // TODO: Implement the function;
}

// file stats
async function getFileStats() {
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    categories: {},
  };
  for (const category of categories) {
    const dir = path.join(DEST_DIR, category);
    let cnt = 0,
      size = 0;
    try {
      const files = await fs.readdir(dir);
      cnt = files.length;
      for (const file of files) {
        const stat = await fs.stat(path.join(dir, file));
        size += stat.size;
      }
    } catch (e) {
      if (e.code !== 'ENOENT')
        console.error('Error getting stats for ${dir} : ${e.message}');
    }
    stats.categories[category] = { cnt, size };
    stats.totalFiles += cnt;
    stats.totalSize += size;
  }
  return stats;
}

//search files
async function searchFiles(patternString) {
  const res = [];
  const lowerPattern = patternString.toLowerCase();
  for (const category in categories) {
    const dir = path.join(DEST_DIR, category);
    try {
      const files = await fs.readdir(dir);
      for (const file in files) {
        if (file.toLowerCase().includes(lowerPattern)) {
          res.push({ category, file, full_path: path.join(dir, file) });
        }
      }
    } catch (e) {
      if (e.code !== 'ENOENT')
        console.error(
          `Error searching for the file in '${dir}' : '${e.message}'`
        );
    }
    return res;
  }
}

//delete files from a folder
async function deleteFromCategory(category) {
  const dir = path.join(DEST_DIR, category);
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      await fs.unlink(path.join(dir, file));
    }
    if (options.verbose) console.log(`Cleared folder: ${dir}`);
  } catch (e) {
    if (e.code !== 'ENOENT')
      console.error('Error deleting in the dir ${dir} : ${e.message}');
  }
}

//aysnc function clearDestination(){

//}
async function organizeFiles(rules) {
  if (options.verbose) console.log('Starting file orgainization');
  await ensureDir(SOURCE_DIR);
  await ensureDir(DEST_DIR);
  for (const cat of categories) await ensureDir(path.join(DEST_DIR, cat));
  if (options.clear) {
    if (options.verbose) console.log('Clearing destination folders...');
    await clearDestination();
  }
  let filesInsource = [];
  try {
    const dirents = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
    filesInsource = dirents.filter((d) => d.isFile()).map((d) => d.name);
  } catch (error) {
    if (error.code === 'ENOENT')
      return console.warn(`Source folder '${SOURCE_DIR}' not found`);
    console.error(error.message);
    process.exit(1);
  }
  if (filesInsource.length === 0) return console.log('No files found');
  for (const filename of filesInsource) {
    const lowername = filename.toLowerCase();
    let targetFolder = 'others';
    let matchedRule = false;
    for (const rule of rules) {
      if (
        lowername.includes(rule.pattern) ||
        lowername.endsWith(rule.pattern)
      ) {
        targetFolder = rule.Folder;
        matchedRule = true;
        break;
      }
    }
    if (!matchedRule) targetFolder = getCategory(filename);
    if (options.verbose) console.log(`'${filename}'-> '${targetFolder}'`);
    // TODO: implement arranging files
  }
  // TODO:  implemetnt options.stats
}

async function main() {
  const rules = parseRules(rules);
  if (options.search) {
    const found = await searchFiles(options.search);
    if (found.length > 0) {
      console.log('\n---Search Results ---');
      found.forEach((f) => console.log(` [${f.category}] -> ${file} `));
      console.log('--------------------');
    } else console.log('No files found');
    return;
  }
  await organizeFiles(rules);
}
main();
