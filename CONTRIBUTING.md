# Contribute to the Hive Mind

Help us build the most comprehensive collection of system prompts. Share your best prompt engineering work with the world.

## How to Add a Prompt

1.  **Fork the Repository**: Clone the repo and create a new branch (e.g., `add-coding-assistant`).
2.  **Create Your File**: Add a new markdown file in `src/prompts/<Category>/` (e.g., `src/prompts/coding/my-prompt.md`).
3.  **Use the Template**:

    ```markdown
    ---
    title: "Prompt Title"
    author: "YourGithubHandle"
    date: 2023-11-01
    model: "GPT-4"
    tags: ["coding", "writing"]
    description: "Brief description of what this prompt accomplishes (10-200 chars)."
    ---

    # Your System Prompt Title

    The actual system prompt content goes here...
    You can use markdown!
    ```

4.  **Validate**: Run `node src/system/scripts/validate-prompts.js` locally to check for errors.
5.  **Submit PR**: Open a Pull Request describing your prompt.

## Guidelines

-   **High Quality**: Prompts should be tested and reliable.
-   **System Prompts**: Focus on foundational system instructions.
-   **Categorized**: Place files in the correct subfolder (e.g., `coding/`, `writing/`) and use correct tags.

