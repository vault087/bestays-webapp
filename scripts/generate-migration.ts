import * as fs from "fs";
import * as path from "path";

const PREPARATION_DIR = path.join(__dirname, "../supabase/migrations/preparation");
const OUTPUT_DIR = path.join(__dirname, "../supabase/migrations");
const OUTPUT_FILE = "999-migrate-all.sql";

function generateMigration(): void {
  try {
    const files = fs
      .readdirSync(PREPARATION_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => {
        // Extract number from filename (e.g., "13_something.sql" -> 13)
        const numA = parseInt(a.match(/^(\d+)_/)?.[1] || "0");
        const numB = parseInt(b.match(/^(\d+)_/)?.[1] || "0");
        return numA - numB;
      });

    let combinedSQL = `-- Generated: ${new Date().toISOString()}\n\n`;

    files.forEach((file, index) => {
      const filePath = path.join(PREPARATION_DIR, file);
      const content = fs.readFileSync(filePath, "utf8");

      combinedSQL += `-- ${file}\n`;
      combinedSQL += content;

      if (index < files.length - 1) {
        combinedSQL += "\n\n";
      }
    });

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
    fs.writeFileSync(outputPath, combinedSQL, "utf8");
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

generateMigration();
