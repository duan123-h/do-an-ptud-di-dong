export function transformQuillHtml(html) {
    // if (typeof html !== "string") return "";
    return html.replace(/class="([^"]*)"/g, (match, classValue) => {
        let style = "";

        if (classValue.includes("ql-align-center")) {
            style += "text-align:center;";
        }

        if (classValue.includes("ql-align-right")) {
            style += "text-align:right;";
        }

        if (classValue.includes("ql-align-left")) {
            style += "text-align:left;";
        }

        if (classValue.includes("ql-bold")) {
            style += "font-weight:bold;";
        }
        if (style) {
            return `style="${style}"`;
        }
        return "";
    });
}