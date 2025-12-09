const fs = require("fs");
const matter = require("gray-matter");

const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Security: Configure Markdown to strictly escape HTML
    const mdLib = markdownIt({
        html: false, // Disable HTML tags in source
        breaks: true, // Convert '\n' to <br>
        linkify: true // Autoconvert URL-like text to links
    });
    eleventyConfig.setLibrary("md", mdLib);

    // Global Data to handle Prompts logic without a directory data file
    eleventyConfig.addGlobalData("eleventyComputed", {
        layout: data => {
            if (data.page.filePathStem && data.page.filePathStem.startsWith('/prompts/')) {
                return "layouts/prompt.njk";
            }
            return data.layout;
        },
        tags: data => {
            if (data.page.filePathStem && data.page.filePathStem.startsWith('/prompts/')) {
                let tags = data.tags || [];
                if (typeof tags === "string") tags = [tags];
                if (!tags.includes("prompts")) tags = [...tags, "prompts"];
                return tags;
            }
            return data.tags;
        },
        category: data => {
            if (data.page.filePathStem && data.page.filePathStem.startsWith('/prompts/')) {
                return data.page.filePathStem.split('/')[2];
            }
            return data.category;
        },
        permalink: data => {
            if (data.page.filePathStem && data.page.filePathStem.startsWith('/prompts/')) {
                return `/${data.page.filePathStem.split('/')[2]}/${data.page.fileSlug}/`;
            }
            return data.permalink;
        }
    });

    // Filter to remove system tags
    eleventyConfig.addFilter("filterTags", function (tags) {
        return (tags || []).filter(tag => tag !== "prompts");
    });
    // Filter to get raw markdown content
    eleventyConfig.addFilter("rawContent", function (inputPath) {
        if (!inputPath) return "";
        let content = fs.readFileSync(inputPath, 'utf8');
        let parsed = matter(content);
        return parsed.content.trim();
    });
    // Watch CSS files for changes
    eleventyConfig.addWatchTarget("./src/system/styles/");

    // Copy assets
    // eleventyConfig.addPassthroughCopy("./src/assets"); // Commented out as checked not existing, or update if exists

    // Filter for readable dates
    eleventyConfig.addFilter("readableDate", dateObj => {
        return new Date(dateObj).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    });

    // Shortcode for current year
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Filter to get minimum of two numbers
    eleventyConfig.addFilter("min", (a, b) => Math.min(a, b));

    // Filter to limit array length
    eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

    // Filter to shuffle array
    eleventyConfig.addFilter("shuffle", (arr) => {
        let a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    });

    // Explicitly define the 'prompts' collection using glob
    // This is necessary because we removed the directory data file, and computed tags
    // are not available at collection time.
    eleventyConfig.addCollection("prompts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/prompts/**/*.md");
    });

    // Collection: Authors
    eleventyConfig.addCollection("authors", function (collectionApi) {
        let authors = new Set();
        collectionApi.getFilteredByGlob("src/prompts/**/*.md").forEach(item => {
            if (item.data.author) authors.add(item.data.author);
        });
        return Array.from(authors).sort();
    });

    // Collection: Models
    eleventyConfig.addCollection("models", function (collectionApi) {
        let models = new Set();
        collectionApi.getFilteredByGlob("src/prompts/**/*.md").forEach(item => {
            if (item.data.model) models.add(item.data.model);
        });
        return Array.from(models).sort();
    });

    // Collection: Categories
    eleventyConfig.addCollection("categories", function (collectionApi) {
        let categories = new Set();
        collectionApi.getFilteredByGlob("src/prompts/**/*.md").forEach(item => {
            // Extract category from file path: /src/prompts/category/filename
            // or relative to input 'src': /prompts/category/filename
            // item.filePathStem: /prompts/category/filename
            let parts = item.filePathStem.split('/');
            // parts: ['', 'prompts', 'category', 'filename']
            if (parts.length >= 3 && parts[1] === 'prompts') {
                let category = parts[2];
                if (category) categories.add(category);
            }
        });
        return Array.from(categories).sort();
    });

    // Collection: All Tags (FLAT)
    eleventyConfig.addCollection("allTags", function (collectionApi) {
        let tags = new Set();
        collectionApi.getFilteredByGlob("src/prompts/**/*.md").forEach(item => {
            if (item.data.tags) {
                // Ensure tags is an array (handle string case if it slips through)
                let itemTags = item.data.tags;
                if (typeof itemTags === "string") itemTags = [itemTags];

                itemTags.forEach(tag => {
                    if (tag !== "prompts") tags.add(tag);
                });
            }
        });
        return Array.from(tags).sort();
    });

    // Collection: Popular Tags (with count)
    eleventyConfig.addCollection("popularTags", function (collectionApi) {
        let tagCounts = {};
        collectionApi.getFilteredByGlob("src/prompts/**/*.md").forEach(item => {
            if (item.data.tags) {
                let itemTags = item.data.tags;
                if (typeof itemTags === "string") itemTags = [itemTags];

                itemTags.forEach(tag => {
                    if (tag !== "prompts") {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    }
                });
            }
        });

        // Convert to array and sort by count (descending)
        return Object.keys(tagCounts)
            .map(tag => ({ name: tag, count: tagCounts[tag] }))
            .sort((a, b) => b.count - a.count);
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "system/_includes",
            data: "system/_data"
        }
    };
};
