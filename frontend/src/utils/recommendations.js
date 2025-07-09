export const RECOMMENDATION_RULES = {
    known: {
        false: [{
            text: "Your brand or site is not recognized by language models. Increase your online presence through consistent naming, backlinks, and high-quality content to improve discoverability.", 
            score: 20
        }]
    },
    prompt_score: {
        low: [{
            text: "Improve content targeting by answering common user questions directly, using clear headings, FAQ formats, and semantically rich language.", 
            score: 15
        }],
        medium: [{
            text: "Improve content targeting by answering common user questions directly, using clear headings, FAQ formats, and semantically rich language.", 
            score: 10
        }]
    },
    robots: {
        disallows: [{
            text: "Update robots.txt to allow indexing by Google, Bing, and LLMs.", 
            score: 10
        }]
    },
    meta_robots: {
        noindex: [{
            text: "Remove the 'noindex' directive in the meta robots tag if you want this page to appear in search engines and LLMs.", 
            score: 10
        }]
    },
    canonical: {
        missing: [{
            text: "Add a canonical tag to specify the preferred URL.", 
            score: 8
        }]
    },
    description: {
        missing: [{
            text: "Add a meta description to improve search snippets.", 
            score: 8
        }]
    },
    structured_data: {
        missing: [{
            text: "Add structured data to help engines underastand your content.", 
            score: 8 
        }]
    },
    title: {
        missing: [
        {
            text: "Add a <title> tag to your page. This is critical for SEO, click-through rates, and helps LLMs understand what the page is about.",
            score: 9,
        },
        ],
    },
    meta_description: {
        missing: [{
            text: "Add a meta description for better search snippets.", 
            score: 7 
        }]
    },
}

export function getRecommendations(data, top = 5) {
    const matched = [];
    
    // Go over main factors
    const brandRules = RECOMMENDATION_RULES["known"];
    if (brandRules && brandRules[data.known])
        matched.push(...brandRules[data.known])

    // Prompt score
    if (data.scores) {
        const scores = data.scores; 
        let averageScore = 0;

        if (scores.length === 0)
            averageScore = 0;
        else {
            const sum = scores.reduce((acc, val) => acc + val);
            averageScore = sum / scores.length;
        }
        
        let scoreLabel = "high";
        if (averageScore <= 75)
            scoreLabel = "medium";
        else if (averageScore <= 50)
            scoreLabel = "low";

        const promptRules = RECOMMENDATION_RULES["prompt_score"];
        if (promptRules && promptRules[scoreLabel])
            matched.push(...promptRules[scoreLabel]);
    }
    
    // Go over technical scan: Get all rules matching this factor & value
    if (data.technical_scan) {
        Object.entries(data.technical_scan).forEach(([factor, value]) => {
            // Normalize value
            value = value.toLowerCase();
            value = value.split(" ")[0];

            const rules = RECOMMENDATION_RULES[factor];
            if (rules && rules[value])
                matched.push(...rules[value]);
        })
    }

    matched.sort((a, b) => b.score - a.score);
    return matched.slice(0, top);
}
