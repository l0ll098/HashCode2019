import * as fs from "fs";
import * as path from "path";

export enum Files {
	Example = "a.txt",
	A = "a.txt",
	B = "b.txt",
	C = "c.txt",
	D = "d.txt",
	E = "e.txt"
}
const curr = Files.D;


let count = 0;
let lastV = null;
let out = "";
let lastSlide = null;
let points = 0;

const slidePicked = [];
let slideShow = [];
let bestSlideShow = [];
let bestPoints = 0;

const ITERATIONS = 150;


(async () => {
	const data = fs.readFileSync("./in/" + curr).toString();

	const photos = [];

	const input = data.split("\n");
	const n = parseInt(input[0], 10);

	for (let i = 1; i <= n; ++i) {
		const parts = input[i].split(" ");

		photos.push({
			i: i - 1,
			or: parts[0].toUpperCase(),
			nTags: parts[1],
			tags: parts.slice(2, parts.length)
		});
	}


	for (let i = 0; i < ITERATIONS; i++) {
		console.log("Iteration: ", i);

		points = 0;
		slideShow = [];
		count = 0;
		lastV = null;
		lastSlide = null;


		for (let j = 0; j < n; j++) {
			slidePicked[j] = false;
		}

		for (let j = 0; j < n; j++) {

			// Get an unpicked item
			let randomIndex = Math.floor(Math.random() * n);
			while (slidePicked[randomIndex]) {
				randomIndex = Math.floor(Math.random() * n);
			}

			// Mark that as picked
			slidePicked[randomIndex] = true;


			const slide = getSlide(photos[randomIndex]);


			if (!slide) {
				continue;
			}

			if (lastSlide != null) {
				// calc points
				if (lastSlide[0].or === "H") {
					points += calcPoint(lastSlide[0], slide[0]);
				}

				if (lastSlide[0].or === "V") {
					points += calcPoint(lastSlide[0], lastSlide[1]);
					points += calcPoint(lastSlide[1], slide[0]);
				}

				if (slide[0].or === "V") {
					points += calcPoint(slide[0], slide[1]);
				}
			}

			lastSlide = slide;

			// Add to the slideshow
			slideShow.push(slide);


			if (points >= bestPoints) {
				bestPoints = points;
				bestSlideShow = slideShow;

				// console.log("Found a new best. New points: ", bestPoints);
			}
		}
	}


	// Print each slide in to the file
	bestSlideShow.forEach((slide) => {
		slideOut(slide);
	});

	out = count + "\n" + out;
	console.log("Points: ", points);

	fs.writeFileSync("./out/" + curr, out);

	console.log("Done");
})();

function getSlide(p) {
	if (p.or === "V") {
		if (!lastV) {
			lastV = p;
			return null;
		} else {
			const copy = lastV;	// ref to lastV
			lastV = null;
			count++;
			return [copy, p];	// Vertical photos
		}
	} else {
		// Horizontal photo, add it
		count++;
		return [p];
	}
}

function slideOut(slide) {
	out += slide[0].i;
	if (slide[1]) {
		out += " " + slide[1].i;
	}
	out += "\n";
}


function calcPoint(s1, s2) {
	const commonTags = s1.tags.filter((value) => -1 !== s2.tags.indexOf(value)).length;
	const s1NotS2 = s1.tags.filter((e) => !s2.tags.find((a) => e === a)).length;
	const s2NotS1 = s2.tags.filter((e) => !s1.tags.find((a) => e === a)).length;

	return Math.min(commonTags, s1NotS2, s2NotS1);
}
