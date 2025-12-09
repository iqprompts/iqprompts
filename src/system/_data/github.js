const fetch = require("node-fetch");
// Note: 11ty 3.0 supports ESM natively, but we are in CommonJS mode.
// We might need to stick to native fetch if node version is recent (18+)
// or use a dynamic import.

module.exports = async function () {
    // We need to find all unique authors first.
    // Since this is a data file, we can't easily access collections *before* they are built.
    // However, we can scan the file system or use a separate data file for authors if we had one.
    // For this static site, we'll scan the src/prompts directory.

    const glob = require('glob');
    const matter = require('gray-matter');
    const files = glob.sync('src/prompts/**/*.md');

    const authors = new Set();
    files.forEach(file => {
        const content = require('fs').readFileSync(file, 'utf8');
        const data = matter(content).data;
        if (data.author) authors.add(data.author);
    });

    console.log(`Fetching GitHub profiles for ${authors.size} authors...`);

    const githubData = {};

    // Helper for fallback avatar
    const getFallbackAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    for (const author of authors) {
        try {
            // Check if author looks like a github handle (no spaces? simple heuristic)
            if (author.includes(' ')) {
                // Assume real name, skip fetch or use fallback
                githubData[author] = {
                    name: author,
                    avatar_url: getFallbackAvatar(author),
                    html_url: '#'
                };
                continue;
            }

            // Fetch from GitHub
            // Use GITHUB_TOKEN if available to avoid rate limits
            const headers = {};
            if (process.env.GITHUB_TOKEN) {
                headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
            }

            const response = await fetch(`https://api.github.com/users/${author}`, { headers });

            if (!response.ok) {
                console.warn(`Failed to fetch GitHub user ${author}: ${response.statusText}`);
                githubData[author] = {
                    name: author,
                    avatar_url: getFallbackAvatar(author),
                    html_url: `https://github.com/${author}` // Best guess
                };
                continue;
            }

            const userData = await response.json();
            githubData[author] = {
                name: userData.name || userData.login,
                bio: userData.bio,
                avatar_url: userData.avatar_url || getFallbackAvatar(author), // Fallback if GitHub user has no avatar set? Unlikely but safe.
                html_url: userData.html_url,
                location: userData.location,
                followers: userData.followers
            };

        } catch (e) {
            console.error(`Error fetching data for ${author}:`, e);
            // CRITICAL FIX: Ensure fallback even on exception
            githubData[author] = {
                name: author,
                avatar_url: getFallbackAvatar(author),
                html_url: '#'
            };
        }
    }

    return githubData;
};
