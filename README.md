# File Organizer (forganize)

A simple yet powerful command-line tool to automatically organize files in your directory into categorized folders.

## Description

This script, `forganize`, scans the current directory for files and moves them into specific folders based on their file extension. It helps keep your directories clean and tidy by separating images, documents, videos, audio files, archives, and code files.

## Features

The tool comes with several options to customize its behavior:

-   `--clear`: Deletes the contents of the destination folders before organizing.
-   `--stats`: Displays statistics about the organized files, including total count and size per category.
-   `--preview`: Shows which files will be moved to which folders without actually moving them.
-   `--search <term>`: Searches for files containing the specified term in their name before organizing.
-   `--verbose`: Enables detailed logging to show the step-by-step process.

## Usage

To run the file organizer, use the following command in your terminal:

```bash
node index.js [options]
```

**Example:**

To preview the organization plan with detailed logs:

```bash
node index.js --preview --verbose
```

## Custom Folder Rules

You can also define your own custom rules to organize files into specific folders. This is useful for files that don't fit the standard categories or for project-specific organization.

Rules are passed as command-line arguments using the format `pattern::folder`.

-   `pattern`: A string to match in the filename (case-insensitive).
-   `folder`: The name of the folder where matching files should be moved.

**Example:**

To move all files containing the word "report" into a "Reports" folder, you would run:

```bash
node index.js "report::Reports"
```

## File Categories

The script organizes files into the following folders:

-   `images`: .jpg, .jpeg, .png, .gif, .bmp, .webp
-   `videos`: .mp4, .mkv, .avi, .mov
-   `audio`: .mp3, .wav, .aac, .flac
-   `documents`: .pdf, .doc, .docx, .txt, .xlsx, .xls, .ppt
-   `archives`: .zip, .rar, .7z, .tar, .gz
-   `codes`: .cpp, .c, .js, .py, .java, .css, .html, .json, .go, .ts
-   `others`: Any other file type.
