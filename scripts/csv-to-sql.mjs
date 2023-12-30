/*
 * This is a small script to turn a CSV into typeorm queryRunner statements.
 * This is for loading OSTs into a migration from a manual source.  I used it to load
 * Audio Trip OSTs from a spreadsheet I put together myself.
 *
 * It's not perfect, but at least eliminated some manual work on my part.
 */

import * as fs from 'fs';

const input = fs.readFileSync('dd_ost.csv');

const lines = input.toString().split("\n");

let output = '';
lines.forEach((line) => {
    if (line == '') {
        return;
    }
    const row = line.split(',');
    const durationSplit = row[3].split(':').map((value) => parseInt(value));
    const duration = durationSplit[0] * 60 + durationSplit[1];

    output += `await queryRunner.query(\`INSERT INTO song ("songHash", "title", "artist", "mapper", "duration", "bpm", "gameId") VALUES `;

    output += `('${row[5]}','${row[0].replace("'","''")}','${row[1]}','${row[2]}',${duration},${row[4].trim()},4)\`);\n`;
});

fs.writeFileSync('dd.ts',output);
