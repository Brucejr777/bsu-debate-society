from pathlib import Path

OUTPUT_FILE = "combined_code.txt"

code_path = Path.cwd()  # current working directory

with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
    for file in code_path.rglob("*"):
        if file.is_file():
            try:
                content = file.read_text(encoding="utf-8", errors="ignore")

                outfile.write("\n" + "=" * 80 + "\n")
                outfile.write(f"FILE: {file}\n")
                outfile.write("=" * 80 + "\n\n")
                outfile.write(content)
                outfile.write("\n")

            except Exception as e:
                print(f"Failed to read {file}: {e}")

print(f"Combined files saved to: {OUTPUT_FILE}")