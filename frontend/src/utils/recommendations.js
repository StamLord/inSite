const Tag = {
    HIGH: "High Impact",
    MEDIUM: "Medium Impact",
    EASY: "Easy Win"
}

export const RECOMMENDATION_RULES = {
    known: {
        false: [{
            tag: Tag.HIGH,
            title:"Improve brand recognition",
            content: "Your brand or site is not recognized by language models. Strengthen your online presence through consistent naming, high-quality backlinks, and authoritative content to improve discoverability.",
            score: 20
        }]
    },
    prompt_score: {
        low: [{
            tag: Tag.HIGH,
            title:"Add direct Q&A sections",
            content: "Target common user questions by creating FAQ pages, clear Q&A sections, and semantically rich headings. Direct answers help LLMs extract and surface your content more effectively.",
            score: 15
        }],
        medium: [{
            tag: Tag.HIGH,
            title:"Expand content with Q&A",
            content: "Support mid-performing queries by adding Q&A-style content and clear headings. This increases alignment with how users phrase questions.",
            score: 10
        }]
    },
    robots: {
        disallows: [{
            tag: Tag.EASY,
            title:"Fix robots.txt blocking",
            content: "Your robots.txt disallows crawling. Search and answer engines cannot access your site until this is corrected.", 
            score: 10
        }]
    },
    meta_robots: {
        noindex: [{
            tag: Tag.EASY,
            title: "Remove noindex directive",
            content: "The meta robots tag contains 'noindex'. This prevents your page from being indexed by search and answer engines.", 
            score: 10
        }]
    },
    canonical: {
        missing: [{
            tag: Tag.EASY,
            title:"Add a canonical tag",
            content: "A canonical tag is missing. Canonicals unify page identity and prevent duplication issues, ensuring answer engines crawl the correct version.", 
            score: 8
        }]
    },
    description: {
        missing: [{
            tag: Tag.EASY,
            title:"Add a meta description",
            content: "A meta description is missing. Descriptions provide concise page summaries for crawlers and answer engines, increasing the chance of selection in AI answers.", 
            score: 8
        }]
    },
    structured_data: {
        missing: [{
            tag: Tag.HIGH,
            title:"Add structured data (schema.org)",
            content: "No structured data detected. Implementing NewsArticle, Organization, and FAQPage schema improves how crawlers and AI engines understand and surface your content.", 
            score: 8 
        }]
    },
    title: {
        missing: [{
            tag: Tag.EASY,
            title:"Add a descriptive <title> tag",
            content: "No <title> tag detected. The <title> is one of the strongest signals for both search engines and answer engines. Without it, your content is unlikely to appear in AI-powered answers.",
            score: 9,
        }]
    },
    meta_description: {
        missing: [{
            tag: Tag.EASY,
            title: "Add a meta description",
            content: "No meta description found. Adding one improves how your page is summarized in search and answer engines.", 
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
