# Intelligence Prompts Directory

A community-driven, open-source directory for high-performance LLM system prompts. Built with **11ty** and **Tailwind CSS**.

![Prompts Directory Screenshot](https://via.placeholder.com/800x400)

## Features

- **"Prompts as Code"**: All prompts are stored as Markdown files in `src/prompts/`, making them easy to version control and edit.
- **Search & Filter**: Quickly find the right prompt for your specific model or use case.
- **Explore**: Browse by [Authors](/authors/), [Categories](/categories/), and [Tags](/tags/).
- **Modern UI**: Sleek, dark-mode design built with Tailwind CSS, focused on readability and developer experience.
- **Copy-Paste Ready**: One-click copy for all system prompts.
- **Validated Content**: Automated validation ensures all prompts adhere to the required schema.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/iqprompts/iqprompts.git
    cd iqprompts
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This command runs both the 11ty server and the Tailwind CSS watcher concurrently.
    Visit `http://localhost:8080` to see the site.

## Project Structure

```
iqprompts/
├── src/
│   ├── prompts/       # Source of truth for all prompts (Markdown files)
│   └── system/        # 11ty layout, pages, and system logic
│       ├── _includes/ # Nunjucks layouts and components
│       ├── pages/     # Site pages (index, categories, authors, etc.)
│       └── styles/    # Tailwind CSS input
├── _site/             # Generated static site (do not edit directly)
└── .eleventy.js       # 11ty configuration
```

## Validation

We use a custom validation script to ensure all prompt files have the correct metadata (frontmatter).

To validate your prompts:
```bash
npm run validate
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to add your own prompts.

## License

MIT
