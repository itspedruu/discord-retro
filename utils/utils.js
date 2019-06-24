module.exports = class Utils {
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}