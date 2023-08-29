export const  formatStringToCamelCase = (string = "") => {
    if (!string) {
        return "";
    }

    const regex = /\s+(\w)?/gi;

    return string.toLowerCase().replace(regex, function(match, letter) {
        return letter.toUpperCase();
    });
}