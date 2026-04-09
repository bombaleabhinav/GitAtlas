import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Secret Patterns
const SECRET_PATTERNS = [
  { name: 'env', regex: /\.env/i },
  { name: 'openai', regex: /sk-[a-zA-Z0-9]{48}/ },
  { name: 'aws', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'firebaseConfig', regex: /firebaseConfig/i }
];

function detectSecrets(patch) {
  if (!patch) return false;
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.regex.test(patch)) {
      return true;
    }
  }
  return false;
}

router.post('/repo', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Parse github URL: https://github.com/owner/repo
    const parts = url.replace('https://github.com/', '').split('/');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }
    
    const owner = parts[0];
    const repo = parts[1].replace('.git', '');
    
    // Fetch commits
    const githubApi = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitAtlas-App'
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await fetch(githubApi, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    const commitsData = await response.json();
    
    // Process commits
    const processedCommits = await Promise.all(commitsData.map(async (commit) => {
      // In a production scenario with many commits, fetching diffs per commit can hit API limits fast.
      // We will attempt to fetch the full commit to get stats and files.
      // To keep it fast, we do this concurrently but might be rate-limited without a token.
      let hasError = false;
      let filesChanged = 0;
      let patch = '';
      
      try {
        const detailRes = await fetch(commit.url, { headers });
        if (detailRes.ok) {
          const detail = await detailRes.json();
          filesChanged = detail.files ? detail.files.length : 0;
          // Collect patch for secret detection
          if (detail.files) {
            patch = detail.files.map(f => f.patch || '').join('\n');
          }
        }
      } catch (err) {
        // Silently handle to not break the whole flow
        console.error("Error fetching commit details");
      }
      
      const containsSecret = detectSecrets(patch) || detectSecrets(commit.commit.message);
      
      return {
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
        filesChanged,
        patch,
        containsSecret
      };
    }));
    
    res.json({ commits: processedCommits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
