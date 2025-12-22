const parseTips = (output) => {
    // Current Logic (reproduced from controller)
    const currentTips = output
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+[\.\)]\s+/.test(line))
        .map(line => line.replace(/^\d+[\.\)]\s+/, ''))
        .slice(0, 5);

    // Proposed Logic
    const improvedTips = output
        .split('\n')
        .map(line => line.trim())
        // More relaxed regex: matches numbers (1., 1), bullets (*, -), and ignores bold formatting like **1.**
        .filter(line => /^(\d+[\.\)]?|[-*•])\s+/.test(line) || /^\*\*\d+[\.\)]\*\*\s+/.test(line))
        .map(line => line.replace(/^(\d+[\.\)]?|[-*•]|\*\*\d+[\.\)]\*\*)\s+/, '').replace(/^\*\*|\*\*$/g, '')) // clear clean up
        .filter(line => line.length > 5) // Filter out very short lines
        .slice(0, 5);

    return { current: currentTips, improved: improvedTips };
};

const testCases = [
    {
        name: "Standard Numbered",
        input: `1. Tip one
2. Tip two
3. Tip three
4. Tip four
5. Tip five`
    },
    {
        name: "Markdown Bold Numbered",
        input: `**1.** Tip one
**2.** Tip two
**3.** Tip three
**4.** Tip four
**5.** Tip five`
    },
    {
        name: "Bulleted List",
        input: `- Tip one
- Tip two
- Tip three
- Tip four
- Tip five`
    },
    {
        name: "Mixed/Messy",
        input: `Here are your tips:
1) Tip one
2. Tip two
* Tip three
- Tip four
5 Tip five`
    }
];

testCases.forEach(test => {
    console.log(`\n--- Test: ${test.name} ---`);
    const results = parseTips(test.input);
    console.log("Current Logic Found:", results.current.length);
    console.log("Improved Logic Found:", results.improved.length);
    if (results.improved.length > 0) {
        console.log("First Improved Tip:", results.improved[0]);
    }
});
