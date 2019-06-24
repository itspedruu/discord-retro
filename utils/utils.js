module.exports = class Utils {
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static format(seconds) {
		let pad = s => s < 10 ? '0' + s : '' + s;
		let types = [
			{time: Math.floor(seconds / (2678400 * 12)), word: "y"},
			{time: Math.floor(seconds % (2678400 * 12) / 2678400), word: "m"},
			{time: Math.floor(seconds % (86400 * 31) / (86400 * 7)), word: "w"},
			{time: Math.floor(seconds % (86400 * 7) / 86400), word: "d"},
			{time: Math.floor(seconds % 86400 / (60 * 60)), word: "h"},
			{time: Math.floor(seconds % (60 * 60) / 60), word: "m"},
			{time: Math.floor(seconds % 60), word: "s"}
		];
		let tempo = types.filter(x => x.time !== 0).map(x => pad(x.time) + x.word).join(' ');
		return tempo;
	}
}