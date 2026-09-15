# Implementation Review Prompt

Use the following prompt with an LLM to review the completed page.

This prompt is intended only to review and improve the completed implementation. It is not used to create the submitted implementation.

Review the DoktorABC landing page in `index.html`, `styles.css`, and `script.js` against the supplied `.fig` design and image assets.

Check the following:

- Visual fidelity at desktop, tablet, and mobile widths, including typography, spacing, gradients, borders, image crops, and carousel controls.
- Responsive behavior at breakpoint boundaries so text never overlaps or obscures images.
- Carousel behavior, including autoplay, looping, buttons, dots, swiping, resizing, and reduced-motion handling.
- Semantic HTML, keyboard behavior, accessible labels, focus visibility, and decorative-image treatment.
- JavaScript and CSS simplicity, duplication, unused rules, fragile selectors, and unnecessary abstractions.
- Missing assets, broken paths, overflow, layout shifts, and browser-dependent rendering.
- Compliance with KISS, DRY, YAGNI, and the existing project structure without adding dependencies.

Report concrete findings by severity and file location. For each finding, explain the visible or functional impact and propose the smallest safe correction. Do not redesign the page or introduce features that are not present in the supplied design.
