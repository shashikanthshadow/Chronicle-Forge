import os
import re

STORIES_DIR = "stories"
os.makedirs(STORIES_DIR, exist_ok=True)


def sanitize(name: str) -> str:
    # Allow letters, numbers, spaces, underscores, hyphens, and apostrophes
    # Strip everything else
    safe = re.sub(r"[^a-zA-Z0-9 _'-]", "", name)
    # Replace spaces with underscores for safer filenames
    return safe.strip().replace(" ", "_")


def create_new_section(name: str):
    filename = sanitize(name) + ".txt"
    filepath = os.path.join(STORIES_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        # Keep the original name for display
        f.write(f"# {name}\n\n")
    return sanitize(name)  # return sanitized name for consistency


def get_section_content(filename: str):
    filepath = os.path.join(STORIES_DIR, filename + ".txt")
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def append_to_section(filename: str, content: str):
    filepath = os.path.join(STORIES_DIR, filename + ".txt")
    with open(filepath, "a", encoding="utf-8") as f:
        f.write("\n\n" + content)
    return content


def get_all_sections():
    return [f.replace(".txt", "") for f in os.listdir(STORIES_DIR) if f.endswith(".txt")]


def delete_section(name: str):
    filepath = os.path.join(STORIES_DIR, name + ".txt")
    if os.path.exists(filepath):
        os.remove(filepath)
        return True
    return False


def get_next_chapter_number(content: str) -> int:
    matches = re.findall(r"Chapter\s+(\d+)", content, re.IGNORECASE)
    if not matches:
        return 1
    return int(matches[-1]) + 1


def get_last_chapter_number(content: str) -> int:
    matches = re.findall(r"Chapter\s+(\d+)", content, re.IGNORECASE)
    if not matches:
        return 1
    return int(matches[-1])
